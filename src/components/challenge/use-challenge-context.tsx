import { Authsignal } from "@authsignal/browser";
import React from "react";
import { ChallengeProps } from "./challenge";

export const VerificationMethod = {
  PASSKEY: "PASSKEY",
  EMAIL_OTP: "EMAIL_OTP",
  AUTHENTICATOR_APP: "AUTHENTICATOR_APP",
  SMS: "SMS",
} as const;

export type TVerificationMethod =
  (typeof VerificationMethod)[keyof typeof VerificationMethod];

type AuthChallengeState = {
  verificationMethod?: TVerificationMethod;
  setVerificationMethod: React.Dispatch<
    React.SetStateAction<TVerificationMethod | undefined>
  >;
  handleChallengeSuccess: () => void;
  authsignal: Authsignal;
} & Pick<ChallengeProps, "user" | "verificationMethods">;

export const AuthChallengeContext = React.createContext<
  AuthChallengeState | undefined
>(undefined);

export function useChallengeContext() {
  const context = React.useContext(AuthChallengeContext);

  if (!context) {
    throw new Error("useChallengeContext must be used within a AuthChallenge");
  }

  return context;
}
