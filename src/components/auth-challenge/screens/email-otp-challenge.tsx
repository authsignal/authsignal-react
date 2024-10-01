import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useAuthsignal } from "../../../hooks/use-authsignal";
import { Drawer } from "vaul";
import { useAuthChallenge } from "../auth-challenge";

const formSchema = z.object({
  code: z.string().min(6, { message: "Enter a valid code" }),
});

enum OtpInputState {
  IDLE = "IDLE",
  LOADING = "LOADING",
  ERROR = "ERROR",
}

export function EmailOtpChallenge() {
  const [codeState, setCodeState] = React.useState<OtpInputState>(
    OtpInputState.IDLE,
  );

  const authsignal = useAuthsignal();

  const { handleChallengeSuccess, userDetails } = useAuthChallenge();

  const submitButtonRef = React.useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const code = form.watch("code");

  React.useEffect(() => {
    authsignal.email.challenge();
  }, [authsignal]);

  React.useEffect(() => {
    if (code?.length === 6) {
      submitButtonRef.current?.click();
    }
  }, [code]);

  const onSubmit = form.handleSubmit(async ({ code }) => {
    setCodeState(OtpInputState.LOADING);

    const verifyResponse = await authsignal.email.verify({ code });

    if ("error" in verifyResponse) {
      // Handle error
      return;
    }

    const { isVerified } = verifyResponse;

    if (isVerified) {
      handleChallengeSuccess();
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

  return (
    <div className="as-flex as-flex-col as-space-y-6">
      <div className="as-space-y-2">
        <Drawer.Title className="as-text-center as-text-xl as-font-medium">
          Confirm it&apos;s you
        </Drawer.Title>
        <p className="as-text-center as-text-sm">
          Enter the code sent to {userDetails?.email ?? "<insert-email>"} to
          proceed.
        </p>
      </div>
      <Form {...form}>
        <form
          noValidate
          onSubmit={onSubmit}
          className="as-flex as-flex-col as-space-y-3 as-w-full"
        >
          <FormField
            control={form.control}
            name="code"
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
