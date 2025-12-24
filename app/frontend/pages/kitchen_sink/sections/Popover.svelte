<script lang="ts">
  import Button from "@/components/ui/Button.svelte"
  import Popover from "@/components/ui/Popover.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Popover.svelte?raw"

  let width = $state("100%")
  let maxWidth = $state("300px")
  let height = $state("25px")
  let maxHeight = $state("none")
</script>

<Section id="popover" title="Popover" code={rawCode}>
  <!-- Default popover with form -->
  <div class="flex min-w-0 flex-wrap gap-4">
    <Popover id="demo-popover" popoverClass="w-80">
      {#snippet trigger()}
        Open popover
      {/snippet}

      <div class="grid gap-4">
        <header class="grid gap-1.5">
          <h4 class="leading-none font-medium">Dimensions</h4>
          <p class="text-muted-foreground text-sm">
            Set the dimensions for the layer.
          </p>
        </header>
        <form class="form grid gap-2">
          <div class="grid grid-cols-3 items-center gap-4">
            <label for="demo-popover-width">Width</label>
            <input
              type="text"
              id="demo-popover-width"
              bind:value={width}
              class="col-span-2 h-8"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <label for="demo-popover-max-width">Max. width</label>
            <input
              type="text"
              id="demo-popover-max-width"
              bind:value={maxWidth}
              class="col-span-2 h-8"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <label for="demo-popover-height">Height</label>
            <input
              type="text"
              id="demo-popover-height"
              bind:value={height}
              class="col-span-2 h-8"
            />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <label for="demo-popover-max-height">Max. height</label>
            <input
              type="text"
              id="demo-popover-max-height"
              bind:value={maxHeight}
              class="col-span-2 h-8"
            />
          </div>
        </form>
      </div>
    </Popover>
  </div>

  <!-- Position variants -->
  <p class="text-muted-foreground mt-6 mb-2 text-sm">Position Variants:</p>
  <div class="flex min-w-0 flex-wrap gap-4">
    <Popover id="popover-bottom" side="bottom">
      {#snippet trigger()}
        Bottom (default)
      {/snippet}
      <p class="text-sm">Popover positioned at the bottom.</p>
      <Button variant="outline" class="mt-2 w-full">Action</Button>
    </Popover>

    <Popover id="popover-top" side="top">
      {#snippet trigger()}
        Top
      {/snippet}
      <p class="text-sm">Popover positioned at the top.</p>
      <Button variant="outline" class="mt-2 w-full">Action</Button>
    </Popover>

    <Popover id="popover-left" side="left">
      {#snippet trigger()}
        Left
      {/snippet}
      <p class="text-sm">Popover positioned at the left.</p>
      <Button variant="outline" class="mt-2 w-full">Action</Button>
    </Popover>

    <Popover id="popover-right" side="right">
      {#snippet trigger()}
        Right
      {/snippet}
      <p class="text-sm">Popover positioned at the right.</p>
      <Button variant="outline" class="mt-2 w-full">Action</Button>
    </Popover>
  </div>

  <!-- Alignment variants -->
  <p class="text-muted-foreground mt-6 mb-2 text-sm">Alignment Variants:</p>
  <div class="flex min-w-0 flex-wrap gap-4">
    <Popover id="popover-start" align="start">
      {#snippet trigger()}
        Align Start (default)
      {/snippet}
      <p class="text-sm">Aligned to the start edge.</p>
      <Button variant="outline" class="mt-2 w-full">Action</Button>
    </Popover>

    <Popover id="popover-center" align="center">
      {#snippet trigger()}
        Align Center
      {/snippet}
      <p class="text-sm">Aligned to the center.</p>
      <Button variant="outline" class="mt-2 w-full">Action</Button>
    </Popover>

    <Popover id="popover-end" align="end">
      {#snippet trigger()}
        Align End
      {/snippet}
      <p class="text-sm">Aligned to the end edge.</p>
      <Button variant="outline" class="mt-2 w-full">Action</Button>
    </Popover>
  </div>
</Section>
