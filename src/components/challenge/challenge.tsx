import { Authsignal } from "@authsignal/browser";
import React from "react";
import { Drawer } from "vaul";

import { useAuthsignalContext } from "../../hooks/use-authsignal-context";
import { useMediaQuery } from "../../hooks/use-media-query";
import { Dialog, DialogContent } from "../../ui/dialog";
import { AuthenticatorAppIcon } from "../icons/authenticator-app-icon";
import { EmailOtpIcon } from "../icons/email-otp-icon";
import { PasskeyIcon } from "../icons/passkey-icon";
import { SmsOtpIcon } from "../icons/sms-otp-icon";

import { AuthenticatorAppChallenge } from "./screens/authenticator-app-challenge";
import { EmailOtpChallenge } from "./screens/email-otp-challenge";
import { PasskeyChallenge } from "./screens/passkey-challenge";
import { SmsOtpChallenge } from "./screens/sms-otp-challenge";
import { VerificationMethods } from "./screens/verification-methods";
import {
  AuthChallengeContext,
  TVerificationMethod,
  useChallengeContext,
  VerificationMethod,
} from "./use-challenge-context";

export type ChallengeProps = {
  token: string;
  onChallengeSuccess?: (params: { token: string }) => void;
  onCancel?: () => void;
  onTokenExpired?: () => void;
  defaultVerificationMethod?: TVerificationMethod;
  verificationMethods?: TVerificationMethod[];
  user?: {
    email?: string;
    phoneNumber?: string;
  };
};

export function Challenge({
  defaultVerificationMethod,
  onChallengeSuccess,
  onCancel,
  token,
  user,
  verificationMethods,
  onTokenExpired,
}: ChallengeProps) {
  const [open, setOpen] = React.useState(false);

  const [verificationMethod, setVerificationMethod] = React.useState<
    TVerificationMethod | undefined
  >(defaultVerificationMethod);

  const { tenantId, baseUrl } = useAuthsignalContext();

  const onTokenExpiredRef = React.useRef(onTokenExpired);

  const authsignal = React.useMemo(
    () =>
      new Authsignal({
        tenantId,
        baseUrl,
        onTokenExpired: () => {
          setOpen(false);

          if (onTokenExpiredRef.current) {
            onTokenExpiredRef.current();
          }
        },
      }),
    [tenantId, baseUrl],
  );

  const isDesktop = useMediaQuery("(min-width: 768px)");

  React.useEffect(() => {
    if (token) {
      authsignal.setToken(token);

      setOpen(true);
    }
  }, [token, authsignal]);

  const handleChallengeSuccess = React.useCallback(
    ({ token }: { token: string }) => {
      setOpen(false);

      if (onChallengeSuccess) {
        onChallengeSuccess({ token });
      }
    },
    [onChallengeSuccess],
  );

  const handleClose = React.useCallback(() => {
    setOpen(false);

    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const handleOpenChange = (open: boolean) => {
    if (!open && onCancel) {
      handleClose();
    }

    setOpen(open);
  };

  const content = (
    <div className="as-text-center as-pt-8">
      {!verificationMethod && <VerificationMethods />}

      {verificationMethod === VerificationMethod.PASSKEY && (
        <PasskeyChallenge token={token} />
      )}

      {verificationMethod === VerificationMethod.EMAIL_OTP && (
        <EmailOtpChallenge />
      )}

      {verificationMethod === VerificationMethod.SMS && <SmsOtpChallenge />}

      {verificationMethod === VerificationMethod.AUTHENTICATOR_APP && (
        <AuthenticatorAppChallenge />
      )}

      {verificationMethod && <AuthChallengeFooter />}
    </div>
  );

  return (
    <AuthChallengeContext.Provider
      value={{
        verificationMethod,
        verificationMethods,
        setVerificationMethod,
        handleChallengeSuccess,
        user,
        authsignal,
      }}
    >
      {isDesktop ? (
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogContent
            className="sm:max-w-[425px] pb-10"
            aria-describedby={undefined}
          >
            {content}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer.Root open={open} onOpenChange={handleOpenChange}>
          <Drawer.Portal>
            <Drawer.Overlay className="as-fixed as-inset-0 as-z-50 as-bg-black/80" />
            <Drawer.Content
              aria-describedby={undefined}
              className="as-fixed as-inset-x-0 as-bottom-0 as-z-50 as-mt-24 as-flex as-h-auto as-flex-col as-rounded-t-[10px] as-border as-bg-background as-pb-8 as-px-4"
            >
              <div className="as-mx-auto as-mt-4 as-h-2 as-w-[100px] as-rounded-full as-bg-muted" />
              {content}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
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
  [VerificationMethod.SMS]: {
    icon: <SmsOtpIcon className="as-size-6" />,
    label: "a text message",
  },
};

function AuthChallengeFooter() {
  const { verificationMethod, verificationMethods, setVerificationMethod } =
    useChallengeContext();

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
