import React from "react";
import { Drawer } from "vaul";

import { useChallengeContext } from "../use-challenge-context";
import { DialogTitle } from "../../../ui/dialog";

export function EmailMagicLinkChallenge() {
  const { handleSuccess, user, authsignal, isDesktop } = useChallengeContext();

  React.useEffect(() => {
    console.log("EmailMagicLinkChallenge useEffect");
    const handleEmailMagicLinkChallenge = async () => {
      await authsignal.emailML.challenge();

      const response = await authsignal.emailML.checkVerificationStatus();

      if (response.data?.token) {
        handleSuccess({ token: response.data.token });
      }
    };

    handleEmailMagicLinkChallenge();
  }, [authsignal, handleSuccess]);

  const TitleComponent = isDesktop ? DialogTitle : Drawer.Title;

  return (
    <div className="as-flex as-flex-col as-space-y-6">
      <div className="as-space-y-2">
        <TitleComponent className="as-text-center as-text-xl as-font-medium as-text-foreground">
          Confirm it&apos;s you
        </TitleComponent>
        <p className="as-text-center as-text-sm as-text-foreground">
          A verification link was sent to {user?.email ?? ""}.<br /> Click the
          link to proceed.
        </p>
      </div>
    </div>
  );
}
