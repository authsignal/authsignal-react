import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import { Drawer } from "vaul";
import { useChallengeContext } from "../use-challenge-context";
import { DialogTitle } from "../../../ui/dialog";

enum State {
  AUTHENTICATING = "AUTHENTICATING",
  ERROR = "ERROR",
}

export function SecurityKeyChallenge() {
  const [state, setState] = React.useState<State>(State.AUTHENTICATING);

  const { handleChallengeSuccess, authsignal, isDesktop } =
    useChallengeContext();

  const handleSecurityKeyAuthentication = useCallback(async () => {
    const handleError = () => {
      setState(State.ERROR);
    };

    setState(State.AUTHENTICATING);

    try {
      const verifyResponse = await authsignal.securityKey.verify();

      if (verifyResponse.error) {
        handleError();
        return;
      }

      if (verifyResponse.data?.token) {
        handleChallengeSuccess({ token: verifyResponse.data.token });
      } else {
        setState(State.ERROR);
      }
    } catch {
      setState(State.ERROR);
    }
  }, [authsignal.securityKey, handleChallengeSuccess]);

  React.useEffect(() => {
    handleSecurityKeyAuthentication();
  }, [handleSecurityKeyAuthentication]);

  const TitleComponent = isDesktop ? DialogTitle : Drawer.Title;

  return (
    <div className="as-space-y-6">
      {state === State.AUTHENTICATING && (
        <>
          <div className="as-space-y-2">
            <TitleComponent className="as-text-xl as-font-medium as-text-foreground">
              Confirm it&apos;s you
            </TitleComponent>
            <p className="as-text-sm as-text-foreground">
              You will receive a prompt from your browser to authenticate with
              your security key.
            </p>
          </div>
          <ReloadIcon className="as-mx-auto as-size-8 as-animate-spin as-text-foreground" />
        </>
      )}

      {state === State.ERROR && (
        <>
          <div className="as-space-y-2">
            <TitleComponent className="as-text-xl as-font-medium as-text-foreground">
              Confirm it&apos;s you
            </TitleComponent>
            <p className="as-text-sm as-text-foreground">
              There was a problem authenticating with your security key.
            </p>
          </div>

          <button
            className="as-inline-flex as-w-full as-items-center as-justify-center as-rounded-lg as-bg-primary as-px-3 as-py-2 as-text-sm as-font-medium as-text-primary-foreground"
            type="button"
            onClick={handleSecurityKeyAuthentication}
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
}
