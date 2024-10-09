import { useCallback, useEffect, useState } from "react";
import {
  ChallengeProps,
  StartChallengeAsyncOptions,
  StartChallengeOptions,
} from "./types";

const ANIMATION_DURATION = 500;

type Listener<T> = (payload: T) => void;

class EventEmitter<T> {
  private listeners: Listener<T>[] = [];

  subscribe(listener: Listener<T>): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(payload: T) {
    this.listeners.forEach((listener) => listener(payload));
  }
}

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

let memoryChallengeState: ChallengeProps | undefined;

const challengeEmitter = new EventEmitter<ChallengeProps | undefined>();

export function useAuthsignal() {
  const [challenge, setChallenge] = useState<ChallengeProps | undefined>(
    memoryChallengeState,
  );

  useEffect(() => {
    const unsubscribe = challengeEmitter.subscribe(setChallenge);
    return () => unsubscribe();
  }, []);

  const startChallenge = useCallback(
    (options: StartChallengeOptions) => {
      if (challenge) {
        throw new ChallengeError(
          "EXISTING_CHALLENGE",
          "An existing challenge is already in progress.",
        );
      }

      const newChallenge: ChallengeProps = {
        ...options,

        onChallengeSuccess: ({ token }) => {
          setTimeout(() => {
            if (options.onChallengeSuccess) {
              options.onChallengeSuccess({ token });
            }

            memoryChallengeState = undefined;
            challengeEmitter.emit(memoryChallengeState);
          }, ANIMATION_DURATION);
        },

        onCancel: () => {
          setTimeout(() => {
            if (options.onCancel) {
              options.onCancel();
            }

            memoryChallengeState = undefined;
            challengeEmitter.emit(memoryChallengeState);
          }, ANIMATION_DURATION);
        },

        onTokenExpired: () => {
          setTimeout(() => {
            if (options.onTokenExpired) {
              options.onTokenExpired();
            }

            memoryChallengeState = undefined;
            challengeEmitter.emit(memoryChallengeState);
          }, ANIMATION_DURATION);
        },
      };

      memoryChallengeState = newChallenge;
      challengeEmitter.emit(memoryChallengeState);
    },
    [challenge],
  );

  const startChallengeAsync = useCallback(
    (options: StartChallengeAsyncOptions) => {
      if (challenge) {
        throw new ChallengeError(
          "EXISTING_CHALLENGE",
          "An existing challenge is already in progress.",
        );
      }

      return new Promise<{ token: string }>((resolve, reject) => {
        const newChallenge: ChallengeProps = {
          ...options,

          onChallengeSuccess: ({ token }) => {
            setTimeout(() => {
              resolve({ token });

              memoryChallengeState = undefined;
              challengeEmitter.emit(memoryChallengeState);
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

              memoryChallengeState = undefined;
              challengeEmitter.emit(memoryChallengeState);
            }, ANIMATION_DURATION);
          },

          onTokenExpired: () => {
            setTimeout(() => {
              reject(
                new ChallengeError("TOKEN_EXPIRED", "Challenge token expired."),
              );

              memoryChallengeState = undefined;
              challengeEmitter.emit(memoryChallengeState);
            }, ANIMATION_DURATION);
          },
        };

        memoryChallengeState = newChallenge;
        challengeEmitter.emit(memoryChallengeState);
      });
    },
    [challenge],
  );

  return { challenge, startChallenge, startChallengeAsync };
}
