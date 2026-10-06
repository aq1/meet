# CLAUDE.md

## Vocal Room Meet

The idea is to make a project that will fill all the needs of online vocal coach.

Features:
- Good quality video chat.
- Synced midi piano.
- Synced audio files playback.


## Code rules
- Use bun to run project build and scripts.
- Do not write comments unless they are 100% necessary.
- Edit files only when explicitly asked.
- UI dir is a component library. It is readonly.
- Project is split in Django-like apps. Each app have models, functions, services and utils.
    - Models are Drizzle models related to the app. Each model lives in it's own file. Drizzle models should be named Django way "{app}_{model}".
    - Each app's models dir has an index.ts that re-exports every model and relations file in it. When adding a model file, add it to that index.ts. When adding a new app, add its models index to src/lib/db/schema.ts.
    - Functions are Tanstack server functions. Each funciton lives in it's own file. Each function should have auth middleware explicitly set. If function is public and has no auth checks at all, it should have publicMiddleware anyway. publicMiddleware is a do-nothing function.
    - Services are business logic that does not have to be exposed to api via functions. But it still can. Notifications, webhook handlers, s3 signing etc.
- lk usually means livekit
- Generate migrations with bun run db:generate, don't generate them yourself
- Do not run migrations by yourself

## Roadmap
1. Singing audio: "original sound" mode (no AEC/NS/AGC, music stereo preset, no DTX), headphone prompt, mic meter, connection indicator.
2. Solid sync: timestamped piano and audio scheduling with clock sync, late-join catch-up, transpose/tempo and A–B loop for tracks, auto-transposing exercises.
3. Teaching tools: live pitch display, lesson recordings with notes, shared sheet music/lyrics, metronome, homework.
4. Coaching business: teacher/student roles, scheduling, student history, reminders, payments.
5. Health: tests for sync and webhooks, media-quality monitoring, mobile Safari, recording retention.
