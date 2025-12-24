<!--
  @component InputGroup
  A wrapper component for inputs with prefix/suffix addons (icons, text, buttons).
  Uses relative positioning with absolutely positioned slots.

  @example Icon prefix
  ```svelte
  <script>
    import { Search } from "@lucide/svelte"
  </script>
  <InputGroup>
    {#snippet prefix()}<Search class="size-4" />{/snippet}
    <input type="text" class="input pl-9" placeholder="Search..." />
  </InputGroup>
  ```

  @example Text prefix and suffix
  ```svelte
  <InputGroup>
    {#snippet prefix()}<span class="text-sm">https://</span>{/snippet}
    {#snippet suffix()}<span class="text-sm">.com</span>{/snippet}
    <input type="text" class="input pl-15 pr-12" placeholder="example" />
  </InputGroup>
  ```

  @example Icon suffix with loading
  ```svelte
  <InputGroup>
    <input type="text" class="input pr-9" placeholder="Loading..." disabled />
    {#snippet suffix()}<LoaderCircle class="size-4 animate-spin" />{/snippet}
  </InputGroup>
  ```

  @example Button suffix
  ```svelte
  <InputGroup>
    <input type="text" class="input pr-20" placeholder="Search..." />
    {#snippet suffixAction()}
      <Button size="sm" class="h-6 p-2 rounded">Search</Button>
    {/snippet}
  </InputGroup>
  ```

  @example With tooltip
  ```svelte
  <InputGroup>
    <input type="password" class="input pr-9" placeholder="Enter password" />
    {#snippet suffix()}
      <span data-tooltip="Password must be at least 8 characters.">
        <Info class="size-4" />
      </span>
    {/snippet}
  </InputGroup>
  ```

  @example Currency input
  ```svelte
  <InputGroup>
    {#snippet prefix()}<span class="text-sm">$</span>{/snippet}
    {#snippet suffix()}<span class="text-sm">USD</span>{/snippet}
    <input type="text" class="input pl-7 pr-12" placeholder="0.00" />
  </InputGroup>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** CSS class for container */
    class?: string
    /** Prefix slot (left side, pointer-events-none by default) */
    prefix?: Snippet
    /** Suffix slot (right side, pointer-events-none by default) */
    suffix?: Snippet
    /** Prefix action slot (left side, interactive) */
    prefixAction?: Snippet
    /** Suffix action slot (right side, interactive) */
    suffixAction?: Snippet
    /** Input element */
    children: Snippet
  }

  let {
    class: className,
    prefix,
    suffix,
    prefixAction,
    suffixAction,
    children,
  }: Props = $props()
</script>

<div class={cn("relative", className)}>
  {@render children()}

  {#if prefix}
    <div
      class="text-muted-foreground pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 [&>svg]:size-4"
    >
      {@render prefix()}
    </div>
  {/if}

  {#if prefixAction}
    <div class="absolute top-1/2 left-1.5 z-10 -translate-y-1/2">
      {@render prefixAction()}
    </div>
  {/if}

  {#if suffix}
    <div
      class="text-muted-foreground pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 [&>svg]:size-4"
    >
      {@render suffix()}
    </div>
  {/if}

  {#if suffixAction}
    <div class="absolute top-1/2 right-1.5 z-10 -translate-y-1/2">
      {@render suffixAction()}
    </div>
  {/if}
</div>
