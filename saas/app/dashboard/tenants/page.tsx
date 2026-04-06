import { Button } from "@/components/ui/button";
import Link from "next/link";
import { TenantList } from "@/components/dashboard/tenant-list";
import { Plus } from "lucide-react";

export default function TenantsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600 mt-2">Manage all shop tenants and their configurations</p>
        </div>
        <Link href="/dashboard/tenants/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Tenant
          </Button>
        </Link>
      </div>

      <TenantList />
    </div>
  );
}
