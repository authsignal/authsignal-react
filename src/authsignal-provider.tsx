import React from "react";

import { Challenge } from "./components/challenge/challenge";
import { AuthsignalProviderProps, ChallengeProps } from "./types";
import { AuthsignalContext } from "./hooks/use-authsignal-context";

export function AuthsignalProvider({
  children,
  tenantId,
  baseUrl = "https://api.authsignal.com/v1",
  appearance,
}: AuthsignalProviderProps) {
  const [challenge, setChallenge] = React.useState<ChallengeProps | undefined>(
    undefined,
  );

  return (
    <AuthsignalContext.Provider
      value={{ tenantId, baseUrl, appearance, setChallenge, challenge }}
    >
      {children}
      {challenge && <Challenge {...challenge} />}
    </AuthsignalContext.Provider>
  );
}
