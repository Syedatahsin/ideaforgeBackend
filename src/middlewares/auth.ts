import { NextFunction, Request, Response } from "express";
import { fromNodeHeaders } from "better-auth/node";
import httpStatus from "http-status";
import { auth } from "../lib/auth";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";

/**
 * Authentication middleware to verify Better Auth session.
 * @param requiredRoles - Optional roles allowed to access the route.
 */
export const authMiddleware = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get session from Better Auth
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const { user } = session;

    // 2. Check Role-Based Access Control (RBAC) if roles are provided
    if (requiredRoles.length > 0 && !requiredRoles.includes(user.role || "")) {
      throw new AppError(httpStatus.FORBIDDEN, "You do not have permission to access this resource");
    }

    // 3. Attach user to request
    // @ts-ignore (Augmentation might not be picked up immediately in all environments)
    req.user = user;

    next();
  });
};
