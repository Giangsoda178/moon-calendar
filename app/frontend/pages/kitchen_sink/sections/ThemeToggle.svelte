<script lang="ts">
  import ThemeToggle from "@/components/ui/ThemeToggle.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./ThemeToggle.svelte?raw"
</script>

<Section id="theme" title="Theme Toggle" code={rawCode}>
  <div class="flex flex-col gap-6">
    <!-- Default: Mode toggle only -->
    <div class="flex flex-col gap-2">
      <p class="text-muted-foreground text-sm">Mode toggle only (default):</p>
      <ThemeToggle tooltipAlign="start" />
    </div>

    <!-- With variant selector -->
    <div class="flex flex-col gap-2">
      <p class="text-muted-foreground text-sm">With variant selector:</p>
      <ThemeToggle showVariants />
    </div>

    <!-- Variant selector only -->
    <div class="flex flex-col gap-2">
      <p class="text-muted-foreground text-sm">Variant selector only:</p>
      <ThemeToggle showMode={false} showVariants />
    </div>
  </div>
</Section>
