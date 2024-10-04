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

      // TODO: Return `isVerified` in the response?
      if (signInResponse.token) {
        handleChallengeSuccess();
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
          <ReloadIcon className="as-size-8 as-animate-spin as-mx-auto" />
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
            className="as-w-full as-px-3 as-py-2 as-text-white as-bg-[#313139] as-rounded-lg as-inline-flex as-items-center as-text-sm as-justify-center"
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
