import { NextRequest, NextResponse } from "next/server";

interface ChatRequest {
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  targetText: string;
  targetIPA?: string;
  mode: "sentence" | "word";
  latestTranscript?: string;
  isVoiceInput: boolean;
  userMessage?: string;
}

interface WordScore {
  score: number;
  note: string | null;
}

// Pronunciation tips based on word patterns — used in demo mode
function getWordTip(word: string): string | null {
  const w = word.toLowerCase();

  if (w.includes("th")) {
    return w === "the" || w === "this" || w === "that" || w === "they" || w === "them" || w === "there" || w === "then" || w === "though"
      ? `/ð/ — đặt lưỡi nhẹ giữa hai hàng răng, rung cổ họng`
      : `/θ/ — đặt lưỡi nhẹ giữa hai hàng răng, thổi hơi (không rung)`;
  }
  if (w.endsWith("ing")) return `Âm cuối /-ŋ/ — kết thúc ở vòm miệng sau, không đọc "inh"`;
  if (w.endsWith("ed")) {
    if (w.endsWith("ted") || w.endsWith("ded")) return `Âm cuối /-ɪd/ — đọc đủ âm "id"`;
    if (/[ptksf]ed$/.test(w)) return `Âm cuối /-t/ — kết thúc bằng /t/ câm, không thêm nguyên âm`;
    return `Âm cuối /-d/ — đọc /d/ câm nhẹ`;
  }
  if (w.endsWith("s") || w.endsWith("es")) {
    return `Đừng bỏ âm cuối /s/ hoặc /z/ — người Việt hay bỏ phụ âm cuối`;
  }
  if (w.includes("tion") || w.includes("sion")) return `/ʃən/ — đọc "shən", nhấn âm tiết trước -tion`;
  if (w.includes("wh")) return `/w/ — môi tròn và đẩy ra trước khi phát âm`;
  if (w.startsWith("w")) return `/w/ — môi tròn chặt trước, sau đó mở ra`;
  if (w.includes("oo")) return `/uː/ — môi tròn và đẩy ra, kéo dài hơn âm "u" tiếng Việt`;
  if (w.includes("ou") || w.includes("ow")) return `/aʊ/ — bắt đầu từ /a/ rộng, trượt lên /ʊ/`;
  if (w.length > 8) {
    // Guess stress: usually penultimate for long words
    return `Từ dài — chú ý nhấn đúng âm tiết chính, các âm không nhấn đọc thành schwa /ə/`;
  }
  if (w.endsWith("le") || w.endsWith("al") || w.endsWith("er") || w.endsWith("or")) {
    return `Âm cuối yếu /ə/ (schwa) — đọc nhẹ và ngắn, không nhấn`;
  }
  return null;
}

function mockWordScores(targetText: string): Record<string, WordScore> {
  const result: Record<string, WordScore> = {};

  targetText.split(/\s+/).forEach((raw) => {
    const word = raw.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
    if (!word) return;

    const hasTh = word.includes("th");
    const hasHardCluster = /[wv]|wh|kn|wr|ph/.test(word);
    const hasEnding = /[td]$|ing$|tion|sion|ed$|s$/.test(word);
    const isLong = word.length > 8;
    const isShort = word.length <= 3;

    let score: number;

    if (hasTh) {
      score = 28 + Math.floor(Math.random() * 30);
    } else if (hasHardCluster) {
      score = 45 + Math.floor(Math.random() * 30);
    } else if (isLong) {
      score = 50 + Math.floor(Math.random() * 30);
    } else if (isShort) {
      score = 78 + Math.floor(Math.random() * 20);
    } else {
      score = 55 + Math.floor(Math.random() * 35);
    }

    if (hasEnding && score > 60) score -= 10; // penalty for dropped endings

    const note = getWordTip(word);
    result[word] = { score, note };
  });

  return result;
}

