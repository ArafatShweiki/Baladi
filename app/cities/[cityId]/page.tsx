import Link from "next/link";

type CityPageProps = {
  params: Promise<{ cityId: string }>;
};

export default async function CityPage({ params }: CityPageProps) {
  const { cityId } = await params;

  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">City: {cityId}</h1>
      <p className="leading-7 text-muted">
        Information and community issues for this city will be added in a
        future development phase.
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
