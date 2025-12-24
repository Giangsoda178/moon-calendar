<script lang="ts">
  import PullToRefresh from "@/components/ui/mobile/PullToRefresh.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  let items = $state(["Item 1", "Item 2", "Item 3"])
  let refreshCount = $state(0)

  async function handleRefresh() {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    refreshCount++
    items = [...items, `Item ${items.length + 1}`]
  }
</script>

<Section id="pull-to-refresh" title="Pull to Refresh">
  <div class="flex flex-col gap-4">
    <p class="text-muted-foreground text-sm">
      Pull down at the top of scrollable content to trigger refresh. (Works best
      on touch devices)
    </p>

    <div class="text-muted-foreground text-xs">
      Refreshed {refreshCount} time{refreshCount !== 1 ? "s" : ""}
    </div>

    <div class="h-48 overflow-hidden rounded border">
      <PullToRefresh onrefresh={handleRefresh}>
        <div class="flex flex-col gap-2 p-3">
          {#each items as item (item)}
            <div class="bg-muted/50 rounded p-3 text-sm">
              {item}
            </div>
          {/each}
        </div>
      </PullToRefresh>
    </div>

    <p class="text-muted-foreground text-xs">
      Pull down from the top of the list above to add a new item.
    </p>
  </div>
</Section>