function buildMockMessage(wordScores: Record<string, WordScore>, transcript: string): string {
  const bad = Object.entries(wordScores).filter(([, v]) => v.score < 50);
  const ok = Object.entries(wordScores).filter(([, v]) => v.score >= 50 && v.score < 80);
  const good = Object.entries(wordScores).filter(([, v]) => v.score >= 80);

  let msg = `Mình nghe bạn đọc: "${transcript}"\n\n`;

  if (good.length) {
    msg += `✅ Phát âm tốt: ${good.map(([w]) => w).join(", ")}\n\n`;
  }

  if (ok.length) {
    msg += `🟡 Cần cải thiện:\n`;
    ok.forEach(([word, { note }]) => {
      msg += `• **${word}**${note ? ` — ${note}` : ""}\n`;
    });
    msg += "\n";
  }

  if (bad.length) {
    msg += `🔴 Cần luyện thêm:\n`;
    bad.forEach(([word, { note }]) => {
      msg += `• **${word}**${note ? ` — ${note}` : ""}\n`;
    });
    msg += "\n";
  }

  // Generic tips based on patterns in bad words
  const hasTh = bad.some(([w]) => w.includes("th")) || ok.some(([w]) => w.includes("th"));
  const hasEnding = bad.some(([w]) => /[tdsng]$|ing$|ed$/.test(w));

  if (hasTh) {
    msg += `💡 Mẹo luyện âm "th": Đặt đầu lưỡi nhẹ giữa hai hàng răng. Thổi hơi qua khe → /θ/ (think). Rung cổ họng → /ð/ (the). Tập trước gương để thấy lưỡi.\n\n`;
  }
  if (hasEnding) {
    msg += `💡 Người Việt hay bỏ phụ âm cuối. Hãy "chạm" nhẹ môi/lưỡi ở cuối từ dù không phát thành tiếng.\n\n`;
  }

  msg += `Thử đọc lại và nhấn 🎤 — mình sẽ theo dõi tiến bộ của bạn!`;
  return msg;
}

// Extract JSON from Claude's response — handles plain JSON, ```json blocks, and embedded objects
function extractJSON(raw: string): unknown | null {
  const text = raw.trim();

  // 1. Direct parse
  try { return JSON.parse(text); } catch { /* continue */ }

  // 2. Strip code block markers (```json ... ``` or ``` ... ```)
  const stripped = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/, "")
    .trim();
  if (stripped !== text) {
    try { return JSON.parse(stripped); } catch { /* continue */ }
  }

  // 3. Find outermost JSON object by first { and last }
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end > start) {
    try { return JSON.parse(text.slice(start, end + 1)); } catch { /* continue */ }
  }

  return null;
}

const SENTENCE_SYSTEM_PROMPT = `Bạn là gia sư phát âm tiếng Anh cho người Việt Nam. Phong cách: thân thiện, cụ thể, khuyến khích.

KHI NHẬN TRANSCRIPT GIỌNG NÓI:
So sánh transcript với câu mục tiêu, chấm điểm mỗi từ 0–100.
Tiêu chí: 80+ tốt, 50–79 khá, <50 cần luyện.

Lỗi phổ biến của người Việt:
- Âm /θ/ /ð/ (th): hay đọc thành /t/ hoặc /d/
- Bỏ phụ âm cuối: /t/ /d/ /k/ /s/ /z/ /ŋ/
- Nhấn âm sai ở từ nhiều âm tiết
- Nguyên âm dài/ngắn: /iː/ vs /ɪ/, /uː/ vs /ʊ/

QUAN TRỌNG: Chỉ trả về JSON thuần túy, KHÔNG dùng markdown, KHÔNG có \`\`\`json, KHÔNG có bất kỳ text nào ngoài JSON.
Ví dụ đúng: {"wordScores":{"hello":{"score":80,"note":null}},"message":"Tốt lắm!"}
Ví dụ SAI: \`\`\`json\n{"wordScores":...}\`\`\`

Format bắt buộc:
{"wordScores":{"word1":{"score":85,"note":null},"word2":{"score":45,"note":"Mẹo: vị trí lưỡi/môi, IPA, so sánh tiếng Việt"}},"message":"Nhận xét + 1–2 bài tập cụ thể"}

KHI NHẬN CÂU HỎI TEXT:
Trả lời tự nhiên bằng tiếng Việt, KHÔNG cần JSON.
Giải thích: IPA, vị trí lưỡi/môi, so sánh âm tiếng Việt gần nhất, ví dụ từ khác cùng âm.`;

const WORD_SYSTEM_PROMPT = `Bạn là gia sư phát âm tiếng Anh cho người Việt Nam. Phong cách: thân thiện, cụ thể, khuyến khích.

KHI NHẬN TRANSCRIPT GIỌNG NÓI:
Đánh giá phát âm từ mục tiêu — điểm 0–100. Phân tích: âm đúng/sai (IPA), vị trí lưỡi/môi, so sánh âm tiếng Việt gần nhất, bài tập minimal pairs.

QUAN TRỌNG: Chỉ trả về JSON thuần túy, KHÔNG dùng markdown, KHÔNG có \`\`\`json, KHÔNG có text nào ngoài JSON.
Ví dụ đúng: {"score":75,"message":"Bạn đọc khá tốt..."}
Ví dụ SAI: \`\`\`json\n{"score":75,...}\`\`\`

Format bắt buộc: {"score":75,"message":"Phản hồi chi tiết tiếng Việt"}

KHI NHẬN CÂU HỎI TEXT:
Trả lời tự nhiên bằng tiếng Việt, KHÔNG cần JSON.
Giải thích: IPA, vị trí lưỡi/môi, so sánh âm tiếng Việt, ví dụ từ, bài tập luyện.`;

