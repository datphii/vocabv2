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

function mockWordScores(targetText: string): Record<string, WordScore> {
  const hardSounds = ["th", "wh", "wr", "kn", "ph"];
  const result: Record<string, WordScore> = {};

  targetText.split(/\s+/).forEach((raw) => {
    const word = raw.replace(/[^a-zA-Z'-]/g, "").toLowerCase();
    if (!word) return;

    const hasHard = hardSounds.some((p) => word.includes(p));
    const isLong = word.length > 8;
    const isShort = word.length <= 3;

    let score: number;
    let note: string | null = null;

    if (hasHard && word.includes("th")) {
      score = 30 + Math.floor(Math.random() * 25);
      note = `Âm /θ/ hoặc /ð/ trong "${word}" cần luyện thêm`;
    } else if (isLong) {
      score = 52 + Math.floor(Math.random() * 28);
      note = score < 65 ? `Nhấn âm trong "${word}" chưa đúng` : null;
    } else if (isShort) {
      score = 80 + Math.floor(Math.random() * 18);
    } else {
      score = 60 + Math.floor(Math.random() * 30);
    }

    result[word] = { score, note };
  });

  return result;
}

function buildMockMessage(wordScores: Record<string, WordScore>, transcript: string): string {
  const good = Object.entries(wordScores).filter(([, v]) => v.score >= 80).map(([w]) => w);
  const ok = Object.entries(wordScores).filter(([, v]) => v.score >= 50 && v.score < 80).map(([w]) => w);
  const bad = Object.entries(wordScores).filter(([, v]) => v.score < 50).map(([w]) => w);

  let msg = `Mình nghe bạn đọc: "${transcript}"\n\n`;
  if (good.length) msg += `✅ Tốt: ${good.join(", ")}\n`;
  if (ok.length) msg += `🟡 Cần cải thiện: ${ok.join(", ")}\n`;
  if (bad.length) msg += `🔴 Cần luyện thêm: ${bad.join(", ")}\n`;
  msg += "\n(Demo mode — thêm API keys vào .env.local để nhận phân tích chi tiết)";
  return msg;
}

// Extract JSON from Claude's response, handling markdown code blocks and extra text
function extractJSON(raw: string): unknown | null {
  // Try direct parse first
  try {
    return JSON.parse(raw.trim());
  } catch {
    // ignore
  }

  // Try extracting from markdown code block: ```json ... ``` or ``` ... ```
  const codeBlockMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {
      // ignore
    }
  }

  // Try finding JSON object in the text
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch {
      // ignore
    }
  }

  return null;
}

const SENTENCE_SYSTEM_PROMPT = `Bạn là gia sư phát âm tiếng Anh cho người Việt. Phong cách: thân thiện, cụ thể, khuyến khích.

KHI NHẬN TRANSCRIPT GIỌNG NÓI:
- So sánh transcript với câu mục tiêu
- Chấm điểm mỗi từ 0–100 (80+ tốt, 50–79 khá, <50 cần luyện)
- Chú ý lỗi người Việt hay gặp: /θ/ /ð/, phụ âm cuối, nhấn âm, nối âm
- Trả lời ĐÚNG format JSON sau, KHÔNG wrap trong code block:
{"wordScores":{"từ1":{"score":85,"note":null},"từ2":{"score":45,"note":"giải thích ngắn"}},"message":"Phản hồi chi tiết bằng tiếng Việt"}

KHI NHẬN CÂU HỎI TEXT:
- Trả lời tự nhiên bằng tiếng Việt, KHÔNG cần JSON
- Giải thích cách phát âm, vị trí lưỡi/môi, ví dụ minh họa`;

const WORD_SYSTEM_PROMPT = `Bạn là gia sư phát âm tiếng Anh cho người Việt. Phong cách: thân thiện, cụ thể, khuyến khích.

KHI NHẬN TRANSCRIPT GIỌNG NÓI:
- Đánh giá phát âm từ mục tiêu — điểm 0–100
- Hướng dẫn chi tiết: vị trí lưỡi, môi, hơi thở
- Trả lời ĐÚNG format JSON sau, KHÔNG wrap trong code block:
{"score":75,"message":"Phản hồi chi tiết bằng tiếng Việt"}

KHI NHẬN CÂU HỎI TEXT:
- Trả lời tự nhiên bằng tiếng Việt, KHÔNG cần JSON
- Giải thích cách phát âm, vị trí lưỡi/môi, ví dụ minh họa`;

export async function POST(request: NextRequest) {
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
  const body: ChatRequest = await request.json();
  const { messages, targetText, targetIPA, mode, latestTranscript, isVoiceInput, userMessage } = body;

  // Demo mode
  if (!ANTHROPIC_API_KEY) {
    if (isVoiceInput && latestTranscript) {
      const wordScores = mode === "sentence" ? mockWordScores(targetText) : undefined;
      const score = mode === "word" ? 60 + Math.floor(Math.random() * 35) : undefined;
      const message =
        mode === "sentence"
          ? buildMockMessage(wordScores!, latestTranscript)
          : `Bạn đọc: "${latestTranscript}"\nĐiểm: ${score}/100\n\n(Demo mode — thêm API keys để nhận phân tích chi tiết)`;
      return NextResponse.json({
        message,
        ...(wordScores ? { wordScores } : {}),
        ...(score !== undefined ? { overallScore: score } : {}),
      });
    }
    return NextResponse.json({
      message: "Đây là chế độ demo. Thêm ANTHROPIC_API_KEY vào .env.local để nhận phản hồi từ Claude!",
    });
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
      // Sentence mode: expect { wordScores, message }
      if (parsed.wordScores && parsed.message) {
        return NextResponse.json({
          message: parsed.message as string,
          wordScores: parsed.wordScores,
        });
      }
      // Word mode: expect { score, message }
      if (parsed.score !== undefined && parsed.message) {
        return NextResponse.json({
          message: parsed.message as string,
          overallScore: parsed.score as number,
        });
      }
      // Has message field
      if (parsed.message) {
        return NextResponse.json({ message: parsed.message as string });
      }
    }

    // JSON parse failed — Claude returned plain text, use it as message
    return NextResponse.json({ message: raw });
  }

  // Text input: Claude returns plain text
  // Try to extract message from JSON if Claude still returns JSON
  const parsed = extractJSON(raw) as Record<string, unknown> | null;
  if (parsed && typeof parsed === "object" && parsed.message) {
    return NextResponse.json({ message: parsed.message as string });
  }

  return NextResponse.json({ message: raw });
}
