<script lang="ts">
  import { Deferred, router } from "@inertiajs/svelte"
  import {
    ArrowRight,
    Check,
    Clock,
    Loader,
    RefreshCw,
    Shield,
    Zap,
  } from "@lucide/svelte"
  import { SvelteDate } from "svelte/reactivity"

  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import Skeleton from "@/components/ui/Skeleton.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import {
    playgroundOncePropsPage2Path,
    playgroundOncePropsPath,
  } from "@/routes"
  import type { CountriesData, HeavyData, PlansData } from "@/types/playground"

  type Props = {
    timestamp: string
    request_count: number
    countries?: CountriesData
    plans?: PlansData
    permissions?: string[]
    heavy_data?: HeavyData
  }

  let {
    timestamp,
    request_count,
    countries,
    plans,
    permissions,
    heavy_data,
  }: Props = $props()

  let refreshingPlans = $state(false)
  let now = new SvelteDate()

  // Update current time every second for countdown calculation
  $effect(() => {
    const interval = setInterval(() => {
      now.setTime(Date.now())
    }, 1000)
    return () => clearInterval(interval)
  })

  // Calculate remaining seconds from server timestamp
  let secondsRemaining = $derived.by(() => {
    if (!plans?.generated_at) return 0
    const elapsed =
      (now.getTime() - new Date(plans.generated_at).getTime()) / 1000
    return Math.max(0, 30 - Math.floor(elapsed))
  })

  function refreshPlans() {
    refreshingPlans = true
    router.reload({
      only: ["plans"],
      onFinish: () => {
        refreshingPlans = false
      },
    })
  }
</script>

<PlaygroundLayout
  title="Once Props"
  description="Client-side cached props that persist across navigations"
