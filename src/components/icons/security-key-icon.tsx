import React from "react";

export function SecurityKeyIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={40}
      height={40}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
    >
      <g clipPath="url(#a)">
        <rect
          x={5.565}
          y={19.293}
          width={18}
          height={28}
          rx={2}
          transform="rotate(-45 5.565 19.293)"
          stroke="currentColor"
          strokeWidth={2}
        />
        <path
          d="M3.444 12.93a2 2 0 0 1 0-2.83L9.1 4.445a2 2 0 0 1 2.829 0l4.242 4.243-8.485 8.485-4.242-4.243ZM9.101 14.343l-2.829-2.828M11.222 12.222 8.393 9.394M13.344 10.101l-2.829-2.829"
          stroke="currentColor"
          strokeWidth={2}
        />
        <circle
          cx={20.414}
          cy={21.415}
          r={5}
          transform="rotate(-45 20.414 21.415)"
          stroke="currentColor"
          strokeWidth={2}
        />
        <circle
          cx={28.192}
          cy={29.192}
          r={1}
          transform="rotate(-45 28.192 29.192)"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h40v40H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}
