import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  CustomerServiceIcon, 
  MapLocation01Icon, 
  Mail01Icon,
  Call01Icon,
  ArrowRight01Icon
} from "@hugeicons/core-free-icons";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with our team for support or sales inquiries.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 md:px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-16 items-start max-w-7xl mx-auto">
        {/* Contact Info */}
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4">
             <h1 className="font-heading text-5xl font-black tracking-tight underline decoration-primary decoration-4 underline-offset-8">Let's Talk.</h1>
             <p className="text-xl text-muted-foreground mt-4 leading-relaxed max-w-lg">
                Whether you're a small vendor or a global enterprise, we have the infrastructure to help you scale.
             </p>
          </div>
          
          <div className="grid gap-8">
             <div className="flex gap-6 items-start">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                   <HugeiconsIcon icon={Mail01Icon} size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-lg">Email Us</h3>
                   <p className="text-muted-foreground mt-1">Our sales team responds within 2 hours during business days.</p>
                   <p className="font-semibold text-primary mt-2">sales@themrktplace.io</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                   <HugeiconsIcon icon={CustomerServiceIcon} size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-lg">24/7 Support</h3>
                   <p className="text-muted-foreground mt-1">Existing merchants can reach our dedicated support desk anytime.</p>
                   <p className="font-semibold text-primary mt-2">support@themrktplace.io</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                   <HugeiconsIcon icon={MapLocation01Icon} size={24} />
                </div>
                <div>
                   <h3 className="font-bold text-lg">Our Office</h3>
                   <p className="text-muted-foreground mt-1">Whitefield, Bengaluru</p>
                   <p className="text-muted-foreground">Karnataka, India — 560066</p>
                </div>
             </div>
          </div>
          
          <div className="mt-4 p-8 bg-muted/20 border border-border/50 rounded-3xl">
             <h4 className="font-bold mb-4">India Headquarters</h4>
             <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <HugeiconsIcon icon={Call01Icon} size={16} />
                <span>+91 80 4900 2000</span>
             </div>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="border-border/50 shadow-2xl p-8 md:p-12 rounded-[40px] bg-card relative overflow-hidden group">
           <CardContent className="p-0 flex flex-col gap-6 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">First Name</Label>
                    <Input id="firstName" placeholder="Jane" className="h-12 rounded-xl bg-muted/30 border-none px-5" />
                 </div>
                 <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Last Name</Label>
                    <Input id="lastName" placeholder="Doe" className="h-12 rounded-xl bg-muted/30 border-none px-5" />
                 </div>
              </div>
              <div className="flex flex-col gap-2">
                 <Label htmlFor="email" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Work Email</Label>
                 <Input id="email" type="email" placeholder="jane@company.com" className="h-12 rounded-xl bg-muted/30 border-none px-5" />
              </div>
              <div className="flex flex-col gap-2">
                 <Label htmlFor="company" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Company Name</Label>
                 <Input id="company" placeholder="D2C Brand Ltd." className="h-12 rounded-xl bg-muted/30 border-none px-5" />
              </div>
              <div className="flex flex-col gap-2">
                 <Label htmlFor="message" className="font-bold text-xs uppercase tracking-widest text-muted-foreground">How can we help?</Label>
                 <Textarea id="message" placeholder="Tell us about your project requirements..." className="min-h-[150px] rounded-xl bg-muted/30 border-none p-5" />
              </div>
              <Button size="lg" className="h-14 rounded-full font-bold text-base mt-4 shadow-xl shadow-primary/20">
                 Send Message
                 <HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
              </Button>
           </CardContent>
           {/* Abstract shape */}
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 -z-0" />
        </Card>
      </div>
    </div>
  );
}
