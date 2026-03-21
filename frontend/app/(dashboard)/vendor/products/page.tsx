import { proxy } from '@/lib/proxy';
import { Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from '@/components/HeroUI';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default async function VendorProducts() {
  const products = await proxy.vendor.getProducts('mock-vendor-id');

  return (
    <div className="py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-[--c-primary]">Inventory</h1>
        <Button as={Link} href="/vendor/products/new" className="bg-[--c-primary] text-white rounded-full font-medium shadow-md hover:shadow-lg h-12 px-6 transition-all hover:-translate-y-0.5">
          <Icon icon="lucide:plus" className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <div className="bg-white border border-[--c-border] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[--c-border] flex items-center justify-between gap-4">
           <div className="relative flex-1 max-w-md">
             <Icon icon="lucide:search" className="absolute left-3 top-1/2 -translate-y-1/2 text-[--c-muted] w-4 h-4" />
             <input type="text" placeholder="Search products..." className="w-full h-10 pl-10 pr-4 text-sm bg-[--c-surface] border border-transparent rounded-lg focus:outline-none focus:border-[--c-primary] focus:bg-white transition-all shadow-inner" />
           </div>
           <Button variant="bordered" className="border-[--c-border] text-[--c-secondary] rounded-lg h-10 font-medium bg-white">
             <Icon icon="lucide:filter" className="w-4 h-4 mr-2" /> Filter
           </Button>
        </div>
        <Table aria-label="Products table" classNames={{ wrapper: "rounded-none shadow-none p-0", th: "bg-[--c-surface] text-[--c-secondary] font-medium tracking-wide text-xs uppercase h-12 border-b border-[--c-border]", td: "py-4 text-sm border-b border-[--c-border] text-[--c-primary]" }}>
          <TableHeader>
            <TableColumn>PRODUCT</TableColumn>
            <TableColumn>SKU</TableColumn>
            <TableColumn>PRICE</TableColumn>
            <TableColumn>STOCK</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn align="end">ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {products.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-[--c-surface] rounded-lg border border-[--c-border]"></div>
                     <span className="font-medium">{item.title}</span>
                  </div>
                </TableCell>
                <TableCell><span className="font-mono text-xs text-[--c-secondary]">SKU-{item.id.toString().slice(-3).padStart(3, '0')}</span></TableCell>
                <TableCell><span className="font-mono">₹{item.price.toLocaleString()}</span></TableCell>
                <TableCell>{Math.floor(Math.random() * 50)}</TableCell>
                <TableCell>
                  <Chip size="sm" variant="flat" color="success" className="font-medium text-[10px] tracking-widest uppercase py-0 h-5">
                    Active
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2 text-[--c-secondary]">
                    <button className="p-2 hover:text-[--c-primary] transition-colors"><Icon icon="lucide:edit-3" className="w-4 h-4" /></button>
                    <button className="p-2 hover:text-[--c-danger] transition-colors"><Icon icon="lucide:trash-2" className="w-4 h-4" /></button>
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
