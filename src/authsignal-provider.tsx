import React from "react";

import "./main.css";

import "@fontsource-variable/inter/standard.css";

type AuthsignalProviderProps = {
  children: React.ReactNode;
  baseUrl?:
    | "https://api.authsignal.com/v1"
    | "https://au.api.authsignal.com/v1"
    | "https://eu.api.authsignal.com/v1"
    | (string & {});
  tenantId: string;
  appearance?: {
    theme?: "authsignal";
    variables?: {
      colorPrimary?: string;
      colorBackground?: string;
      colorText?: string;
      colorDanger?: string;
      fontFamily?: string;
      spacingUnit?: string;
      borderRadius?: string;
    };
  };
};

export const AuthsignalContext = React.createContext<
  Pick<AuthsignalProviderProps, "baseUrl" | "tenantId"> | undefined
>(undefined);

export function AuthsignalProvider({
  children,
  tenantId,
  baseUrl,
}: AuthsignalProviderProps) {
  return (
    <AuthsignalContext.Provider value={{ tenantId, baseUrl }}>
      {children}
    </AuthsignalContext.Provider>
  );
}
