import { supabase } from "./supabase";

export interface CloudData {
  pronunciation_data: unknown;
}

export async function loadFromCloud(userId: string): Promise<CloudData | null> {
  const { data, error } = await supabase
    .from("user_sync")
    .select("pronunciation_data")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Supabase load error:", error.message);
    return null;
  }
  return data;
}

export async function saveToCloud(userId: string, pronunciationData: unknown): Promise<void> {
  const { error } = await supabase
    .from("user_sync")
    .upsert(
      {
        user_id: userId,
        pronunciation_data: pronunciationData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

  if (error) console.error("Supabase save error:", error.message);
}
