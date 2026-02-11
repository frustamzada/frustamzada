import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      <Header />

      <div className="flex flex-1">
        {/* Sidebar - hidden on mobile */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Sidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 w-full pb-20 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>

      <Footer />

      {/* Mobile bottom nav - fixed on mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <MobileNav />
      </div>
    </div>
  );
}
