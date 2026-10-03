# Daybook implementation outcomes

## Closed diary and physical open-book experience

- The landing screen is a closed physical diary with a clear action to open it.
- Clicking or swiping opens the diary with a realistic page-turn animation.
- The open state is an asymmetric book spread rather than a normal dashboard with a diary skin.
- The left page shows memories/photos and the right page shows planner tasks and journal content.
- Swiping or using previous/next controls advances to another date.
- The spread uses paper textures, stickers, tape, handwritten elements, a center fold/shadow, and small page-turn animations.
- The experience is responsive: on narrow screens the book becomes a readable page-by-page scrapbook sequence while preserving the diary metaphor.

## Capture This Moment and scrapbook memories

- A permanent “Capture this moment” camera control is visible in the diary experience.
- Activating it opens a camera/gallery-style capture flow.
- The user can select a gallery image and, where browser permissions allow, capture from the device camera using a camera input fallback.
- A captured image automatically attaches to today’s journal page.
- The new photo appears as if physically taped onto the scrapbook page with an imperfect placement/rotation animation.
- A day can contain multiple photos/memories.
- Memory cards support captions, Polaroid-style frames, tape and scrapbook positioning metadata.
- If camera access is unavailable, gallery selection and immediate preview still work.

## Connected planner, journal, and Tiny Moments

- The right page contains editable journal text and planner tasks.
- Tasks can be created, reordered or toggled complete.
- The diary displays a Today’s Progress section with completed and incomplete goals.
- The journal reflection updates from task completion, including a statement such as “You completed 3/4 goals today.”
- Tiny Moments let the user save a short note without writing a full journal entry.
- A Tiny Moment includes a time, kind (photo, note or song), optional media, and short note.
- Examples such as a coffee photo, campus photo, or song note can be represented in the timeline.
- Tiny Moments are displayed in an arranged timeline/collage and are included in the day’s memory count/word count where applicable.

## Day vibes and atmosphere prompt

- Every day has a vibe that can be changed independently.
- The initial vibe choices include Soft, Midnight, Cozy, Academic, Pink scrapbook, Dark academia, Nature, and Y2K.
- Changing the vibe changes background, accents, stickers/decorations, paper treatment, and typography accents.
- The user can type an atmosphere request such as “Make today’s page feel like a rainy Sunday.”
- The atmosphere input applies a deterministic first-pass mapping for supported phrases and has a graceful fallback for unsupported phrases.
- The implementation preserves a stable server-ready contract so a managed LLM can later return a vibe, palette, paper, decorations, and reflection tone.

## Memory Capsule and sealing

- The website creates a Memory Capsule view for a day containing the date, memories count, word count, completed task count, today’s vibe, and a short reflection such as “You seemed to have a productive day.”
- The user can activate “Seal day.”
- Sealing visibly changes the page into an archived/sealed state with a wax-stamp or capsule treatment.
- Sealing remains reversible in the prototype so the user can continue editing during development.
- The capsule summary remains available for later browsing.

## Today in the Past

- Opening today’s diary shows an “On this day” / “Today in the past” section.
- Previous years for the same calendar date show their date, photos when available, and journal snippets.
- The history view creates a personal time-machine feeling and is visually integrated with the scrapbook experience.

## Scrapbook mode and manipulation affordances

- A scrapbook mode exposes controls for the selected page element.
- Users can drag, rotate and resize photo cards.
- Users can add tape, stickers, washi tape, labels, doodles, handwritten notes, and paper variants.
- Selected elements use visible editing affordances while the rest of the page remains readable.
- Scrapbook styling uses real buttons/labels, accessible focus states, and a reduced-motion path.

## Persistence, storage, and server seams

- The database schema adds user-owned journal days, tasks, memories, Tiny Moments, and scrapbook elements without destructive changes to the starter users table.
- Protected tRPC procedures load a day, save journal content, create/toggle tasks, add memories/moments, change vibe, seal/unseal a day, and retrieve same-date history.
- Authenticated writes use the protected procedures and are owned by the current user.
- The capture path has a server-owned upload seam that validates type/size, obtains a durable storage address, and persists the stable asset URL with memory metadata.
- Browser code never receives server runtime credentials or temporary signed URLs.
- When no authenticated user is present, a seeded demo page can render for preview, but demo writes are not presented as persisted.

## Quality and delivery

- The Daybook visual system replaces the starter blue-dashboard language with warm paper, ink, collage layers, and Daybook red `#E96858`.
- The first build uses an editorial serif plus modern sans pairing, with handwritten styling limited to small annotations.
- The project keeps the initialized React/Express/tRPC/Drizzle stack and port 3000 runtime.
- `public/manus-routes.json` is served as valid JSON and matches the implemented page routes.
- TypeScript diagnostics are registered before the first application code batch.
- `pnpm check`, `pnpm test`, and the production build pass after implementation, with actionable issues corrected before checkpointing.
- The running preview is verified at desktop and mobile widths for the closed/open diary, page-turn state, capture flow, task progress, vibe switching, capsule sealing, and Today in the Past section.
