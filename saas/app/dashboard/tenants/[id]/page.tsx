import { TenantDetail } from "@/components/dashboard/tenant-detail";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface TenantPageProps {
  params: {
    id: string;
  };
}

export default function TenantPage({ params }: TenantPageProps) {
  return (
    <div>
      <Link href="/dashboard/tenants">
        <Button variant="ghost" className="mb-4 gap-2">
          <ChevronLeft className="w-4 h-4" />
          Back to Tenants
        </Button>
      </Link>
      <TenantDetail tenantId={params.id} />
    </div>
  );
}
