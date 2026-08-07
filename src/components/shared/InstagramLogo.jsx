export default function InstagramLogo({ size = 24 }) {
  const gradientId = `logo-gradient-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradientId} x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.75"
      />
      <circle
        cx="12"
        cy="12"
        r="4.5"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.75"
      />
      <circle cx="17.5" cy="6.5" r="1.25" fill={`url(#${gradientId})`} />
    </svg>
  );
}
