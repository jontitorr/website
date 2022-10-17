import { useEffect, useState, createContext, useContext } from "react";
import { useCurrentUser } from "@/lib/user";

import type { Dispatch, SetStateAction } from "react";

interface AuthContextInterface {
  initializing: boolean;
  isAuthenticated: boolean;
  setLoginReferral: Dispatch<SetStateAction<string>>;
  loginReferral: string;
}

export const AuthContext = createContext<AuthContextInterface>({} as AuthContextInterface);

export function useAuth() {
  const auth = useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return auth;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginReferral, setLoginReferral] = useState("");

  const { data } = useCurrentUser();

  useEffect(() => {
    if (!data) {
      return;
    }

    setIsAuthenticated(!!data.user);
    setInitializing(false);
  }, [data]);

  return (
    <AuthContext.Provider value={{ initializing, isAuthenticated, loginReferral, setLoginReferral }}>
      {children}
    </AuthContext.Provider>
  );
}
