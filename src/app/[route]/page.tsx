import { FramerRouteView } from "@/views/framer-route";

export default async function Page({ params }: { params: Promise<{ route: string }> }) {
  const { route } = await params;
  return <FramerRouteView route={route} />;
}
