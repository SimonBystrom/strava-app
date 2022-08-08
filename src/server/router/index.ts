// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { protectedExampleRouter } from "./protected-example-router";
import { loginRouter } from "./login";
import { stravaDataRouter } from "./stravaData";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("signup.", loginRouter)
  .merge("stravaData.", stravaDataRouter)

// export type definition of API
export type AppRouter = typeof appRouter;
