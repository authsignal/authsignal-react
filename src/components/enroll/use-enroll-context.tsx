import { Authsignal } from "@authsignal/browser";
import React from "react";
import { ChallengeOptions, TVerificationMethod } from "../../types";

type EnrollState = {
  isDesktop: boolean;
  verificationMethod?: TVerificationMethod;
  verificationMethods?: ChallengeOptions["verificationMethods"];
  user?: ChallengeOptions["user"];
  setVerificationMethod: React.Dispatch<
    React.SetStateAction<TVerificationMethod | undefined>
  >;
  handleSuccess: (params: { token: string }) => void;
  authsignal: Authsignal;
};

export const EnrollContext = React.createContext<EnrollState | undefined>(
  undefined,
);

export function useEnrollContext() {
  const context = React.useContext(EnrollContext);

  if (!context) {
    throw new Error("useEnrollContext must be used within a EnrollContext");
  }

  return context;
}
