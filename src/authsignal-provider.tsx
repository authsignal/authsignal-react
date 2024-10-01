import React from "react";

import "./main.css";

import "@fontsource-variable/inter/standard.css";

import { Authsignal } from "@authsignal/browser";

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

export const AuthsignalContext = React.createContext<Authsignal | undefined>(
  undefined,
);

export function AuthsignalProvider({
  children,
  tenantId,
  baseUrl,
}: AuthsignalProviderProps) {
  const [authsignal] = React.useState(
    () => new Authsignal({ tenantId, baseUrl }),
  );

  return (
    <AuthsignalContext.Provider value={authsignal}>
      {children}
    </AuthsignalContext.Provider>
  );
}
