import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  const formData = await request.formData();
  const audioBlob = formData.get("audio") as Blob | null;

  if (!audioBlob) {
    return NextResponse.json({ error: "No audio provided" }, { status: 400 });
  }

  // Demo mode: no API key
  if (!OPENAI_API_KEY) {
    return NextResponse.json({
      transcript: "the weather is beautiful today",
      isMock: true,
    });
  }

  // Real Whisper call
  const whisperForm = new FormData();
  const ext = audioBlob.type.includes("mp4") ? "mp4" : "webm";
  whisperForm.append("file", audioBlob, `recording.${ext}`);
  whisperForm.append("model", "whisper-1");
  whisperForm.append("language", "en");

  const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: whisperForm,
  });

  if (!response.ok) {
    const err = await response.text();
    return NextResponse.json({ error: "Whisper error", detail: err }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({ transcript: data.text as string });
}
