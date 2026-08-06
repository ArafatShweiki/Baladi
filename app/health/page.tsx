import { connection } from "next/server";

import { getHealthData } from "@/lib/health";

export default async function HealthPage() {
  await connection();
  const health = getHealthData();

  return (
    <section className="max-w-2xl space-y-6" aria-labelledby="health-heading">
      <h1 id="health-heading" className="text-3xl font-bold tracking-tight">
        Health Check
      </h1>
      <dl className="divide-y divide-border rounded-radius border border-border">
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium">Status</dt>
          <dd>{health.status}</dd>
        </div>
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium">Application name</dt>
          <dd>{health.app}</dd>
        </div>
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium">Version</dt>
          <dd>{health.version}</dd>
        </div>
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium">Message</dt>
          <dd>{health.message}</dd>
        </div>
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-3 sm:gap-4">
          <dt className="font-medium">Timestamp</dt>
          <dd>
            <time dateTime={health.timestamp}>{health.timestamp}</time>
          </dd>
        </div>
      </dl>
    </section>
  );
}
