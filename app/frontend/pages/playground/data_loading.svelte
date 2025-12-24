<script lang="ts">
  import { Deferred, WhenVisible, router } from "@inertiajs/svelte"
  import {
    BarChart3,
    Clock,
    DollarSign,
    FileText,
    Loader,
    RefreshCw,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import Skeleton from "@/components/ui/Skeleton.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import { playgroundDataLoadingPath } from "@/routes"

  type Stats = {
    users: number
    revenue: number
    orders: number
    conversion_rate: number
  }

  type ReportItem = {
    id: number
    name: string
    value: number
    trend: "up" | "down" | "stable"
    change: number
  }

  type ChartDataPoint = {
    day: string
    value: number
    previous: number
  }

  type Props = {
    stats: Stats
    timestamp: string
    expensive_report?: ReportItem[]
    chart_data?: ChartDataPoint[]
  }

  let { stats, timestamp, expensive_report, chart_data }: Props = $props()

  let reloadingStats = $state(false)

  function reloadStats() {
    reloadingStats = true
    router.reload({
      only: ["stats", "timestamp"],
      onFinish: () => {
        reloadingStats = false
      },
    })
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value)
  }
</script>

<PlaygroundLayout
  title="Data Loading Patterns"
  description="Partial Reloads, Deferred Props, Load When Visible"
