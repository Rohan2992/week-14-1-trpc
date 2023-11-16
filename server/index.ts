import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

const appRouter = router({
  createTodo: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string()
      })
    )
    .query(async (opts) => {
      const title = opts.input.title;
      const description = opts.input.description;

      console.log("I m inside the server index.ts");
      return { id: "1", title, description };
    }),

  signUp: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async (opts) => {
      const username = opts.ctx.username;
      const email = opts.input.email;
      const password = opts.input.password;

      // console.log(username);

      return { id: "New", username, email, password };
    })
});

const server = createHTTPServer({
  router: appRouter,
  createContext(opts) {
    const authHeaders = opts.req.headers["authorization"];
    console.log(authHeaders);

    return { username: authHeaders };
  }
});

server.listen(3000);
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
