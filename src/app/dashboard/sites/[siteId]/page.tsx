import { redirect } from "next/navigation";

export default async function SiteOverviewPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  redirect(`/dashboard/sites/${siteId}/settings`);
}
