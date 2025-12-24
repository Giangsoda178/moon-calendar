<script lang="ts">
  import SafeArea from "@/components/ui/mobile/SafeArea.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"
</script>

<Section id="safe-area" title="Safe Area">
  <div class="flex flex-col gap-4">
    <p class="text-muted-foreground text-sm">
      Safe area utilities protect content from device notches and home
      indicators.
    </p>

    <div class="flex flex-col gap-2">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        CSS Variables
      </div>
      <code class="bg-muted block rounded p-2 text-xs">
        --safe-area-top: env(safe-area-inset-top)<br />
        --safe-area-bottom: env(safe-area-inset-bottom)
      </code>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        Utility Classes
      </div>
      <div class="flex flex-wrap gap-2">
        <code class="bg-muted rounded px-2 py-1 text-xs">pt-safe</code>
        <code class="bg-muted rounded px-2 py-1 text-xs">pb-safe</code>
        <code class="bg-muted rounded px-2 py-1 text-xs">p-safe</code>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        SafeArea Component
      </div>
      <SafeArea top bottom class="bg-muted rounded p-3">
        <p class="text-sm">Content with safe area padding</p>
      </SafeArea>
    </div>
  </div>
</Section>
