import { useCallback } from "react";
import {
  ChallengeOptions,
  ChallengeProps,
  StartChallengeAsyncOptions,
  StartChallengeOptions,
} from "./types";
import { useAuthsignalContext } from "./hooks/use-authsignal-context";

const ANIMATION_DURATION = 500;

type ChallengeErrorCodes =
  | "USER_CANCELED"
  | "TOKEN_EXPIRED"
  | "EXISTING_CHALLENGE";

export class ChallengeError extends Error {
  code: ChallengeErrorCodes;

  constructor(code: ChallengeErrorCodes, message: string) {
    super(message);
    this.code = code;
    this.name = "ChallengeError";
  }
}

type InitResponse = {
  challengeOptions: ChallengeOptions;
};

export function useAuthsignal() {
  const { baseUrl, setChallenge, challenge } = useAuthsignalContext();

  const getChallengeOptions = useCallback(
    async ({ token }: { token: string }) => {
      const initRequest = await fetch(`${baseUrl}/client/init`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (!initRequest.ok) {
        return;
      }

      const initResponse: InitResponse = await initRequest.json();

      return initResponse.challengeOptions;
    },
    [baseUrl],
  );

  const startChallenge = useCallback(
    async (options: StartChallengeOptions) => {
      if (challenge) {
        throw new ChallengeError(
          "EXISTING_CHALLENGE",
          "An existing challenge is already in progress.",
        );
      }

      const challengeOptions = await getChallengeOptions({
        token: options.token,
      });

      if (!challengeOptions) {
        options.onTokenExpired?.();
        return;
      }

      const previouslyFocusedElement =
        document.activeElement as HTMLElement | null;

      const returnFocus = () => {
        previouslyFocusedElement?.focus();
      };

      const newChallenge: ChallengeProps = {
        challengeOptions,

        onChallengeSuccess: ({ token }) => {
          setTimeout(() => {
            if (options.onChallengeSuccess) {
              options.onChallengeSuccess({ token });
            }

            setChallenge(undefined);
          }, ANIMATION_DURATION);
        },

        onCancel: () => {
          setTimeout(() => {
            if (options.onCancel) {
              options.onCancel();
            }

            setChallenge(undefined);

            returnFocus();
          }, ANIMATION_DURATION);
        },

        onTokenExpired: () => {
          setTimeout(() => {
            if (options.onTokenExpired) {
              options.onTokenExpired();
            }

            setChallenge(undefined);

            returnFocus();
          }, ANIMATION_DURATION);
        },
      };

      setChallenge(newChallenge);
    },
    [challenge, getChallengeOptions, setChallenge],
  );

  const startChallengeAsync = useCallback(
    async (options: StartChallengeAsyncOptions) => {
      if (challenge) {
        throw new ChallengeError(
          "EXISTING_CHALLENGE",
          "An existing challenge is already in progress.",
        );
      }

      const challengeOptions = await getChallengeOptions({
        token: options.token,
      });

      if (!challengeOptions) {
        throw new ChallengeError("TOKEN_EXPIRED", "Challenge token expired.");
      }

      const previouslyFocusedElement =
        document.activeElement as HTMLElement | null;

      const returnFocus = () => {
        previouslyFocusedElement?.focus();
      };

      return new Promise<{ token: string }>((resolve, reject) => {
        const newChallenge: ChallengeProps = {
          challengeOptions,

          onChallengeSuccess: ({ token }) => {
            setTimeout(() => {
              resolve({ token });

              setChallenge(undefined);
            }, ANIMATION_DURATION);
          },

          onCancel: () => {
            setTimeout(() => {
              reject(
                new ChallengeError(
                  "USER_CANCELED",
                  "Challenge was canceled by the user.",
                ),
              );

              setChallenge(undefined);

              returnFocus();
            }, ANIMATION_DURATION);
          },

          onTokenExpired: () => {
            setTimeout(() => {
              reject(
                new ChallengeError("TOKEN_EXPIRED", "Challenge token expired."),
              );

              setChallenge(undefined);

              returnFocus();
            }, ANIMATION_DURATION);
          },
        };

        setChallenge(newChallenge);
      });
    },
    [challenge, getChallengeOptions, setChallenge],
  );

  return { challenge, startChallenge, startChallengeAsync };
}
