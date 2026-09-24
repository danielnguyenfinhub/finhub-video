// Moves an edit.json item (a cue, stat or chapter) earlier or later by deltaMs:
// every source-time field shifts together, so a cue's inner beats (atMs,
// strikeMs, highlightAtMs, vsAtMs) stay inside its fromMs..toMs window.
// Durations (durMs) are not times and stay put. Import-free on purpose, so
// review/check-shift.mjs can run it with Node's type stripping.
const TIME_KEY = /^(atMs|fromMs|toMs|strikeMs|highlightAtMs|vsAtMs)$/;

export const shiftTimes = <T>(value: T, deltaMs: number): T => {
  if (Array.isArray(value))
    return value.map((v) => shiftTimes(v, deltaMs)) as T;
  if (value === null || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>))
    out[k] =
      TIME_KEY.test(k) && typeof v === "number"
        ? Math.max(0, Math.round(v + deltaMs))
        : shiftTimes(v, deltaMs);
  return out as T;
};
