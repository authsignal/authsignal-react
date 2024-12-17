import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import { Drawer } from "vaul";
import { useEnrollContext } from "../use-enroll-context";
import { DialogTitle } from "../../../ui/dialog";
import { browserSupportsWebAuthn } from "@simplewebauthn/browser";
import { isIframeInSafari } from "../../../lib/device";

type PasskeyEnrollmentProps = {
  token: string; // TODO: This should be set in the web sdk
};

enum State {
  AUTHENTICATING = "AUTHENTICATING",
  ERROR = "ERROR",
  NOT_SUPPORTED = "NOT_SUPPORTED",
}

export function PasskeyEnroll({ token }: PasskeyEnrollmentProps) {
  const [state, setState] = React.useState<State | undefined>(
    isIframeInSafari() ? undefined : State.AUTHENTICATING,
  );

  const { handleSuccess, authsignal, isDesktop } = useEnrollContext();

  const handlePasskeyRegistration = useCallback(async () => {
    if (!browserSupportsWebAuthn()) {
      setState(State.NOT_SUPPORTED);
      return;
    }

    const handleError = () => {
      setState(State.ERROR);
    };

    setState(State.AUTHENTICATING);

    try {
      const signUpResponse = await authsignal.passkey.signUp({
        token,
      });

      if (signUpResponse.error) {
        handleError();
        return;
      }

      if (signUpResponse.data?.token) {
        handleSuccess({ token: signUpResponse.data.token });
      } else {
        setState(State.ERROR);
      }
    } catch {
      setState(State.ERROR);
    }
  }, [authsignal.passkey, handleSuccess, token]);

  React.useEffect(() => {
    handlePasskeyRegistration();
  }, [handlePasskeyRegistration]);

  const TitleComponent = isDesktop ? DialogTitle : Drawer.Title;

  return (
    <div className="as-space-y-6">
      {!state && isIframeInSafari() && (
        <>
          <button
            className="as-inline-flex as-w-full as-items-center as-justify-center as-rounded-lg as-bg-primary as-px-3 as-py-2 as-text-sm as-font-medium as-text-primary-foreground"
            type="button"
            onClick={handlePasskeyRegistration}
          >
            Create a passkey
          </button>
        </>
      )}

      {state === State.NOT_SUPPORTED && (
        <div className="as-space-y-2">
          <TitleComponent className="as-text-xl as-font-medium as-text-foreground">
            Passkeys not supported
          </TitleComponent>
          <p className="as-text-sm as-text-foreground">
            Your browser does not support passkeys.
          </p>
        </div>
      )}

      {state === State.AUTHENTICATING && (
        <>
          <div className="as-space-y-2">
            <TitleComponent className="as-text-xl as-font-medium as-text-foreground">
              Create passkey
            </TitleComponent>
            <p className="as-text-sm as-text-foreground">
              You will receive a prompt from your browser to create a passkey.
            </p>
          </div>
          <ReloadIcon className="as-mx-auto as-size-8 as-animate-spin as-text-foreground" />
        </>
      )}

      {state === State.ERROR && (
        <>
          <div className="as-space-y-2">
            <TitleComponent className="as-text-xl as-font-medium as-text-foreground">
              Create passkey
            </TitleComponent>
            <p className="as-text-sm as-text-foreground">
              There was a problem creating your passkey.
            </p>
          </div>

          <button
            className="as-inline-flex as-w-full as-items-center as-justify-center as-rounded-lg as-bg-primary as-px-3 as-py-2 as-text-sm as-font-medium as-text-primary-foreground"
            type="button"
            onClick={handlePasskeyRegistration}
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
}
