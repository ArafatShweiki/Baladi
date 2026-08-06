import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">About Baladi</h1>
      <p className="leading-7 text-muted">
        Baladi is planned as a community platform for reporting infrastructure,
        maintenance, cleanliness, safety, accessibility, water, electricity,
        and technology problems to responsible institutions in Palestine.
      </p>
      <p className="leading-7 text-muted">
        The current project contains only the foundation and placeholder pages.
        Real reporting and management functionality will be implemented in
        later development phases.
      </p>
      <Link
        href="/"
        className="inline-flex rounded-sm font-medium text-primary underline underline-offset-4 hover:no-underline"
      >
        Back to home
      </Link>
    </section>
  );
}
