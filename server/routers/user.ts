import { publicProcedure, router } from "../trpc";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { TRPCError } from "@trpc/server";
import { isLoggedIn } from "../middleware/user";
import { SECRET } from "../index";

export const userRouter = router({
  signup: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string()
      })
    )
    .mutation(async (opts) => {
      const username = opts.input.username;
      const password = opts.input.password;

      let response = await opts.ctx.db.User.insertMany([
        { username, password }
      ]);

      console.log(response);
      let userId = response[0]._id;

      const token: string = jwt.sign({ userId: userId }, SECRET, {
        expiresIn: "3h"
      });

      return { token };
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string(),
        password: z.string()
      })
    )
    .mutation(async (opts) => {
      const response = opts.ctx.db.User.find({
        email: opts.input.username
      });
      if (!response) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      const token: string = jwt.sign({ userId: opts.ctx.userId }, SECRET, {
        expiresIn: "3h"
      });

      return { token };
    }),

  me: publicProcedure
    .use(isLoggedIn)
    .output(z.object({ email: z.string() }))
    .query(async (opts) => {
      let response = await opts.ctx.db.User.findById(opts.ctx.userId);

      if (!response) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      return { email: response.username || "" };
    })
});
