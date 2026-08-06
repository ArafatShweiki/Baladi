import Link from "next/link";

export default function ReportPage() {
  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Report an issue</h1>
      <p className="leading-7 text-muted">
        A way to submit local infrastructure and community problems will be
        added in a future development phase.
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
