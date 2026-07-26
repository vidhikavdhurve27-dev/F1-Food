import { BadgeCheck, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { orgTypeMap, type OrgTypeId, type VerificationStatus } from "@/data/organizations";

export function VerifiedBadge({
  type,
  status = "verified",
  className,
}: {
  type?: OrgTypeId;
  status?: VerificationStatus;
  className?: string;
}) {
  if (status === "pending") {
    return (
      <Badge variant="warning" className={className}>
        <Clock3 /> Verification Pending
      </Badge>
    );
  }
  const label = type ? orgTypeMap[type].label.split(" /")[0] : "Partner";
  return (
    <Badge variant="successSoft" className={className}>
      <BadgeCheck /> Verified {label}
    </Badge>
  );
}
