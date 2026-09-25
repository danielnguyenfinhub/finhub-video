// Parses reel.edit.subtitle into an episode line when it matches the show's
// "Tập N/M · Name" convention. Never invents a number: no match -> null, and
// the strip falls back to showing the subtitle as is (golden rule: never
// invent an episode number).
const EPISODE = /^Tập\s+(\d+)(?:\/(\d+))?\s*[·:-]\s*(.+)$/u;

export type Episode = { ep: number; total?: number; name: string };

export const parseEpisode = (subtitle: string | undefined): Episode | null => {
  if (!subtitle) return null;
  const m = EPISODE.exec(subtitle.trim());
  if (!m) return null;
  return {
    ep: Number(m[1]),
    total: m[2] ? Number(m[2]) : undefined,
    name: m[3].trim(),
  };
};

// The uppercase strip/cover text: "TẬP 3/8 · MUA NHÀ ĐẦU TIÊN" when parsed,
// else the subtitle uppercased as is.
export const stripLine = (subtitle: string | undefined): string => {
  const ep = parseEpisode(subtitle);
  const raw = ep
    ? `Tập ${ep.ep}${ep.total ? `/${ep.total}` : ""} · ${ep.name}`
    : (subtitle ?? "");
  return raw.toLocaleUpperCase("vi");
};
