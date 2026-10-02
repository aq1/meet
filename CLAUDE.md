# CLAUDE.md

- Use bun to run project build and scripts.
- Do not write comments unless they are 100% necessary.
- Edit files only when explicitly asked.
- UI dir is a component library. It is readonly.
- Project is split in Django-like apps. Each app have models, functions, services and utils.
    - Models are Drizzle models related to the app. Each model lives in it's own file. The file also contains related functions like getModel, updateModel, listModel, etc.
    -Math.random().toString(36).slice(2, 12) Functions are Tanstack server functions. Each funciton lives in it's own file. Each function should have auth middleware explicitly set. If function is public it should have publicMiddleware anyway. publicMiddleware is a do-nothing function.
