# remocn — local reference library

Vendored from https://remocn.dev (MIT, see LICENSE) — 300+ Remotion animations, transitions, shaders,
text effects, UI primitives, icons and full templates. Files sit at their shadcn install paths
(`components/remocn/*`, `lib/remocn*/*`), so their `@/components/remocn/...` and `@/lib/remocn-*`
imports resolve against this folder. To use one, copy it plus the files it imports into `src/`,
then adapt like the Remotion Elements (see ../CATALOG.md): Be Vietnam Pro, `src/brand/theme.ts`
colours, 1080×1920 safe zones.

Packages not yet in finhub-video: `@fontsource/manrope`, `@fontsource/inter`, `date-fns`, `lucide-react`, `culori`, `@paper-design/shaders-react`, `opentype.js`, `@fontsource/roboto-mono` — install only when you use an element that needs one.
`shader-gem-smoke` expects `public/prisma/symbol-light.svg` (a Prisma logo, not copied) — pass your own image.
Type-check (tsc against finhub tsconfig, `@/*` → this folder): all internal imports resolve. Besides the missing packages, finhub is stricter than remocn, so `stretch-in`, `lib/remocn-ui/color.ts`, the `brand-guidelines`/`release-teaser` `motion.ts` and `x-follow-card` need small type fixes once copied into `src/`.

## ai

- **ChatGPT** (`components/remocn/chat-gpt.tsx`) — Announcing a ChatGPT integration or GPT-powered feature where the OpenAI brand must be recognizable. _vibe: tech_ · npm: @remotion/google-fonts · ⚠ third-party brand UI — reference only
- **Claude Chat** (`components/remocn/claude-chat.tsx`) — Announcing a Claude integration or Anthropic-powered feature where the Claude brand must be visible. _vibe: tech_ · npm: @remotion/google-fonts · ⚠ third-party brand UI — reference only
- **Claude Code** (`components/remocn/claude-code.tsx`) — Depicting a Claude Code / agentic-CLI workflow as a recognizable branded surface in a dev-tool demo. _vibe: tech_ · npm: @remotion/google-fonts · ⚠ third-party brand UI — reference only
- **OpenCode** (`components/remocn/opencode.tsx`) — Depicting the OpenCode TUI as a recognizable branded surface in a dev-tool demo. _vibe: tech_ · npm: @remotion/google-fonts · ⚠ third-party brand UI — reference only
- **v0** (`components/remocn/v0.tsx`) — Depicting the Vercel v0 composer as a recognizable branded surface in a generative-UI demo. _vibe: tech_ · npm: @remotion/google-fonts · ⚠ third-party brand UI — reference only

## compositions

- **Ecosystem Constellation** (`components/remocn/ecosystem-constellation.tsx`) — The story is "we plug into everything" — one hub product ringed by the tools it connects to. _vibe: tech_
- **Infinite Bento Pan** (`components/remocn/infinite-bento-pan.tsx`) — You need an ambient establishing shot that says "a lot is happening here" without asking anyone to read a single number. _vibe: data_
- **Live Code Compilation** (`components/remocn/live-code-compilation.tsx`) — You want to show cause and effect for a developer audience: a style prop finishes typing on the left and the button on the right changes on that exact frame. _vibe: tech_

## effects

- **Confetti** (`components/remocn/confetti.tsx`) — A milestone moment needs a celebratory payoff — product launch, plan completion, success screen. _vibe: playful_
- **Crumple Toss** (`components/remocn/crumple-toss.tsx`) — Discarding something on screen — the old plan, the wrong answer, the previous version. _vibe: paper_
- **Cursor Gravity** (`components/remocn/cursor-gravity.tsx`) — An empty scene should reveal a call to action through a physical pulling gesture. _vibe: playful_
- **Ink Arrow** (`components/remocn/ink-arrow.tsx`) — A hand-drawn annotation should point from one thing to another — callouts over paper or scrapbook scenes. _vibe: paper_
- **Paper Wobble** (`components/remocn/paper-wobble.tsx`) — Any block should carry the stop-motion reshoot wobble — headlines, cards, or content that must feel hand-placed rather than laid out. _vibe: paper_
- **Radial Burst** (`components/remocn/radial-burst.tsx`) — A product introduction needs a short abstract geometric opening before its title. _vibe: playful_
- **Scribble Circle** (`components/remocn/scribble-circle.tsx`) — Circling the one element that matters — a button, a number, a row in a screenshot. _vibe: paper_
- **Simulated Cursor** (`components/remocn/simulated-cursor.tsx`) — You are narrating a screen demo and need a synthetic cursor that moves predictably over a UI screenshot or recording _vibe: clean_
- **TV Power Off** (`components/remocn/tv-power-off.tsx`) — A scene should end like a device being switched off rather than fading out — the picture collapses, a dot lingers, and the frame is dead. _vibe: tech_

## filters

- **ASCII Render** (`components/remocn/ascii-render.tsx`) — A scene should arrive out of text — interpolate intensity from 1 to 0 and the UI resolves out of ASCII instead of just fading in. _vibe: tech_
- **CRT Screen** (`components/remocn/crt-screen.tsx`) — A scene should read as something displayed on a tube rather than rendered flat — retro terminals, arcade beats, an old dashboard being demoed. _vibe: tech_
- **Camera Lens** (`components/remocn/camera-lens.tsx`) — A screencast looks sterile and you want it to read as filmed — this is the cheapest way to stop a recording looking like a render. _vibe: premium_
- **Halftone Print** (`components/remocn/halftone-print.tsx`) — A scene should read as something printed rather than displayed — zine-flavoured intros, riso posters, editorial title cards. _vibe: paper_
- **Hologram** (`components/remocn/hologram.tsx`) — A feature should present as a projection rather than as a screen — a sci-fi flavoured reveal, a 'here is what is coming' beat. _vibe: tech_
- **Pixelate Region** (`components/remocn/pixelate-region.tsx`) — A product demo shows real data — API keys, tokens, email addresses, account numbers — that must not leave the building. _vibe: clean_
- **Security Cam** (`components/remocn/security-cam.tsx`) — A beat should play as surveillance footage — a cold open, a 'meanwhile, in production' aside, anything that wants to read as captured rather than presented. _vibe: tech_
- **Sustained Glitch** (`components/remocn/sustained-glitch.tsx`) — A tech or developer-facing scene should feel unstable for its whole run without the corruption ever settling into a constant texture. _vibe: tech_
- **Underwater Ripple** (`components/remocn/underwater-ripple.tsx`) — A scene should sit under water for its whole run — calm premium backdrops, ambient hero loops, a title card that needs motion without a direction. _vibe: premium_
- **VHS Filter** (`components/remocn/vhs-filter.tsx`) — A scene should read as recovered tape footage rather than a clean render — retro product spots, 'here is what we shipped in 2003' beats, lo-fi title cards. _vibe: tech_

## icons

