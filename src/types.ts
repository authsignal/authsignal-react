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

export type AuthsignalProviderProps = {
  baseUrl?:
    | "https://api.authsignal.com/v1"
    | "https://au.api.authsignal.com/v1"
    | "https://eu.api.authsignal.com/v1"
    | (string & {});
  tenantId: string;
  appearance?: Appearance;
  children: React.ReactNode;
};

export const VerificationMethod = {
  PASSKEY: "PASSKEY",
  SECURITY_KEY: "SECURITY_KEY",
  EMAIL_OTP: "EMAIL_OTP",
  EMAIL_MAGIC_LINK: "EMAIL_MAGIC_LINK",
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

type ChallengeCallbacks = {
  onSuccess?: (params: { token: string }) => void;
  onCancel?: () => void;
  onTokenExpired?: () => void;
};

export type ChallengeProps = {
  challengeOptions: ChallengeOptions;
} & ChallengeCallbacks;

type EnrollOptions = {
  token: string;
  verificationMethods?: TVerificationMethod[];
  user?: {
    email?: string;
    phoneNumber?: string;
  };
};

type EnrollCallbacks = {
  onSuccess?: (params: { token: string }) => void;
  onCancel?: () => void;
  onTokenExpired?: () => void;
};

export type EnrollProps = {
  enrollOptions: EnrollOptions;
} & EnrollCallbacks;

export type StartChallengeOptions = { token: string } & ChallengeCallbacks;

export type StartChallengeAsyncOptions = {
  token: string;
};
