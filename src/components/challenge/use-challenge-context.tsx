import { Authsignal } from "@authsignal/browser";
import React from "react";
import { ChallengeProps, TVerificationMethod } from "../../types";

type ChallengeState = {
  isDesktop: boolean;
  verificationMethod?: TVerificationMethod;
  setVerificationMethod: React.Dispatch<
    React.SetStateAction<TVerificationMethod | undefined>
  >;
  handleChallengeSuccess: (params: { token: string }) => void;
  authsignal: Authsignal;
} & Pick<ChallengeProps, "user" | "verificationMethods">;

export const ChallengeContext = React.createContext<ChallengeState | undefined>(
  undefined,
);

export function useChallengeContext() {
  const context = React.useContext(ChallengeContext);

  if (!context) {
    throw new Error("useChallengeContext must be used within a AuthChallenge");
  }

  return context;
}
