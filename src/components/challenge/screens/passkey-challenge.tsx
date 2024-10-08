import { ReloadIcon } from "@radix-ui/react-icons";
import React, { useCallback } from "react";
import { Drawer } from "vaul";
import { useChallengeContext } from "../use-challenge-context";

type PasskeyChallengeProps = {
  token: string; // TODO: This should be set in the web sdk
};

enum State {
  AUTHENTICATING = "AUTHENTICATING",
  ERROR = "ERROR",
}

export function PasskeyChallenge({ token }: PasskeyChallengeProps) {
  const [state, setState] = React.useState<State>(State.AUTHENTICATING);

  const { handleChallengeSuccess, authsignal } = useChallengeContext();

  const handlePasskeyAuthentication = useCallback(async () => {
    const handleError = () => {
      setState(State.ERROR);
    };

    setState(State.AUTHENTICATING);

    try {
      const signInResponse = await authsignal.passkey.signIn({
        token,
      });

      if ("error" in signInResponse) {
        handleError();
        return;
      }

      if (signInResponse.token) {
        handleChallengeSuccess({ token: signInResponse.token });
      } else {
        setState(State.ERROR);
      }
    } catch {
      setState(State.ERROR);
    }
  }, [authsignal.passkey, handleChallengeSuccess, token]);

  React.useEffect(() => {
    handlePasskeyAuthentication();
  }, [handlePasskeyAuthentication]);

  return (
    <div className="as-space-y-6">
      {state === State.AUTHENTICATING && (
        <>
          <div className="as-space-y-2">
            <Drawer.Title className="as-text-xl as-font-medium">
              Confirm it&apos;s you
            </Drawer.Title>
            <p className="as-text-sm">
              You will receive a prompt from your browser to authenticate with
              your passkey.
            </p>
          </div>
          <ReloadIcon className="as-mx-auto as-size-8 as-animate-spin" />
        </>
      )}

      {state === State.ERROR && (
        <>
          <div className="as-space-y-2">
            <Drawer.Title className="as-text-xl as-font-medium">
              Confirm it&apos;s you
            </Drawer.Title>
            <p className="as-text-sm">
              There was a problem authenticating with your passkey.
            </p>
          </div>

          <button
            className="as-inline-flex as-w-full as-items-center as-justify-center as-rounded-lg as-bg-primary as-px-3 as-py-2 as-text-sm as-font-medium as-text-white"
            type="button"
            onClick={handlePasskeyAuthentication}
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
}
