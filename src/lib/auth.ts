import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
import { z } from "zod";
import { oAuthProxy } from "better-auth/plugins/oauth-proxy";
import config from "../config";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: config.app_user,
    pass: config.app_pass,
  },
});

export const auth = betterAuth({
  // --- BASE URL ---
  baseURL: config.better_auth_url,

  // --- SECRET ---
  secret: config.better_auth_secret,

  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // --- TRUSTED ORIGINS ---
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");
    const allowedOrigins = [
      config.app_url,
      config.better_auth_url,
      "http://localhost:3000",
      "http://localhost:5000",
    ].filter(Boolean) as string[];

    if (!origin) return allowedOrigins;

    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return [origin];
    }
    return [];
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "STUDENT",
        validator: { input: z.enum(["STUDENT", "TUTOR", "ADMIN"]) },
        input: true,
      },
      status: {
        type: "string",
        required: false,
        defaultValue: "ACTIVE",
        validator: { input: z.enum(["ACTIVE", "BANNED"]) },
        input: true,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  // --- GOOGLE LOGIN ---
  /* 
  socialProviders: {
    google: {
      clientId: config.google_client_id!,
      clientSecret: config.google_client_secret!,
      redirectURI: `${config.better_auth_url}/api/auth/callback/google`,
    },
  },
  */

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, token }) => {
      try {
        const verificationUrl = `${config.app_url}/verify-email?token=${token}`;

        // Color Palette
        const brandLime = "#B0DB43"; // Primary
        const deepDark = "#1A1A1A";  // High contrast text
        const forestGreen = "#1E3A1D"; // Secondary Brand Color

        await transporter.sendMail({
          from: '"IdeaForge" <noreply@ideaforge.com>',
          to: user.email,
          subject: "Confirm your email for IdeaForge",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fdfdfd; margin: 0; padding: 0; }
                .wrapper { width: 100%; table-layout: fixed; background-color: #fdfdfd; padding-bottom: 40px; }
                .main { background-color: #ffffff; margin: 0 auto; width: 100%; max-width: 600px; border-spacing: 0; font-family: sans-serif; color: ${deepDark}; border: 1px solid #eeeeee; border-radius: 8px; overflow: hidden; }
                .header { background-color: ${forestGreen}; padding: 30px; text-align: center; }
                .content { padding: 40px 30px; text-align: center; }
                .btn { 
                  background-color: ${brandLime}; 
                  color: ${deepDark} !important; /* DARK TEXT ON LIME BACKGROUND */
                  padding: 18px 36px; 
                  text-decoration: none; 
                  border-radius: 4px; 
                  font-weight: 800; 
                  font-size: 16px; 
                  display: inline-block;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                }
                .footer { padding: 20px; text-align: center; font-size: 12px; color: #999999; }
              </style>
            </head>
            <body>
              <div class="wrapper">
                <table class="main">
                  <tr>
                    <td class="header">
                      <h1 style="color: ${brandLime}; margin: 0; font-size: 24px;">IdeaForge</h1>
                    </td>
                  </tr>
                  <tr>
                    <td class="content">
                      <h2 style="margin-top: 0;">Final step...</h2>
                      <p style="font-size: 16px; line-height: 1.5;">Click the button below to verify your email address and activate your account.</p>
                      <div style="margin: 35px 0;">
                        <a href="${verificationUrl}" class="btn">Verify Account</a>
                      </div>
                      <p style="font-size: 13px; color: #666666;">Or copy this link: <br> <a href="${verificationUrl}" style="color: ${forestGreen};">${verificationUrl}</a></p>
                    </td>
                  </tr>
                  <tr>
                    <td class="footer">
                      &copy; ${new Date().getFullYear()} IdeaForge. All rights reserved.
                    </td>
                  </tr>
                </table>
              </div>
            </body>
            </html>
          `,
        });
      } catch (err) {
        console.error("Email Verification Error:", err);
        throw err;
      }
    },
  },

  plugins: [oAuthProxy()],

  // --- ADVANCED COOKIE CONFIG ---
  advanced: {
    cookiePrefix: "ideaforge-auth",
    // useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      // secure: process.env.NODE_ENV === "production",
      path: "/",
    },
  },

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
    cookieOptions: {
      sameSite: "lax",
      // secure: process.env.NODE_ENV === "production",
    },
  },
});
