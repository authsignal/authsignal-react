import React from "react";
import { AuthsignalProviderProps, ChallengeProps, EnrollProps } from "../types";

export const AuthsignalContext = React.createContext<
  | (Pick<AuthsignalProviderProps, "tenantId" | "appearance"> & {
      baseUrl:
        | "https://api.authsignal.com/v1"
        | "https://au.api.authsignal.com/v1"
        | "https://eu.api.authsignal.com/v1"
        | (string & {});
      challenge: ChallengeProps | undefined;
      setChallenge: (state: ChallengeProps | undefined) => void;
      enroll: EnrollProps | undefined;
      setEnroll: (state: EnrollProps | undefined) => void;
    })
  | undefined
>(undefined);

export function useAuthsignalContext() {
  const context = React.useContext(AuthsignalContext);

  if (context === undefined) {
    throw new Error(
      "useAuthsignalContext must be used within a AuthsignalProvider",
    );
  }

  return context;
}
