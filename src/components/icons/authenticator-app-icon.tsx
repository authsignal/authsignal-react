import React from "react";

export function AuthenticatorAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      focusable="false"
      aria-hidden
    >
      <path
        d="M20 31h.017m-6.684 4h13.334A3.333 3.333 0 0 0 30 31.667V8.333A3.333 3.333 0 0 0 26.667 5H13.333A3.333 3.333 0 0 0 10 8.333v23.334A3.333 3.333 0 0 0 13.333 35Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 8.333A3.333 3.333 0 0 1 13.333 5h13.334A3.333 3.333 0 0 1 30 8.333v23.334A3.333 3.333 0 0 1 26.667 35H13.333A3.333 3.333 0 0 1 10 31.667V8.333Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path stroke="currentColor" strokeWidth={2} d="M11 26h19" />
    </svg>
  );
}
