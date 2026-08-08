export default function CatLogo({ size = 24 }) {
  const gradientId = `cat-logo-gradient-${size}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 hover:scale-110"
      style={{ verticalAlign: 'middle' }}
    >
      <defs>
        <linearGradient id={gradientId} x1="2" y1="22" x2="22" y2="2" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="50%" stopColor="#6d28d9" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>

      {/* Outer Cat Head Silhouette with Distinct Pointed Ears */}
      <path
        d="M8 6.5C9.3 5.9 10.6 5.6 12 5.6C13.4 5.6 14.7 5.9 16 6.5L20.8 2.2C21.4 1.7 22.3 2.3 22 3.1L20.2 8.8C21.4 10.4 22 12.3 22 14.5C22 19 17.5 22 12 22C6.5 22 2 19 2 14.5C2 12.3 2.6 10.4 3.8 8.8L2 3.1C1.7 2.3 2.6 1.7 3.2 2.2L8 6.5Z"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner Ear Highlights */}
      <path
        d="M5 8L4 4.5L7.5 7"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 8L20 4.5L16.5 7"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cat Eyes */}
      <ellipse cx="8.2" cy="12.8" rx="1.5" ry="2" fill={`url(#${gradientId})`} />
      <ellipse cx="15.8" cy="12.8" rx="1.5" ry="2" fill={`url(#${gradientId})`} />
      {/* Eye catchlights */}
      <circle cx="7.7" cy="12.1" r="0.5" fill="#ffffff" />
      <circle cx="15.3" cy="12.1" r="0.5" fill="#ffffff" />

      {/* Cute Triangle Nose */}
      <path
        d="M10.8 15.2H13.2L12 16.4Z"
        fill={`url(#${gradientId})`}
      />

      {/* "W" Cat Mouth */}
      <path
        d="M12 16.4V17.4C11.4 18 10.4 18 9.7 17.4 M12 17.4C12.6 18 13.6 18 14.3 17.4"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.3"
        strokeLinecap="round"
      />

      {/* Left Whiskers */}
      <path
        d="M5.5 14.2L1.8 13.5 M5.5 16.2L1.2 16.5 M5.5 18.2L2.2 19.5"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Right Whiskers */}
      <path
        d="M18.5 14.2L22.2 13.5 M18.5 16.2L22.8 16.5 M18.5 18.2L21.8 19.5"
        stroke={`url(#${gradientId})`}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
