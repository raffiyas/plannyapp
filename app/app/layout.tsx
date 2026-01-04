import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import { StoreProvider } from '@/lib/store';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <StoreProvider>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </StoreProvider>
    </AuthGuard>
  );
}
