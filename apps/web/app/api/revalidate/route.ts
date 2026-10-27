import { revalidatePath } from "next/cache";

// Chiamato da manage.thoadd.com dopo "Pubblica": rigenera subito tutte le pagine, in entrambe le lingue.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Non autorizzato", { status: 401 });
  }
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  return Response.json({ revalidated: true });
}
