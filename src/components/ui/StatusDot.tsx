type Status = "online" | "offline" | "away";

const STATUS_COLOR: Record<Status, string> = {
  online: "var(--color-status-online)",
  away: "var(--color-status-away)",
  offline: "var(--color-status-offline)",
};

interface StatusDotProps {
  status: Status;
  size?: number;
  ring?: boolean;
  className?: string;
}

export default function StatusDot({
  status,
  size = 8,
  ring = false,
  className = "",
}: StatusDotProps) {
  return (
    <span
      className={`inline-block rounded-full shrink-0 ${ring ? "ring-2 ring-(--color-bg-surface)" : ""} ${className}`}
      style={{ width: size, height: size, backgroundColor: STATUS_COLOR[status] }}
    />
  );
}
