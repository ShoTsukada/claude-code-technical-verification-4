import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <main
        id="main-content"
        className="flex-1 desktop:ml-60 px-4 py-8 desktop:px-6"
      >
        {children}
      </main>
    </div>
  );
}
