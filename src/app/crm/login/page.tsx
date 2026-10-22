import { redirect } from "next/navigation";
import { getSession } from "@/lib/crm/auth";
import CrmLogin from "@/components/crm/CrmLogin";

export default async function CrmLoginPage() {
  const session = await getSession();
  if (session) redirect("/crm");

  return <CrmLogin />;
}
