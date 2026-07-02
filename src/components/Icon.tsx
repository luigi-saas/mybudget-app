import type { IconKey } from "@/lib/types";

const paths: Record<IconKey, JSX.Element> = {
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  water: <path d="M12 2C8 8 5 11.5 5 15a7 7 0 0 0 14 0c0-3.5-3-7-7-13Z" />,
  home: <path d="m3 11 9-8 9 8v9a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2v-9Z" />,
  wifi: <path d="M2 8.5a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M8.5 15.5a6 6 0 0 1 7 0M12 19h.01" />,
  phone: <path d="M6 2h6l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v6a2 2 0 0 1-2 2C11.4 22 2 12.6 2 6a2 2 0 0 1 2-2Z" />,
  cart: <path d="M3 3h2l2.4 12.4a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L21 8H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2Zm9 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />,
  food: <path d="M6 2v8a3 3 0 0 0 6 0V2M9 2v20M18 2c-2 1-3 3-3 6s1 4 3 4v10" />,
  fuel: <path d="M4 22V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M4 22h10M14 9h2.5l3 3v5a1.5 1.5 0 0 1-3 0V13l-2-2M7 6v4h4V6" />,
  restaurant: <path d="M11 2v9a2 2 0 1 1-4 0V2M7 2v6M9 2v6M18 2c-2 3-2 5-2 7s.5 2 2 2 2 0 2-2-0-4-2-7Zm0 9v11" />,
  family: <path d="M9 4a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm7 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M15 20c0-2.6-1-4.8-2.6-6.2A5 5 0 0 1 21 20" />,
  gift: <path d="M12 8v14M4 12h16v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6ZM3 8h18v4H3zM8 8a2.5 2.5 0 0 1 0-5c2 0 4 5 4 5s2-5 4-5a2.5 2.5 0 0 1 0 5" />,
  sparkles: <path d="M12 3v4M12 17v4M4 12H2M22 12h-2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4M12 8a4 4 0 0 0 4 4 4 4 0 0 0-4 4 4 4 0 0 0-4-4 4 4 0 0 0 4-4Z" />,
  car: <path d="M3 13h18l-2-6H5l-2 6Zm0 0v5h2m14-5v5h-2M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />,
  piggy: <path d="M4 12a6 6 0 0 1 6-6h4a6 6 0 0 1 6 4h1v4h-2a6 6 0 0 1-3 3v3H12v-2H9v2H6v-3a6 6 0 0 1-2-5Zm10-5V5" />,
  plane: <path d="m2 16 20-8-8 20-3-8-8-3Z" />,
  shield: <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" />,
  wallet: <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3M3 7l3-3h9M16 14h.01M16 11h5v6h-5a3 3 0 0 1 0-6Z" />,
  bank: <path d="M3 10 12 4l9 6M4 10v10h16V10M9 14v4M12 14v4M15 14v4M2 20h20" />,
  alert: <path d="M12 9v4M12 17h.01M10.3 3.9 2.5 18a1.8 1.8 0 0 0 1.5 2.7h16a1.8 1.8 0 0 0 1.5-2.7L13.7 3.9a1.8 1.8 0 0 0-3.4 0Z" />,
  clock: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm0-16v6l4 2" />,
};

export default function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: IconKey;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
