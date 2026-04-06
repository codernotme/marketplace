import { AccountSidebar } from '@/components/account/AccountSidebar';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { PageWrapper } from '@/components/shared/PageWrapper';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <PageWrapper>
        <div className="py-8 md:py-10 min-h-[70vh]">
          <div className="grid grid-cols-1 lg:grid-cols-[18rem_1fr] gap-6 lg:gap-8 items-start">
            <AccountSidebar />
            <section>{children}</section>
          </div>
        </div>
      </PageWrapper>
    </AuthGuard>
  );
}
