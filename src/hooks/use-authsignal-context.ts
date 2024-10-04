import React from "react";

import { AuthsignalContext } from "../authsignal-provider";

export function useAuthsignalContext() {
  const context = React.useContext(AuthsignalContext);

  if (context === undefined) {
    throw new Error(
      "useAuthsignalContext must be used within a AuthsignalProvider",
    );
  }

  return context;
}
