import { FloatingDockFooter } from "@/components/site/floating-dock-footer";
import { FramerMainView } from "@/components/site/framer-main-view";
import { WelcomeGate } from "@/components/site/welcome-gate";
import { getHomepageComponents, getNativeComponentReplacement } from "@/lib/native-content";
import { getManagedRadarNavigation } from "@/lib/wordpress";
import { YouTubePlaylistPlayer } from "@/components/site/youtube-playlist-player";

/**
 * The imported Framer homepage is the primary site view. The Next shell owns
 * the global background layer and the replacement footer only.
 */
export const HomeView = async () => {
  const [navigation, components] = await Promise.all([
    getManagedRadarNavigation(),
    getHomepageComponents(),
  ]);
  const replacement = components.find((component) => component.componentKey === "aktiv-section") ?? await getNativeComponentReplacement();

  return (
    <main className="relative min-h-lvh overflow-x-clip bg-transparent text-foreground">
      <WelcomeGate />
      <FramerMainView replacement={replacement} components={components} />
      <YouTubePlaylistPlayer mode="homepage" />
      <FloatingDockFooter navigation={navigation} />
    </main>
  );
};