- **Activity** (`components/remocn/icon-activity.tsx`) — Animated Lucide activity icon — the pulse line sweeps through like an EKG, popping at the peak. Loops by default.
- **Alert Triangle** (`components/remocn/icon-alert-triangle.tsx`) — Animated Lucide triangle-alert icon — the outline draws on, the mark pops in, then the exclamation blinks to flag a risk or warning.
- **Arrow Down** (`components/remocn/icon-arrow-down.tsx`) — Animated Lucide arrow-down icon — the shaft and head draw on, then the arrow nudges down for cost/latency reduction beats or scroll cues.
- **Arrow Left** (`components/remocn/icon-arrow-left.tsx`) — Animated Lucide arrow-left icon — the shaft and head draw on, then the arrow nudges back for back navigation or 'previously' callbacks.
- **Arrow Right** (`components/remocn/icon-arrow-right.tsx`) — Animated Lucide arrow-right icon — the shaft and head draw on, then the arrow nudges forward for CTAs, next-step pointers, or flow direction.
- **Arrow Up** (`components/remocn/icon-arrow-up.tsx`) — Animated Lucide arrow-up icon — the shaft and head draw on, then the arrow nudges up for growth, improvement, or upward-trend beats.
- **At Sign** (`components/remocn/icon-at-sign.tsx`) — Animated Lucide at-sign icon — the inner 'a' draws and pops, then the outer swoosh re-traces its tail: a mention landing.
- **Award** (`components/remocn/icon-award.tsx`) — Animated Lucide award icon — the medal draws on, the ribbon unfurls beneath it, then the medal swings to rest.
- **Bar Chart 3** (`components/remocn/icon-bar-chart-3.tsx`) — Animated Lucide bar-chart-3 icon — the axis draws on, then three bars rise left to right with overshoot: the classic growth chart.
- **Bell** (`components/remocn/icon-bell.tsx`) — Animated Lucide bell icon — the body draws on, the clapper follows, then the bell swings from its mount to signal a notification or alert.
- **Bookmark** (`components/remocn/icon-bookmark.tsx`) — Animated Lucide bookmark icon — draws on, then drops into place from above with a spring landing.
- **Calendar** (`components/remocn/icon-calendar.tsx`) — Animated Lucide calendar icon — the pad draws on, then the binder rings dip and the page snaps into place.
- **Camera** (`components/remocn/icon-camera.tsx`) — Animated Lucide camera icon — draws on, then the lens blinks shut and open like a shutter firing.
- **Check Circle** (`components/remocn/icon-check-circle.tsx`) — Animated Lucide circle-check icon — the ring draws clockwise, the checkmark traces in, then the whole mark pops to confirm a completed or successful state.
- **Check** (`components/remocn/icon-check.tsx`) — Animated Lucide check icon — the stroke draws on, then stamps with a spring pop to mark a step, task, or claim as done.
- **Chevron Down** (`components/remocn/icon-chevron-down.tsx`) — Animated Lucide chevron-down icon — draws on, then nudges downward with a fading echo.
- **Chevron Left** (`components/remocn/icon-chevron-left.tsx`) — Animated Lucide chevron-left icon — draws on, then nudges left with a fading echo.
- **Chevron Right** (`components/remocn/icon-chevron-right.tsx`) — Animated Lucide chevron-right icon — draws on, then nudges right with a fading echo.
- **Chevron Up** (`components/remocn/icon-chevron-up.tsx`) — Animated Lucide chevron-up icon — draws on, then nudges upward with a fading echo.
- **Clock** (`components/remocn/icon-clock.tsx`) — Animated Lucide clock icon — the face draws on, then the hands sweep through discrete ticks. Loops by default.
- **Cloud** (`components/remocn/icon-cloud.tsx`) — Animated Lucide cloud icon — draws on, then floats: a weightless bob and a half before settling.
- **Code** (`components/remocn/icon-code.tsx`) — Animated Lucide code icon — the angle brackets draw on, pull apart, and snap back around their code.
- **Copy** (`components/remocn/icon-copy.tsx`) — Animated Lucide copy icon — the two sheets draw back-to-front, then the front sheet lifts and settles to read as a duplicate for a copy-to-clipboard beat.
- **Credit Card** (`components/remocn/icon-credit-card.tsx`) — Animated Lucide credit-card icon — the card draws on, then the stripe swipes through and the card tips: payment accepted.
- **Crown** (`components/remocn/icon-crown.tsx`) — Animated Lucide crown icon — descends into place from above, lands with a pop, then rocks regally to rest.
- **Database** (`components/remocn/icon-database.tsx`) — Animated Lucide database icon — the cylinder draws on, then a write lands: the top disc pops and data settles down the stack.
- **Dollar Sign** (`components/remocn/icon-dollar-sign.tsx`) — Animated Lucide dollar-sign icon — draws on, then the sign stretches tall: understated cha-ching.
- **Download** (`components/remocn/icon-download.tsx`) — Animated Lucide download icon — the tray draws on, the arrow fades in, then drops into the tray with a squash on impact for a download or export beat.
- **External Link** (`components/remocn/icon-external-link.tsx`) — Animated Lucide external-link icon — the box and arrow draw on, then the arrow darts out toward the top-right for 'view on GitHub', external docs, or open-in-new-tab beats.
- **Eye Off** (`components/remocn/icon-eye-off.tsx`) — Animated Lucide eye-off icon — the eye fragments draw on, then the slash cuts through and visibility dims.
- **Eye** (`components/remocn/icon-eye.tsx`) — Animated Lucide eye icon — draws on, then blinks once and refocuses its pupil.
- **File Text** (`components/remocn/icon-file-text.tsx`) — Animated Lucide file-text icon — the page draws on, then the text lines type themselves in, top to bottom.
- **Filter** (`components/remocn/icon-filter.tsx`) — Animated Lucide filter icon — the funnel draws on, then gives two quick shakes as results fall through.
- **Flame** (`components/remocn/icon-flame.tsx`) — Animated Lucide flame icon — the outline draws on, then flickers with a looping scale-and-skew wobble for hot features, trending items, or streaks. Loops by default.
- **Folder** (`components/remocn/icon-folder.tsx`) — Animated Lucide folder icon — draws on, then the folder tips open for a peek and closes.
- **Gem** (`components/remocn/icon-gem.tsx`) — Animated Lucide gem icon — the stone draws on, then light catches it: facets re-trace in sequence with a flicker and a pop.
- **Gift** (`components/remocn/icon-gift.tsx`) — Animated Lucide gift icon — draws on, then the lid lifts for a peek and lands with a ribbon pop: almost unwrapped.
- **Globe** (`components/remocn/icon-globe.tsx`) — Animated Lucide globe icon — draws on, then the meridian sweeps west to east like the world turning. Loops by default.
- **Heart** (`components/remocn/icon-heart.tsx`) — Animated Lucide heart icon — the outline draws on, then a lub-dub heartbeat pulse for likes, favorites, or built-with-love moments.
- **Help Circle** (`components/remocn/icon-help-circle.tsx`) — Animated Lucide help-circle icon — the ring draws on, then the question mark re-draws and tilts like a curious head.
- **Home** (`components/remocn/icon-home.tsx`) — Animated Lucide home icon — the house draws on, then the door re-draws open and the house settles: welcome home.
- **Icon Scatter** (`components/remocn/icon-scatter.tsx`) — Playful product or app transitions where icons are part of the brand's visual language. _vibe: playful_ · npm: @remotion/transitions
- **Icons Core** (`lib/remocn-icons/index.ts`) — Shared animation contract, pure frame-to-phase timeline, and SVG path-draw helpers for remocn icons. · npm: @remotion/paths
- **Image** (`components/remocn/icon-image.tsx`) — Animated Lucide image icon — the frame draws on, then the mountain redraws and the sun drifts into place like a photo developing.
- **Inbox** (`components/remocn/icon-inbox.tsx`) — Animated Lucide inbox icon — the tray draws on, then dips under the weight of an arriving item and springs back.
- **Info** (`components/remocn/icon-info.tsx`) — Animated Lucide info icon — the ring draws clockwise, the dot pops and stem draws in, then the dot bobs to draw a gentle, neutral note.
- **Key** (`components/remocn/icon-key.tsx`) — Animated Lucide key icon — draws on, then turns in an invisible lock and springs back.
- **Layout Grid** (`components/remocn/icon-layout-grid.tsx`) — Animated Lucide layout-grid icon — four tiles draw on, then re-pop into place clockwise like a dashboard assembling.
- **Link** (`components/remocn/icon-link.tsx`) — Animated Lucide link icon — two chain halves draw on, pull apart, and click together.
- **Loader** (`components/remocn/icon-loader.tsx`) — Animated Lucide loader-circle icon — the arc draws on, then spins continuously for a loading or processing beat. Loops by default.
- **Lock** (`components/remocn/icon-lock.tsx`) — Animated Lucide lock icon — the body draws on, then the shackle lifts and slams shut with a confirming pop.
- **Log Out** (`components/remocn/icon-log-out.tsx`) — Animated Lucide log-out icon — draws on, then the arrow steps out through the door frame with a fading echo.
- **Mail** (`components/remocn/icon-mail.tsx`) — Animated Lucide mail icon — the envelope draws on, then the flap re-traces open and the whole envelope pops: you've got mail.
- **Maximize** (`components/remocn/icon-maximize.tsx`) — Animated Lucide maximize icon — four corner brackets draw on, then fly outward and spring back like a window going fullscreen.
- **Menu** (`components/remocn/icon-menu.tsx`) — Animated Lucide menu icon — the three bars slide in from the left, top to bottom, each overshooting into place.
- **Message Circle** (`components/remocn/icon-message-circle.tsx`) — Animated Lucide message-circle icon — the bubble draws on, then inflates from its tail like a message arriving.
- **Mic** (`components/remocn/icon-mic.tsx`) — Animated Lucide mic icon — draws on, then the capsule bounces twice like a level meter picking up voice.
- **Monitor** (`components/remocn/icon-monitor.tsx`) — Animated Lucide monitor icon — the stand draws, then the screen powers on with a CRT-style unsquash.
- **Moon** (`components/remocn/icon-moon.tsx`) — Animated Lucide moon icon — draws on, then rocks gently into place: settling in for the night.
- **More Horizontal** (`components/remocn/icon-more-horizontal.tsx`) — Animated Lucide more-horizontal icon — three dots pop in, then do a left-to-right thinking wave.
- **Package** (`components/remocn/icon-package.tsx`) — Animated Lucide package icon — the box draws on, lands with a squash-and-stretch, then the tape seam seals it.
- **Party Popper** (`components/remocn/icon-party-popper.tsx`) — Animated Lucide party-popper icon — the cone draws on, then confetti bursts outward as the cone recoils for launch, milestone, or celebration finales.
- **Pause** (`components/remocn/icon-pause.tsx`) — Animated Lucide pause icon — the two bars draw on, then pinch toward each other and settle like a held breath.
- **Pencil** (`components/remocn/icon-pencil.tsx`) — Animated Lucide pencil icon — draws on, then scribbles: the pencil rocks around its tip as if writing.
- **Phone** (`components/remocn/icon-phone.tsx`) — Animated Lucide phone icon — draws on, then rings: three decaying rotation oscillations around center.
- **Play** (`components/remocn/icon-play.tsx`) — Animated Lucide play icon — the triangle draws on, then presses in and springs forward like a play button being hit.
- **Plus Circle** (`components/remocn/icon-plus-circle.tsx`) — Animated Lucide plus-circle icon — the ring draws on, the plus crosses in, then the whole badge pops.
- **Plus** (`components/remocn/icon-plus.tsx`) — Animated Lucide plus icon — the two strokes draw on, then the mark twirls 90deg with a scale pop for an energetic add or create beat.
- **Refresh Cw** (`components/remocn/icon-refresh-cw.tsx`) — Animated Lucide refresh-cw icon — the two arcs draw on, arrowheads pop, then the whole mark spins in cycles for sync, retry, or up-to-date messaging. Loops by default.
- **Rocket** (`components/remocn/icon-rocket.tsx`) — Animated Lucide rocket icon — draws on, then lifts off: the ship rises on a tilt while the flame re-ignites, then eases back to rest.
- **Save** (`components/remocn/icon-save.tsx`) — Animated Lucide save icon — the disk draws on, then presses down and writes: the label slot re-draws as data commits.
- **Search** (`components/remocn/icon-search.tsx`) — Animated Lucide search icon — the lens draws on, the handle extends, then the magnifier sweeps a small scanning path for a search or discovery beat.
- **Send** (`components/remocn/icon-send.tsx`) — Animated Lucide send icon — the paper plane draws on, then darts forward with a wind-up and settles back for a send-message beat.
- **Settings** (`components/remocn/icon-settings.tsx`) — Animated Lucide settings icon — the gear and center draw on, then the gear turns exactly one tooth for a settings, configuration, or customization beat.
- **Share 2** (`components/remocn/icon-share-2.tsx`) — Animated Lucide share-2 icon — three nodes draw on, then the connections re-trace and the receiving nodes pop as the share lands.
- **Shield** (`components/remocn/icon-shield.tsx`) — Animated Lucide shield icon — draws on, then braces: a firm guard pulse that asserts protection.
- **Shopping Cart** (`components/remocn/icon-shopping-cart.tsx`) — Animated Lucide shopping-cart icon — draws on, then rolls forward to checkout, wheels popping as it stops.
- **Skip Forward** (`components/remocn/icon-skip-forward.tsx`) — Animated Lucide skip-forward icon — draws on, then dashes forward past center and snaps against its end bar.
- **Smartphone** (`components/remocn/icon-smartphone.tsx`) — Animated Lucide smartphone icon — draws on, then buzzes: three fast vibration oscillations.
- **Sparkles** (`components/remocn/icon-sparkles.tsx`) — Animated Lucide sparkles icon — the main sparkle draws on, the accents pop, then a looping twinkle for AI, magic, or premium highlights. Loops by default.
- **Star** (`components/remocn/icon-star.tsx`) — Animated Lucide star icon — the outline draws on, then twinkles into place with a small rotate and scale pop for ratings, favorites, or star callouts.
- **Sun** (`components/remocn/icon-sun.tsx`) — Animated Lucide sun icon — the core draws on, then eight rays fan out clockwise and the sun swells: sunrise.
- **Tag** (`components/remocn/icon-tag.tsx`) — Animated Lucide tag icon — draws on, then swings from its hole like a price tag flicked by a shopper.
- **Target** (`components/remocn/icon-target.tsx`) — Animated Lucide target icon — three rings draw in from outside, then the bullseye hits: inner dot pops and the board shudders.
- **Terminal** (`components/remocn/icon-terminal.tsx`) — Animated Lucide terminal icon — draws on, then the prompt nudges forward and the cursor blinks twice.
- **Thumbs Up** (`components/remocn/icon-thumbs-up.tsx`) — Animated Lucide thumbs-up icon — the hand draws on, then springs up with an approving stamp for positive reviews, approvals, or social-proof beats.
- **Timer** (`components/remocn/icon-timer.tsx`) — Animated Lucide timer icon — draws on, then the start button clicks and the hand sweeps: the stopwatch is running.
- **Trash** (`components/remocn/icon-trash.tsx`) — Animated Lucide trash-2 icon — the can draws on, then the lid flips open and the contents vanish for a delete or cleanup beat.
- **Trending Down** (`components/remocn/icon-trending-down.tsx`) — Animated Lucide trending-down icon — the line descends across, then the arrowhead lands with damped weight.
- **Trending Up** (`components/remocn/icon-trending-up.tsx`) — Animated Lucide trending-up icon — the line climbs across, then the arrowhead pops at the peak.
- **Trophy** (`components/remocn/icon-trophy.tsx`) — Animated Lucide trophy icon — draws on, then hoists: the cup hops with a pop at the apex while its handles flash in.
- **Upload** (`components/remocn/icon-upload.tsx`) — Animated Lucide upload icon — the tray draws on, the arrow fades in, then launches upward with a spring for an upload, publish, or submission beat.
- **User Plus** (`components/remocn/icon-user-plus.tsx`) — Animated Lucide user-plus icon — the figure draws on, then the plus strokes draw in and pop: a new member added.
- **User** (`components/remocn/icon-user.tsx`) — Animated Lucide user icon — draws on, then gives a small presence nod: head dips as shoulders rise to meet it.
- **Users** (`components/remocn/icon-users.tsx`) — Animated Lucide users icon — the front figure draws on and pops, then the second figure slides in from behind: the team assembles.
- **Video** (`components/remocn/icon-video.tsx`) — Animated Lucide video icon — draws on, then the lens wedge pans out and snaps back to its shot.
- **Volume 2** (`components/remocn/icon-volume-2.tsx`) — Animated Lucide volume-2 icon — the speaker draws on, then the two sound waves ripple outward one after the other.
- **Volume X** (`components/remocn/icon-volume-x.tsx`) — Animated Lucide volume-x icon — the speaker draws on, then the X slashes in and the glyph shakes off the sound.
- **Wallet** (`components/remocn/icon-wallet.tsx`) — Animated Lucide wallet icon — draws on, then the wallet thickens with a quiet x-scale: money in.
- **X Circle** (`components/remocn/icon-x-circle.tsx`) — Animated Lucide x-circle icon — the ring draws on, the X slashes in, and the badge shakes once: firmly rejected.
- **X** (`components/remocn/icon-x.tsx`) — Animated Lucide x icon — the two diagonals draw in crosswise, then the mark shakes to punctuate an error, removal, or dismissal.
- **Zap** (`components/remocn/icon-zap.tsx`) — Animated Lucide zap icon — the bolt draws in fast, then flashes with a double blink for speed, performance, or instant-result claims.

