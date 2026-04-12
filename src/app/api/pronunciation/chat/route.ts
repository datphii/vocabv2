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

// Mock: assign realistic scores without API key
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

function buildMockMessage(
  wordScores: Record<string, WordScore>,
  transcript: string
): string {
  const good = Object.entries(wordScores).filter(([, v]) => v.score >= 80).map(([w]) => w);
  const ok = Object.entries(wordScores).filter(([, v]) => v.score >= 50 && v.score < 80).map(([w]) => w);
  const bad = Object.entries(wordScores).filter(([, v]) => v.score < 50).map(([w]) => w);

  let msg = `[Demo — chưa có API key]\n\nMình nghe bạn đọc: "${transcript}"\n\n`;
  if (good.length) msg += `✅ Tốt: ${good.join(", ")}\n`;
  if (ok.length) msg += `🟡 Cần cải thiện: ${ok.join(", ")}\n`;
  if (bad.length) msg += `🔴 Cần luyện thêm: ${bad.join(", ")}\n`;
  msg += "\nThêm OPENAI_API_KEY và ANTHROPIC_API_KEY vào .env.local để nhận phân tích thực!";
  return msg;
}

const SENTENCE_SYSTEM_PROMPT = `Bạn là gia sư phát âm tiếng Anh chuyên giúp người Việt cải thiện phát âm và ngữ điệu.

Khi nhận transcript giọng nói của học viên:
1. Phân tích từng từ trong câu mục tiêu — chấm điểm 0–100
2. Phản hồi thân thiện, cụ thể, bằng tiếng Việt
3. Chú ý lỗi phổ biến của người Việt: âm /θ/ /ð/, phụ âm cuối bị nuốt, nhấn âm, ngữ điệu

Định dạng khi có voice input (LUÔN trả JSON hợp lệ):
{"wordScores":{"word":{"score":number,"note":"string or null"}},"message":"string"}

Định dạng khi hỏi text:
{"message":"string"}

Không thêm bất kỳ text nào ngoài JSON.`;

const WORD_SYSTEM_PROMPT = `Bạn là gia sư phát âm tiếng Anh chuyên giúp người Việt cải thiện phát âm và ngữ điệu.

Học viên đang luyện phát âm một từ cụ thể. Khi nhận transcript:
1. Đánh giá tổng thể từ đó — điểm 0–100
2. Hướng dẫn cụ thể cách phát âm đúng (vị trí lưỡi, môi, hơi thở)
3. Phản hồi bằng tiếng Việt, thân thiện và khuyến khích

Định dạng khi có voice input (LUÔN trả JSON hợp lệ):
{"score":number,"message":"string"}

Định dạng khi hỏi text:
{"message":"string"}

Không thêm bất kỳ text nào ngoài JSON.`;

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
          : `[Demo] Bạn đọc: "${latestTranscript}". Điểm: ${score}/100. Thêm API key để nhận phân tích chi tiết!`;
      return NextResponse.json({ message, ...(wordScores ? { wordScores } : {}), ...(score !== undefined ? { overallScore: score } : {}) });
    }
    return NextResponse.json({
      message:
        "[Demo mode] Đây là chế độ demo. Thêm ANTHROPIC_API_KEY vào .env.local để nhận phản hồi thực từ Claude!",
    });
  }

  // Build context prefix for system prompt
  const contextLine =
    mode === "sentence"
      ? `\nCâu mục tiêu: "${targetText}"${targetIPA ? ` | IPA: ${targetIPA}` : ""}`
      : `\nTừ mục tiêu: "${targetText}"${targetIPA ? ` | IPA: ${targetIPA}` : ""}`;

  const systemText =
    (mode === "sentence" ? SENTENCE_SYSTEM_PROMPT : WORD_SYSTEM_PROMPT) + contextLine;

  // Latest user turn
  let latestContent = "";
  if (isVoiceInput && latestTranscript) {
    latestContent = `[Ghi âm] Transcript: "${latestTranscript}"`;
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
      "anthropic-beta": "prompt-caching-2024-07-31",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      system: [{ type: "text", text: systemText, cache_control: { type: "ephemeral" } }],
      messages: apiMessages,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: "Claude API error", detail: err }, { status: 500 });
  }

  const data = await response.json();
  const raw: string = data.content?.[0]?.text ?? "";

  try {
    const parsed = JSON.parse(raw);
    return NextResponse.json({
      message: parsed.message ?? raw,
      ...(parsed.wordScores ? { wordScores: parsed.wordScores } : {}),
      ...(parsed.score !== undefined ? { overallScore: parsed.score } : {}),
    });
  } catch {
    return NextResponse.json({ message: raw });
  }
}
