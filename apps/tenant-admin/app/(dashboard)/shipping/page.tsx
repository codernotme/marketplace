import { PageHeader } from "@workspace/ui/components/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, DeliveryTruck01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping — themrktplace",
  description: "Shipping zones, carriers, and fulfillment settings.",
};

export default function ShippingPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Shipping"
        description="Configure shipping zones, carriers, and delivery rates."
      >
        <Button size="sm">
          <HugeiconsIcon icon={Add01Icon} data-icon="inline-start" />
          Add zone
        </Button>
      </PageHeader>

      {/* Shipping zones */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Shipping Zones</h2>
        {[
          { name: "Domestic (India)", regions: "All India", carriers: ["Shiprocket", "Delhivery"], rates: "₹50–₹150" },
          { name: "South Asia", regions: "Nepal, Bangladesh, Sri Lanka", carriers: ["FedEx", "DHL"], rates: "₹500–₹1200" },
          { name: "International", regions: "Rest of world", carriers: ["DHL", "FedEx", "UPS"], rates: "₹1500+" },
        ].map((zone) => (
          <Card key={zone.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <HugeiconsIcon icon={Location01Icon} size={18} className="text-primary" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold">{zone.name}</CardTitle>
                  <CardDescription className="text-xs">{zone.regions}</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </CardHeader>
            <CardContent className="flex items-center gap-6 text-sm">
              <div>
                <span className="text-muted-foreground text-xs">Carriers: </span>
                {zone.carriers.map((c) => (
                  <Badge key={c} variant="outline" className="mr-1 text-xs">{c}</Badge>
                ))}
              </div>
              <div>
                <span className="text-muted-foreground text-xs">Rates: </span>
                <span className="font-medium">{zone.rates}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Carrier integrations */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Carrier Integrations</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: "Shiprocket", status: "connected" },
            { name: "Delhivery", status: "connected" },
            { name: "FedEx", status: "not connected" },
            { name: "DHL", status: "not connected" },
          ].map((carrier) => (
            <Card key={carrier.name} className="text-center">
              <CardContent className="pt-6 pb-4 flex flex-col items-center gap-3">
                <div className="size-12 rounded-xl bg-muted flex items-center justify-center">
                  <HugeiconsIcon icon={DeliveryTruck01Icon} size={24} className="text-muted-foreground" />
                </div>
                <p className="text-sm font-medium">{carrier.name}</p>
                <Badge variant={carrier.status === "connected" ? "default" : "secondary"} className="text-xs">
                  {carrier.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
