import React from "react";
import { useForm } from "react-hook-form";
import { Drawer } from "vaul";

import { cn } from "../../../lib/utils";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../../../ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../../../ui/input-otp";
import { useChallengeContext } from "../use-challenge-context";
import { DialogTitle } from "../../../ui/dialog";

type FormData = {
  code: string;
};

enum OtpInputState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  ERROR = "ERROR",
}

export function AuthenticatorAppChallenge() {
  const [codeState, setCodeState] = React.useState<OtpInputState>(
    OtpInputState.IDLE,
  );

  const { handleSuccess, authsignal, isDesktop } = useChallengeContext();

  const submitButtonRef = React.useRef<HTMLButtonElement>(null);

  const form = useForm<FormData>({
    defaultValues: {
      code: "",
    },
  });

  const code = form.watch("code");

  React.useEffect(() => {
    if (code?.length === 6) {
      submitButtonRef.current?.click();
    }
  }, [code]);

  const onSubmit = form.handleSubmit(async ({ code }) => {
    setCodeState(OtpInputState.LOADING);

    const verifyResponse = await authsignal.totp.verify({ code });

    if (verifyResponse.error) {
      return;
    }

    const token = verifyResponse.data?.token;

    if (token) {
      handleSuccess({ token });
    } else {
      setCodeState(OtpInputState.ERROR);

      setTimeout(() => {
        setCodeState(OtpInputState.IDLE);

        form.resetField("code");

        setTimeout(() => {
          form.setFocus("code");
        }, 0);
      }, 500);
    }
  });

  const TitleComponent = isDesktop ? DialogTitle : Drawer.Title;

  return (
    <div className="as-flex as-flex-col as-space-y-6">
      <div className="as-space-y-2">
        <TitleComponent className="as-text-center as-text-xl as-font-medium as-text-foreground">
          Confirm it&apos;s you
        </TitleComponent>
        <p className="as-text-center as-text-sm as-text-foreground">
          Enter the code from your authenticator app to proceed.
        </p>
      </div>
      <Form {...form}>
        <form
          noValidate
          onSubmit={onSubmit}
          className="as-flex as-w-full as-flex-col as-space-y-3"
        >
          <FormField
            control={form.control}
            name="code"
            rules={{ required: "Enter a code" }}
            render={({ field }) => (
              <FormItem className="as-mx-auto">
                <FormLabel className="as-sr-only">Code</FormLabel>
                <FormControl>
                  <InputOTP
                    disabled={codeState === OtpInputState.LOADING}
                    maxLength={6}
                    {...field}
                  >
                    <InputOTPGroup
                      className={cn(
                        codeState === OtpInputState.ERROR && "as-animate-shake",
                      )}
                    >
                      <InputOTPSlot
                        className={cn(
                          codeState === OtpInputState.ERROR &&
                            "as-border-red-600",
                        )}
                        index={0}
                      />
                      <InputOTPSlot
                        className={cn(
                          codeState === OtpInputState.ERROR &&
                            "as-border-red-600",
                        )}
                        index={1}
                      />
                      <InputOTPSlot
                        className={cn(
                          codeState === OtpInputState.ERROR &&
                            "as-border-red-600",
                        )}
                        index={2}
                      />
                      <InputOTPSlot
                        className={cn(
                          codeState === OtpInputState.ERROR &&
                            "as-border-red-600",
                        )}
                        index={3}
                      />
                      <InputOTPSlot
                        className={cn(
                          codeState === OtpInputState.ERROR &&
                            "as-border-red-600",
                        )}
                        index={4}
                      />
                      <InputOTPSlot
                        className={cn(
                          codeState === OtpInputState.ERROR &&
                            "as-border-red-600",
                        )}
                        index={5}
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </FormControl>
                <FormMessage className="as-sr-only" />
              </FormItem>
            )}
          />
          <button hidden type="submit" ref={submitButtonRef} />
        </form>
      </Form>
    </div>
  );
}
