# Writing a faceless script (document → script.json)

Daniel gives a document (a lender policy update, an RBA announcement, a fact sheet); you write `public/videos/<slug>/script.json`. `scripts/voice-video.mjs` voices it with Google's male voice Charon (Gemini TTS; `--engine omnivoice` for Daniel's cloned voice, `--engine elevenlabs` for ElevenLabs) and builds the video. Daniel approves the script **before** anything is voiced.

The writing rules below are MoneyPrinterTurbo's (Daniel liked how it writes scripts; `app/services/llm.py`), adapted to Finance Hub, RG 234 and the golden rules.

## Before writing

- **No client data.** If the document names a person, an address, a loan or account number, or a client's figures, stop and tell Daniel. Don't anonymise it yourself.
- **Find the one idea.** The idea is what a viewer should do or know after 45–75 s. Anything else in the document is a different video.

## The narration (`scenes[].vi`)

- **Get straight to the point.** Never open with "Xin chào", "welcome to this video" or "hôm nay mình sẽ nói về". The first sentence is the hook: a number, a surprise or a question, readable in under 3 s.
- **Write only what is spoken.** No titles, no markdown, no labels such as "Narrator:" or "Cảnh 1:", no stage directions. The voice engine reads every character.
- **Keep scenes short.** Each scene is one idea in 1–2 short sentences, about 5–12 s spoken, or about 15–35 Vietnamese words. A typical video has 5–9 scenes.
- **Write numbers the way they are said**, so the golden rules can chart them:
  - use "6,2 phần trăm", which is shown as "6,2%";
  - use "4,1 tỷ đô" or "500 nghìn đô";
  - use a Vietnamese decimal comma.
- **Name banks plainly** (CommBank, Westpac, ANZ, NAB…): the logo appears by itself. Never suggest a bank endorses or sponsors the video.
- **Stay general.** This is general information, not advice. Don't use "bạn nên vay…" style personal recommendations, guarantees, or "tốt nhất / rẻ nhất" claims.
- **Watch RG 234 terms.** The dry run blocks restricted terms. Rephrase them; only use an exemption with a real reason.
- **End with one call to action**, e.g. "Nhắn tin cho Finance Hub để được hỗ trợ." Don't add a second one.
- **Write real Vietnamese** with every diacritic.

## The English line (`scenes[].en`)

Write a faithful, plain translation of that scene. It appears under the captions for the whole scene, so keep it to about 20 words or fewer.

## Pick each scene's visual first (Daniel's rule, 25/09/2026)

Remotion elements explain; Pexels footage only fills the gaps. Decide the visual for every scene before writing its footage phrase:

| The scene… | Visual | Where it goes |
|---|---|---|
| gives a number | a counting ring chart. It is automatic when the number is spoken ("6,2 phần trăm"), or a `stats` entry for a label you write | `edit.json` |
| compares options (fixed vs variable, lender A vs B, before vs after) | a `compare` cue: two cards with rows | `edit.json` `cues` |
| shows data across 2–3 items | a `bars` cue | `edit.json` `cues` |
| outlines key points or steps (2–5) | a `points` cue: a numbered list revealed as each point is said | `edit.json` `cues` |
| names a bank | its logo. This is automatic | no work |
| sets the scene, tells a story, or is the call to action | stock footage (Pixabay, then Pexels) | `scenes[].footage` |
| is a gap that stock can't show well (an idea, a mood, a situation with no realistic footage) | an AI image (fal.ai FLUX, about US$0.03) with a slow zoom | `scenes[].ai` |

A scene with an element gets **no** `footage` or `ai`. A scene never has both: stock and AI are never mixed in one scene (OpenMontage).

**Writing an `ai` prompt:**
- Describe it like a location scout, not a stock librarian. "A young couple's hands holding a single brass house key over a moving box, morning window light" beats "home buying".
- Write concrete nouns plus light and setting. Leave out emotions and intentions.
- A fixed style (navy and amber tones, no text or logos, people from behind or out of focus) and one seed per video are added automatically, so the stills match.
- Never describe a real person, a real brand, or anything that could pass for a client's document. It plays on the brand navy, and a veil hides footage whenever an element is on screen. Cue times come from `words.json` after voicing, so add the cues to `edit.json` in the Build step.

## Footage (`scenes[].footage`, optional, gap scenes only)

Each phrase:

- is 1–3 **English** words;
- always carries the video's main subject;
- follows scene order, so the picture matches what is being said.

Good examples: "house keys couple", "bank branch australia", "calculator bills kitchen", "family new home".

Avoid:
- abstract words that return nothing useful ("interest rate", "refinance");
- recognisable brands or logos;
- anything that could look like a real client.

Clips come from Pixabay first, then Pexels. Both are free for commercial use with no credit required. Pixabay has no portrait filter, so portrait clips are preferred and landscape clips are centre-cropped.

**Keys in `.env.local`:**
- `PIXABAY_API_KEY` and/or `PEXELS_API_KEY` for stock clips.
- `FAL_KEY` for AI images.

Every search, clip and image is cached in `voice/footage/`, so a re-run costs nothing.

## Post copy (`post`, optional)

This is for the upload. It follows MoneyPrinterTurbo's social-copy rules:

- **title:** a catchy hook of 60 characters or fewer.
- **caption:** 1–3 sentences that end with the single call to action. No hashtags inside.
- **hashtags:** 3–5 of them, each starting with "#", no spaces, and relevant (e.g. #vayvon #muanha #FinanceHub).

RG 234 scans all of it.

## Example

```json
{
  "title": "Phí ngân hàng: 3 điều nên biết",
  "scenes": [
    { "vi": "Mỗi năm người Úc trả hàng tỷ đô phí ngân hàng.", "en": "Australians pay billions in bank fees every year.", "footage": "bank fees paperwork" },
    { "vi": "Lãi suất trung bình hiện khoảng 6,2 phần trăm.", "en": "The average rate is around 6.2 percent." },
    { "vi": "Hãy xem lại khoản vay mỗi năm một lần. Nhắn tin cho Finance Hub để được hỗ trợ.", "en": "Review your loan once a year. Message Finance Hub for help.", "footage": "couple reviewing home loan" }
  ],
  "post": {
    "title": "Bạn đang trả bao nhiêu phí ngân hàng?",
    "caption": "Ba điều nên kiểm tra với khoản vay của bạn. Nhắn tin cho Finance Hub để được hỗ trợ.",
    "hashtags": ["#vayvon", "#taichinh", "#FinanceHub"]
  }
}
```

## Steps

1. **Write** `script.json` and run `node scripts/voice-video.mjs <slug> --dry-run`. It checks RG 234 and prints the character count and the footage searches.
2. **Send Daniel the script** as a readable list (Vietnamese, English, footage, post copy) with the character count. Wait for his approval.
3. **Build.** Run `node scripts/voice-video.mjs <slug>`, then add the hook, chapters and stats to `edit.json` (`references/edit-json.md`). Check stills, then render with `python scripts/render-video.py <slug>`.
