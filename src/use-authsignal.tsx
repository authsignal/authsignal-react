import { useCallback } from "react";
import {
  ChallengeOptions,
  ChallengeProps,
  EnrollProps,
  StartChallengeAsyncOptions,
  StartChallengeOptions,
  TVerificationMethod,
  VerificationMethod,
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

type EnrollmentErrorCodes =
  | "USER_CANCELED"
  | "TOKEN_EXPIRED"
  | "EXISTING_ENROLLMENT";

export class EnrollmentError extends Error {
  code: EnrollmentErrorCodes;

  constructor(code: EnrollmentErrorCodes, message: string) {
    super(message);
    this.code = code;
    this.name = "EnrollmentError";
  }
}

type InitResponse = {
  token: string;
  challengeOptions: ChallengeOptions;
  userAuthenticators: { verificationMethod: TVerificationMethod }[];
  actionConfiguration: {
    allowedVerificationMethods: TVerificationMethod[];
  };
};

type BaseOptions = {
  token: string;
  onSuccess?: ({ token }: { token: string }) => void;
  onCancel?: () => void;
  onTokenExpired?: () => void;
};

function createCallbackHandlers<T>(
  options: BaseOptions,
  setState: (state: T | undefined) => void,
) {
  const previouslyFocusedElement = document.activeElement as HTMLElement | null;
  const returnFocus = () => previouslyFocusedElement?.focus();

  return {
    onSuccess: ({ token }: { token: string }) => {
      setTimeout(() => {
        if (options.onSuccess) {
          options.onSuccess({ token });
        }
        setState(undefined);
      }, ANIMATION_DURATION);
    },

    onCancel: () => {
      setTimeout(() => {
        if (options.onCancel) {
          options.onCancel();
        }
        setState(undefined);
        returnFocus();
      }, ANIMATION_DURATION);
    },

    onTokenExpired: () => {
      setTimeout(() => {
        if (options.onTokenExpired) {
          options.onTokenExpired();
        }
        setState(undefined);
        returnFocus();
      }, ANIMATION_DURATION);
    },
  };
}

function createAsyncCallbackHandlers<T>(
  setState: (state: T | undefined) => void,
  ErrorClass: typeof ChallengeError | typeof EnrollmentError,
  errorPrefix: string,
) {
  const previouslyFocusedElement = document.activeElement as HTMLElement | null;
  const returnFocus = () => previouslyFocusedElement?.focus();

  return {
    onSuccess: (
      { token }: { token: string },
      resolve: (value: { token: string }) => void,
    ) => {
      setTimeout(() => {
        resolve({ token });
        setState(undefined);
      }, ANIMATION_DURATION);
    },

    onCancel: (reject: (reason?: unknown) => void) => {
      setTimeout(() => {
        reject(
          new ErrorClass(
            "USER_CANCELED",
            `${errorPrefix} was canceled by the user.`,
          ),
        );
        setState(undefined);
        returnFocus();
      }, ANIMATION_DURATION);
    },

    onTokenExpired: (reject: (reason?: unknown) => void) => {
      setTimeout(() => {
        reject(
          new ErrorClass("TOKEN_EXPIRED", `${errorPrefix} token expired.`),
        );
        setState(undefined);
        returnFocus();
      }, ANIMATION_DURATION);
    },
  };
}

async function getInitResponse(
  baseUrl: string,
  token: string,
): Promise<InitResponse | undefined> {
  const initRequest = await fetch(`${baseUrl}/client/init`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!initRequest.ok) {
    return;
  }

  return await initRequest.json();
}

async function getChallengeOptions({
  baseUrl,
  token,
}: {
  baseUrl: string;
  token: string;
}) {
  const initResponse = await getInitResponse(baseUrl, token);

  if (!initResponse) {
    return;
  }

  const supportedVerificationMethods = Object.keys(VerificationMethod);

  return {
    ...initResponse.challengeOptions,
    // Remove unsupported verification methods e.g. Veriff/iProov
    verificationMethods:
      initResponse.challengeOptions.verificationMethods?.filter(
        (verificationMethod) =>
          supportedVerificationMethods.includes(verificationMethod),
      ),
  };
}

async function getEnrollOptions({
  baseUrl,
  token,
}: {
  baseUrl: string;
  token: string;
}) {
  const initResponse = await getInitResponse(baseUrl, token);

  if (!initResponse) {
    return;
  }

  const supportedVerificationMethods = Object.keys(VerificationMethod);

  return {
    token: initResponse.token,
    verificationMethods:
      initResponse.actionConfiguration.allowedVerificationMethods?.filter(
        (verificationMethod) =>
          supportedVerificationMethods.includes(verificationMethod),
      ),
  };
}

export function useAuthsignal() {
  const { baseUrl, setChallenge, challenge, setEnroll, enroll } =
    useAuthsignalContext();

  const startChallenge = useCallback(
    async (options: StartChallengeOptions) => {
      if (challenge) {
        throw new ChallengeError(
          "EXISTING_CHALLENGE",
          "An existing challenge is already in progress.",
        );
      }

      const challengeOptions = await getChallengeOptions({
        baseUrl,
        token: options.token,
      });

      if (!challengeOptions) {
        options.onTokenExpired?.();
        return;
      }

      const handlers = createCallbackHandlers<ChallengeProps>(
        options,
        setChallenge,
      );

      setChallenge({ challengeOptions, ...handlers });
    },
    [baseUrl, challenge, setChallenge],
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
        baseUrl,
        token: options.token,
      });

      if (!challengeOptions) {
        throw new ChallengeError("TOKEN_EXPIRED", "Challenge token expired.");
      }

      return new Promise<{ token: string }>((resolve, reject) => {
        const handlers = createAsyncCallbackHandlers<ChallengeProps>(
          setChallenge,
          ChallengeError,
          "Challenge",
        );

        setChallenge({
          challengeOptions,
          onSuccess: (params) => handlers.onSuccess(params, resolve),
          onCancel: () => handlers.onCancel(reject),
          onTokenExpired: () => handlers.onTokenExpired(reject),
        });
      });
    },
    [baseUrl, challenge, setChallenge],
  );

  const startEnrollment = useCallback(
    async (options: StartChallengeOptions) => {
      if (enroll) {
        throw new EnrollmentError(
          "EXISTING_ENROLLMENT",
          "An existing enrollment is already in progress.",
        );
      }

      const enrollOptions = await getEnrollOptions({
        baseUrl,
        token: options.token,
      });

      if (!enrollOptions) {
        options.onTokenExpired?.();
        return;
      }

      const handlers = createCallbackHandlers<EnrollProps>(options, setEnroll);

      setEnroll({ enrollOptions, ...handlers });
    },
    [baseUrl, enroll, setEnroll],
  );

  const startEnrollmentAsync = useCallback(
    async (options: StartChallengeAsyncOptions) => {
      if (enroll) {
        throw new EnrollmentError(
          "EXISTING_ENROLLMENT",
          "An existing enrollment is already in progress.",
        );
      }

      const enrollOptions = await getEnrollOptions({
        baseUrl,
        token: options.token,
      });

      if (!enrollOptions) {
        throw new EnrollmentError("TOKEN_EXPIRED", "Enrollment token expired.");
      }

      return new Promise<{ token: string }>((resolve, reject) => {
        const handlers = createAsyncCallbackHandlers<EnrollProps>(
          setEnroll,
          EnrollmentError,
          "Enrollment",
        );

        setEnroll({
          enrollOptions,
          onSuccess: (params) => handlers.onSuccess(params, resolve),
          onCancel: () => handlers.onCancel(reject),
          onTokenExpired: () => handlers.onTokenExpired(reject),
        });
      });
    },
    [baseUrl, enroll, setEnroll],
  );

  return {
    challenge,
    enroll,
    startChallenge,
    startChallengeAsync,
    startEnrollment,
    startEnrollmentAsync,
  };
}
