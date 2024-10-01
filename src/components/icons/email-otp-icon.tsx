import React from "react";

export function EmailOtpIcon({ className }: { className?: string }) {
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
        stroke="currentColor"
        strokeWidth={2}
        d="M16.25 21 5 31m18.75-10L35 31M5 11l13.69 11.865a2 2 0 0 0 2.62 0L35 11"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 12.333A3.333 3.333 0 0 1 8.333 9h23.334A3.333 3.333 0 0 1 35 12.333V29a3.333 3.333 0 0 1-3.333 3.333H8.333A3.333 3.333 0 0 1 5 29V12.333Z"
      />
    </svg>
  );
}
