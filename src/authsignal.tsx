import React from "react";

import { AuthsignalProvider } from "./authsignal-provider";
import { Challenge } from "./components/challenge/challenge";
import { useAuthsignal } from "./use-authsignal";

type AuthsignalProps = {
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

export function Authsignal(props: AuthsignalProps) {
  const { challenge } = useAuthsignal();

  return (
    <AuthsignalProvider {...props}>
      {challenge && <Challenge {...challenge} />}
    </AuthsignalProvider>
  );
}
