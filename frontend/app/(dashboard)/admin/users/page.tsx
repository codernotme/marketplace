import { proxy } from '@/lib/proxy';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, User } from '@/components/HeroUI';
import { Icon } from '@iconify/react';

export default async function AdminUsers() {
  const users = await proxy.admin.getUsers();

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-[--c-primary]">User Management</h1>
        <Button className="bg-[--c-primary] text-white rounded-full font-medium shadow-sm hover:shadow-lg h-12 px-6 transition-all hover:-translate-y-0.5">
          <Icon icon="lucide:user-plus" className="w-4 h-4 mr-2" /> Invite User
        </Button>
      </div>

      <div className="bg-white border border-[--c-border] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[--c-border] flex items-center justify-between">
           <div className="relative w-80">
             <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[--c-muted] w-4 h-4" />
             <input type="text" placeholder="Search by name, email, or role..." className="w-full h-10 pl-10 pr-4 text-sm bg-[--c-surface] border border-transparent rounded-lg focus:outline-none focus:border-[--c-primary] focus:bg-white transition-all shadow-inner" />
           </div>
        </div>
        <Table aria-label="Users table" classNames={{ wrapper: "rounded-none shadow-none p-0", th: "bg-[--c-surface] text-[--c-secondary] font-medium tracking-wide text-xs uppercase h-12 border-b border-[--c-border]", td: "py-4 text-sm border-b border-[--c-border] text-[--c-primary]" }}>
          <TableHeader>
            <TableColumn>USER</TableColumn>
            <TableColumn>ROLE</TableColumn>
            <TableColumn>JOINED</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="end">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {users.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <User
                    name={item.name}
                    description={item.email}
                    classNames={{ name: "font-medium text-[--c-primary]", description: "text-[--c-secondary]" }}
                    avatarProps={{ radius: "md", src: `https://i.pravatar.cc/150?u=${item.id}` }}
                  />
                </TableCell>
                <TableCell>
                   <Chip size="sm" variant="dot" color={item.role === 'Admin' ? 'danger' : item.role === 'Vendor' ? 'warning' : 'default'} className="border-none font-medium">
                     {item.role}
                   </Chip>
                </TableCell>
                <TableCell><span className="font-mono text-xs text-[--c-secondary]">{item.joined}</span></TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color={item.status === 'Active' ? 'success' : 'default'} className="font-medium text-[11px] tracking-wide uppercase">
                    {item.status}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2 text-[--c-secondary]">
                    <button className="p-2 hover:text-[--c-primary] transition-colors"><Icon icon="lucide:more-vertical" className="w-4 h-4" /></button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
