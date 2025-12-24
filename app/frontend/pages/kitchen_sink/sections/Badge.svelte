<script lang="ts">
  import { ArrowRight, Check, CircleAlert, ExternalLink } from "@lucide/svelte"

  import Badge from "@/components/ui/Badge.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"
  import { kitchenSinkPath } from "@/routes"

  import rawCode from "./Badge.svelte?raw"
</script>

<Section id="badge" title="Badge" code={rawCode}>
  <div class="flex flex-col gap-4">
    <!-- Using Badge Component -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Using Badge Component:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Badge>Primary</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <Badge variant="outline">
          <Check class="size-3" />
          Badge
        </Badge>
        <Badge variant="destructive">
          <CircleAlert class="size-3" />
          Alert
        </Badge>
      </div>
    </div>

    <!-- Badge as Inertia Link -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        Inertia Links (SPA navigation with js_routes):
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <Badge href={kitchenSinkPath()}>
          Kitchen Sink
          <ArrowRight class="size-3" />
        </Badge>
        <Badge href="/kitchen_sink" variant="secondary">
          String path
          <ArrowRight class="size-3" />
        </Badge>
        <Badge href="#badge" variant="outline">
          Anchor Link
          <ArrowRight class="size-3" />
        </Badge>
      </div>
    </div>

    <!-- External Links -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        External Links (opens in new tab):
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <Badge href="https://svelte.dev" external variant="outline">
          Svelte Docs
          <ExternalLink class="size-3" />
        </Badge>
        <Badge href="https://inertiajs.com" external variant="secondary">
          Inertia.js
          <ExternalLink class="size-3" />
        </Badge>
      </div>
    </div>

    <!-- Pill Badges -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        Pill Badges (custom class):
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <Badge class="min-w-5 rounded-full px-1">8</Badge>
        <Badge variant="destructive" class="min-w-5 rounded-full px-1">99</Badge
        >
        <Badge
          variant="outline"
          class="min-w-5 rounded-full px-1 font-mono tabular-nums">20+</Badge
        >
      </div>
    </div>

    <!-- CSS Class Usage (existing) -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">CSS Classes (raw):</p>
      <div class="flex flex-wrap items-center gap-2">
        <span class="badge">Primary</span>
        <span class="badge-secondary">Secondary</span>
        <span class="badge-outline">Outline</span>
        <span class="badge-destructive">Destructive</span>
      </div>
    </div>
  </div>
</Section>
