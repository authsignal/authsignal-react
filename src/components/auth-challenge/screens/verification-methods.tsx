import React from "react";
import {
  TVerificationMethod,
  useAuthChallenge,
  VerificationMethod,
} from "../auth-challenge";
import { PasskeyIcon } from "../../icons/passkey-icon";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { AuthenticatorAppIcon } from "../../icons/authenticator-app-icon";
import { EmailOtpIcon } from "../../icons/email-otp-icon";
import { Drawer } from "vaul";
import { SmsOtpIcon } from "../../icons/sms-otp-icon";

export function VerificationMethods() {
  return (
    <div className="as-space-y-4">
      <Drawer.Title className="as-text-center as-text-xl as-font-medium">
        Select an authentication method
      </Drawer.Title>
      <ul className="as-space-y-3">
        <VerificationMethodItem
          verificationMethod={VerificationMethod.PASSKEY}
          icon={<PasskeyIcon className="as-size-8" />}
          label="Passkey"
        />
        <VerificationMethodItem
          verificationMethod={VerificationMethod.AUTHENTICATOR_APP}
          icon={<AuthenticatorAppIcon className="as-size-8" />}
          label="Authenticator app"
        />
        <VerificationMethodItem
          verificationMethod={VerificationMethod.EMAIL_OTP}
          icon={<EmailOtpIcon className="as-size-8" />}
          label="Email OTP"
        />
        <VerificationMethodItem
          verificationMethod={VerificationMethod.SMS}
          icon={<SmsOtpIcon className="as-size-8" />}
          label="Text message"
        />
      </ul>
    </div>
  );
}

type VerificationMethodItemProps = {
  verificationMethod: TVerificationMethod;
  icon: React.ReactNode;
  label: string;
};

function VerificationMethodItem({
  verificationMethod,
  icon,
  label,
}: VerificationMethodItemProps) {
  const { setVerificationMethod, verificationMethods } = useAuthChallenge();

  const isVerificationMethodAllowed = React.useMemo(() => {
    if (!verificationMethods) {
      return true;
    }

    return verificationMethods?.includes(verificationMethod);
  }, [verificationMethods, verificationMethod]);

  if (!isVerificationMethodAllowed) {
    return null;
  }

  return (
    <li>
      <button
        className="as-p-2 as-rounded as-border as-flex as-items-center as-w-full as-shadow"
        onClick={() => setVerificationMethod(verificationMethod)}
        type="button"
      >
        <div className="as-flex as-items-center as-space-x-2">
          {icon}
          <span className="as-text-sm as-font-medium">{label}</span>
        </div>
        <ChevronRightIcon className="as-size-4 as-ml-auto" />
      </button>
    </li>
  );
}
