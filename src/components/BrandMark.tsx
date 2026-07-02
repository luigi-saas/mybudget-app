import LucideIcon from "./LucideIcon";

export default function BrandMark({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const isSmall = size === "sm";

  return (
    <div
      className={`flex ${isSmall ? "h-8 w-8" : "h-10 w-10"} items-center justify-center rounded-2xl bg-primary text-white shadow-[0_10px_30px_rgba(37,99,235,0.25)] ${className}`}
    >
      <LucideIcon name="piggy" size={isSmall ? 16 : 20} />
    </div>
  );
}
