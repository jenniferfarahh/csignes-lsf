import AppNavbar from "./AppNavbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppNavbar />
      <main className="mx-auto max-w-5xl px-4 py-4">{children}</main>
    </div>
  );
}
// This layout renders the navbar on top and the page content below.
