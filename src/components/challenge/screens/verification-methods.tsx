import { ChevronRightIcon } from "@radix-ui/react-icons";
import React from "react";
import { Drawer } from "vaul";

import { AuthenticatorAppIcon } from "../../icons/authenticator-app-icon";
import { EmailOtpIcon } from "../../icons/email-otp-icon";
import { PasskeyIcon } from "../../icons/passkey-icon";
import { SmsOtpIcon } from "../../icons/sms-otp-icon";
import { useChallengeContext } from "../use-challenge-context";
import { TVerificationMethod, VerificationMethod } from "../../../types";
import { DialogTitle } from "../../../ui/dialog";
import { EmailMagicLinkIcon } from "../../icons/email-magic-link-icon";

export function VerificationMethods() {
  const { isDesktop } = useChallengeContext();

  const TitleComponent = isDesktop ? DialogTitle : Drawer.Title;

  return (
    <div className="as-space-y-4">
      <TitleComponent className="as-text-center as-text-xl as-font-medium as-text-foreground">
        Select an authentication method
      </TitleComponent>
      <ul className="as-space-y-3">
        <VerificationMethodItem
          verificationMethod={VerificationMethod.PASSKEY}
          icon={<PasskeyIcon className="as-size-[2rem]" />}
          label="Passkey"
        />
        <VerificationMethodItem
          verificationMethod={VerificationMethod.AUTHENTICATOR_APP}
          icon={<AuthenticatorAppIcon className="as-size-[2rem]" />}
          label="Authenticator app"
        />
        <VerificationMethodItem
          verificationMethod={VerificationMethod.EMAIL_OTP}
          icon={<EmailOtpIcon className="as-size-[2rem]" />}
          label="Email OTP"
        />
        <VerificationMethodItem
          verificationMethod={VerificationMethod.EMAIL_MAGIC_LINK}
          icon={<EmailMagicLinkIcon className="as-size-[2rem]" />}
          label="Email magic link"
        />
        <VerificationMethodItem
          verificationMethod={VerificationMethod.SMS}
          icon={<SmsOtpIcon className="as-size-[2rem]" />}
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
  const { setVerificationMethod, verificationMethods } = useChallengeContext();

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
        className="as-flex as-w-full as-items-center as-rounded as-border as-p-2 as-text-foreground as-shadow"
        onClick={() => setVerificationMethod(verificationMethod)}
        type="button"
      >
        <div className="as-flex as-items-center as-space-x-2">
          {icon}
          <span className="as-text-sm as-font-medium ">{label}</span>
        </div>
        <ChevronRightIcon className="as-ml-auto as-size-4" />
      </button>
    </li>
  );
}
