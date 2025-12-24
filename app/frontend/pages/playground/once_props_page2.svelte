<script lang="ts">
  import { Deferred } from "@inertiajs/svelte"
  import {
    ArrowLeft,
    Check,
    Clock,
    Globe,
    Loader,
    Shield,
    Zap,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import { playgroundOncePropsPath } from "@/routes"
  import type { CountriesData, HeavyData, PlansData } from "@/types/playground"

  type Props = {
    timestamp: string
    countries?: CountriesData
    plans?: PlansData
    available_permissions?: string[]
    heavy_data?: HeavyData
  }

  let {
    timestamp,
    countries,
    plans,
    available_permissions,
    heavy_data,
  }: Props = $props()
</script>

<PlaygroundLayout
  title="Once Props - Page 2"
  description="Demonstrating cache persistence across page navigation"
>
  <!-- Navigate Back (Primary CTA) -->
  <Card class="border-primary/50 bg-primary/5">
    {#snippet header()}
      <div class="flex items-center gap-2">
        <ArrowLeft class="size-5" />
        <h2>Navigate Back</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Go back to Page 1 — timestamps should still match (cache preserved).
    </p>

    <Button href={playgroundOncePropsPath()}>
      <ArrowLeft />
      Back to Page 1
    </Button>
  </Card>

  <!-- Key Point -->
  <Card
    class="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
  >
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Check class="size-5 text-green-600 dark:text-green-400" />
        <h2 class="text-green-900 dark:text-green-100">Cache Preserved!</h2>
      </div>
    {/snippet}

    <p class="text-sm text-green-800 dark:text-green-200">
      Compare the <strong>generated_at</strong> timestamps below with Page 1. If they
      match, the data came from cache (no server computation).
    </p>
  </Card>

  <!-- Timestamps comparison -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Clock class="size-5" />
        <h2>Timestamps</h2>
      </div>
    {/snippet}

    <div class="grid gap-4 sm:grid-cols-2">
      <div
        class="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
      >
        <div class="text-xs font-medium text-amber-700 dark:text-amber-400">
          Regular Prop (always fresh)
        </div>
        <p class="mt-2 font-mono text-lg font-bold">{timestamp}</p>
        <p class="text-muted-foreground text-xs">Changes on every navigation</p>
      </div>

      {#if plans}
        <div
          class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30"
        >
          <div class="text-xs font-medium text-green-700 dark:text-green-400">
            Once Prop (plans.generated_at)
          </div>
          <p class="mt-2 font-mono text-lg font-bold">
            {new Date(plans.generated_at).toLocaleTimeString()}
          </p>
          <p class="text-muted-foreground text-xs">
            Should match Page 1 (cached)
          </p>
        </div>
      {/if}
    </div>
  </Card>

  <!-- Countries (cached) -->
  {#if countries}
    <Card>
      {#snippet header()}
        <div class="flex items-center gap-2">
          <Globe class="size-5" />
          <h2>Countries (cached from Page 1)</h2>
        </div>
      {/snippet}

      <p class="text-muted-foreground mb-3 text-xs">
        Loaded: {new Date(countries.generated_at).toLocaleTimeString()} — should match
        Page 1
      </p>

      <div class="flex flex-wrap gap-2">
        {#each countries.items as country (country.code)}
          <div class="bg-muted/50 flex items-center gap-2 rounded-lg px-3 py-2">
            <span class="text-lg">{country.flag}</span>
            <span class="text-sm">{country.name}</span>
          </div>
        {/each}
      </div>
    </Card>
  {/if}

  <!-- Permissions with Custom Key -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Shield class="size-5" />
        <h2>Permissions (shared key: "user_permissions")</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Page 1 uses <code class="bg-muted rounded px-1">permissions:</code>, Page
      2 uses <code class="bg-muted rounded px-1">available_permissions:</code>
      — same <code class="bg-muted rounded px-1">key</code>, same cached data.
    </p>

    {#if available_permissions}
      <div class="flex flex-wrap gap-2">
        {#each available_permissions as permission (permission)}
          <span
            class="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm"
          >
            {permission.replace(/_/g, " ")}
          </span>
        {/each}
      </div>
    {/if}
  </Card>

  <!-- Deferred + Once -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Zap class="size-5" />
        <h2>Deferred + Once (Experimental)</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-3 text-xs">
      Shows cached value initially, then refreshes via deferred request.
    </p>

    <Deferred data="heavy_data">
      <svelte:fragment slot="fallback">
        <div class="flex items-center gap-2 text-sm text-amber-600">
          <Loader class="size-4 animate-spin" />
          Loading deferred data...
        </div>
      </svelte:fragment>

      {#if heavy_data}
        <div
          class="flex items-center gap-2 rounded-lg bg-blue-100 p-3 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
        >
          <Clock class="size-4" />
          <span>
            Computed at <code
              class="rounded bg-blue-200 px-1 font-mono dark:bg-blue-900/50"
              >{new Date(heavy_data.generated_at).toLocaleTimeString()}</code
            >
          </span>
        </div>
      {/if}
    </Deferred>
  </Card>
</PlaygroundLayout>
