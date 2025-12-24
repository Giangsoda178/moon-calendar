<script lang="ts">
  import { router, useRemember } from "@inertiajs/svelte"
  import {
    AlertTriangle,
    ArrowRight,
    Check,
    Clock,
    Database,
    RefreshCw,
    RotateCcw,
    Save,
    ScrollText,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import Input from "@/components/ui/Input.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import { playgroundNavigationDemoPath } from "@/routes"

  type Props = {
    server_timestamp: string
    random_number: number
  }

  let { server_timestamp, random_number }: Props = $props()

  // Track navigation states
  let isReloading = $state(false)
  let isPartialReloading = $state(false)

  // Local state - will be preserved with preserveState
  let localCounter = $state(0)
  let textInput = $state("")

  // useRemember - persists state across browser history navigation
  // This survives back/forward button clicks
  const rememberedState = useRemember({ counter: 0, notes: "" }, "nav-demo")

  // Manual reload with router.reload()
  function handleReload() {
    isReloading = true
    router.reload({
      onFinish: () => {
        isReloading = false
      },
    })
  }

  // Partial reload - only refresh specific props
  function handlePartialReload() {
    isPartialReloading = true
    router.reload({
      only: ["server_timestamp"],
      onFinish: () => {
        isPartialReloading = false
      },
    })
  }
</script>

<PlaygroundLayout
  title="Navigation Demo"
  description="Demonstrates preserveScroll, preserveState, useRemember, and partial reloads"
>
  <!-- Navigation Options (Primary CTA) -->
  <Card class="border-primary/50 bg-primary/5">
    {#snippet header()}
      <div class="flex items-center gap-2">
        <ArrowRight class="size-5" />
        <h2>Test Navigation</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Try different navigation options and observe what gets preserved vs reset.
    </p>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Button href={playgroundNavigationDemoPath()}>
        <ArrowRight />
        Default
      </Button>
      <Button
        href={playgroundNavigationDemoPath()}
        preserveScroll
        variant="outline"
      >
        <ScrollText />
        preserveScroll
      </Button>
      <Button
        href={playgroundNavigationDemoPath()}
        preserveState
        variant="secondary"
      >
        <Save />
        preserveState
      </Button>
      <Button
        href={playgroundNavigationDemoPath()}
        preserveScroll
        preserveState
        variant="outline"
      >
        <Check />
        Both
      </Button>
    </div>
  </Card>

  <!-- How to Test Instructions -->
  <Card
    class="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
  >
    {#snippet header()}
      <div class="flex items-center gap-2">
        <AlertTriangle class="size-5 text-amber-600" />
        <h2 class="text-amber-900 dark:text-amber-100">How to Test</h2>
      </div>
    {/snippet}

    <ol
      class="list-decimal space-y-1 pl-5 text-xs text-amber-800 dark:text-amber-200"
    >
      <li>
        Increment the <strong>Local Counter</strong> and type in the input below
      </li>
      <li>Scroll down to see the spacer area</li>
      <li>Click <strong>Default</strong> → counter resets, scrolls to top</li>
      <li>
        Click <strong>preserveScroll</strong> → stays scrolled, counter resets
      </li>
      <li>
        Click <strong>preserveState</strong> → counter preserved, scrolls to top
      </li>
      <li>
        Click <strong>Both</strong> → counter preserved AND stays scrolled
      </li>
      <li>
        <strong>useRemember</strong> survives browser back/forward (try navigating
        away and back)
      </li>
    </ol>
  </Card>

  <!-- Server Props -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Database class="size-5" />
        <h2>Server Props (from Rails)</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Server props are <strong>always freshly fetched</strong> on every
      navigation.
      <code class="bg-muted rounded px-1">preserveState</code> only preserves client-side
      state, not server data.
    </p>

    <div class="grid gap-4 sm:grid-cols-2">
      <div
        class="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
      >
        <div class="text-xs font-medium text-amber-700 dark:text-amber-400">
          Server Timestamp
        </div>
        <p class="mt-2 font-mono text-lg font-bold">{server_timestamp}</p>
        <p class="text-muted-foreground text-xs">
          Always changes (server-generated)
        </p>
      </div>
      <div
        class="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30"
      >
        <div class="text-xs font-medium text-amber-700 dark:text-amber-400">
          Random Number
        </div>
        <p class="mt-2 font-mono text-lg font-bold">{random_number}</p>
        <p class="text-muted-foreground text-xs">
          Always changes (server-generated)
        </p>
      </div>
    </div>
  </Card>

  <!-- Local State ($state) -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <RefreshCw class="size-5" />
        <h2>Local State (Svelte $state)</h2>
      </div>
    {/snippet}

    <div class="mb-4 space-y-2">
      <p class="text-muted-foreground text-sm">
        <code class="bg-muted rounded px-1">let counter = $state(0)</code>
      </p>
      <div
        class="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs dark:border-blue-900 dark:bg-blue-950/30"
      >
        <p class="font-medium text-blue-800 dark:text-blue-200">
          Resets on navigation <strong>unless</strong> using preserveState
        </p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
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
          Local Counter
        </div>
        <div class="mt-2 flex items-baseline gap-3">
          <span class="text-3xl font-bold">{localCounter}</span>
          <span class="text-muted-foreground text-sm">clicks</span>
        </div>
        <div class="mt-3 flex gap-2">
          <Button
            onclick={() => (localCounter += 1)}
            variant="outline"
            size="sm"
          >
            +1
          </Button>
          <Button onclick={() => (localCounter = 0)} variant="ghost" size="sm">
            <RotateCcw class="size-3" />
            Reset
          </Button>
        </div>
      </div>

      <div>
        <div class="text-muted-foreground mb-2 text-xs font-medium">
          Text Input
        </div>
        <Input
          bind:value={textInput}
          placeholder="Type something..."
          class="mb-2"
        />
        {#if textInput}
          <p class="text-muted-foreground text-xs">
            You typed: "<span class="text-foreground font-medium"
              >{textInput}</span
            >"
          </p>
        {:else}
          <p class="text-muted-foreground text-xs">
            Type something and navigate to test preservation
          </p>
        {/if}
      </div>
    </div>
  </Card>

  <!-- useRemember State -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Save class="size-5" />
        <h2>useRemember (History State)</h2>
      </div>
    {/snippet}

    <div class="mb-4 space-y-2">
      <p class="text-muted-foreground text-sm">
        <code class="bg-muted rounded px-1"
          >useRemember(&#123; counter: 0 &#125;, "key")</code
        >
      </p>
      <div
        class="rounded-lg border border-purple-200 bg-purple-50 p-3 text-xs dark:border-purple-900 dark:bg-purple-950/30"
      >
        <p class="font-medium text-purple-800 dark:text-purple-200">
          Survives browser back/forward navigation! Try: navigate away, then
          press back button.
        </p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div
        class="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-900 dark:bg-purple-950/30"
      >
        <div
          class="flex items-center gap-2 text-xs font-medium text-purple-700 dark:text-purple-400"
        >
          <span class="relative flex size-2">
            <span
              class="absolute inline-flex size-full animate-ping rounded-full bg-purple-400 opacity-75"
            ></span>
            <span class="relative inline-flex size-2 rounded-full bg-purple-500"
            ></span>
          </span>
          Remembered Counter
        </div>
        <div class="mt-2 flex items-baseline gap-3">
          <span class="text-3xl font-bold">{$rememberedState.counter}</span>
          <span class="text-muted-foreground text-sm">clicks</span>
        </div>
        <div class="mt-3 flex gap-2">
          <Button
            onclick={() => ($rememberedState.counter += 1)}
            variant="outline"
            size="sm"
          >
            +1
          </Button>
          <Button
            onclick={() => ($rememberedState.counter = 0)}
            variant="ghost"
            size="sm"
          >
            <RotateCcw class="size-3" />
            Reset
          </Button>
        </div>
      </div>

      <div>
        <div class="text-muted-foreground mb-2 text-xs font-medium">
          Remembered Notes
        </div>
        <Input
          bind:value={$rememberedState.notes}
          placeholder="Notes persist across history..."
          class="mb-2"
        />
        {#if $rememberedState.notes}
          <p class="text-xs text-purple-600 dark:text-purple-400">
            This will persist when you navigate away and back!
          </p>
        {:else}
          <p class="text-muted-foreground text-xs">
            Type notes, navigate away, then press back button
          </p>
        {/if}
      </div>
    </div>
  </Card>

  <!-- Spacer for scroll testing -->
  <div
    class="bg-muted/50 flex h-48 items-center justify-center rounded-lg border border-dashed"
  >
    <div class="text-center">
      <ScrollText class="text-muted-foreground mx-auto size-8" />
      <p class="text-muted-foreground mt-2 text-sm">
        Scroll spacer — scroll past this to test preserveScroll
      </p>
    </div>
  </div>

  <!-- Navigation after scroll (for testing preserveScroll) -->
  <Card class="border-primary/50 bg-primary/5">
    {#snippet header()}
      <div class="flex items-center gap-2">
        <ScrollText class="size-5" />
        <h2>Test Navigation (After Scroll)</h2>
      </div>
    {/snippet}

    <!-- Inline state display -->
    <div class="mb-4 grid gap-3 sm:grid-cols-3">
      <div class="bg-background/50 rounded-lg border p-3">
        <div class="text-muted-foreground text-xs">Server Timestamp</div>
        <p class="font-mono text-sm font-bold">{server_timestamp}</p>
      </div>
      <div class="bg-background/50 rounded-lg border p-3">
        <div class="text-muted-foreground text-xs">Random Number</div>
        <p class="font-mono text-sm font-bold">{random_number}</p>
      </div>
      <div
        class="rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/30"
      >
        <div class="text-xs text-green-700 dark:text-green-400">
          Local Counter
        </div>
        <p class="font-mono text-sm font-bold">{localCounter}</p>
      </div>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Button href={playgroundNavigationDemoPath()}>
        <ArrowRight />
        Default
      </Button>
      <Button
        href={playgroundNavigationDemoPath()}
        preserveScroll
        variant="outline"
      >
        <ScrollText />
        preserveScroll
      </Button>
      <Button
        href={playgroundNavigationDemoPath()}
        preserveState
        variant="secondary"
      >
        <Save />
        preserveState
      </Button>
      <Button
        href={playgroundNavigationDemoPath()}
        preserveScroll
        preserveState
        variant="outline"
      >
        <Check />
        Both
      </Button>
    </div>

    <p class="text-muted-foreground mt-3 text-xs">
      Server props always refresh. Local Counter only preserved with <code
        class="bg-muted rounded px-1">preserveState</code
      >.
    </p>
  </Card>

  <!-- router.reload() Demo -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <RefreshCw class="size-5" />
        <h2>router.reload() Method</h2>
      </div>
    {/snippet}

    <div class="mb-4 space-y-2">
      <p class="text-muted-foreground text-sm">
        <code class="bg-muted rounded px-1"
          >router.reload(&#123; preserveState: true, preserveScroll: true
          &#125;)</code
        >
      </p>
      <div
        class="rounded-lg border border-green-200 bg-green-50 p-3 text-xs dark:border-green-900 dark:bg-green-950/30"
      >
        <p class="font-medium text-green-800 dark:text-green-200">
          <Check class="mr-1 inline size-3" />
          <code>reload()</code> automatically sets preserveState and preserveScroll
          to true
        </p>
      </div>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <div>
        <p class="text-muted-foreground mb-2 text-sm font-medium">
          Full Reload
        </p>
        <Button onclick={handleReload} variant="outline" loading={isReloading}>
          {#if !isReloading}
            <RefreshCw />
          {/if}
          router.reload()
        </Button>
        <p class="text-muted-foreground mt-1 text-xs">
          Refreshes all props, keeps scroll & state
        </p>
      </div>

      <div>
        <p class="text-muted-foreground mb-2 text-sm font-medium">
          Partial Reload
        </p>
        <Button
          onclick={handlePartialReload}
          variant="secondary"
          loading={isPartialReloading}
        >
          {#if !isPartialReloading}
            <Clock />
          {/if}
          only: ["server_timestamp"]
        </Button>
        <p class="text-muted-foreground mt-1 text-xs">
          Only refreshes timestamp, not random_number
        </p>
      </div>
    </div>
  </Card>

  <!-- Key Takeaways -->
  <Card
    class="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30"
  >
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Check class="size-5 text-green-600 dark:text-green-400" />
        <h2 class="text-green-900 dark:text-green-100">Key Takeaways</h2>
      </div>
    {/snippet}

    <div
      class="grid gap-4 text-sm text-green-800 sm:grid-cols-2 dark:text-green-200"
    >
      <div>
        <p class="mb-1 font-semibold">preserveState</p>
        <p class="text-xs">
          Keeps <strong>client-side</strong> state ($state vars) — server props still
          refresh
        </p>
      </div>
      <div>
        <p class="mb-1 font-semibold">preserveScroll</p>
        <p class="text-xs">
          Maintains scroll position instead of jumping to top
        </p>
      </div>
      <div>
        <p class="mb-1 font-semibold">useRemember</p>
        <p class="text-xs">
          Persists state in browser history — survives back/forward navigation
        </p>
      </div>
      <div>
        <p class="mb-1 font-semibold">Partial Reloads (only:)</p>
        <p class="text-xs">
          Refresh specific server props without fetching everything
        </p>
      </div>
    </div>
  </Card>

  <!-- Bottom spacer -->
  <div
    class="bg-muted/50 flex h-24 items-center justify-center rounded-lg border border-dashed"
  >
    <p class="text-muted-foreground text-sm">Bottom of page</p>
  </div>
</PlaygroundLayout>
