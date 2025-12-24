<script lang="ts">
  import Button from "@/components/ui/Button.svelte"
  import BottomSheet from "@/components/ui/mobile/BottomSheet.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  let basicOpen = $state(false)
  let titledOpen = $state(false)
</script>

<Section id="bottom-sheet" title="Bottom Sheet">
  <div class="flex flex-col gap-4">
    <p class="text-muted-foreground text-sm">
      Slide-up modal with drag-to-dismiss. Swipe down on the handle to close.
    </p>

    <div class="flex gap-2">
      <Button size="sm" onclick={() => (basicOpen = true)}>Basic Sheet</Button>
      <Button size="sm" variant="outline" onclick={() => (titledOpen = true)}
        >With Title</Button
      >
    </div>

    <BottomSheet bind:open={basicOpen}>
      <div class="p-4">
        <p class="font-medium">Basic Bottom Sheet</p>
        <p class="text-muted-foreground mt-2 text-sm">
          Drag down on the handle above to dismiss, or tap the backdrop.
        </p>
        <div class="mt-4 flex gap-2">
          <Button size="sm" onclick={() => (basicOpen = false)}>Close</Button>
        </div>
      </div>
    </BottomSheet>

    <BottomSheet bind:open={titledOpen} title="Select an Option">
      <div class="flex flex-col p-2">
        <button
          class="hover:bg-muted rounded-lg p-3 text-left"
          onclick={() => (titledOpen = false)}
        >
          Option 1
        </button>
        <button
          class="hover:bg-muted rounded-lg p-3 text-left"
          onclick={() => (titledOpen = false)}
        >
          Option 2
        </button>
        <button
          class="hover:bg-muted rounded-lg p-3 text-left"
          onclick={() => (titledOpen = false)}
        >
          Option 3
        </button>
        <button
          class="hover:bg-muted text-destructive rounded-lg p-3 text-left"
          onclick={() => (titledOpen = false)}
        >
          Cancel
        </button>
      </div>
    </BottomSheet>
  </div>
</Section>