## layout

- **Backdrop** (`components/remocn/backdrop.tsx`) — You need a scene background — wrap every composition in `Backdrop` rather than hardcoding background colors on individual components. _vibe: clean_
- **Chat to Preview Layout** (`components/remocn/chat-to-preview-layout.tsx`) — Showing an AI agent at work — the conversation starts as the subject, then yields the frame to what it produced _vibe: tech_
- **Drift** (`components/remocn/drift.tsx`) — Any static scene should feel alive — hero cards, feature panels, dashboards sitting between transitions. _vibe: clean_
- **Stage** (`components/remocn/stage.tsx`) — A product screen, website, image, or live React scene should read as a photographed object rather than a flat full-frame capture. _vibe: premium_

## lib (shared helpers)

- **Canvas Presentation** (`lib/remocn/canvas-presentation.tsx`) — The html-in-canvas scaffolding the canvas transitions and scene filters share: support detection, a full-screen WebGL2 shader fed either both sides of a cut or the single scene a filter wraps, and routing to a CSS fallback where the browser lacks the API. · npm: @remotion/transitions
- **Scene Motion** (`lib/remocn/scene-motion.ts`) — The motion vocabulary scene content is built from: an exponential travel curve, a separate opacity ramp, three spring easings, and a compressing stagger.
- **Stop Motion Clock** (`lib/remocn/stop-motion.ts`) — Quantized stop-motion clock for Remotion. Stepped frames, stepped springs, deterministic hashing, and per-pose paper jitter.
- **remocn UI Core** (`lib/remocn-ui/timeline.ts`, `lib/remocn-ui/theme.ts`, `lib/remocn-ui/color.ts`, `lib/remocn-ui/motion.ts`, `lib/remocn-ui/types.ts`, `lib/remocn-ui/index.ts`) — Shared timeline-fold hook, theme context, and color math for remocn UI primitives. · npm: culori

