// Where a video's recording files (source.mp4, foreground.webm, words.json,
// original.*) live, as a path under public/. edit.json "source" names a
// recording in public/recordings/<id>/, shared by every slug that edits it;
// without it (unmigrated and faceless videos) they sit in the slug's own
// public/videos/<slug>/. The one copy of this rule for TypeScript and Node:
// MortgageReel wraps it in staticFile(), the review page and server prefix
// public/, and scripts/*.mjs import it through Node's type stripping, so this
// file must stay import-free. scripts/recordings.py is the Python copy.
export const recordingPath = (
  slug: string,
  source: string | undefined,
  file: string,
): string =>
  source ? `recordings/${source}/${file}` : `videos/${slug}/${file}`;
