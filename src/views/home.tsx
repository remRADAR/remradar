import { LiquidGlassFooter } from "@/components/site/liquid-glass-footer";
import { FramerMainView } from "@/components/site/framer-main-view";
import { WelcomeGate } from "@/components/site/welcome-gate";
import { getNativeComponentReplacement } from "@/lib/native-content";
import { getManagedRadarNavigation } from "@/lib/wordpress";

/**
 * The imported Framer homepage is the primary site view. The Next shell owns
 * the global background layer and the replacement footer only.
 */
export const HomeView = async () => {
  const [navigation, replacement] = await Promise.all([
    getManagedRadarNavigation(),
    getNativeComponentReplacement(),
  ]);

  return (
    <main className="relative min-h-lvh overflow-x-clip bg-transparent text-foreground">
      <WelcomeGate />
      <div aria-hidden="true" className="radar-background pointer-events-none fixed inset-0 -z-10" />
      <FramerMainView replacement={replacement} />
      <LiquidGlassFooter navigation={navigation} />
    </main>
  );
};
