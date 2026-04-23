import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,

  // App
  app_url: process.env.APP_URL || 'http://localhost:3000',

  // Better Auth
  better_auth_url: process.env.BETTER_AUTH_URL || 'http://localhost:5000/api/auth',
  better_auth_secret: process.env.BETTER_AUTH_SECRET,

  // Email (Nodemailer)
  app_user: process.env.APP_USER,
  app_pass: process.env.APP_PASS,

  // Google OAuth
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
};
