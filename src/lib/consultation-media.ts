import { supabase } from "./db";

export type ConsultationRecordingState = "idle" | "recording" | "processing";

export const CONSULTATION_AUDIO_BUCKET = "consultation-audio";

const MIME_EXTENSION_MAP: Record<string, string> = {
  "audio/webm": "webm",
  "audio/webm;codecs=opus": "webm",
  "audio/ogg": "ogg",
  "audio/ogg;codecs=opus": "ogg",
  "audio/wav": "wav",
  "audio/x-wav": "wav",
  "audio/mpeg": "mp3",
  "audio/mp4": "m4a",
  "audio/x-m4a": "m4a",
  "audio/aac": "aac",
};

function normalizeMimeType(mimeType?: string | null) {
  return (mimeType || "").toLowerCase().trim();
}

export function resolveConsultationAudioExtension(mimeType?: string | null): string {
  const normalized = normalizeMimeType(mimeType);
  if (MIME_EXTENSION_MAP[normalized]) {
    return MIME_EXTENSION_MAP[normalized];
  }

  if (normalized.startsWith("audio/")) {
    if (normalized.includes("mpeg")) return "mp3";
    if (normalized.includes("mp4") || normalized.includes("m4a")) return "m4a";
    if (normalized.includes("ogg")) return "ogg";
    if (normalized.includes("wav")) return "wav";
    if (normalized.includes("aac")) return "aac";
  }

  return "webm";
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function buildConsultationAudioPath({
  timestamp = new Date(),
  uniqueId = crypto.randomUUID(),
  mimeType,
}: {
  timestamp?: Date;
  uniqueId?: string;
  mimeType?: string | null;
}) {
  const year = timestamp.getUTCFullYear();
  const month = pad(timestamp.getUTCMonth() + 1);
  const day = pad(timestamp.getUTCDate());
  const extension = resolveConsultationAudioExtension(mimeType);

  return `consultations/${year}/${month}/${day}/${uniqueId}.${extension}`;
}

export async function uploadConsultationAudio(
  audio: Blob,
  options?: {
    timestamp?: Date;
    uniqueId?: string;
    mimeType?: string | null;
  },
): Promise<{ path: string; publicUrl: string }> {
  const path = buildConsultationAudioPath({
    timestamp: options?.timestamp,
    uniqueId: options?.uniqueId,
    mimeType: options?.mimeType ?? audio.type,
  });

  const { error } = await supabase.storage.from(CONSULTATION_AUDIO_BUCKET).upload(path, audio, {
    contentType: audio.type || "application/octet-stream",
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from(CONSULTATION_AUDIO_BUCKET).getPublicUrl(path);
  return {
    path,
    publicUrl: data.publicUrl,
  };
}
