import { redirect } from "next/navigation";
import { getSession } from "@/lib/server/get-session";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  return <>{children}</>;
}