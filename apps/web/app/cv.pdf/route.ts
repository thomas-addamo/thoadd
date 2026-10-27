import { serveCv } from "@/lib/serve-cv";

export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return serveCv(request, "it");
}
