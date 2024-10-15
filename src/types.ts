export type AppearanceVariables = {
  colorPrimary?: string;
  colorPrimaryForeground?: string;
  colorBackground?: string;
  colorForeground?: string;
  colorDanger?: string;
  colorRing?: string;
  colorMuted?: string;
  colorInputBorder?: string;

  spacingUnit?: string;
  borderRadius?: string;
};

export type Appearance = {
  theme?: "authsignal";
  variables?: AppearanceVariables;
};

export type AuthsignalProps = {
  baseUrl?:
    | "https://api.authsignal.com/v1"
    | "https://au.api.authsignal.com/v1"
    | "https://eu.api.authsignal.com/v1"
    | (string & {});
  tenantId: string;
  appearance?: Appearance;
};

export const VerificationMethod = {
  PASSKEY: "PASSKEY",
  EMAIL_OTP: "EMAIL_OTP",
  AUTHENTICATOR_APP: "AUTHENTICATOR_APP",
  SMS: "SMS",
} as const;

export type TVerificationMethod =
  (typeof VerificationMethod)[keyof typeof VerificationMethod];

export type ChallengeOptions = {
  token: string;
  defaultVerificationMethod?: TVerificationMethod;
  verificationMethods?: TVerificationMethod[];
  user?: {
    email?: string;
    phoneNumber?: string;
  };
};

export type ChallengeProps = {
  challengeOptions: ChallengeOptions;
  onChallengeSuccess?: (params: { token: string }) => void;
  onCancel?: () => void;
  onTokenExpired?: () => void;
};

export type StartChallengeOptions = ChallengeProps;

export type StartChallengeAsyncOptions = { challengeOptions: ChallengeOptions };
