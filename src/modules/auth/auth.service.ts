import { auth } from "../../lib/auth";
import { SignUpInput, SignInInput } from "./auth.validation";

// ==================== SIGN UP ====================
const signUp = async (data: SignUpInput) => {
  const response = await auth.api.signUpEmail({
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role,
    },
    asResponse: false,
  });
  return response;
};

// ==================== SIGN IN ====================
const signIn = async (data: SignInInput) => {
  const response = await auth.api.signInEmail({
    body: {
      email: data.email,
      password: data.password,
    },
    asResponse: false,
  });
  return response;
};

// ==================== SIGN OUT ====================
const signOut = async (headers: Headers) => {
  const response = await auth.api.signOut({
    headers,
    asResponse: false,
  });
  return response;
};

export const AuthService = {
  signUp,
  signIn,
  signOut,
};
