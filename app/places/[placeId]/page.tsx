import Link from "next/link";

type PlacePageProps = {
  params: Promise<{ placeId: string }>;
};

export default async function PlacePage({ params }: PlacePageProps) {
  const { placeId } = await params;

  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Place: {placeId}</h1>
      <p className="leading-7 text-muted">
        Details and related community issues for this place will be added in a
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
