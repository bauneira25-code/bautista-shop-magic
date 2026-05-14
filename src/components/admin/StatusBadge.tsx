import { STATUS_LABEL, STATUS_TONE, type FullOrderStatus } from "@/lib/admin/statuses";

export function StatusBadge({ status }: { status: string }) {
  const s = status as FullOrderStatus;
  const tone = STATUS_TONE[s] ?? "bg-neutral-200 text-neutral-700";
  const label = STATUS_LABEL[s] ?? status;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}>
      {label}
    </span>
  );
}
