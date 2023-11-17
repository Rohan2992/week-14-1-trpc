import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { router } from "./trpc";
import { userRouter } from "./routers/user";
import { todoRouter } from "./routers/todo";
import cors from "cors";
import jwt from "jsonwebtoken";
import { User, Todo } from "./db";
import mongoose from "mongoose";

export const SECRET = "SECRET";

mongoose.connect("mongodb://localhost:27017/NEWTodoDB");

const appRouter = router({ user: userRouter, todo: todoRouter });

const server = createHTTPServer({
  router: appRouter,
  middleware: cors(),
  createContext(opts) {
    const authHeaders = opts.req.headers["authorization"];

    if (authHeaders) {
      const token = authHeaders.split(" ")[1];
      console.log(token);
      return new Promise((resolve) => {
        jwt.verify(token, SECRET, (err, user) => {
          if (user) {
            resolve({ userId: user.userId, db: { Todo, User } });
          } else {
            resolve({ db: { Todo, User } });
          }
        });
      });
    }

    return { db: { Todo, User } };
  }
});

server.listen(3000);
// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
