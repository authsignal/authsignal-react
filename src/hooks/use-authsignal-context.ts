import React from "react";
import { AuthsignalProviderProps, ChallengeProps } from "../types";

export const AuthsignalContext = React.createContext<
  | (Pick<AuthsignalProviderProps, "baseUrl" | "tenantId" | "appearance"> & {
      challenge: ChallengeProps | undefined;
      setChallenge: React.Dispatch<
        React.SetStateAction<ChallengeProps | undefined>
      >;
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
