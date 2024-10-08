import React from "react";

import { AuthsignalProvider } from "./authsignal-provider";
import { Challenge } from "./components/challenge/challenge";
import { useAuthsignal } from "./use-authsignal";
import { AuthsignalProps } from "./types";

export function Authsignal(props: AuthsignalProps) {
  const { challenge } = useAuthsignal();

  return (
    <AuthsignalProvider {...props}>
      {challenge && <Challenge {...challenge} />}
    </AuthsignalProvider>
  );
}
