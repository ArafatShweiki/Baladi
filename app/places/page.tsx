import Link from "next/link";

export default function PlacesPage() {
  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Places</h1>
      <p className="leading-7 text-muted">
        This page will list municipalities, universities, and other responsible
        institutions in a future development phase.
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
