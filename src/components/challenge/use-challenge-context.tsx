import { Authsignal } from "@authsignal/browser";
import React from "react";
import { ChallengeOptions, TVerificationMethod } from "../../types";

type ChallengeState = {
  isDesktop: boolean;
  verificationMethod?: TVerificationMethod;
  verificationMethods?: ChallengeOptions["verificationMethods"];
  user?: ChallengeOptions["user"];
  setVerificationMethod: React.Dispatch<
    React.SetStateAction<TVerificationMethod | undefined>
  >;
  handleChallengeSuccess: (params: { token: string }) => void;
  authsignal: Authsignal;
};

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
