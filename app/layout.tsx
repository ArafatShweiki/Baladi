import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navigation = [
  { href: "/", label: "Home" },
  { href: "/cities", label: "Cities" },
  { href: "/places", label: "Places" },
  { href: "/issues", label: "Issues" },
  { href: "/report", label: "Report" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
];

export const metadata: Metadata = {
  title: {
    default: "Baladi",
    template: "%s | Baladi",
  },
  description:
    "Baladi is a future community issue-reporting platform for Palestine.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="border-b border-border bg-background">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <Link
              href="/"
              className="w-fit text-xl font-semibold tracking-tight text-primary"
            >
              Baladi
            </Link>

            <nav aria-label="Main navigation">
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="rounded-sm text-foreground underline-offset-4 hover:text-primary hover:underline"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
          {children}
        </main>

        <footer className="border-t border-border">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 text-sm text-muted sm:px-6">
            Baladi foundation project. More functionality will be added in future
            development phases.
          </div>
        </footer>
      </body>
    </html>
  );
}
