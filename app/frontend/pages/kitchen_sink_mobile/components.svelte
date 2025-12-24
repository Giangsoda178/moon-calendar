<script lang="ts">
  import AppBar from "@/components/ui/mobile/AppBar.svelte"
  import BottomNav from "@/components/ui/mobile/BottomNav.svelte"
  import MobileLayout from "@/components/ui/mobile/MobileLayout.svelte"
  import { kitchenSinkMobileIndexPath } from "@/routes"

  import AppBarSection from "./sections/AppBarSection.svelte"
  import BottomNavSection from "./sections/BottomNavSection.svelte"
  import BottomSheetSection from "./sections/BottomSheetSection.svelte"
  import PullToRefreshSection from "./sections/PullToRefreshSection.svelte"
  import SafeAreaSection from "./sections/SafeAreaSection.svelte"
  import DeviceFrame from "./shared/DeviceFrame.svelte"
  import { navItems } from "./shared/nav-items"

  // Jump links for quick navigation
  const sections = [
    { id: "safe-area", label: "Safe Area" },
    { id: "app-bar", label: "App Bar" },
    { id: "bottom-nav", label: "Bottom Nav" },
    { id: "bottom-sheet", label: "Bottom Sheet" },
    { id: "pull-to-refresh", label: "Pull to Refresh" },
  ]

  function scrollToSection(id: string) {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }
</script>

<DeviceFrame>
  <MobileLayout>
    {#snippet header()}
      <AppBar
        title="Components"
        backHref={kitchenSinkMobileIndexPath()}
        titleAlign="center"
      />
    {/snippet}

    <div class="flex flex-col pb-20">
      <!-- Jump Links -->
      <div
        class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 border-b backdrop-blur"
      >
        <div class="scrollbar-hide flex gap-2 overflow-x-auto p-3">
          {#each sections as section (section.id)}
            <button
              type="button"
              class="bg-card hover:bg-accent shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors"
              onclick={() => scrollToSection(section.id)}
            >
              {section.label}
            </button>
          {/each}
        </div>
      </div>

      <!-- Info Banner -->
      <div class="bg-muted/30 border-b px-4 py-3">
        <p class="text-muted-foreground text-xs">
          Technical showcase of all mobile components. Each component follows
          Basecoat styling patterns with proper accessibility and touch
          interactions.
        </p>
      </div>

      <!-- Sections -->
      <div class="flex flex-col gap-6 p-4">
        <SafeAreaSection />
        <AppBarSection />
        <BottomNavSection />
        <BottomSheetSection />
        <PullToRefreshSection />
      </div>

      <!-- Footer Info -->
      <div class="border-t px-4 py-6 text-center">
        <p class="text-muted-foreground text-xs">
          All components support dark mode, RTL, and reduced motion preferences.
        </p>
      </div>
    </div>

    {#snippet footer()}
      <BottomNav items={navItems} />
    {/snippet}
  </MobileLayout>
</DeviceFrame>

<style>
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
</style>
