import React from "react";
import { AuthsignalContext } from "../authsignal-provider";

export function useAuthsignal() {
  const context = React.useContext(AuthsignalContext);

  if (context === undefined) {
    throw new Error("useAuthsignal must be used within a AuthsignalProvider");
  }

  return context;
}