## other

- **Brush** (`components/remocn/brush.tsx`) — Variable-width brush ribbons for Remotion. Pressure taper, grain displacement, and spine samplers shared by the ink marks.
- **UI Command Menu Item** (`components/remocn/command-menu-item.tsx`, `components/remocn/use-command-menu-item-transition.ts`) — A command-palette row whose idle/hover/press/selected state is a pure function of the timeline. Leading icon + label + trailing shortcut kbd. Exports an inline CommandMenuItemRow (reused by CommandMenu) and a standalone CommandMenuItem atom; the row background, label color, and icon color are keyframed presets.
- **UI Dropdown Menu Item** (`components/remocn/dropdown-menu-item.tsx`, `components/remocn/use-dropdown-menu-item-transition.ts`) — A dropdown menu action row whose idle/hover/press state is a pure function of the timeline; the row background and label color are keyframed presets. Composed inside the DropdownMenu panel.
- **UI Select Item** (`components/remocn/select-item.tsx`, `components/remocn/use-select-item-transition.ts`) — A select option row whose idle/hover/press/selected state is a pure function of the timeline; the row background, label color, and check icon are keyframed presets. Composed inside the Select panel.

## shaders

- **Light Tunnel** (`components/remocn/shader-light-tunnel.tsx`) — A title reveal or product intro needs a luminous forward flight through a tunnel. _vibe: premium_
- **Shader Caustics** (`components/remocn/shader-caustics.tsx`) — Water, light, or premium ambient backdrops where refracted-light filaments fit the mood. _vibe: premium_
- **Shader Color Panels** (`components/remocn/shader-color-panels.tsx`) — You want an architectural, glassy backdrop of translucent panes sliding past each other. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Dithering** (`components/remocn/shader-dithering.tsx`) — You want a retro/print, 1-bit ordered-dither texture over a moving gradient. _vibe: tech_ · npm: @paper-design/shaders-react
- **Shader Dot Orbit** (`components/remocn/shader-dot-orbit.tsx`) — You want a structured dot-grid backdrop with gentle orbital motion. _vibe: tech_ · npm: @paper-design/shaders-react
- **Shader Gem Smoke** (`components/remocn/shader-gem-smoke.tsx`) — Brand or logo reveals that want smoke living inside and around a mark. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader God Rays** (`components/remocn/shader-god-rays.tsx`) — A hero or reveal scene wants cinematic volumetric light rays from a corner source. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Grain Gradient** (`components/remocn/shader-grain-gradient.tsx`) — A gradient backdrop needs analog texture — the grain reads as film/print rather than flat digital. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Liquid Metal** (`components/remocn/shader-liquid-metal.tsx`) — A premium, industrial, or luxury scene wants a brushed/molten metal surface. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Mesh Gradient** (`components/remocn/shader-mesh-gradient.tsx`) — You need a quality, production-grade gradient backdrop. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Metaballs** (`components/remocn/shader-metaballs.tsx`) — A playful or organic scene wants lava-lamp blobs merging and splitting. _vibe: playful_ · npm: @paper-design/shaders-react
- **Shader Neuro Noise** (`components/remocn/shader-neuro-noise.tsx`) — An AI / ML / tech scene wants an organic neural-web texture that reads as "intelligence". _vibe: tech_ · npm: @paper-design/shaders-react
- **Shader Perlin Noise** (`components/remocn/shader-perlin-noise.tsx`) — You want a soft, cloudy, organic backdrop that drifts slowly and stays calm. _vibe: clean_ · npm: @paper-design/shaders-react
- **Shader Pulsing Border** (`components/remocn/shader-pulsing-border.tsx`) — You want a pulsing lit frame around the scene edges to contain foreground content. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Simplex Noise** (`components/remocn/shader-simplex-noise.tsx`) — You want the smoothest of the noise backdrops — fewer directional artifacts than Perlin. _vibe: clean_ · npm: @paper-design/shaders-react
- **Shader Smoke Ring** (`components/remocn/shader-smoke-ring.tsx`) — You want a single soft, centered smoke ring as a focal atmospheric element. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Spiral** (`components/remocn/shader-spiral.tsx`) — You want a hypnotic, rotating radial background with visible arm structure. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Strata** (`components/remocn/shader-strata.tsx`) — Calm, grounded, geological ambient backdrops — foundations, stability, "built on" narratives. _vibe: clean_
- **Shader Swirl** (`components/remocn/shader-swirl.tsx`) — You want a hypnotic, radial background with clear banded structure around a center. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Voronoi** (`components/remocn/shader-voronoi.tsx`) — You want a cellular, crystalline backdrop that shifts and re-tessellates. _vibe: tech_ · npm: @paper-design/shaders-react
- **Shader Warp** (`components/remocn/shader-warp.tsx`) — A hero scene wants organic, liquid motion that feels alive but stays out of the way. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Water** (`components/remocn/shader-water.tsx`) — A scene wants a calm, aquatic atmosphere with gentle refracted highlights. _vibe: premium_ · npm: @paper-design/shaders-react
- **Shader Weave** (`components/remocn/shader-weave.tsx`) — Tactile, crafted, "made-of" textures — fabric, mesh, or substrate metaphors. _vibe: premium_

## social

- **GitHub Sponsors** (`components/remocn/github-sponsors.tsx`) — A thank-you beat for funders — the heart draws itself, docks upward, and every sponsor avatar blur-staggers into a grid beneath it. _vibe: social_ · npm: @remotion/google-fonts · ⚠ third-party brand UI — reference only
- **GitHub Stars** (`components/remocn/github-stars.tsx`) — Celebrating an OSS milestone — the count-up odometer landing on a star total is the payoff beat. _vibe: data_ · npm: date-fns, @remotion/google-fonts · ⚠ third-party brand UI — reference only
- **Logo Enter** (`components/remocn/logo-enter.tsx`) — Showing a cluster of brand/partner/integration logos arriving together ("works with…", an AI-tool lineup, an icon cloud). _vibe: social_
- **X Follow Card** (`components/remocn/x-follow-card.tsx`) — Showcasing a single X profile with the recognizable click-to-Follow payoff as the action beat. _vibe: social_ · npm: @remotion/google-fonts · ⚠ third-party brand UI — reference only
- **X Followers Overview** (`components/remocn/x-followers-overview.tsx`) — A milestone or social-proof scene needs cycling follow notifications building to a total reveal. _vibe: data_ · npm: @remotion/google-fonts · ⚠ third-party brand UI — reference only

