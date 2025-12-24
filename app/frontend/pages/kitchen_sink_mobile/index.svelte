<script lang="ts">
  import {
    Bell,
    FlaskConical,
    House,
    LayoutGrid,
    Moon,
    Rss,
    Settings,
    Smartphone,
    Sun,
    User,
  } from "@lucide/svelte"

  import AppBar from "@/components/ui/mobile/AppBar.svelte"
  import BottomNav from "@/components/ui/mobile/BottomNav.svelte"
  import MobileLayout from "@/components/ui/mobile/MobileLayout.svelte"
  import SettingsItem from "@/components/ui/mobile/SettingsItem.svelte"
  import SettingsSection from "@/components/ui/mobile/SettingsSection.svelte"
  import {
    kitchenSinkMobileComponentsPath,
    kitchenSinkMobileFeedPath,
    kitchenSinkMobileProfilePath,
    kitchenSinkMobileSettingsPath,
    kitchenSinkPath,
    rootPath,
  } from "@/routes"
  import { useAppearance } from "@/runes/use-appearance.svelte"
  import { inertiaAction } from "@/utils"

  import DeviceFrame from "./shared/DeviceFrame.svelte"
  import { navItems } from "./shared/nav-items"

  const appearance = useAppearance()

  // Demo pages for the mobile kitchen sink
  const demoPages = [
    {
      title: "Settings",
      description: "AppBar, lists, toggles",
      icon: Settings,
      href: kitchenSinkMobileSettingsPath(),
    },
    {
      title: "Profile",
      description: "Avatar, cards, forms",
      icon: User,
      href: kitchenSinkMobileProfilePath(),
    },
    {
      title: "Feed",
      description: "PullToRefresh, cards",
      icon: Rss,
      href: kitchenSinkMobileFeedPath(),
    },
    {
      title: "Components",
      description: "Technical showcase",
      icon: LayoutGrid,
      href: kitchenSinkMobileComponentsPath(),
    },
  ]
</script>

{#snippet appBarActions()}
  <button
    type="button"
    class="text-foreground hover:bg-accent inline-flex size-10 items-center justify-center rounded-md transition-colors"
    aria-label="Toggle theme"
    onclick={() =>
      appearance.update(appearance.value === "dark" ? "light" : "dark")}
  >
    {#if appearance.value === "dark"}
      <Sun class="size-5" />
    {:else}
      <Moon class="size-5" />
    {/if}
  </button>
  <button
    type="button"
    class="text-foreground hover:bg-accent relative inline-flex size-10 items-center justify-center rounded-md transition-colors"
    aria-label="Notifications"
  >
    <Bell class="size-5" />
    <span
      class="bg-primary text-primary-foreground absolute top-1 right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-medium"
      >3</span
    >
  </button>
{/snippet}

<DeviceFrame>
  <MobileLayout>
    {#snippet header()}
      <AppBar title="Mobile Demo" hideBack actions={appBarActions} />
    {/snippet}

    <div class="flex flex-col gap-6 p-4">
      <!-- Hero Section -->
      <div class="text-center">
        <div
          class="bg-muted text-muted-foreground mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl"
        >
          <Smartphone class="size-8" />
        </div>
        <h1 class="text-xl font-bold tracking-tight">Mobile Components</h1>
        <p class="text-muted-foreground mt-1 text-sm">
          Explore mobile UI patterns in realistic contexts
        </p>
      </div>

      <!-- Demo Pages Grid -->
      <div class="grid grid-cols-2 gap-3">
        {#each demoPages as page (page.title)}
          <a
            href={page.href}
            use:inertiaAction
            class="group bg-card flex flex-col gap-3 rounded-xl border p-4 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
          >
            <div
              class="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-xl"
            >
              <page.icon class="size-6" />
            </div>
            <div>
              <h2 class="leading-none font-semibold">{page.title}</h2>
              <p class="text-muted-foreground mt-1 text-xs">
                {page.description}
              </p>
            </div>
          </a>
        {/each}
      </div>

      <!-- Quick Links Section -->
      <SettingsSection title="Quick Links">
        <SettingsItem
          icon={FlaskConical}
          label="Desktop Kitchen Sink"
          action="chevron"
          href={kitchenSinkPath()}
        />
        <div class="border-t"></div>
        <SettingsItem
          icon={House}
          label="Home"
          action="chevron"
          href={rootPath()}
        />
      </SettingsSection>

      <!-- Info Card -->
      <div class="bg-muted/30 rounded-xl border p-4">
        <p class="text-muted-foreground text-sm">
          These demo pages showcase mobile components in realistic app contexts.
          Each page demonstrates how components work together to create cohesive
          mobile experiences.
        </p>
      </div>
    </div>

    {#snippet footer()}
      <BottomNav items={navItems} />
    {/snippet}
  </MobileLayout>
</DeviceFrame>
