import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { SignUpInput, SignInInput } from "./auth.validation";

// ==================== SIGN UP ====================
const signUp = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as SignUpInput;
  const result = await AuthService.signUp(data);

  res.status(201).json({
    success: true,
    message: "Registration successful! Please check your email to verify your account.",
    data: result,
  });
});

// ==================== SIGN IN ====================
const signIn = catchAsync(async (req: Request, res: Response) => {
  const data = req.body as SignInInput;
  const result = await AuthService.signIn(data);

  res.status(200).json({
    success: true,
    message: "Signed in successfully.",
    data: result,
  });
});

// ==================== SIGN OUT ====================
const signOut = catchAsync(async (req: Request, res: Response) => {
  const headers = new Headers();
  const authHeader = req.headers["authorization"];
  const cookieHeader = req.headers["cookie"];
  if (authHeader) headers.set("authorization", authHeader);
  if (cookieHeader) headers.set("cookie", cookieHeader);

  await AuthService.signOut(headers);

  res.status(200).json({
    success: true,
    message: "Signed out successfully.",
    data: null,
  });
});

export const AuthController = {
  signUp,
  signIn,
  signOut,
};
