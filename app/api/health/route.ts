import { getHealthData } from "@/lib/health";

export function GET() {
  return Response.json(getHealthData(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
