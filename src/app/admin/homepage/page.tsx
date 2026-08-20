import { HomepageEditor } from "@/components/admin/homepage-editor";
import { getHomepageComponents } from "@/lib/native-content";

export default async function HomepageAdminPage() {
  const components = await getHomepageComponents();
  return <HomepageEditor initialComponents={components} />;
}
