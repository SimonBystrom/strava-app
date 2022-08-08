import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({message: 'Email must be a valid'}),
  password: z.string().min(4, { message: 'Password must be minimum 4 characters'}).max(12, {message: 'Password must be maximum 12 characters.'}),
});

export const signUpSchema = loginSchema.extend({
  username: z.string(),
});

export const stravaDataSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresAt: z.date(),
  userId: z.string(),
})

export type ILogin = z.infer<typeof loginSchema>;
export type ISignUp = z.infer<typeof signUpSchema>;
export type IStravaData = z.infer<typeof stravaDataSchema>
