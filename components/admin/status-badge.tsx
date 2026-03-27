import type {
  AvailabilityStatus,
  InquiryStatus,
  LocaleVisibilityStatus,
  PublishStatus,
} from "@prisma/client";

import { Badge } from "@/components/ui/badge";

type StatusKind = "publish" | "availability" | "inquiry" | "locale";

type AdminStatusBadgeProps = {
  kind: StatusKind;
  status:
    | AvailabilityStatus
    | InquiryStatus
    | LocaleVisibilityStatus
    | PublishStatus;
};

function getBadgeConfig(kind: StatusKind, status: AdminStatusBadgeProps["status"]) {
  if (kind === "publish") {
    switch (status as PublishStatus) {
      case "published":
        return { label: "Published", variant: "success" as const };
      case "review":
        return { label: "Review", variant: "warning" as const };
      case "archived":
        return { label: "Archived", variant: "neutral" as const };
      default:
        return { label: "Draft", variant: "muted" as const };
    }
  }

  if (kind === "availability") {
    switch (status as AvailabilityStatus) {
      case "in_stock":
        return { label: "In stock", variant: "success" as const };
      case "available_on_request":
        return { label: "On request", variant: "muted" as const };
      case "out_of_stock":
        return { label: "Out of stock", variant: "warning" as const };
      default:
        return { label: "Discontinued", variant: "neutral" as const };
    }
  }

  if (kind === "inquiry") {
    switch (status as InquiryStatus) {
      case "answered":
        return { label: "Answered", variant: "success" as const };
      case "qualified":
        return { label: "Qualified", variant: "warning" as const };
      case "closed":
        return { label: "Closed", variant: "neutral" as const };
      case "spam":
        return { label: "Spam", variant: "neutral" as const };
      default:
        return { label: "New", variant: "muted" as const };
    }
  }

  switch (status as LocaleVisibilityStatus) {
    case "public":
      return { label: "Public", variant: "success" as const };
    case "internal_only":
      return { label: "Internal only", variant: "warning" as const };
    default:
      return { label: "Disabled", variant: "neutral" as const };
  }
}

export function AdminStatusBadge({ kind, status }: AdminStatusBadgeProps) {
  const config = getBadgeConfig(kind, status);
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
