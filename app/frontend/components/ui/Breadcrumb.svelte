<!--
  @component Breadcrumb
  Displays navigation path using a hierarchy of links.
  Note: There is no dedicated Breadcrumb component in Basecoat - this is a styled list.

  @example Basic usage
  ```svelte
  <script lang="ts">
    import Breadcrumb from "@/components/ui/Breadcrumb.svelte"

    const items = [
      { label: "Home", href: "/" },
      { label: "Products", href: "/products" },
      { label: "Electronics" }, // Current page (no href)
    ]
  </script>

  <Breadcrumb {items} />
  ```

  @example With ellipsis dropdown for collapsed items
  ```svelte
  <script lang="ts">
    import Breadcrumb from "@/components/ui/Breadcrumb.svelte"

    const items = [
      { label: "Home", href: "/" },
      {
        ellipsis: true,
        items: [
          { label: "Documentation", href: "/docs" },
          { label: "Themes", href: "/themes" },
          { label: "GitHub", href: "https://github.com" },
        ],
      },
      { label: "Components", href: "/components" },
      { label: "Breadcrumb" },
    ]
  </script>

  <Breadcrumb {items} />
  ```

  @example Custom separator
  ```svelte
  <Breadcrumb {items} separator="/" />
  ```
-->
<script lang="ts">
  import { ChevronRight, Ellipsis } from "@lucide/svelte"

  import DropdownMenu from "@/components/ui/DropdownMenu.svelte"
  import { cn } from "@/utils"

  /**
   * A breadcrumb item - either a link, current page, or ellipsis dropdown
   */
  export type BreadcrumbItem =
    | {
        /** Display label */
        label: string
        /** Link URL (omit for current page) */
        href?: string
        ellipsis?: never
        items?: never
      }
    | {
        /** Show ellipsis with dropdown */
        ellipsis: true
        /** Dropdown items */
        items: { label: string; href: string }[]
        label?: never
        href?: never
      }

  type Props = {
    /** Breadcrumb items */
    items: BreadcrumbItem[]
    /** Custom separator (defaults to ChevronRight icon) */
    separator?: string
    /** CSS class for the container */
    class?: string
  }

  let { items, separator, class: className }: Props = $props()
</script>

<ol
  class={cn(
    "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
    className,
  )}
>
  {#each items as item, i (i)}
    {#if i > 0}
      <li aria-hidden="true">
        {#if separator}
          <span class="text-muted-foreground">{separator}</span>
        {:else}
          <ChevronRight class="size-3.5" />
        {/if}
      </li>
    {/if}

    <li class="inline-flex items-center gap-1.5">
      {#if item.ellipsis && item.items}
        <!-- Ellipsis with dropdown -->
        <DropdownMenu
          id="breadcrumb-ellipsis-{i}"
          triggerClass="flex size-9 h-4 w-4 items-center justify-center hover:text-foreground cursor-pointer"
          popoverClass="p-1"
        >
          {#snippet trigger()}
            <Ellipsis class="size-4" />
            <span class="sr-only">More pages</span>
          {/snippet}

          {#each item.items as dropdownItem, idx (idx)}
            <a href={dropdownItem.href} role="menuitem">
              {dropdownItem.label}
            </a>
          {/each}
        </DropdownMenu>
      {:else if item.href}
        <!-- Link item -->
        <a href={item.href} class="hover:text-foreground transition-colors">
          {item.label}
        </a>
      {:else}
        <!-- Current page (no link) -->
        <span class="text-foreground font-normal">{item.label}</span>
      {/if}
    </li>
  {/each}
</ol>
