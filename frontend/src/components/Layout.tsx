import { Header } from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-grayscale-100">
      <Header />
      <main className="mx-auto p-12">{children}</main>
    </div>
  );
}
