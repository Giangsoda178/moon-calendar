<!--
  @component PullToRefresh
  Pull-down-to-refresh wrapper for scrollable content.
  Follows Basecoat styling with consistent colors and animations.

  @example Basic usage
  ```svelte
  <script lang="ts">
    let items = $state([...])

    async function handleRefresh() {
      const newItems = await fetchItems()
      items = newItems
    }
  </script>

  <PullToRefresh onrefresh={handleRefresh}>
    <ul>
      {#each items as item}
        <li>{item.name}</li>
      {/each}
    </ul>
  </PullToRefresh>
  ```

  @example With custom threshold
  ```svelte
  <PullToRefresh onrefresh={handleRefresh} threshold={100}>
    <div>Content</div>
  </PullToRefresh>
  ```

  @example In MobileLayout
  ```svelte
  <MobileLayout>
    {#snippet header()}
      <AppBar title="Feed" />
    {/snippet}

    <PullToRefresh onrefresh={refreshFeed}>
      <div class="p-4">
        {#each posts as post}
          <PostCard {post} />
        {/each}
      </div>
    </PullToRefresh>

    {#snippet footer()}
      <BottomNav items={navItems} />
    {/snippet}
  </MobileLayout>
  ```
-->
<script lang="ts">
  import { LoaderCircle, RefreshCw } from "@lucide/svelte"
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Callback when refresh triggered (can be async) */
    onrefresh: () => void | Promise<void>
    /** Pull distance threshold in pixels */
    threshold?: number
    /** Additional CSS classes */
    class?: string
    /** Content to wrap */
    children: Snippet
  }

  let {
    onrefresh,
    threshold = 70,
    class: className,
    children,
  }: Props = $props()

  let scrollEl = $state<HTMLDivElement | null>(null)

  let isDragging = $state(false)
  let startY = $state(0)
  let pullDistance = $state(0)
  let isRefreshing = $state(false)

  // Only allow pull when at scroll top
  let canPull = $derived.by(() => {
    if (!scrollEl) return false
    return scrollEl.scrollTop <= 0
  })

  // Progress towards threshold (0-1)
  let progress = $derived(Math.min(pullDistance / threshold, 1))

  // Should trigger refresh
  let shouldRefresh = $derived(pullDistance >= threshold)

  function handleTouchStart(e: TouchEvent) {
    if (!canPull || isRefreshing) return

    isDragging = true
    startY = e.touches[0].clientY
    pullDistance = 0
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isDragging || !canPull || isRefreshing) return

    const currentY = e.touches[0].clientY
    const diff = currentY - startY

    // Only pull down (positive diff) and apply resistance
    if (diff > 0) {
      // Resistance factor: harder to pull as distance increases
      pullDistance = diff * 0.5

      // Prevent default scroll when pulling
      if (pullDistance > 5) {
        e.preventDefault()
      }
    } else {
      // Reset if scrolling up
      pullDistance = 0
    }
  }

  async function handleTouchEnd() {
    if (!isDragging) return

    isDragging = false

    if (shouldRefresh && !isRefreshing) {
      isRefreshing = true
      pullDistance = threshold // Hold at threshold during refresh

      try {
        await onrefresh()
      } finally {
        isRefreshing = false
        pullDistance = 0
      }
    } else {
      pullDistance = 0
    }
  }

  // Rotation animation for indicator
  let rotation = $derived(progress * 180)
</script>

<div
  class={cn("relative h-full overflow-hidden", className)}
  style="touch-action: pan-y;"
>
  <!-- Pull indicator -->
  <div
    class="absolute inset-x-0 top-0 flex items-center justify-center overflow-hidden"
    style:height="{Math.min(pullDistance, threshold)}px"
    style:opacity={progress}
  >
    <div
      class={cn(
        "bg-background border-border flex size-10 items-center justify-center rounded-full border shadow-md",
        isRefreshing && "text-primary",
      )}
    >
      {#if isRefreshing}
        <LoaderCircle class="size-5 animate-spin" />
      {:else}
        <span
          class="transition-transform"
          style:transform="rotate({rotation}deg)"
        >
          <RefreshCw class="text-muted-foreground size-5" />
        </span>
      {/if}
    </div>
  </div>

  <!-- Scrollable content -->
  <div
    bind:this={scrollEl}
    class="h-full overflow-y-auto overscroll-y-contain"
    style:transform="translateY({pullDistance}px)"
    style:transition={isDragging
      ? "none"
      : "transform 0.2s cubic-bezier(0.32, 0.72, 0, 1)"}
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
  >
    {@render children()}
  </div>
</div>
