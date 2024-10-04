import { useCallback, useEffect, useState } from "react";

import { Challenge } from "./components/challenge/challenge";

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

type ChallengeProps = React.ComponentPropsWithoutRef<typeof Challenge>;

const ANIMATION_DURATION = 500;

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
    ({ onChallengeSuccess, onCancel, ...props }: ChallengeProps) => {
      const newChallenge: ChallengeProps = {
        ...props,
        onChallengeSuccess: ({ token }) => {
          setTimeout(() => {
            onChallengeSuccess({ token });

            memoryChallengeState = undefined;

            challengeEmitter.emit(memoryChallengeState);
          }, ANIMATION_DURATION);
        },
        onCancel: () => {
          setTimeout(() => {
            if (onCancel) {
              onCancel();
            }

            memoryChallengeState = undefined;

            challengeEmitter.emit(memoryChallengeState);
          }, ANIMATION_DURATION);
        },
      };

      memoryChallengeState = newChallenge;

      challengeEmitter.emit(memoryChallengeState);
    },
    [],
  );

  return {
    challenge,
    startChallenge,
  };
}
