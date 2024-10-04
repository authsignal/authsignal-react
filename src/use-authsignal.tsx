import { useCallback, useEffect, useState } from "react";
import { Challenge } from "./components/challenge/challenge";

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

class ChallengeError extends Error {
  code: "USER_CANCELLED" | "TOKEN_EXPIRED";

  constructor(code: "USER_CANCELLED" | "TOKEN_EXPIRED", message: string) {
    super(message);
    this.code = code;
    this.name = "ChallengeError";
  }
}

type ChallengeProps = React.ComponentPropsWithoutRef<typeof Challenge>;

let memoryChallengeState: ChallengeProps | undefined;

const challengeEmitter = new EventEmitter<ChallengeProps | undefined>();

type StartChallengeOptions = ChallengeProps;

type StartChallengeAsyncOptions = Omit<
  ChallengeProps,
  "onChallengeSuccess" | "onTokenExpired" | "onCancel"
>;

export function useAuthsignal() {
  const [challenge, setChallenge] = useState<ChallengeProps | undefined>(
    memoryChallengeState,
  );

  useEffect(() => {
    const unsubscribe = challengeEmitter.subscribe(setChallenge);
    return () => unsubscribe();
  }, []);

  const startChallenge = useCallback((options: StartChallengeOptions) => {
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
  }, []);

  const startChallengeAsync = useCallback(
    (options: StartChallengeAsyncOptions) => {
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
                  "USER_CANCELLED",
                  "Challenge was cancelled by the user.",
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
    [],
  );

  return { challenge, startChallenge, startChallengeAsync };
}
