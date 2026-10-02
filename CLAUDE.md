# CLAUDE.md

- Use bun to run project build and scripts.
- Do not write comments unless they are 100% necessary.
- Edit files only when explicitly asked.
- UI dir is a component library. It is readonly.
- Project is split in Django-like apps. Each app have models, functions, services and utils.
    - Models are Drizzle models related to the app. Each model lives in it's own file. Drizzle models should be named Django way "{app}_{model}".
    - Each app's models dir has an index.ts that re-exports every model and relations file in it. When adding a model file, add it to that index.ts. When adding a new app, add its models index to src/lib/db/schema.ts.
    - Functions are Tanstack server functions. Each funciton lives in it's own file. Each function should have auth middleware explicitly set. If function is public it should have publicMiddleware anyway. publicMiddleware is a do-nothing function.
    - Services are business logic that does not have to be exposed to api via functions. But it still can. Notifications, webhook handlers, s3 signing etc.