## templates

- **Brand Guidelines** (`components/remocn/templates/brand-guidelines/assets.ts`, `components/remocn/templates/brand-guidelines/content.ts`, `components/remocn/templates/brand-guidelines/motion.ts`, `components/remocn/templates/brand-guidelines/ui.tsx`, `components/remocn/templates/brand-guidelines/index.tsx`, `components/remocn/templates/brand-guidelines/scenes/identity.tsx`, `components/remocn/templates/brand-guidelines/scenes/palette.tsx`, `components/remocn/templates/brand-guidelines/scenes/typography.tsx`, `components/remocn/templates/brand-guidelines/scenes/collage.tsx`, `components/remocn/templates/brand-guidelines/scenes/closing.tsx`) — You want to introduce a brand system through its mark, colors, typography, and photography. _vibe: premium_ · npm: @fontsource/manrope, @fontsource/inter
- **Order Flow** (`components/remocn/templates/fomo-limit-orders/content.ts`, `components/remocn/templates/fomo-limit-orders/index.tsx`, `components/remocn/templates/fomo-limit-orders/motion.ts`, `components/remocn/templates/fomo-limit-orders/scenes/closing.tsx`, `components/remocn/templates/fomo-limit-orders/scenes/confirmation.tsx`, `components/remocn/templates/fomo-limit-orders/scenes/opening.tsx`, `components/remocn/templates/fomo-limit-orders/scenes/phone.tsx`, `components/remocn/templates/fomo-limit-orders/scenes/price.tsx`, `components/remocn/templates/fomo-limit-orders/scenes/slider.tsx`, `components/remocn/templates/fomo-limit-orders/ui.tsx`) — You want a complete trading-interface demo built from editable React and SVG layers. _vibe: premium_ · npm: @fontsource/manrope · ⚠ third-party brand UI — reference only
- **Product Showcase** (`components/remocn/templates/launch-anything/assets.ts`, `components/remocn/templates/launch-anything/content.ts`, `components/remocn/templates/launch-anything/index.tsx`, `components/remocn/templates/launch-anything/motion.ts`, `components/remocn/templates/launch-anything/screens.tsx`, `components/remocn/templates/launch-anything/ui.tsx`, `components/remocn/templates/launch-anything/scenes/opening.tsx`, `components/remocn/templates/launch-anything/scenes/action.tsx`, `components/remocn/templates/launch-anything/scenes/portal.tsx`, `components/remocn/templates/launch-anything/scenes/showcase.tsx`, `components/remocn/templates/launch-anything/scenes/proof.tsx`, `components/remocn/templates/launch-anything/scenes/industry.tsx`, `components/remocn/templates/launch-anything/scenes/space.tsx`, `components/remocn/templates/launch-anything/scenes/closing.tsx`, `components/remocn/templates/launch-anything/scenes/action-frame.tsx`) — You want a complete 26.7-second product film with editable text and demonstrations. _vibe: premium_ · npm: @fontsource/manrope
- **Release Teaser** (`components/remocn/templates/release-teaser/index.tsx`, `components/remocn/templates/release-teaser/content.ts`, `components/remocn/templates/release-teaser/motion.ts`, `components/remocn/templates/release-teaser/geometry.ts`, `components/remocn/templates/release-teaser/background.tsx`, `components/remocn/templates/release-teaser/ui.tsx`, `components/remocn/templates/release-teaser/scenes/statement.tsx`, `components/remocn/templates/release-teaser/scenes/closing.tsx`) — You want a sixteen-second release announcement built around anticipation and a final brand reveal. _vibe: premium_ · npm: @fontsource/inter
- **Workflow Console** (`components/remocn/templates/workflow-console/content.ts`, `components/remocn/templates/workflow-console/countries.ts`, `components/remocn/templates/workflow-console/motion.ts`, `components/remocn/templates/workflow-console/ui.tsx`, `components/remocn/templates/workflow-console/index.tsx`, `components/remocn/templates/workflow-console/scenes/intro.tsx`, `components/remocn/templates/workflow-console/scenes/commands.tsx`, `components/remocn/templates/workflow-console/scenes/terminal.tsx`, `components/remocn/templates/workflow-console/scenes/geography.tsx`, `components/remocn/templates/workflow-console/scenes/tools.tsx`, `components/remocn/templates/workflow-console/scenes/responses.tsx`, `components/remocn/templates/workflow-console/scenes/titles.tsx`, `components/remocn/templates/workflow-console/scenes/chart.tsx`, `components/remocn/templates/workflow-console/scenes/mark.tsx`) — You want a complete 46.8-second CLI or automation demo with editable commands and results. _vibe: tech_ · npm: @fontsource/inter, @fontsource/roboto-mono

## transitions

- **ASCII Dissolve** (`components/remocn/ascii-dissolve.tsx`) — The video has a retro, terminal, or print aesthetic — the text-grid dissolve reads as CRT or risograph texture. _vibe: tech_ · npm: @remotion/transitions
- **Caret Wipe** (`components/remocn/caret-wipe.tsx`) — Dev-tool, editor, or terminal demos where a typing cursor is the natural through-line between scenes. _vibe: clean_ · npm: @remotion/transitions
- **Displacement** (`components/remocn/displacement.tsx`) — A cut in a tech or interface demo should read as the picture being knocked out of register rather than blended. _vibe: tech_ · npm: @remotion/transitions
- **Dither Dissolve** (`components/remocn/dither-dissolve.tsx`) — The video has a retro, terminal, or print aesthetic — the dither reads as CRT/risograph texture. _vibe: tech_ · npm: @remotion/transitions
- **Ember Burn** (`components/remocn/ember-burn.tsx`) — A scene change should feel cinematic and physical — the frame is destroyed rather than blended away. _vibe: premium_ · npm: @remotion/transitions
- **Focus Pull** (`components/remocn/focus-pull.tsx`) — The tone is refined and editorial — premium product films, calm brand moments, testimonials. _vibe: premium_ · npm: @remotion/transitions
- **Glitch Cut** (`components/remocn/glitch-cut.tsx`) — The cut lands in a tech or developer-facing demo and should read as a deliberate broadcast artifact instead of a smooth blend. _vibe: tech_ · npm: @remotion/transitions
- **Grain Dissolve** (`components/remocn/grain-dissolve.tsx`) — The video has an editorial, textured, analog feel — grain reads as film and print. _vibe: premium_ · npm: @remotion/transitions
- **Grid Wave** (`components/remocn/grid-wave.tsx`) — A product or interface demo needs a cut with craft — the frame is handled as a surface rather than blended away. _vibe: tech_ · npm: @remotion/transitions
- **Lens Zoom** (`components/remocn/lens-zoom.tsx`) — A high-energy beat drop or reveal needs a cinematic camera move — the cut hides inside the peak of the distortion. _vibe: premium_ · npm: @remotion/transitions
- **Page Turn** (`components/remocn/page-turn.tsx`) — Act breaks in paper or scrapbook stop-motion videos — the current page physically leaves and the next scene is already living beneath it. _vibe: paper_ · npm: @remotion/transitions
- **Particle Dissolve** (`components/remocn/particle-dissolve.tsx`) — A scene change should read as the picture breaking down into matter and reassembling, not as one image fading through another. _vibe: tech_ · npm: @remotion/transitions
- **Perlin Dissolve** (`components/remocn/perlin-dissolve.tsx`) — Organic, atmospheric chapter changes — nature, ambient, calm product films. _vibe: premium_ · npm: @remotion/transitions
- **Push Through** (`components/remocn/push-through.tsx`) — The narrative moves deeper into a topic — zooming in on a feature, entering a product, chapter descent. _vibe: premium_ · npm: @remotion/transitions
- **Ripple Zoom** (`components/remocn/ripple-zoom.tsx`) — A hero statement or logo deserves a camera move — the dolly-through-rings reads as arriving at the point. _vibe: premium_ · npm: @remotion/transitions
- **Shader Seam** (`components/remocn/shader-seam.tsx`) — An OpenShaders material should dissolve in place to reveal the next scene. _vibe: premium_ · npm: @remotion/transitions
- **Shader Spiral Pass** (`components/remocn/shader-spiral-pass.tsx`) — A scene change should feel like flying through the center of a luminous spiral. _vibe: premium_ · npm: @remotion/transitions
- **Slide Swap** (`components/remocn/slide-swap.tsx`) — You want a scene-to-scene grammar with no overlap at all — the outgoing content is fully gone before the incoming content's first frame. _vibe: clean_
- **Smoke Dissolve** (`components/remocn/smoke-dissolve.tsx`) — A reveal should feel like emerging from mist — moody, cinematic, mysterious openings. _vibe: premium_ · npm: @remotion/transitions
- **Spring Settle** (`components/remocn/spring-settle.tsx`) — The stage colour changes from scene to scene — the crossfade happens inside the empty gap, so it never muddies two scenes together. _vibe: premium_
- **Swirl Dissolve** (`components/remocn/swirl-dissolve.tsx`) — A dramatic chapter break where the frame should visibly transform — reveals, act changes. _vibe: premium_ · npm: @remotion/transitions
- **Warp Dissolve** (`components/remocn/warp-dissolve.tsx`) — Moving between chapters or moods — the melt reads as time passing or context shifting. _vibe: premium_ · npm: @remotion/transitions
- **Wave Wipe** (`components/remocn/wave-wipe.tsx`) — The transition should feel like physical motion — a swell washing over the frame, tides, page-over-page. _vibe: premium_ · npm: @remotion/transitions
- **Whip Pan** (`components/remocn/whip-pan.tsx`) — Cuts need to feel fast and energetic — feature-to-feature jumps, montage rhythm, tech demos. _vibe: playful_ · npm: @remotion/transitions
- **Zoom Blur** (`components/remocn/zoom-blur.tsx`) — You need a default, general-purpose cut for a product demo — the de-facto workhorse transition of the catalog. _vibe: clean_ · npm: @remotion/transitions

