<script lang="ts">
  import {
    ArrowRight,
    Download,
    Ellipsis,
    ExternalLink,
    MousePointerClick,
    Send,
    Trash2,
    Upload,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"
  import { kitchenSinkPath } from "@/routes"
  import { toast } from "@/runes/toast.svelte"

  import rawCode from "./Button.svelte?raw"

  let clickCount = $state(0)
</script>

<Section id="button" title="Button" code={rawCode}>
  <div class="flex flex-col gap-4">
    <!-- Variants -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Variants:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="link">Link</Button>
      </div>
    </div>

    <!-- Sizes -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Sizes:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
      </div>
    </div>

    <!-- Icon Buttons -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Icon Buttons:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Button size="icon"><Download /></Button>
        <Button variant="secondary" size="icon"><Upload /></Button>
        <Button variant="outline" size="icon"><Send /></Button>
        <Button variant="ghost" size="icon"><ArrowRight /></Button>
        <Button variant="destructive" size="icon"><Trash2 /></Button>
        <Button variant="link" size="icon"><Ellipsis /></Button>
      </div>
    </div>

    <!-- With Icons -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">With Icons:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Button variant="outline">
          <Download />
          Download
        </Button>
        <Button variant="secondary">
          Upload
          <Upload />
        </Button>
        <Button variant="destructive">
          <Trash2 />
          Delete
        </Button>
      </div>
    </div>

    <!-- States -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">States:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Button loading>Loading</Button>
        <Button disabled>Disabled</Button>
        <Button loading variant="outline">Processing</Button>
      </div>
    </div>

    <!-- Click Handlers -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Click Handlers:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Button onclick={() => (clickCount += 1)} variant="outline">
          <MousePointerClick />
          Clicked {clickCount} times
        </Button>
        <Button
          onclick={() => toast.success("Button clicked!")}
          variant="secondary"
        >
          Toast on Click
        </Button>
        <Button
          onclick={(e) => {
            e.preventDefault()
            toast.info("Default prevented!")
          }}
          variant="ghost"
        >
          Prevent Default
        </Button>
      </div>
    </div>

    <!-- As Inertia Links -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        Inertia Links (SPA navigation):
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <Button href={kitchenSinkPath()} variant="outline">
          Kitchen Sink
          <ArrowRight />
        </Button>
        <Button href="/kitchen_sink" variant="secondary">
          String Path
          <ArrowRight />
        </Button>
        <Button href="#button" variant="ghost">Anchor Link</Button>
      </div>
    </div>

    <!-- External Links -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        External Links (opens in new tab):
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <Button href="https://svelte.dev" external variant="outline">
          Svelte Docs
          <ExternalLink />
        </Button>
        <Button href="https://inertiajs.com" external variant="secondary">
          Inertia.js
          <ExternalLink />
        </Button>
      </div>
    </div>

    <!-- CSS Class Usage -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">CSS Classes (raw):</p>
      <div class="flex flex-wrap items-center gap-2">
        <button class="btn">Primary</button>
        <button class="btn-secondary">Secondary</button>
        <button class="btn-outline">Outline</button>
        <button class="btn-ghost">Ghost</button>
        <button class="btn-destructive">Destructive</button>
        <button class="btn-link">Link</button>
      </div>
    </div>
  </div>
</Section>
