import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import { safeCrmReturnPath } from "@/lib/crm/returnPath";
import CrmLogin from "@/components/crm/CrmLogin";

interface CrmLoginPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CrmLoginPage({
  searchParams,
}: CrmLoginPageProps) {
  // Set when a notification email deep-linked to a lead but the session had
  // expired. Sanitised here so the form can only ever bounce back into /crm.
  const next = safeCrmReturnPath((await searchParams).next);

  const session = await getSession();
  if (session) redirect(next);

  return <CrmLogin next={next} />;
}