## typography

- **Blur Out Up** (`components/remocn/blur-out-up.tsx`) — A title or tagline needs a graceful upward exit before the next scene cuts in. _vibe: premium_
- **Bottom-Up Letters** (`components/remocn/bottom-up-letters.tsx`) — A short punchy word or acronym should land with clear, visible per-character energy. _vibe: clean_
- **Caret Swap** (`components/remocn/caret-swap.tsx`) — One phrase should be replaced by another through a caret gesture: the cursor swells into a block that eats the old text, collapses back and types the new one. _vibe: tech_
- **Centered Word Build** (`components/remocn/centered-word-build.tsx`) — A short statement should assemble one word at a time while every visible prefix stays centered and pushes closer. _vibe: clean_
- **Chromatic Wave** (`components/remocn/chromatic-wave.tsx`) — A held title — an album cover, a poster hold, a loop — needs slow, ambient distortion instead of a one-shot entrance. _vibe: tech_
- **Extrude Pop** (`components/remocn/extrude-pop.tsx`) — A short punchy word — a score, a verdict, a CTA — should land with physical weight, like a stamp rising off the page. _vibe: playful_
- **Fade Through** (`components/remocn/fade-through.tsx`) — One label, stat, or short phrase needs to swap cleanly into another in the same slot. _vibe: clean_
- **Focus Blur Resolve** (`components/remocn/focus-blur-resolve.tsx`) — A hero word or short phrase should feel like a camera lens pulling into focus. _vibe: premium_
- **Fog Rise** (`components/remocn/fog-rise.tsx`) — A big display word should materialize out of atmosphere — already at its size and position, resolving from heavy blur as if rising along the z-axis. _vibe: premium_
- **Gooey Morph** (`components/remocn/gooey-morph.tsx`) — A title reveal should feel liquid and organic — shapes fuse and hand their mass to the word instead of crossfading. _vibe: playful_
- **Gradient Scale Cut Text** (`components/remocn/gradient-scale-cut-text.tsx`) — A title should begin at an imposing scale and resolve through a deliberately abrupt editorial cut. _vibe: premium_
- **Hand Count** (`components/remocn/hand-count.tsx`) — A stat, price, or count belongs in a hand-made scene — the number should arrive by being written, not by rolling. _vibe: paper_ · npm: @remotion/google-fonts
- **Handwrite** (`components/remocn/handwrite.tsx`) — Captions, labels, and headlines should read as pen-written on paper — the core text voice of stop-motion scrapbook scenes. _vibe: paper_ · npm: @remotion/google-fonts
- **Infinite Marquee** (`components/remocn/infinite-marquee.tsx`) — A scene needs ambient motion in the background or as a decorative band between sections. _vibe: clean_
- **Ink Underline** (`components/remocn/ink-underline.tsx`) — A hand-dragged ink underline belongs beneath a written headline, URL, or stat — pairs with `handwrite`, with `delay` set from `handwriteDuration`. _vibe: paper_
- **Inline Highlight** (`components/remocn/inline-highlight.tsx`) — One keyword inside a sentence needs to draw attention through a color shift without any background decoration. _vibe: clean_
- **Inline Pill Takeover** (`components/remocn/inline-pill-takeover.tsx`) — A sentence should transform an inline placeholder into a CTA without cutting to a separate title card. _vibe: premium_
- **Inline Word Roll** (`components/remocn/inline-word-roll.tsx`) — A headline keeps its opening phrase while cycling through audiences, benefits or outcomes. _vibe: clean_
- **Kinetic Center Build** (`components/remocn/kinetic-center-build.tsx`) — A short headline should build word by word with satisfying kinetic momentum, locking centered at the end. _vibe: premium_
- **Kinetic Morph Text** (`components/remocn/kinetic-morph-text.tsx`) — A short sequence of phrases should feel like the same letters physically rearranging. _vibe: playful_
- **Kinetic Warp** (`components/remocn/kinetic-warp.tsx`) — A short, heavy display word needs a bold kinetic-typography moment where the whole word bends and snaps instead of individual letters animating. _vibe: playful_
- **Line-by-Line Slide** (`components/remocn/line-by-line-slide.tsx`) — A multi-line headline or short paragraph needs a flowing, line-by-line entrance with a matching exit. _vibe: clean_
- **Marker Highlight** (`components/remocn/marker-highlight.tsx`) — A key phrase inside a sentence needs a physical, hand-drawn-feeling highlight that visually underscores the word. _vibe: playful_
- **Mask Reveal Up** (`components/remocn/mask-reveal-up.tsx`) — A multi-line headline or stacked list needs a clean, contained upward reveal that holds on screen. _vibe: clean_
- **Matrix Decode** (`components/remocn/matrix-decode.tsx`) — A hacker, terminal, or cyberpunk aesthetic is required and the scramble-to-reveal glyph effect is on-brand. _vibe: tech_
- **Micro Scale Fade** (`components/remocn/micro-scale-fade.tsx`) — A label, subheading, or supporting text needs an entrance that feels polished without drawing attention to itself. _vibe: clean_
- **Number Wheel** (`components/remocn/number-wheel.tsx`) — A metric, stat, or count should animate to its value in a satisfying odometer roll. _vibe: data_ · npm: @remotion/google-fonts
- **Outline Fill Track Text** (`components/remocn/outline-fill-track-text.tsx`) — A statement should hand focus from a lead word to a large numeric value in one continuous move. _vibe: premium_
- **Per Character Rise** (`components/remocn/per-character-rise.tsx`) — A short word or phrase needs a crisp, sharp character-by-character entrance with even, readable stagger. _vibe: clean_
- **Per-Word Crossfade** (`components/remocn/per-word-crossfade.tsx`) — Two short phrases need to swap with a soft, word-by-word transition that reads as calm and composed. _vibe: clean_
- **Perspective Marquee** (`components/remocn/perspective-marquee.tsx`) — A dark, cinematic background treatment is needed with text rolling into a 3D vanishing point. _vibe: premium_
- **Perspective Squeeze** (`components/remocn/perspective-squeeze.tsx`) — A looping hold — an outro, a background title, a stream screen — needs constant, hypnotic typographic motion (the 225-frame track ends where it starts). _vibe: playful_
- **RGB Glitch Text** (`components/remocn/rgb-glitch-text.tsx`) — A tech, hacker, or cyberpunk scene needs a moment of digital corruption on a title. _vibe: tech_
- **Rolling Number** (`components/remocn/rolling-number.tsx`) — Animating a large integer metric on a stats or milestone slide (revenue, signups, impressions). _vibe: data_ · npm: @remotion/google-fonts
- **Rolodex Flip** (`components/remocn/rolodex-flip.tsx`) — Cycling package, feature, or value names inside a held line — install commands, "works with X" beats, plan-name cycling. _vibe: tech_
- **Rush Type** (`components/remocn/rush-type.tsx`) — A short phrase should cycle one forceful word at a time. _vibe: tech_
- **Scale Down Fade** (`components/remocn/scale-down-fade.tsx`) — A headline needs a confident, minimal entrance without any kinetic exaggeration. _vibe: clean_
- **Shader Text Reveal** (`components/remocn/shader-text-reveal.tsx`) — A short headline needs the hero shader reveal, one word at a time. _vibe: premium_
- **Shadow Sweep Text** (`components/remocn/shadow-sweep-text.tsx`) — A short statement should emerge through a dense shadow instead of fading or clipping into view. _vibe: premium_
- **Shared Axis Y** (`components/remocn/shared-axis-y.tsx`) — Swapping two text values in a slide-deck style transition (A → B → C chained in `<Sequence>`). _vibe: clean_
- **Shared Axis Z** (`components/remocn/shared-axis-z.tsx`) — Conveying a zoom-in narrative: moving from a broad context to a focused point. _vibe: clean_
- **Sheen Slide In** (`components/remocn/sheen-slide-in.tsx`) — An intro title should arrive with momentum — a fast entrance, a long exponential settle and a barely visible final creep into center. _vibe: premium_
- **Shimmer Sweep** (`components/remocn/shimmer-sweep.tsx`) — Highlighting a product name or pricing tier with a refined, metallic gleam — luxury SaaS, pricing slides. _vibe: premium_
- **Short Slide Down** (`components/remocn/short-slide-down.tsx`) — A multi-word headline should build its layout visibly — each word stacking to create a composed block. _vibe: clean_
- **Short Slide Right** (`components/remocn/short-slide-right.tsx`) — A short headline should enter with horizontal momentum — reads as forward motion or progress. _vibe: clean_
- **Slot Machine Roll** (`components/remocn/slot-machine-roll.tsx`) — Revealing a price change, plan upgrade, or before/after value where the string includes symbols (`$`, `%`, `×`). _vibe: playful_
- **Soft Blur In** (`components/remocn/soft-blur-in.tsx`) — A hero headline needs the Apple-style per-character soft reveal — premium, airy, cinematic. _vibe: premium_
- **Spring Scale In** (`components/remocn/spring-scale-in.tsx`) — The scene calls for energy and bounce — product launches, celebration moments, fun CTAs. _vibe: playful_
- **Squeeze In** (`components/remocn/squeeze-in.tsx`) — A wordmark or short title should be uncovered by a clean wipe, as if a background-colored cover slides off it. _vibe: premium_
- **Staggered Fade Up** (`components/remocn/staggered-fade-up.tsx`) — A headline or body sentence is long and a simpler single-unit entrance would feel flat. _vibe: clean_
- **Stretch In** (`components/remocn/stretch-in.tsx`) — A heavy display word needs a fast, physical entrance where the letterforms visibly deform — bars stretch long while stems keep their exact width. _vibe: playful_ · npm: opentype.js
- **Strikethrough Replace** (`components/remocn/strikethrough-replace.tsx`) — Showing a problem being replaced by a solution — the strike says you are crossing this out on purpose _vibe: clean_
- **Top-Down Letters** (`components/remocn/top-down-letters.tsx`) — A single uppercase word or short acronym should enter with structural weight — each letter landing like a stamp. _vibe: clean_
- **Tracking In** (`components/remocn/tracking-in.tsx`) — A title word or brand name should feel like it is focusing into place — tracking collapse is the right metaphor for clarity, precision, or sharpness. _vibe: premium_
- **Type Fossil** (`components/remocn/type-fossil.tsx`) — A creative process should move from earlier wording to a finished idea. _vibe: premium_
- **Typed Split Wipe** (`components/remocn/typed-split-wipe.tsx`) — A product or feature introduction should type itself cleanly before breaking into controlled directional fragments. _vibe: tech_
- **Typewriter** (`components/remocn/typewriter.tsx`) — Simulating a command being typed into a terminal or input — pairs with `terminal-simulator`. _vibe: clean_
- **Value Swap** (`components/remocn/value-swap.tsx`) — A value changes at a specific story beat — before/after price, status promotion, a hex/token flip. _vibe: clean_
- **Word Push** (`components/remocn/word-push.tsx`) — A single tagline or closing phrase should build word by word with physical, push-driven motion instead of plain fades. _vibe: premium_
- **Word Stream** (`components/remocn/word-stream.tsx`) — An intro or narration follows a voiceover and each phrase should build word by word at speaking pace. _vibe: premium_
- **Zoom Words** (`components/remocn/zoom-words.tsx`) — An intro should open uncomfortably close: huge words appearing one by one while the camera tracks the growing line off-frame. _vibe: premium_

