import React from "react";
import { Drawer } from "vaul";
import { EmailOtpChallenge } from "./screens/email-otp-challenge";
import { useAuthsignal } from "../../hooks/use-authsignal";
import { VerificationMethods } from "./screens/verification-methods";
import { PasskeyChallenge } from "./screens/passkey-challenge";
import { EmailOtpIcon } from "../icons/email-otp-icon";
import { AuthenticatorAppIcon } from "../icons/authenticator-app-icon";
import { PasskeyIcon } from "../icons/passkey-icon";

/**
 * TODO:
 *  - Respect permitted authentication methods
 *  - Default verification method
 *  - Masked email/phone number
 *  - Handle error states e.g. token expiry
 *  - desktop VerificationMethod
 *  - SMS, Authenticator app, etc.
 */

type AuthChallengeProps = {
  token: string;
  onChallengeSuccess: () => void;
  onCancel?: () => void;
  defaultVerificationMethod?: TVerificationMethod;
  verificationMethods?: TVerificationMethod[];
  userDetails?: {
    email?: string;
    phoneNumber?: string;
  };
};

export const VerificationMethod = {
  PASSKEY: "PASSKEY",
  EMAIL_OTP: "EMAIL_OTP",
  AUTHENTICATOR_APP: "AUTHENTICATOR_APP",
} as const;

export type TVerificationMethod =
  (typeof VerificationMethod)[keyof typeof VerificationMethod];

type AuthChallengeState = {
  verificationMethod?: TVerificationMethod;
  setVerificationMethod: React.Dispatch<
    React.SetStateAction<TVerificationMethod | undefined>
  >;
  handleChallengeSuccess: () => void;
} & Pick<AuthChallengeProps, "userDetails" | "verificationMethods">;

const AuthChallengeContext = React.createContext<
  AuthChallengeState | undefined
>(undefined);

export function useAuthChallenge() {
  const context = React.useContext(AuthChallengeContext);

  if (!context) {
    throw new Error("useAuthChallenge must be used within a AuthChallenge");
  }

  return context;
}

export function AuthChallenge({
  defaultVerificationMethod,
  onChallengeSuccess,
  onCancel,
  token,
  userDetails,
  verificationMethods,
}: AuthChallengeProps) {
  const [open, setOpen] = React.useState(false);
  const [verificationMethod, setVerificationMethod] = React.useState<
    TVerificationMethod | undefined
  >(defaultVerificationMethod);

  const authsignal = useAuthsignal();

  if (!token) {
    throw new Error("token is required");
  }

  React.useEffect(() => {
    if (token) {
      authsignal.setToken(token);
      setOpen(true);
    }
  }, [token, authsignal]);

  const handleChallengeSuccess = React.useCallback(() => {
    setOpen(false);
    onChallengeSuccess();
  }, [onChallengeSuccess]);

  return (
    <AuthChallengeContext.Provider
      value={{
        verificationMethod,
        verificationMethods,
        setVerificationMethod,
        handleChallengeSuccess,
        userDetails,
      }}
    >
      <Drawer.Root
        open={open}
        onOpenChange={(open) => {
          if (!open && onCancel) {
            onCancel();
          }

          setOpen(open);
        }}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="as-fixed as-inset-0 as-z-50 as-bg-black/80" />
          <Drawer.Content
            aria-describedby={undefined}
            className="as-fixed as-inset-x-0 as-bottom-0 as-z-50 as-mt-24 as-flex as-h-auto as-flex-col as-rounded-t-[10px] as-border as-bg-background as-pb-8 as-px-4"
          >
            <div className="as-mx-auto as-mt-4 as-h-2 as-w-[100px] as-rounded-full as-bg-muted" />
            <div className="as-text-center as-pt-8">
              {!verificationMethod && <VerificationMethods />}

              {verificationMethod === VerificationMethod.PASSKEY && (
                <PasskeyChallenge token={token} />
              )}

              {verificationMethod === VerificationMethod.EMAIL_OTP && (
                <EmailOtpChallenge />
              )}

              {verificationMethod && <AuthChallengeFooter />}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </AuthChallengeContext.Provider>
  );
}

const verificationMethodConfig: Record<
  TVerificationMethod,
  { icon: JSX.Element; label: string }
> = {
  [VerificationMethod.PASSKEY]: {
    icon: <PasskeyIcon className="as-size-6" />,
    label: "a passkey",
  },
  [VerificationMethod.EMAIL_OTP]: {
    icon: <EmailOtpIcon className="as-size-6" />,
    label: "an email OTP",
  },
  [VerificationMethod.AUTHENTICATOR_APP]: {
    icon: <AuthenticatorAppIcon className="as-size-6" />,
    label: "an authenticator app",
  },
};

function AuthChallengeFooter() {
  const { verificationMethod, verificationMethods, setVerificationMethod } =
    useAuthChallenge();

  if (
    (verificationMethods && verificationMethods.length > 2) ||
    !verificationMethods
  ) {
    return (
      <button
        className="as-text-indigo-600 as-text-sm as-font-medium as-mt-6"
        onClick={() => setVerificationMethod(undefined)}
        type="button"
      >
        Use another authentication method
      </button>
    );
  }

  if (verificationMethods && verificationMethods.length === 2) {
    const otherMethod = verificationMethods.filter(
      (v) => v !== verificationMethod,
    )[0];

    const { icon, label } = verificationMethodConfig[otherMethod];

    return (
      <button
        className="as-text-indigo-600 as-text-sm as-font-medium as-mt-6 as-inline-flex as-items-center as-space-x-1"
        onClick={() => setVerificationMethod(otherMethod)}
        type="button"
      >
        {icon}
        <span>Use {label} instead</span>
      </button>
    );
  }

  return null;
}
