import { proxy } from '@/lib/proxy';
import { Card, CardBody, Chip, Button } from '@/components/HeroUI';

export default async function UserOrdersPage() {
  const orders = await proxy.user.getOrders('mock-user-id');

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="font-display text-4xl text-[--c-primary] mb-8">Order History</h1>
      
      <div className="space-y-4">
        {orders.map(order => (
          <Card key={order.id} className="bg-white border border-[--c-border] shadow-sm w-full hover:shadow-md transition-shadow">
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] text-[--c-secondary] uppercase tracking-[0.1em] mb-1 font-semibold">Reference</p>
                    <p className="font-mono text-[13px] font-semibold text-[--c-primary]">{order.id}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[--c-secondary] uppercase tracking-[0.1em] mb-1 font-semibold">Ordered On</p>
                    <p className="text-[13px] font-medium text-[--c-primary]">{order.date}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[--c-secondary] uppercase tracking-[0.1em] mb-1 font-semibold">Total Amount</p>
                    <p className="font-mono text-[13px] font-semibold text-[--c-primary]">
                      {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(order.total)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 justify-between md:justify-end w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-[--c-border]">
                  <Chip 
                    variant="flat" 
                    color={order.status === 'Delivered' ? 'success' : 'warning'}
                    size="sm"
                    className="font-medium tracking-wide text-[10px] uppercase h-6"
                  >
                    {order.status}
                  </Chip>
                  <Button variant="bordered" size="sm" className="rounded-full border-[--c-border] text-[--c-primary] hover:border-[--c-primary] font-medium px-5 bg-white">
                    Track Order
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
