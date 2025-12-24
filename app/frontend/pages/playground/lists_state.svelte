<script lang="ts">
  import { InfiniteScroll, router, useRemember } from "@inertiajs/svelte"
  import {
    Bell,
    Check,
    ChevronDown,
    Clock,
    Filter,
    Hourglass,
    Loader,
    Plus,
    ScrollText,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import { playgroundListsStatePath } from "@/routes"

  type Item = {
    id: number
    title: string
    description: string
    status: "active" | "completed" | "pending"
    created_at: string
  }

  type Notification = {
    id: string
    message: string
    type: "info" | "success" | "warning"
    time: string
  }

  type Props = {
    items: Item[]
    notifications: Notification[]
    available_filters: string[]
    available_sorts: string[]
  }

  let { items, notifications, available_filters, available_sorts }: Props =
    $props()

  // Remember state - persists across navigation (uses Svelte writable store)
  const filterState = useRemember(
    { filter: "all", sort: "newest" },
    "lists-state-filter",
  )

  // Filtered items based on remembered state
  let filteredItems = $derived(
    items.filter((item) => {
      if ($filterState.filter === "all") return true
      return item.status === $filterState.filter
    }),
  )

  // Loading notification state
  let loadingNotification = $state(false)

  function updateFilter(filter: string) {
    $filterState.filter = filter
  }

  function updateSort(sort: string) {
    $filterState.sort = sort
  }

  function loadMoreNotifications() {
    loadingNotification = true
    // Reload the page to get a new notification (merged with existing)
    router.reload({
      only: ["notifications"],
      onFinish: () => {
        loadingNotification = false
      },
    })
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "completed":
        return Check
      case "pending":
        return Hourglass
      default:
        return Clock
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed":
        return "text-green-500 bg-green-500/10"
      case "pending":
        return "text-yellow-500 bg-yellow-500/10"
      default:
        return "text-blue-500 bg-blue-500/10"
    }
  }

  function getNotificationColor(type: string) {
    switch (type) {
      case "success":
        return "border-green-500/50 bg-green-500/10"
      case "warning":
        return "border-yellow-500/50 bg-yellow-500/10"
      default:
        return "border-blue-500/50 bg-blue-500/10"
    }
  }

  function formatTime(isoString: string) {
    return new Date(isoString).toLocaleTimeString()
  }
</script>

<PlaygroundLayout
  title="Lists & State"
  description="Infinite Scroll, Merging Props, Remembering State"
>
  <!-- Feature 1: Remembering State -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Filter class="size-5" />
        <h2>Remembering State</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Uses <code class="bg-muted rounded px-1">useRemember()</code> hook to persist
      state in browser history.
    </p>
    <div class="bg-muted/50 mb-4 rounded-lg p-3 text-sm">
      <p class="mb-2 font-medium">How to test:</p>
      <ol class="text-muted-foreground list-inside list-decimal space-y-1">
        <li>Select a filter below (e.g., "completed")</li>
        <li>Click "Back to Playground" button at the bottom</li>
        <li>
          Press browser <kbd
            class="bg-background rounded border px-1.5 py-0.5 text-xs">←</kbd
          > back button
        </li>
        <li>Your filter selection will be restored!</li>
      </ol>
    </div>

    <div class="flex flex-wrap gap-4">
      <div>
        <span class="text-muted-foreground mb-1 block text-sm">Filter</span>
        <div class="flex gap-1">
          {#each available_filters as filter (filter)}
            <button
              onclick={() => updateFilter(filter)}
              class="rounded px-3 py-1.5 text-sm capitalize transition-colors {$filterState.filter ===
              filter
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'}"
            >
              {filter}
            </button>
          {/each}
        </div>
      </div>

      <div>
        <span class="text-muted-foreground mb-1 block text-sm">Sort</span>
        <div class="flex gap-1">
          {#each available_sorts as sort (sort)}
            <button
              onclick={() => updateSort(sort)}
              class="rounded px-3 py-1.5 text-sm capitalize transition-colors {$filterState.sort ===
              sort
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'}"
            >
              {sort}
            </button>
          {/each}
        </div>
      </div>
    </div>

    <p class="text-muted-foreground mt-3 text-xs">
      Current state: filter="{$filterState.filter}", sort="{$filterState.sort}"
    </p>
  </Card>

  <!-- Feature 2: Merging Props -->
  <Card>
    {#snippet header()}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Bell class="size-5" />
          <h2>Merging Props</h2>
          <span
            class="bg-primary text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-xs"
          >
            {notifications.length}
          </span>
        </div>
        <Button
          onclick={loadMoreNotifications}
          variant="outline"
          size="sm"
          loading={loadingNotification}
        >
          <Plus />
          Add Notification
        </Button>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Uses <code class="bg-muted rounded px-1">InertiaRails.merge()</code> to append
      new notifications without replacing existing ones. Each click adds a new notification
      to the list.
    </p>

    <div class="max-h-48 space-y-2 overflow-y-auto">
      {#each notifications as notification (notification.id)}
        <div
          class="rounded-lg border p-3 {getNotificationColor(
            notification.type,
          )}"
        >
          <div class="flex items-start justify-between gap-2">
            <p class="text-sm">{notification.message}</p>
            <span class="text-muted-foreground shrink-0 text-xs">
              {formatTime(notification.time)}
            </span>
          </div>
        </div>
      {/each}
    </div>
  </Card>

  <!-- Feature 3: Infinite Scroll -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <ScrollText class="size-5" />
        <h2>Infinite Scroll</h2>
        <span class="text-muted-foreground ml-2 text-sm">
          ({filteredItems.length} items shown)
        </span>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Uses <code class="bg-muted rounded px-1">InertiaRails.scroll(pagy)</code>
      with <code class="bg-muted rounded px-1">InfiniteScroll</code> component and
      Pagy v43+ pagination.
    </p>

    <div class="max-h-96 overflow-y-auto rounded-lg border">
      <InfiniteScroll data="items" as="div" class="divide-y">
        {#each filteredItems as item (item.id)}
          {@const StatusIcon = getStatusIcon(item.status)}
          <div class="flex items-center gap-4 p-4">
            <div class="rounded-full p-2 {getStatusColor(item.status)}">
              <StatusIcon class="size-4" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground font-mono text-xs">
                  #{item.id}
                </span>
                <h4 class="truncate font-medium">{item.title}</h4>
              </div>
              <p class="text-muted-foreground truncate text-sm">
                {item.description}
              </p>
            </div>
            <span
              class="rounded px-2 py-1 text-xs capitalize {getStatusColor(
                item.status,
              )}"
            >
              {item.status}
            </span>
          </div>
        {/each}

        <svelte:fragment slot="next" let:loading let:hasMore let:fetch>
          {#if loading}
            <div class="flex items-center justify-center gap-2 p-4">
              <Loader class="size-4 animate-spin" />
              <span class="text-muted-foreground text-sm">Loading more...</span>
            </div>
          {:else if hasMore}
            <button
              onclick={() => fetch()}
              class="text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-2 p-4 transition-colors"
            >
              <ChevronDown class="size-4" />
              <span class="text-sm">Load more items</span>
            </button>
          {:else}
            <div class="text-muted-foreground p-4 text-center text-sm">
              No more items to load
            </div>
          {/if}
        </svelte:fragment>
      </InfiniteScroll>
    </div>
  </Card>

  <!-- Reset Button -->
  <div class="flex justify-end">
    <Button href={playgroundListsStatePath()} variant="ghost">
      Reset (Full Page Load)
    </Button>
  </div>
</PlaygroundLayout>
