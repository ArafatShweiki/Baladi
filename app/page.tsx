import Link from "next/link";

const mainRoutes = [
  { href: "/cities", label: "Browse cities" },
  { href: "/places", label: "Browse places" },
  { href: "/issues", label: "View public issues" },
  { href: "/report", label: "Report an issue" },
  { href: "/dashboard", label: "Open the dashboard" },
  { href: "/about", label: "Learn about Baladi" },
];

export default function HomePage() {
  return (
    <section className="space-y-8" aria-labelledby="home-heading">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Project foundation
        </p>
        <h1
          id="home-heading"
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Baladi / <span lang="ar" dir="rtl">بلدي</span>
        </h1>
        <p className="text-lg leading-8 text-muted">
          Baladi is a future community issue-reporting platform that will help
          people report local problems to municipalities, universities, and
          responsible institutions.
        </p>
        <p className="leading-7">
          This version establishes the project structure and placeholder pages.
          Real reporting and management features will be built in later phases.
        </p>
      </div>

      <nav aria-label="Foundation pages">
        <h2 className="mb-3 text-lg font-semibold">Explore the planned pages</h2>
        <ul className="flex max-w-3xl flex-wrap gap-3">
          {mainRoutes.map((route) => (
            <li key={route.href}>
              <Link
                href={route.href}
                className="inline-flex rounded-radius border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-subtle"
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
