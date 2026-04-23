// Auth-related TypeScript interfaces

export interface IAuthUser {
  id: string;
  name: string | null;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: string | null;
  status: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignUpResponse {
  user: IAuthUser;
  token?: string;
}

export interface ISignInResponse {
  user: IAuthUser;
  session: IAuthSession;
  token: string;
}