## ui

- **UI AI Prompt Flow** (`components/remocn/ai-prompt-flow.tsx`) — Demoing an AI product's whole prompt-to-answer experience in one self-contained scene _vibe: clean_
- **UI Accordion** (`components/remocn/accordion.tsx`, `components/remocn/use-accordion-transition.ts`) — Showing a collapsible FAQ or settings section expanding on a timeline cue. _vibe: clean_
- **UI Alert Dialog** (`components/remocn/alert-dialog.tsx`, `components/remocn/use-alert-dialog-transition.ts`) — Showing a destructive confirmation dialog (delete, reset, revoke) in a product demo. _vibe: clean_
- **UI Blur In** (`components/remocn/blur-in.tsx`, `components/remocn/use-blur-in-transition.ts`) — Revealing an arbitrary JSX subtree (card, image, composed scene) with a premium blur entrance. _vibe: premium_
- **UI Button** (`components/remocn/button.tsx`, `components/remocn/use-button-transition.ts`) — Showing the full interactive lifecycle of a CTA — hover → press → loading → success — on the timeline. _vibe: clean_
- **UI Caret** (`components/remocn/caret.tsx`) — Placing a blinking insertion cursor beside a text node or at the end of a typed string. _vibe: tech_
- **UI Chat Flow** (`components/remocn/chat-flow.tsx`) — A scene needs a messaging conversation that carries your own brand tokens instead of a real platform's chrome. _vibe: social_
- **UI Checkbox** (`components/remocn/checkbox.tsx`, `components/remocn/use-checkbox-transition.ts`) — Showing a task being checked off in a to-do or onboarding list. _vibe: clean_
- **UI Checkout Flow** (`components/remocn/checkout-flow.tsx`) — Demoing a SaaS payment or upgrade UX end-to-end with cursor navigation and toast confirmation. _vibe: clean_
- **UI Combobox** (`components/remocn/combobox.tsx`, `components/remocn/use-combobox-transition.ts`) — Showing a searchable/filterable dropdown with a typed query narrowing the list on the timeline. _vibe: clean_
- **UI Command Menu** (`components/remocn/command-menu.tsx`, `components/remocn/use-command-menu-transition.ts`) — Demoing a ⌘K palette opening with a typed query filtering icon-labeled commands. _vibe: tech_
- **UI Context Menu** (`components/remocn/context-menu.tsx`, `components/remocn/use-context-menu-transition.ts`) — Showing a right-click menu appearing at a cursor position over content in a product demo. _vibe: clean_
- **UI Cursor** (`components/remocn/cursor.tsx`, `components/remocn/use-cursor-path.ts`) — Guiding the viewer's attention through a UI by animating a pointer between elements. _vibe: clean_
- **UI Dialog** (`components/remocn/dialog.tsx`, `components/remocn/use-dialog-transition.ts`) — Showing a non-destructive modal (edit form, settings, profile update) opening and closing on the timeline. _vibe: clean_
- **UI Drawer** (`components/remocn/drawer.tsx`, `components/remocn/use-drawer-transition.ts`) — Showing a mobile-style bottom sheet sliding up from the edge of the frame. _vibe: clean_
- **UI Dropdown Menu** (`components/remocn/dropdown-menu.tsx`, `components/remocn/use-dropdown-menu-transition.ts`) — Showing a button that opens an action list — the classic "Options" or account menu pattern. _vibe: clean_
- **UI Field** (`components/remocn/field.tsx`) — Laying out labeled form controls — label, animated control, description hint — with consistent spacing _vibe: clean_
- **UI Input** (`components/remocn/input.tsx`, `components/remocn/use-input-transition.ts`) — Showing a text field being focused, typed into, or validated at a specific frame. _vibe: clean_
- **UI Message Bubble** (`components/remocn/message-bubble.tsx`, `components/remocn/use-message-bubble-transition.ts`) — You are hand-timing a single message landing on a beat you control, driving `style` from `useMessageBubbleTransition`. _vibe: clean_
- **UI Onboarding Stepper Flow** (`components/remocn/onboarding-stepper-flow.tsx`) — Demoing a multi-step onboarding experience — account setup, plan choice, preferences — in one scene _vibe: clean_
- **UI Popover** (`components/remocn/popover.tsx`, `components/remocn/use-popover-transition.ts`) — Showing a hover-card with richer content (title + description) than a single-line tooltip label allows. _vibe: clean_
- **UI Progress** (`components/remocn/progress.tsx`, `components/remocn/use-progress-transition.ts`) — Showing a loading, upload, or completion bar animating to a target value. _vibe: data_
- **UI Radio** (`components/remocn/radio.tsx`, `components/remocn/use-radio-transition.ts`) — Demonstrating a single-choice selection moment in a form walkthrough. _vibe: clean_
- **UI Resizable** (`components/remocn/resizable.tsx`, `components/remocn/use-resizable-transition.ts`) — Demonstrating a code/preview split pane layout with its ratio animating across frames. _vibe: clean_
- **UI Select Menu** (`components/remocn/select-menu.tsx`, `components/remocn/use-select-menu-transition.ts`) — A vertical single-choice menu where one option is highlighted and the highlight should glide smoothly between options as the selection changes. _vibe: clean_
- **UI Select** (`components/remocn/select.tsx`, `components/remocn/use-select-transition.ts`) — Demonstrating a dropdown menu opening and an option being highlighted or selected on the timeline. _vibe: clean_
- **UI Settings Toggle Flow** (`components/remocn/settings-toggle-flow.tsx`) — Showing a complete settings interaction walkthrough for a product demo — zero assembly required. _vibe: clean_
- **UI Sheet** (`components/remocn/sheet.tsx`, `components/remocn/use-sheet-transition.ts`) — Showing a slide-in edit panel or settings drawer with backdrop dim in a product demo. _vibe: clean_
- **UI Signup Flow** (`components/remocn/signup-flow.tsx`) — Showing a full onboarding or signup flow in a product launch or demo video. _vibe: clean_
- **UI Skeleton Block** (`components/remocn/skeleton-block.tsx`) — Building a custom skeleton layout by composing individual shimmer rectangles at precise dimensions _vibe: clean_
- **UI Skeleton** (`components/remocn/skeleton.tsx`, `components/remocn/use-skeleton-transition.ts`) — Showing a loading state resolving to real content — the skeleton fades out as real UI fades in. _vibe: clean_
- **UI Slider** (`components/remocn/slider.tsx`, `components/remocn/use-slider-transition.ts`) — Demonstrating a range control being dragged to a target value with hover/press thumb states. _vibe: clean_
- **UI Spinner** (`components/remocn/spinner.tsx`) — Showing a loading indicator inside a button after a click (hover → press → loading state). _vibe: clean_
- **UI Stepper** (`components/remocn/stepper.tsx`, `components/remocn/use-stepper-transition.ts`) — Showing a multi-step onboarding, checkout, or wizard flow advancing through numbered steps. _vibe: clean_
- **UI Switch** (`components/remocn/switch.tsx`, `components/remocn/use-switch-transition.ts`) — Showing a toggle being flipped in a settings panel walkthrough. _vibe: clean_
- **UI Tabs** (`components/remocn/tabs.tsx`, `components/remocn/use-tabs-transition.ts`) — Showing a tabbed UI switching between content panels in a product demo. _vibe: clean_
- **UI Telegram Chat Flow** (`components/remocn/telegram-chat-flow.tsx`) — The scene must read as Telegram — blue tailed bubbles, in-bubble timestamps, and double-check delivery marks. _vibe: social_ · ⚠ third-party brand UI — reference only
- **UI Toast** (`components/remocn/toast.tsx`, `components/remocn/use-toast-transition.ts`) — Showing a success/error notification appear after an action (form submit, save, API call). _vibe: clean_
- **UI Toggle Group** (`components/remocn/toggle-group.tsx`, `components/remocn/use-toggle-group-transition.ts`) — Showing a segmented control switching between view modes, time ranges, or mutually exclusive options. _vibe: clean_
- **UI Tooltip** (`components/remocn/tooltip.tsx`, `components/remocn/use-tooltip-transition.ts`) — Showing a hover tooltip appearing next to a UI element in a product walkthrough. _vibe: clean_
- **UI Typing Indicator** (`components/remocn/typing-indicator.tsx`) — Signalling that a reply or an answer is being composed — drop it inside a `message-bubble` or any container. _vibe: clean_
- **UI iMessage Chat Flow** (`components/remocn/imessage-chat-flow.tsx`) — The scene must read as iMessage — gray incoming and blue outgoing tailed bubbles with tapback badges at the outer top corner. _vibe: social_ · npm: lucide-react · ⚠ third-party brand UI — reference only

