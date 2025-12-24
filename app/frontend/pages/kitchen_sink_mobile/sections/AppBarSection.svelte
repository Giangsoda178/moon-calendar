<script lang="ts">
  import { Bell, Share } from "@lucide/svelte"

  import AppBar from "@/components/ui/mobile/AppBar.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"
</script>

<Section id="app-bar" title="App Bar">
  <div class="flex flex-col gap-4">
    <p class="text-muted-foreground text-sm">
      Top navigation bar with back button, title, and action buttons.
    </p>

    <div class="flex flex-col gap-3">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        Basic
      </div>
      <div class="overflow-hidden rounded border">
        <AppBar title="Page Title" backHref="#" />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        With Subtitle
      </div>
      <div class="overflow-hidden rounded border">
        <AppBar title="John Doe" subtitle="Online" backHref="#" />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        With Actions
      </div>
      <div class="overflow-hidden rounded border">
        <AppBar title="Profile" backHref="#">
          {#snippet actions()}
            <button
              class="hover:bg-accent flex size-10 items-center justify-center rounded-full"
            >
              <Share class="size-5" />
            </button>
            <button
              class="hover:bg-accent flex size-10 items-center justify-center rounded-full"
            >
              <Bell class="size-5" />
            </button>
          {/snippet}
        </AppBar>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        Center Title
      </div>
      <div class="overflow-hidden rounded border">
        <AppBar title="Settings" backHref="#" titleAlign="center" />
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        Transparent
      </div>
      <div class="bg-muted overflow-hidden rounded border">
        <AppBar title="Gallery" transparent />
      </div>
    </div>
  </div>
</Section>
