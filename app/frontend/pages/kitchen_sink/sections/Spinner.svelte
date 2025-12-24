<script lang="ts">
  import Button from "@/components/ui/Button.svelte"
  import Spinner from "@/components/ui/Spinner.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Spinner.svelte?raw"
</script>

<Section id="spinner" title="Spinner" code={rawCode}>
  <div class="flex min-w-0 flex-col gap-6">
    <!-- Size variants -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Size Variants:</p>
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center gap-2">
          <Spinner size="sm" />
          <span class="text-muted-foreground text-xs">sm</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner size="md" />
          <span class="text-muted-foreground text-xs">md</span>
        </div>
        <div class="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <span class="text-muted-foreground text-xs">lg</span>
        </div>
      </div>
    </div>

    <!-- Color variants -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        Color Variants (via class):
      </p>
      <div class="flex items-center gap-6">
        <Spinner class="text-primary" />
        <Spinner class="text-destructive" />
        <Spinner class="text-green-500" />
        <Spinner class="text-muted-foreground" />
      </div>
    </div>

    <!-- In buttons -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">In Buttons:</p>
      <div class="flex flex-wrap items-center gap-4">
        <Button disabled>
          <Spinner size="sm" />
          Loading...
        </Button>
        <Button variant="outline" disabled>
          <Spinner size="sm" />
          Please wait
        </Button>
        <Button variant="secondary" disabled>
          <Spinner size="sm" />
          Processing
        </Button>
      </div>
    </div>

    <!-- In badges -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">In Badges:</p>
      <div class="flex flex-wrap items-center gap-4">
        <span class="badge">
          <Spinner size="sm" />
          Syncing
        </span>
        <span class="badge-secondary">
          <Spinner size="sm" />
          Updating
        </span>
        <span class="badge-outline">
          <Spinner size="sm" />
          Processing
        </span>
      </div>
    </div>
  </div>
</Section>