## ui-blocks

- **Animated Bar Chart** (`components/remocn/animated-bar-chart.tsx`) — Showing comparative categorical metrics in a product demo — feature usage, plan distribution, benchmark scores. _vibe: data_
- **Animated Line Chart** (`components/remocn/animated-line-chart.tsx`) — Showing growth or trend over time — revenue curve, DAU climb, error-rate drop. _vibe: data_
- **Check List** (`components/remocn/check-list.tsx`) — A list of features, steps, or done-items should be read in full and then crossed off in a hand-made scene. _vibe: paper_
- **Glass Code Block** (`components/remocn/glass-code-block.tsx`) — A landing or hero scene needs an animated code backdrop that reads as "premium dev tool." _vibe: tech_
- **Glass Code Walk** (`components/remocn/glass-code-walk.tsx`) — A code reveal needs camera motion — the frame stays pinned to the line currently typing, then pulls back so the whole file lands as the payoff. _vibe: tech_
- **Paper Sticker** (`components/remocn/paper-sticker.tsx`) — Short labels, chips, or callout notes should exist as physical taped paper on a stop-motion scene. _vibe: paper_
- **Polaroid** (`components/remocn/polaroid.tsx`) — Media belongs in a hand-placed instant-photo frame with a handwritten caption. _vibe: paper_
- **Reel** (`components/remocn/reel.tsx`) — Showing a sequence of screenshots or product shots that should bloom open one over the last in a fixed frame. _vibe: clean_
- **Search Reveal** (`components/remocn/search-reveal.tsx`) — A product introduction should begin with a search for its name. _vibe: premium_
- **Terminal Cursor Zoom** (`components/remocn/terminal-cursor-zoom.tsx`) — One install command is the whole beat and it must stay legible in a vertical or small-screen crop — the camera holds the cursor at frame center at 2.8× zoom. _vibe: tech_
- **Terminal Simulator** (`components/remocn/terminal-simulator.tsx`) — Demoing a CLI tool install sequence (`npm install`, `npx shadcn add`, build output). _vibe: tech_
