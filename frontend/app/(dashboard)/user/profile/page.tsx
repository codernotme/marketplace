import { proxy } from '@/lib/proxy';
import { Button, Input, Card, CardBody, Avatar, Divider } from '@/components/HeroUI';
import { Icon } from '@iconify/react';

export default async function UserProfilePage() {
  const profile = await proxy.user.getProfile('mock-user-id');

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="font-display text-4xl text-[--c-primary] mb-8">General Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           <Card className="bg-white border border-[--c-border] shadow-sm">
             <CardBody className="p-8">
               <h3 className="text-lg font-medium text-[--c-primary] mb-6">Personal Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Input label="Full Name" defaultValue={profile.name} labelPlacement="outside" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
                 <Input label="Email Address" defaultValue={profile.email} labelPlacement="outside" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
                 <Input label="Phone Number" placeholder="+91 98765 43210" labelPlacement="outside" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
                 <Input label="Location" placeholder="Mumbai, India" labelPlacement="outside" classNames={{ inputWrapper: "bg-white border border-[--c-border] shadow-none h-12" }} />
               </div>
               <Button className="mt-8 bg-[--c-primary] text-white rounded-full font-medium h-12 px-8 shadow-md hover:shadow-lg transition-all">
                 Save Changes
               </Button>
             </CardBody>
           </Card>

           <Card className="bg-white border border-[--c-border] shadow-sm">
             <CardBody className="p-8">
               <h3 className="text-lg font-medium text-[--c-primary] mb-4">Security</h3>
               <p className="text-sm text-[--c-secondary] mb-8">Manage your password and account security settings.</p>
               <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[--c-border] group hover:border-[--c-primary] transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                       <Icon icon="lucide:lock" className="w-5 h-5 text-[--c-secondary]" />
                       <div>
                         <p className="text-sm font-medium text-[--c-primary]">Password</p>
                         <p className="text-xs text-[--c-muted]">Last changed 3 months ago</p>
                       </div>
                    </div>
                    <Icon icon="lucide:chevron-right" className="w-4 h-4 text-[--c-muted] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[--c-border] group hover:border-[--c-primary] transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                       <Icon icon="lucide:shield-check" className="w-5 h-5 text-[--c-secondary]" />
                       <div>
                         <p className="text-sm font-medium text-[--c-primary]">Two-Factor Authentication</p>
                         <p className="text-xs text-[--c-muted]">Currently disabled</p>
                       </div>
                    </div>
                    <Icon icon="lucide:chevron-right" className="w-4 h-4 text-[--c-muted] group-hover:translate-x-1 transition-transform" />
                  </div>
               </div>
             </CardBody>
           </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-white border border-[--c-border] shadow-sm">
            <CardBody className="p-10 flex flex-col items-center">
               <Avatar src={profile.avatar} className="w-32 h-32 text-large mb-6 border-4 border-[--c-surface] shadow-xl" radius="full" />
               <h2 className="text-xl font-medium text-[--c-primary] mb-1">{profile.name}</h2>
               <p className="text-sm text-[--c-secondary] mb-6">{profile.email}</p>
               <Divider className="mb-6" />
               <div className="w-full space-y-4">
                 <div className="flex justify-between text-sm">
                    <span className="text-[--c-secondary]">Joined</span>
                    <span className="text-[--c-primary] font-medium">{profile.joined}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-[--c-secondary]">Level</span>
                    <span className="text-[--c-primary] font-medium">Standard Member</span>
                 </div>
               </div>
               <Button variant="bordered" className="w-full mt-8 border-[--c-border] text-[--c-primary] rounded-full font-medium h-12">
                 Change Avatar
               </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
