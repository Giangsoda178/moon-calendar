<script lang="ts">
  import { inertia, usePoll } from "@inertiajs/svelte"
  import {
    Activity,
    Clock,
    Compass,
    Cpu,
    ExternalLink,
    HardDrive,
    KeyRound,
    Mail,
    Pause,
    Play,
    Users,
    Zap,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"

  type Dashboard = {
    timestamp: string
    cpu: number
    memory: number
    requests: number
    active_users: number
  }

  type PrefetchTarget = {
    name: string
    path: string
    icon: string
  }

  type Props = {
    dashboard: Dashboard
    prefetch_targets: PrefetchTarget[]
  }

  let { dashboard, prefetch_targets }: Props = $props()

  // Polling hook - auto-refresh every 3 seconds
  const { start, stop } = usePoll(
    3000,
    { only: ["dashboard"] },
    { autoStart: true },
  )

  let isPolling = $state(true)

  function togglePolling() {
    if (isPolling) {
      stop()
    } else {
      start()
    }
    isPolling = !isPolling
  }

  // Icon mapping
  const icons: Record<string, typeof KeyRound> = {
    "key-round": KeyRound,
    mail: Mail,
    compass: Compass,
  }

  function getIcon(iconName: string) {
    return icons[iconName] || Activity
  }

  function getStatusColor(value: number, thresholds: [number, number]) {
    if (value < thresholds[0]) return "text-green-500"
    if (value < thresholds[1]) return "text-yellow-500"
    return "text-red-500"
  }
</script>

<PlaygroundLayout
  title="Real-time & Performance"
  description="Polling, Prefetching"
>
  <!-- Feature 1: Polling -->
  <Card>
    {#snippet header()}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Activity class="size-5" />
          <h2>Polling</h2>
          <span
            class="ml-2 flex items-center gap-1 text-xs {isPolling
              ? 'text-green-500'
              : 'text-muted-foreground'}"
          >
            <span
              class="size-2 rounded-full {isPolling
                ? 'animate-pulse bg-green-500'
                : 'bg-muted-foreground'}"
            ></span>
            {isPolling ? "Live" : "Paused"}
          </span>
        </div>
        <Button onclick={togglePolling} variant="outline" size="sm">
          {#if isPolling}
            <Pause class="size-4" />
            Pause
          {:else}
            <Play class="size-4" />
            Resume
          {/if}
        </Button>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Uses <code class="bg-muted rounded px-1"
        >usePoll(3000, &#123; only: ['dashboard'] &#125;)</code
      > to auto-refresh dashboard metrics every 3 seconds.
    </p>

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Cpu class="text-muted-foreground size-4" />
            <span class="text-muted-foreground text-sm">CPU</span>
          </div>
          <span class={getStatusColor(dashboard.cpu, [50, 80])}>
            {dashboard.cpu}%
          </span>
        </div>
        <div class="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
          <div
            class="h-full rounded-full transition-all duration-500 {dashboard.cpu <
            50
              ? 'bg-green-500'
              : dashboard.cpu < 80
                ? 'bg-yellow-500'
                : 'bg-red-500'}"
            style="width: {dashboard.cpu}%"
          ></div>
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <HardDrive class="text-muted-foreground size-4" />
            <span class="text-muted-foreground text-sm">Memory</span>
          </div>
          <span class={getStatusColor(dashboard.memory, [60, 85])}>
            {dashboard.memory}%
          </span>
        </div>
        <div class="bg-muted mt-2 h-2 w-full overflow-hidden rounded-full">
          <div
            class="h-full rounded-full transition-all duration-500 {dashboard.memory <
            60
              ? 'bg-green-500'
              : dashboard.memory < 85
                ? 'bg-yellow-500'
                : 'bg-red-500'}"
            style="width: {dashboard.memory}%"
          ></div>
        </div>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <Zap class="text-muted-foreground size-4" />
          <span class="text-muted-foreground text-sm">Requests/s</span>
        </div>
        <p class="mt-1 text-2xl font-bold">{dashboard.requests}</p>
      </div>

      <div class="bg-muted/50 rounded-lg p-4">
        <div class="flex items-center gap-2">
          <Users class="text-muted-foreground size-4" />
          <span class="text-muted-foreground text-sm">Active Users</span>
        </div>
        <p class="mt-1 text-2xl font-bold">{dashboard.active_users}</p>
      </div>
    </div>

    <p class="text-muted-foreground mt-3 flex items-center gap-1 text-xs">
      <Clock class="size-3" />
      Last updated: {dashboard.timestamp}
    </p>
  </Card>

  <!-- Feature 2: Prefetching -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <ExternalLink class="size-5" />
        <h2>Prefetching</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Uses <code class="bg-muted rounded px-1"
        >use:inertia=&#123;&#123; prefetch: true &#125;&#125;</code
      > to preload pages on hover. Check the Network tab to see prefetch requests.
    </p>

    <div class="grid gap-3 sm:grid-cols-3">
      {#each prefetch_targets as target (target.path)}
        {@const Icon = getIcon(target.icon)}
        <a
          href={target.path}
          use:inertia={{ prefetch: true }}
          class="bg-muted/50 hover:bg-muted flex items-center gap-3 rounded-lg p-4 transition-colors"
        >
          <div class="bg-primary/10 text-primary rounded-lg p-2">
            <Icon class="size-5" />
          </div>
          <div>
            <p class="font-medium">{target.name}</p>
            <p class="text-muted-foreground text-xs">Hover to prefetch</p>
          </div>
        </a>
      {/each}
    </div>

    <div class="bg-muted/30 mt-4 rounded-lg p-4">
      <h4 class="mb-2 text-sm font-medium">How Prefetching Works</h4>
      <ul class="text-muted-foreground space-y-1 text-sm">
        <li>1. Hover over a link to trigger a background request</li>
        <li>2. The response is cached in memory</li>
        <li>
          3. Clicking the link uses the cached response (instant navigation)
        </li>
        <li>4. Open DevTools Network tab to see prefetch requests</li>
      </ul>
    </div>
  </Card>
</PlaygroundLayout>
