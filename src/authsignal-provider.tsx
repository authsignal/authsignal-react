import React from "react";

import "./main.css";
import { AuthsignalProps } from "./types";

type AuthsignalProviderProps = {
  children: React.ReactNode;
} & AuthsignalProps;

export const AuthsignalContext = React.createContext<
  Pick<AuthsignalProps, "baseUrl" | "tenantId" | "appearance"> | undefined
>(undefined);

export function AuthsignalProvider({
  children,
  tenantId,
  baseUrl,
  appearance,
}: AuthsignalProviderProps) {
  return (
    <AuthsignalContext.Provider value={{ tenantId, baseUrl, appearance }}>
      {children}
    </AuthsignalContext.Provider>
  );
}
