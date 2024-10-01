import React from "react";
import { View } from "../auth-challenge";
import { PasskeyIcon } from "../../icons/passkey-icon";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { AuthenticatorAppIcon } from "../../icons/authenticator-app-icon";
import { EmailOtpIcon } from "../../icons/email-otp-icon";
import { Drawer } from "vaul";

type AuthenticationMethodsProps = {
  setView: (view: View) => void;
};

export function AuthenticationMethods({ setView }: AuthenticationMethodsProps) {
  return (
    <div className="as-space-y-4">
      <Drawer.Title className="as-text-center as-text-xl as-font-medium">
        Select an authentication method
      </Drawer.Title>
      <ul className="as-space-y-3">
        <li>
          <button
            className="as-p-2 as-rounded as-border as-flex as-items-center as-w-full as-shadow"
            onClick={() => setView(View.PASSKEY_CHALLENGE)}
            type="button"
          >
            <div className="as-flex as-items-center as-space-x-2">
              <PasskeyIcon className="as-size-8" />
              <span className="as-text-sm as-font-medium">Passkey</span>
            </div>
            <ChevronRightIcon className="as-size-4 as-ml-auto" />
          </button>
        </li>
        <li>
          <button
            className="as-p-2 as-rounded as-border as-flex as-items-center as-w-full as-shadow"
            onClick={() => setView(View.AUTHENTICATOR_APP_CHALLENGE)}
            type="button"
          >
            <div className="as-flex as-items-center as-space-x-2">
              <AuthenticatorAppIcon className="as-size-8" />
              <span className="as-text-sm as-font-medium">
                Authenticator app
              </span>
            </div>
            <ChevronRightIcon className="as-size-4 as-ml-auto" />
          </button>
        </li>
        <li>
          <button
            className="as-p-2 as-rounded as-border as-flex as-items-center as-w-full as-shadow"
            onClick={() => setView(View.EMAIL_OTP_CHALLENGE)}
            type="button"
          >
            <div className="as-flex as-items-center as-space-x-2">
              <EmailOtpIcon className="as-size-8" />
              <span className="as-text-sm as-font-medium">Email OTP</span>
            </div>
            <ChevronRightIcon className="as-size-4 as-ml-auto" />
          </button>
        </li>
      </ul>
    </div>
  );
}