>
  <!-- Feature 1: Partial Reloads -->
  <Card>
    {#snippet header()}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <RefreshCw class="size-5" />
          <h2>Partial Reloads</h2>
        </div>
        <Button
          onclick={reloadStats}
          variant="outline"
          size="sm"
          loading={reloadingStats}
        >
          <RefreshCw class={reloadingStats ? "animate-spin" : ""} />
          Reload Stats Only
        </Button>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Uses <code class="bg-muted rounded px-1"
        >router.reload(&#123; only: ['stats', 'timestamp'] &#125;)</code
      > to refresh specific props without a full page reload.
    </p>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <Users class="text-muted-foreground size-4" />
          <span class="text-muted-foreground text-sm">Users</span>
        </div>
        <p class="mt-1 text-2xl font-bold">{stats.users}</p>
      </div>
      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <DollarSign class="text-muted-foreground size-4" />
          <span class="text-muted-foreground text-sm">Revenue</span>
        </div>
        <p class="mt-1 text-2xl font-bold">{formatCurrency(stats.revenue)}</p>
      </div>
      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <ShoppingCart class="text-muted-foreground size-4" />
          <span class="text-muted-foreground text-sm">Orders</span>
        </div>
        <p class="mt-1 text-2xl font-bold">{stats.orders}</p>
      </div>
      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <TrendingUp class="text-muted-foreground size-4" />
          <span class="text-muted-foreground text-sm">Conversion</span>
        </div>
        <p class="mt-1 text-2xl font-bold">{stats.conversion_rate}%</p>
      </div>
    </div>

    <p class="text-muted-foreground mt-3 flex items-center gap-1 text-xs">
      <Clock class="size-3" />
      Last updated: {timestamp}
    </p>
  </Card>

  <!-- Feature 2: Deferred Props -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <FileText class="size-5" />
        <h2>Deferred Props</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Uses <code class="bg-muted rounded px-1">InertiaRails.defer</code> to lazy-load
      expensive data after initial render. The report below loads ~1.5 seconds after
      the page.
    </p>

    <Deferred data="expensive_report">
      <svelte:fragment slot="fallback">
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm text-amber-600">
            <Loader class="size-4 animate-spin" />
            Loading expensive report...
          </div>
          {#each [1, 2, 3, 4, 5] as _row (_row)}
            <div class="flex items-center gap-4">
              <Skeleton class="h-4 w-24" />
              <Skeleton class="h-4 w-32" />
              <Skeleton class="h-4 w-16" />
            </div>
          {/each}
        </div>
      </svelte:fragment>

      <div class="space-y-2">
        {#if expensive_report}
          {#each expensive_report as item (item.id)}
            <div
              class="bg-muted/30 flex items-center justify-between rounded-lg p-3"
            >
              <div class="flex items-center gap-3">
                <span class="text-muted-foreground font-mono text-sm"
                  >#{item.id}</span
                >
                <span class="font-medium">{item.name}</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-mono">{formatCurrency(item.value)}</span>
                <span
                  class="flex items-center gap-1 text-sm {item.change > 0
                    ? 'text-green-600'
                    : item.change < 0
                      ? 'text-red-600'
                      : 'text-muted-foreground'}"
                >
                  {#if item.trend === "up"}
                    <TrendingUp class="size-4" />
                  {:else if item.trend === "down"}
                    <TrendingDown class="size-4" />
                  {/if}
                  {item.change > 0 ? "+" : ""}{item.change}%
                </span>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </Deferred>
  </Card>

  <!-- Spacer for scroll testing - 60vh ensures user must scroll -->
  <div
    class="bg-muted/50 flex h-[60vh] flex-col items-center justify-center gap-4 rounded-lg border border-dashed"
  >
    <p class="text-muted-foreground text-sm">
      ↓ Scroll down to trigger "Load When Visible" ↓
    </p>
    <div
      class="text-muted-foreground/70 max-w-md space-y-2 text-center text-xs"
    >
      <p><strong>How to test:</strong></p>
      <ol class="list-inside list-decimal text-left">
        <li>Open DevTools → Network tab</li>
        <li>Filter by "Fetch/XHR"</li>
        <li>Scroll down until the chart card enters the viewport</li>
        <li>Watch for a new request to this page URL</li>
        <li>
          Click request → Headers → look for <code class="bg-muted rounded px-1"
            >X-Inertia-Partial-Data: chart_data</code
          >
        </li>
        <li>The chart will appear after the request completes</li>
      </ol>
    </div>
  </div>

  <!-- Feature 3: Load When Visible -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <BarChart3 class="size-5" />
        <h2>Load When Visible</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Uses <code class="bg-muted rounded px-1">InertiaRails.optional</code> +
      <code class="bg-muted rounded px-1">WhenVisible</code> component to load data
      only when the element enters the viewport.
    </p>

    <WhenVisible data="chart_data" buffer={100}>
      <div
        slot="fallback"
        class="flex flex-col items-center justify-center py-8"
      >
        <Loader class="text-muted-foreground size-8 animate-spin" />
        <p class="text-muted-foreground mt-2 text-sm">Loading chart data...</p>
        <p class="text-muted-foreground/60 mt-1 text-xs">
          (Waiting for element to enter viewport)
        </p>
      </div>

      <div class="space-y-4">
        <p class="flex items-center gap-2 text-sm text-green-600">
          <span class="size-2 rounded-full bg-green-500"></span>
          Chart data loaded!
        </p>
        {#if chart_data}
          <div
            class="flex items-end justify-between gap-2"
            style="height: 200px;"
          >
            {#each chart_data as point (point.day)}
              <div class="flex flex-1 flex-col items-center gap-1">
                <div class="relative w-full">
                  <div
                    class="bg-primary/20 absolute bottom-0 w-full rounded-t transition-all"
                    style="height: {point.previous / 5}px;"
                  ></div>
                  <div
                    class="bg-primary relative w-full rounded-t transition-all"
                    style="height: {point.value / 5}px;"
                  ></div>
                </div>
                <span class="text-muted-foreground text-xs">{point.day}</span>
              </div>
            {/each}
          </div>
          <div class="flex items-center justify-center gap-4 text-xs">
            <span class="flex items-center gap-1">
              <span class="bg-primary size-3 rounded"></span> Current
            </span>
            <span class="flex items-center gap-1">
              <span class="bg-primary/20 size-3 rounded"></span> Previous
            </span>
          </div>
        {/if}
      </div>
    </WhenVisible>
  </Card>

  <!-- Full Page Reload Button -->
  <div class="flex justify-end">
    <Button href={playgroundDataLoadingPath()} variant="ghost">
      <RefreshCw />
      Full Page Reload
    </Button>
  </div>
</PlaygroundLayout>
