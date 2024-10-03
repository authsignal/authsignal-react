import React from "react";

export function SmsOtpIcon({ className }: { className?: string }) {
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
        d="M28.333 13.333h3.334A3.333 3.333 0 0 1 35 16.666v10A3.333 3.333 0 0 1 31.667 30h-3.334v6.666L21.667 30H15c-.92 0-1.754-.373-2.357-.977m0 0 5.69-5.69H25A3.333 3.333 0 0 0 28.333 20V10A3.333 3.333 0 0 0 25 6.667H8.333A3.333 3.333 0 0 0 5 10v10a3.333 3.333 0 0 0 3.333 3.333h3.334V30l.976-.977Z"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
