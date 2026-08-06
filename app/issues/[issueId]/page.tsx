import Link from "next/link";

type IssuePageProps = {
  params: Promise<{ issueId: string }>;
};

export default async function IssuePage({ params }: IssuePageProps) {
  const { issueId } = await params;

  return (
    <section className="max-w-3xl space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Issue: {issueId}</h1>
      <p className="leading-7 text-muted">
        Details and progress for this community issue will be added in a future
        development phase.
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
