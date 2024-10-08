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
  useChallengeContext,
} from "./use-challenge-context";
import {
  ChallengeProps,
  TVerificationMethod,
  VerificationMethod,
} from "../../types";
import { createTheme } from "../../lib/create-theme";

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

  const [container, setContainer] = React.useState<Element | null>(null);

  const [verificationMethod, setVerificationMethod] = React.useState<
    TVerificationMethod | undefined
  >(defaultVerificationMethod);

  const { tenantId, baseUrl, appearance } = useAuthsignalContext();

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
    <div className="as-pt-8 as-text-center">
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

  const style = createTheme(appearance);

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
            container={container}
            className="as-pb-10 sm:as-max-w-[425px]"
            aria-describedby={undefined}
          >
            {content}
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer.Root open={open} onOpenChange={handleOpenChange}>
          <Drawer.Portal container={container}>
            <Drawer.Overlay className="as-fixed as-inset-0 as-z-50 as-bg-black/80" />
            <Drawer.Content
              aria-describedby={undefined}
              className="as-fixed as-inset-x-0 as-bottom-0 as-z-50 as-mt-24 as-flex as-h-auto as-flex-col as-rounded-t-[10px] as-border as-bg-background as-px-4 as-pb-8"
            >
              <div className="as-mx-auto as-mt-4 as-h-2 as-w-[100px] as-rounded-full as-bg-muted" />
              {content}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      )}
      <div className="authsignal" style={style} ref={setContainer} />
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
        className="as-mt-6 as-text-sm as-font-medium as-text-[#5865D6]"
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
        className="as-mt-6 as-inline-flex as-items-center as-space-x-1 as-text-sm as-font-medium as-text-[#5865D6]"
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
