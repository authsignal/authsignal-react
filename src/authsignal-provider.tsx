import React from "react";

import { Challenge } from "./components/challenge/challenge";
import { AuthsignalProviderProps, ChallengeProps, EnrollProps } from "./types";
import { AuthsignalContext } from "./hooks/use-authsignal-context";
import { Enroll } from "./components/enroll/enroll";

export function AuthsignalProvider({
  children,
  tenantId,
  baseUrl = "https://api.authsignal.com/v1",
  appearance,
}: AuthsignalProviderProps) {
  const [challenge, setChallenge] = React.useState<ChallengeProps | undefined>(
    undefined,
  );

  const [enroll, setEnroll] = React.useState<EnrollProps | undefined>(
    undefined,
  );

  return (
    <AuthsignalContext.Provider
      value={{
        tenantId,
        baseUrl,
        appearance,
        setChallenge,
        challenge,
        setEnroll,
        enroll,
      }}
    >
      {children}
      {challenge && <Challenge {...challenge} />}
      {enroll && <Enroll {...enroll} />}
    </AuthsignalContext.Provider>
  );
}
