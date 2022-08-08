import { createRouter } from "./context";
import * as trpc from "@trpc/server";
import { z } from "zod";
import { signUpSchema } from "../validations/auth";
import { hash } from "argon2";

export const loginRouter = createRouter()
  .mutation("signup", {
    input: signUpSchema,
    resolve: async ({ input, ctx }) => {
      const { username, email, password } = input;

      const exists = await ctx.prisma.user.findFirst({
        where: { email },
      });

      if (exists) {
        throw new trpc.TRPCError({
          code: "CONFLICT",
          message: "User already exists.",
        });
      }

      const hashedPassword = await hash(password);

      const result = await ctx.prisma.user.create({
        data: { username, email, password: hashedPassword },
      });

      return {
        status: 201,
        message: "Account created successfully",
        result: {
          email: result.email,
          id: result.id
        }
      };
    },
  });
