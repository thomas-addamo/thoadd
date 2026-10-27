import { eq, getDb, profile } from "@thoadd/db";
import { Fields, Notice, SaveButton } from "@/components/fields";
import { PageTitle } from "@/components/page-title";
import { profileFields } from "@/lib/sections";
import { saveProfile } from "../actions";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ ok?: string; errore?: string }> }) {
  const { ok, errore } = await searchParams;
  const [me] = await getDb().select().from(profile).where(eq(profile.id, 1));

  return (
    <>
      <PageTitle title="Profilo" note="Nome, presentazione e dati dell'hero e della sezione Profilo." />
      <Notice ok={ok} error={errore} />
      <form action={saveProfile} className="rounded-[var(--radius-sheet)] bg-cloud p-6 shadow-[var(--shadow-sheet)] md:p-10">
        <Fields fields={profileFields} values={me ?? {}} idPrefix="profilo" />
        <div className="mt-8 flex justify-end">
          <SaveButton>Salva il profilo</SaveButton>
        </div>
      </form>
    </>
  );
}
