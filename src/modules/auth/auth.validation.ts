import { z } from "zod";

// ==================== SIGN UP ====================
export const signUpSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Name is required" })
      .min(2, "Name must be at least 2 characters")
      .max(60, "Name must not exceed 60 characters"),
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must not exceed 64 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    role: z
      .enum(["STUDENT", "TUTOR", "ADMIN"])
      .optional()
      .default("STUDENT"),
  }),
});

// ==================== SIGN IN ====================
export const signInSchema = z.object({
  body: z.object({
    email: z
      .string({ error: "Email is required" })
      .email("Invalid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(1, "Password is required"),
  }),
});

// ==================== TYPES ====================
export type SignUpInput = z.infer<typeof signUpSchema>["body"];
export type SignInInput = z.infer<typeof signInSchema>["body"];
