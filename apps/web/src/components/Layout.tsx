import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
  maxWidth?: string;
}

export default function Layout({ children, maxWidth = "1024px" }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-secondary">
      <Header />
      <main className="flex justify-center p-4 md:p-6 lg:p-8">
        <div style={{ maxWidth }} className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
