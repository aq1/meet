# CLAUDE.md

- Use bun to run project build and scripts.
- Do not write comments unless they are 100% necessary.
- Edit files only when explicitly asked.
- UI dir is a component library. It is readonly.
- All server logic lives in `src/lib/<area>/` (e.g. `lib/rooms`, `lib/livekit`, `lib/s3`). Routes and components only import from lib; API route handlers just delegate to a lib function.
- Server functions (`createServerFn`) go in `src/lib/<area>/functions/` and are named `<name>.function.ts` (e.g. `lib/rooms/functions/create-room.function.ts`).
