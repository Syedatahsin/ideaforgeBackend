import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { signUpSchema, signInSchema } from "./auth.validation";

const router = Router();

// POST /api/v1/auth/sign-up
router.post("/sign-up", validateRequest(signUpSchema), AuthController.signUp);

// POST /api/v1/auth/sign-in
router.post("/sign-in", validateRequest(signInSchema), AuthController.signIn);

// POST /api/v1/auth/sign-out
router.post("/sign-out", AuthController.signOut);

// NOTE: The following are handled automatically by Better Auth at /api/auth/*
// GET  /api/auth/get-session
// POST /api/auth/forget-password
// POST /api/auth/reset-password
// GET  /api/auth/callback/google

export const AuthRoutes = router;
