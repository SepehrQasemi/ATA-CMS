import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8, "Password is required."),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