>
  <!-- Test Navigation (Primary CTA) -->
  <Card class="border-primary/50 bg-primary/5">
    {#snippet header()}
      <div class="flex items-center gap-2">
        <ArrowRight class="size-5" />
        <h2>Test Navigation</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Navigate to Page 2 and back. Watch the timestamps — they should stay the
      same (cached).
    </p>

    <div class="flex flex-wrap gap-3">
      <Button href={playgroundOncePropsPage2Path()}>
        <ArrowRight />
        Go to Page 2
      </Button>
      <a href={playgroundOncePropsPath()} data-inertia="false">
        <Button variant="outline">Hard Reload (clears cache)</Button>
      </a>
    </div>
  </Card>

  <!-- Request Counter -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <RefreshCw class="size-5" />
        <h2>Regular Props vs Once Props</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Navigate to Page 2 and back. Regular props update; once props stay cached.
    </p>

    <div class="grid gap-4 sm:grid-cols-2">
      <div
        class="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
      >
        <div class="text-xs font-medium text-amber-700 dark:text-amber-400">
          Regular Prop (changes each navigation)
        </div>
        <div class="mt-2 flex items-baseline gap-3">
          <span class="text-3xl font-bold">{request_count}</span>
          <span class="text-muted-foreground text-sm">requests</span>
        </div>
        <p class="text-muted-foreground mt-1 flex items-center gap-1 text-xs">
          <Clock class="size-3" />
          Server: {timestamp}
        </p>
      </div>

      <div
        class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30"
      >
        <div
          class="flex items-center gap-2 text-xs font-medium text-green-700 dark:text-green-400"
        >
          <span class="relative flex size-2">
            <span
              class="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"
            ></span>
            <span class="relative inline-flex size-2 rounded-full bg-green-500"
            ></span>
          </span>
          Once Prop (cached)
        </div>
        <div class="mt-2 flex items-baseline gap-3">
          <span class="text-3xl font-bold">{countries?.items?.length || 0}</span
          >
          <span class="text-muted-foreground text-sm">countries</span>
        </div>
        <p class="text-muted-foreground mt-1 text-xs">
          Loaded: {countries?.generated_at
            ? new Date(countries.generated_at).toLocaleTimeString()
            : "—"}
        </p>
      </div>
    </div>
  </Card>

  <!-- Plans with Expiration -->
  <Card>
    {#snippet header()}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Clock class="size-5" />
          <h2>Once Prop with Expiration (30s TTL)</h2>
        </div>
        <Button
          onclick={refreshPlans}
          variant="outline"
          size="sm"
          loading={refreshingPlans}
        >
          {#if !refreshingPlans}
            <RefreshCw />
          {/if}
          Force Refresh
        </Button>
      </div>
    {/snippet}

    <div class="mb-4 space-y-2">
      <p class="text-muted-foreground text-sm">
        <code class="bg-muted rounded px-1"
          >InertiaRails.once(expires_in: 30.seconds)</code
        >
      </p>
    </div>

    {#if plans}
      <!-- Server timestamp and countdown -->
      <div class="grid gap-3 sm:grid-cols-2">
        <div
          class="rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/30"
        >
          <div class="flex items-center gap-2">
            <Clock class="size-4 text-blue-600" />
            <span class="text-sm font-medium text-blue-800 dark:text-blue-200"
              >Generated at</span
            >
          </div>
          <p class="mt-1 font-mono text-lg font-bold">
            {new Date(plans.generated_at).toLocaleTimeString()}
          </p>
          <p class="text-muted-foreground text-xs">Stays same when cached</p>
        </div>

        <div
          class="rounded-lg border p-3 {secondsRemaining > 0
            ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30'
            : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30'}"
        >
          <div class="flex items-center gap-2">
            <Clock
              class="size-4 {secondsRemaining > 0
                ? 'text-green-600'
                : 'text-red-600'}"
            />
            <span
              class="text-sm font-medium {secondsRemaining > 0
                ? 'text-green-800 dark:text-green-200'
                : 'text-red-800 dark:text-red-200'}"
            >
              {secondsRemaining > 0 ? "Cache Valid" : "Cache Expired"}
            </span>
          </div>
          <p class="mt-1 font-mono text-lg font-bold">
            {#if secondsRemaining > 0}
              {secondsRemaining}s remaining
            {:else}
              Expired
            {/if}
          </p>
          <p class="text-muted-foreground text-xs">
            {secondsRemaining > 0
              ? "Refresh after expiry"
              : "Next nav fetches fresh"}
          </p>
        </div>
      </div>
    {:else}
      <p class="text-muted-foreground text-sm">Loading...</p>
    {/if}
  </Card>

  <!-- Permissions with Custom Key -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Shield class="size-5" />
        <h2>Custom Key: Shared Across Pages</h2>
      </div>
    {/snippet}

    <div class="mb-4 space-y-2">
      <p class="text-muted-foreground text-sm">
        <code class="bg-muted rounded px-1"
          >InertiaRails.once(key: "user_permissions")</code
        >
      </p>
      <div
        class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-900 dark:bg-blue-950/30"
      >
        <p class="font-medium text-blue-800 dark:text-blue-200">
          Page 1: <code class="rounded bg-blue-100 px-1 dark:bg-blue-900/50"
            >permissions:</code
          >
          • Page 2:
          <code class="rounded bg-blue-100 px-1 dark:bg-blue-900/50"
            >available_permissions:</code
          >
          — same
          <code class="rounded bg-blue-100 px-1 dark:bg-blue-900/50"
            >key: "user_permissions"</code
          >
        </p>
      </div>
    </div>

    {#if permissions}
      <div class="flex flex-wrap gap-2">
        {#each permissions as permission (permission)}
          <span
            class="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
          >
            {permission.replace(/_/g, " ")}
          </span>
        {/each}
      </div>
    {:else}
      <p class="text-muted-foreground text-sm">Loading permissions...</p>
    {/if}
  </Card>

  <!-- Deferred + Once Combined -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Zap class="size-5" />
        <h2>Deferred + Once (Experimental)</h2>
      </div>
    {/snippet}

    <div class="mb-4 space-y-2">
      <p class="text-muted-foreground text-sm">
        <code class="bg-muted rounded px-1">InertiaRails.defer(once: true)</code
        >
      </p>
      <div
        class="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs dark:border-amber-900 dark:bg-amber-950/30"
      >
        <p class="font-medium text-amber-800 dark:text-amber-200">
          ⚠️ Current behavior: Deferred props fetch on every navigation, then
          update cache.
        </p>
        <p class="text-muted-foreground mt-1">
          Initial render shows cached value (if any), then deferred request
          fetches fresh data.
        </p>
      </div>
    </div>

    <Deferred data="heavy_data">
      <svelte:fragment slot="fallback">
        <div class="space-y-3">
          <div class="flex items-center gap-2 text-sm text-amber-600">
            <Loader class="size-4 animate-spin" />
            Computing...
          </div>
          {#each [1, 2, 3, 4, 5] as _ (_)}
            <Skeleton class="h-4 w-full" />
          {/each}
        </div>
      </svelte:fragment>

      {#if heavy_data}
        <div class="space-y-4">
          <div
            class="flex items-center gap-2 rounded-lg bg-green-100 p-3 text-sm text-green-800 dark:bg-green-900/30 dark:text-green-200"
          >
            <Check class="size-4" />
            <span>
              Computed at <code
                class="rounded bg-green-200 px-1 font-mono dark:bg-green-900/50"
                >{new Date(heavy_data.generated_at).toLocaleTimeString()}</code
              >
              — {heavy_data.summary}
            </span>
          </div>

          <div class="grid gap-2 sm:grid-cols-5">
            {#each heavy_data.metrics as metric (metric.id)}
              <div class="bg-muted/50 rounded-lg p-3 text-center">
                <p class="text-2xl font-bold">{metric.value}</p>
                <p class="text-muted-foreground text-xs">{metric.unit}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}
    </Deferred>
  </Card>
</PlaygroundLayout>