export async function POST(request: NextRequest) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const body: ChatRequest = await request.json();
  const { messages, targetText, targetIPA, mode, latestTranscript, isVoiceInput, userMessage } = body;

  // Demo mode
  if (!ANTHROPIC_API_KEY) {
    if (isVoiceInput && latestTranscript) {
      const wordScores = mode === "sentence" ? mockWordScores(targetText) : undefined;
      const score = mode === "word" ? 55 + Math.floor(Math.random() * 35) : undefined;
      const message =
        mode === "sentence"
          ? buildMockMessage(wordScores!, latestTranscript)
          : buildWordMockMessage(targetText, latestTranscript, score!);
      return NextResponse.json({
        message,
        isMock: true,
        ...(wordScores ? { wordScores } : {}),
        ...(score !== undefined ? { overallScore: score } : {}),
      });
    }
    // Text question in demo mode — give a useful default tip
    const demoTextReply = userMessage
      ? `Câu hỏi hay! Để nhận phân tích chi tiết từ Claude AI, hãy thêm ANTHROPIC_API_KEY vào file .env.local.\n\nTrong lúc đó, mình gợi ý: luyện phát âm bằng cách đọc chậm từng âm tiết, dùng từ điển Cambridge để nghe phát âm chuẩn, và chú ý đặc biệt đến các âm /θ/, /ð/, và phụ âm cuối từ — đây là điểm yếu phổ biến nhất của người Việt học tiếng Anh.`
      : "Nhấn 🎤 để bắt đầu luyện tập!";
    return NextResponse.json({ message: demoTextReply, isMock: true });
  }

  // Build system prompt with target context
  const contextLine =
    mode === "sentence"
      ? `\n\nCâu mục tiêu: "${targetText}"${targetIPA ? ` (IPA: ${targetIPA})` : ""}`
      : `\n\nTừ mục tiêu: "${targetText}"${targetIPA ? ` (IPA: ${targetIPA})` : ""}`;

  const systemText = (mode === "sentence" ? SENTENCE_SYSTEM_PROMPT : WORD_SYSTEM_PROMPT) + contextLine;

  // Build the latest user message
  let latestContent = "";
  if (isVoiceInput && latestTranscript) {
    latestContent = `[Ghi âm] Tôi đọc: "${latestTranscript}"`;
  } else if (userMessage) {
    latestContent = userMessage;
  }

  const apiMessages = [
    ...messages,
    ...(latestContent ? [{ role: "user" as const, content: latestContent }] : []),
  ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: systemText,
      messages: apiMessages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Claude API error:", err);
    return NextResponse.json(
      { message: "Lỗi kết nối Claude API. Kiểm tra API key và thử lại." },
      { status: 500 }
    );
  }

  const data = await response.json();
  const raw: string = data.content?.[0]?.text ?? "";

  // If voice input, try to parse structured JSON response
  if (isVoiceInput) {
    const parsed = extractJSON(raw) as Record<string, unknown> | null;

    if (parsed && typeof parsed === "object") {
      if (parsed.wordScores && parsed.message) {
        return NextResponse.json({
          message: parsed.message as string,
          wordScores: parsed.wordScores,
        });
      }
      if (parsed.score !== undefined && parsed.message) {
        return NextResponse.json({
          message: parsed.message as string,
          overallScore: parsed.score as number,
        });
      }
      if (parsed.message) {
        return NextResponse.json({ message: parsed.message as string });
      }
    }

    return NextResponse.json({ message: raw });
  }

  // Text input: Claude returns plain text
  const parsed = extractJSON(raw) as Record<string, unknown> | null;
  if (parsed && typeof parsed === "object" && parsed.message) {
    return NextResponse.json({ message: parsed.message as string });
  }

  return NextResponse.json({ message: raw });
}

function buildWordMockMessage(word: string, transcript: string, score: number): string {
  const tip = getWordTip(word.toLowerCase());
  let msg = `Bạn đọc: "${transcript}" — Điểm ước tính: **${score}/100**\n\n`;

  if (score >= 80) {
    msg += `✅ Phát âm khá tốt! `;
  } else if (score >= 50) {
    msg += `🟡 Gần đúng rồi, cần điều chỉnh thêm một chút. `;
  } else {
    msg += `🔴 Cần luyện thêm. `;
  }

  if (tip) {
    msg += `\n\n💡 **Hướng dẫn phát âm "${word}":**\n${tip}\n\n`;
  }

  msg += `Thử đọc lại chậm từng âm tiết: ${word.split("").join("-")} rồi ghép lại.\nNhấn 🎤 để thử lại!`;
  return msg;
}
