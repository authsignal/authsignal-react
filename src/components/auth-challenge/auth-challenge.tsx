import React from "react";
import { Drawer } from "vaul";
import { EmailOtpChallenge } from "./views/email-otp-challenge";
import { useAuthsignal } from "../../hooks/use-authsignal";
import { AuthenticationMethods } from "./views/authentication-methods";
import { PasskeyChallenge } from "./views/passkey-challenge";

/**
 * TODO:
 *  - Respect permitted authentication methods
 *  - Default verification method
 *  - Masked email/phone number
 *  - Handle error states e.g. token expiry
 *  - desktop view
 *  - SMS, Authenticator app, etc.
 */

type AuthChallengeProps = {
  title?: string;
  description?: string;
  token: string;
  onChallengeSuccess: () => void;
  defaultView?: View;
};

export enum View {
  PASSKEY_CHALLENGE = "PASSKEY_CHALLENGE",
  EMAIL_OTP_CHALLENGE = "EMAIL_OTP_CHALLENGE",
  AUTHENTICATOR_APP_CHALLENGE = "AUTHENTICATOR_APP_CHALLENGE",
  AUTHENTICATION_METHODS = "AUTHENTICATION_METHODS",
}

export function AuthChallenge({
  token,
  defaultView,
  onChallengeSuccess,
  ...rest
}: AuthChallengeProps) {
  const [open, setOpen] = React.useState(false);
  const [view, setView] = React.useState<View>(
    defaultView ?? View.EMAIL_OTP_CHALLENGE,
  );

  const authsignal = useAuthsignal();

  const contentProps = rest.description
    ? {}
    : { "aria-describedby": undefined };

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
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Portal>
        <Drawer.Overlay className="as-fixed as-inset-0 as-z-50 as-bg-black/80" />
        <Drawer.Content
          aria-describedby={undefined}
          className="as-fixed as-inset-x-0 as-bottom-0 as-z-50 as-mt-24 as-flex as-h-auto as-flex-col as-rounded-t-[10px] as-border as-bg-background as-pb-8 as-px-4"
          {...contentProps}
        >
          <div className="as-mx-auto as-mt-4 as-h-2 as-w-[100px] as-rounded-full as-bg-muted" />
          <div className="as-text-center as-pt-8">
            {view === View.AUTHENTICATION_METHODS && (
              <AuthenticationMethods setView={setView} />
            )}

            {view === View.PASSKEY_CHALLENGE && (
              <PasskeyChallenge
                token={token}
                handleChallengeSuccess={handleChallengeSuccess}
              />
            )}

            {view === View.EMAIL_OTP_CHALLENGE && (
              <EmailOtpChallenge
                email="test@test.com"
                handleChallengeSuccess={handleChallengeSuccess}
              />
            )}

            {view !== View.AUTHENTICATION_METHODS && (
              <button
                className="as-text-indigo-600 as-text-sm as-font-medium as-mt-6"
                onClick={() => setView(View.AUTHENTICATION_METHODS)}
                type="button"
              >
                Use another authentication method
              </button>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
