<script lang="ts">
  import {
    Check,
    Copy,
    CreditCard,
    Info,
    Link2,
    LoaderCircle,
    Mail,
    Search,
    Star,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import InputGroup from "@/components/ui/InputGroup.svelte"
  import Kbd from "@/components/ui/Kbd.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./InputGroup.svelte?raw"

  let copied = $state(false)

  function handleCopy() {
    navigator.clipboard.writeText("https://x.com/hunvreus")
    copied = true
    setTimeout(() => (copied = false), 2000)
  }
</script>

<Section id="input-group" title="Input Group" code={rawCode}>
  <div class="grid max-w-sm gap-6">
    <!-- Icon Prefix -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Icon Prefix:</p>
      <InputGroup>
        {#snippet prefix()}<Search class="size-4" />{/snippet}
        <input type="text" class="input pl-9" placeholder="Search..." />
      </InputGroup>
    </div>

    <!-- Icon Suffix -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Icon Suffix:</p>
      <InputGroup>
        <input type="email" class="input pr-9" placeholder="Enter your email" />
        {#snippet suffix()}<Mail class="size-4" />{/snippet}
      </InputGroup>
    </div>

    <!-- Both Icons -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Both Icons:</p>
      <InputGroup>
        {#snippet prefix()}<CreditCard class="size-4" />{/snippet}
        <input type="text" class="input px-9" placeholder="Card number" />
        {#snippet suffix()}<Check class="size-4 text-green-500" />{/snippet}
      </InputGroup>
    </div>

    <!-- Text Prefix & Suffix -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Text Prefix & Suffix:</p>
      <InputGroup>
        {#snippet prefix()}<span class="text-sm">$</span>{/snippet}
        <input type="text" class="input pr-12 pl-7" placeholder="0.00" />
        {#snippet suffix()}<span class="text-sm">USD</span>{/snippet}
      </InputGroup>
    </div>

    <!-- URL Input -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">URL Input:</p>
      <InputGroup>
        {#snippet prefix()}<span class="text-sm">https://</span>{/snippet}
        <input type="text" class="input pr-12 pl-16" placeholder="example" />
        {#snippet suffix()}<span class="text-sm">.com</span>{/snippet}
      </InputGroup>
    </div>

    <!-- With Tooltip -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">With Tooltip:</p>
      <InputGroup>
        <input
          type="password"
          class="input pr-9"
          placeholder="Enter password"
        />
        {#snippet suffix()}
          <span
            class="cursor-help"
            data-tooltip="Password must be at least 8 characters."
          >
            <Info class="size-4" />
          </span>
        {/snippet}
      </InputGroup>
    </div>

    <!-- Copy Button -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Copy Button:</p>
      <InputGroup>
        <input
          type="text"
          readonly
          class="input pr-9"
          value="https://x.com/hunvreus"
        />
        {#snippet suffixAction()}
          <button
            type="button"
            class="btn-icon-ghost text-muted-foreground hover:text-foreground size-6"
            onclick={handleCopy}
          >
            {#if copied}
              <Check class="size-4" />
            {:else}
              <Copy class="size-4" />
            {/if}
          </button>
        {/snippet}
      </InputGroup>
    </div>

    <!-- Search Button -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Search Button:</p>
      <InputGroup>
        <input
          type="text"
          class="input pr-20"
          placeholder="Type to search..."
        />
        {#snippet suffixAction()}
          <Button variant="secondary" size="sm" class="h-6 rounded px-2"
            >Search</Button
          >
        {/snippet}
      </InputGroup>
    </div>

    <!-- With Kbd -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">With Keyboard Shortcut:</p>
      <InputGroup>
        {#snippet prefix()}<Search class="size-4" />{/snippet}
        <input
          type="text"
          class="input pr-12 pl-9"
          placeholder="Search pages..."
        />
        {#snippet suffix()}<Kbd>/</Kbd>{/snippet}
      </InputGroup>
    </div>

    <!-- Loading State -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Loading State:</p>
      <InputGroup>
        <input
          type="text"
          class="input pr-9"
          placeholder="Searching..."
          disabled
        />
        {#snippet suffix()}
          <LoaderCircle class="size-4 animate-spin opacity-50" />
        {/snippet}
      </InputGroup>
    </div>

    <!-- Star Toggle -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Interactive Suffix:</p>
      <InputGroup>
        <input
          type="text"
          class="input rounded-full pr-9 pl-4"
          placeholder="Bookmark this..."
        />
        {#snippet suffixAction()}
          <button
            type="button"
            aria-pressed="false"
            onclick={(e) => {
              const btn = e.currentTarget as HTMLButtonElement
              btn.ariaPressed = btn.ariaPressed === "true" ? "false" : "true"
            }}
            class="btn-icon-ghost text-muted-foreground hover:text-foreground size-6 rounded-full aria-pressed:text-amber-500 [&>svg]:aria-pressed:fill-amber-500"
          >
            <Star class="size-4" />
          </button>
        {/snippet}
      </InputGroup>
    </div>

    <!-- Inline Group -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Inline Group:</p>
      <div class="flex w-fit items-stretch">
        <label
          for="url-input"
          class="bg-muted flex items-center rounded-l-md border border-r-0 px-4 text-sm shadow-xs"
        >
          https://
        </label>
        <InputGroup>
          <input
            id="url-input"
            type="text"
            class="input rounded-none pr-9"
            placeholder="example.com"
          />
          {#snippet suffix()}<Link2 class="size-4" />{/snippet}
        </InputGroup>
        <div
          class="bg-muted flex items-center rounded-r-md border border-l-0 px-4 text-sm shadow-xs"
        >
          .com
        </div>
      </div>
    </div>
  </div>
</Section>
