import assert from "node:assert/strict";
import test from "node:test";

import { buildConsultationAudioPath, resolveConsultationAudioExtension } from "./consultation-media";

test("resolveConsultationAudioExtension maps known MIME types", () => {
  assert.equal(resolveConsultationAudioExtension("audio/webm"), "webm");
  assert.equal(resolveConsultationAudioExtension("audio/mpeg"), "mp3");
  assert.equal(resolveConsultationAudioExtension("audio/mp4"), "m4a");
  assert.equal(resolveConsultationAudioExtension("audio/ogg;codecs=opus"), "ogg");
});

test("resolveConsultationAudioExtension falls back to webm", () => {
  assert.equal(resolveConsultationAudioExtension("application/octet-stream"), "webm");
  assert.equal(resolveConsultationAudioExtension(undefined), "webm");
});

test("buildConsultationAudioPath creates a stable storage path", () => {
  const path = buildConsultationAudioPath({
    timestamp: new Date("2026-06-28T14:35:12.000Z"),
    uniqueId: "abc123",
    mimeType: "audio/webm",
  });

  assert.equal(path, "consultations/2026/06/28/abc123.webm");
});

test("buildConsultationAudioPath uses the MIME-based extension", () => {
  const path = buildConsultationAudioPath({
    timestamp: new Date("2026-06-28T14:35:12.000Z"),
    uniqueId: "xyz789",
    mimeType: "audio/mpeg",
  });

  assert.equal(path, "consultations/2026/06/28/xyz789.mp3");
});
