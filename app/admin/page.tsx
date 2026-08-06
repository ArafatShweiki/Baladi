import Link from "next/link";

export default function AdminPage() {
  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">
        Organization manager dashboard
      </h1>
      <p className="leading-7 text-muted">
        Tools for responsible organizations to review and manage issues will be
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
