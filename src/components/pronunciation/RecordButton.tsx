"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

interface RecordButtonProps {
  onTranscriptReady: (transcript: string) => void;
  disabled?: boolean;
}

export default function RecordButton({ onTranscriptReady, disabled }: RecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setIsLoading(true);
        try {
          const formData = new FormData();
          const ext = mimeType.includes("webm") ? "webm" : "mp4";
          formData.append("audio", blob, `recording.${ext}`);
          const res = await fetch("/api/pronunciation/transcribe", {
            method: "POST",
            body: formData,
          });
          const { transcript } = await res.json();
          onTranscriptReady(transcript as string);
        } catch {
          // silently fail — user can retry
        } finally {
          setIsLoading(false);
        }
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      alert("Không thể truy cập microphone. Vui lòng cho phép quyền truy cập mic trong trình duyệt.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-gray-100">
        <Loader2 size={22} className="text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
      aria-label={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
      className={`relative flex items-center justify-center w-14 h-14 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
        isRecording
          ? "bg-red-500 shadow-lg shadow-red-200"
          : "bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-200"
      }`}
    >
      {isRecording && (
        <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-40" />
      )}
      {isRecording ? (
        <Square size={20} className="text-white relative z-10 fill-white" />
      ) : (
        <Mic size={22} className="text-white" />
      )}
    </button>
  );
}
