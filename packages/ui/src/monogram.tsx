type MonogramProps = {
  size?: number;
  strokeWidth?: number;
  className?: string;
  title?: string;
};

// La barra della T è anche la traversa della A: un solo tratto.
export function Monogram({ size = 32, strokeWidth = 1.5, className, title }: MonogramProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d="M13 27 L21 5 L29 27" />
      <path d="M3 13 H23.9" />
      <path d="M10.5 13 V27" />
    </svg>
  );
}
