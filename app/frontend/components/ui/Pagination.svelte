<!--
  @component Pagination
  Page navigation with ellipsis and edge buttons.
  Supports Pagy v43+ data_hash format and smooth transitions.

  Uses button variant CSS classes for consistent styling.
  Supports SPA navigation via Inertia when available.

  @example Basic usage (controlled)
  ```svelte
  <script>
    let page = $state(1)
  </script>
  <Pagination totalItems={100} perPage={10} bind:page />
  ```

  @example With Pagy v43+ data_hash (recommended for Rails)
  ```svelte
  <script>
    // Controller: @pagy.data_hash(data_keys: %i[page last count url_template])
    const { pagy, items } = $props()
  </script>
  <Pagination {pagy} />
  ```

  @example With callback
  ```svelte
  <Pagination
    totalItems={items.length}
    perPage={20}
    bind:page={currentPage}
    onchange={(p) => fetchPage(p)}
  />
  ```

  @example Without edge buttons
  ```svelte
  <Pagination totalItems={50} showEdges={false} bind:page />
  ```

  @example With SPA navigation
  ```svelte
  <Pagination
    totalItems={100}
    perPage={10}
    page={currentPage}
    buildHref={(p) => `/users?page=${p}`}
  />
  ```

  @example Server-side pagination with URL template
  ```svelte
  <script>
    // From Rails: @pagy.data_hash(data_keys: %i[page last count url_template])
    const { pagy } = $page.props
  </script>
  <Pagination
    page={pagy.page}
    totalPages={pagy.last}
    urlTemplate={pagy.url_template}
  />
  ```
-->
<script lang="ts">
  import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
  } from "@lucide/svelte"

  import { IsMobile } from "@/runes/is-mobile.svelte"
  import { cn, inertiaAction } from "@/utils"

  /** Pagy v43+ data_hash format */
  type PagyData = {
    page: number
    last: number
    count?: number
    previous?: number | null
    next?: number | null
    url_template?: string
    first_url?: string
    last_url?: string
    previous_url?: string | null
    next_url?: string | null
  }

  type Props = {
    /** Pagy v43+ data_hash object (preferred for Rails integration) */
    pagy?: PagyData
    /** Current page (1-indexed, bindable) - used if pagy not provided */
    page?: number
    /** Total number of items - used if pagy not provided */
    totalItems?: number
    /** Total number of pages - alternative to totalItems */
    totalPages?: number
    /** Items per page */
    perPage?: number
    /** Callback when page changes (for controlled mode) */
    onchange?: (page: number) => void
    /** Build href for page (enables SPA navigation) */
    buildHref?: (page: number) => string
    /** Pagy URL template with "P " placeholder (from url_template) */
    urlTemplate?: string
    /** Number of page buttons to show on each side of current */
    siblingCount?: number
    /** Total number of page slots to display (odd number recommended, default 7) */
    slots?: number
    /** Show first/last page buttons */
    showEdges?: boolean
    /** CSS class for container */
    class?: string
  }

  let {
    pagy,
    page = $bindable(1),
    totalItems,
    totalPages: totalPagesProp,
    perPage = 10,
    onchange,
    buildHref,
    urlTemplate,
    siblingCount = 1,
    slots = 7,
    showEdges = true,
    class: className,
  }: Props = $props()

  // Responsive: force compact mode on mobile (≤767px)
  const isMobile = new IsMobile()

  // On mobile: 5 slots (compact), otherwise use prop
  const effectiveSlots = $derived(isMobile.current ? Math.min(slots, 5) : slots)

  // Resolve page from pagy or prop
  let currentPage = $derived(pagy?.page ?? page)

  // Calculate total pages from pagy, totalPages prop, or totalItems
  const totalPagesCount = $derived(
    pagy?.last ??
      totalPagesProp ??
      Math.max(1, Math.ceil((totalItems ?? 0) / perPage)),
  )

  // Clamp page to valid range (only for non-pagy mode)
  $effect(() => {
    if (!pagy) {
      if (page < 1) page = 1
      if (page > totalPagesCount) page = totalPagesCount
    }
  })

  // Build URL from template or buildHref
  function getPageUrl(pageNum: number): string | undefined {
    // Pagy URL template uses "P " as placeholder
    const template = pagy?.url_template ?? urlTemplate
    if (template) {
      return template.replace("P ", String(pageNum))
    }
    return buildHref?.(pageNum)
  }

  // Check if we're using URL-based navigation
  const hasUrls = $derived(!!(pagy?.url_template ?? urlTemplate ?? buildHref))

  // Check if Inertia is available for SPA navigation
  const useSpaNav = $derived(hasUrls && inertiaAction !== undefined)

  // Generate page numbers with ellipsis using fixed slots to prevent layout shift
  // When effectiveSlots >= 7: shows first, last, and siblings around current with ellipsis
  // When effectiveSlots < 7: shows contiguous pages around current (compact mode)
  const pageNumbers = $derived.by(() => {
    const pages: (number | "ellipsis")[] = []

    // If total pages fit in slots, show all pages
    if (totalPagesCount <= effectiveSlots) {
      for (let i = 1; i <= totalPagesCount; i++) {
        pages.push(i)
      }
      return pages
    }

    // Compact mode: show contiguous pages centered on current
    if (effectiveSlots < 7) {
      const half = Math.floor(effectiveSlots / 2)
      let start = Math.max(1, currentPage - half)
      const end = Math.min(totalPagesCount, start + effectiveSlots - 1)
      start = Math.max(1, end - effectiveSlots + 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    }

    // Full mode with first/last and ellipsis
    // Reserve 2 slots for first and last page
    // Reserve up to 2 slots for ellipsis (left and right)
    // Remaining slots for siblings around current
    const siblingsPerSide = Math.max(
      siblingCount,
      Math.floor((effectiveSlots - 5) / 2),
    )

    // Calculate window around current page
    let windowStart = currentPage - siblingsPerSide
    let windowEnd = currentPage + siblingsPerSide

    // Adjust window if it would overlap with edges
    const showLeftEllipsis = windowStart > 2
    const showRightEllipsis = windowEnd < totalPagesCount - 1

    // Build the sequence
    pages.push(1)

    if (showLeftEllipsis) {
      pages.push("ellipsis")
      // Adjust start to not overlap with first page
      windowStart = Math.max(2, windowStart)
    } else {
      // Fill slots from 2 to windowStart
      for (let i = 2; i < windowStart; i++) {
        pages.push(i)
      }
    }

    // Add window around current
    for (
      let i = Math.max(2, windowStart);
      i <= Math.min(totalPagesCount - 1, windowEnd);
      i++
    ) {
      pages.push(i)
    }

    if (showRightEllipsis) {
      pages.push("ellipsis")
    } else {
      // Fill remaining slots to last page
      for (let i = windowEnd + 1; i < totalPagesCount; i++) {
        pages.push(i)
      }
    }

    if (totalPagesCount > 1) {
      pages.push(totalPagesCount)
    }

    return pages
  })

  function goToPage(newPage: number) {
    if (newPage < 1 || newPage > totalPagesCount) return
    page = newPage
    onchange?.(page)
  }
</script>

<nav class={cn("flex items-center gap-1", className)} aria-label="Pagination">
  {#if showEdges}
    {#if useSpaNav}
      <a
        href={getPageUrl(1)}
        use:inertiaAction
        class={cn(
          "pagination-btn btn-sm-icon-outline",
          currentPage === 1 && "pointer-events-none opacity-50",
        )}
        aria-label="First page"
        aria-disabled={currentPage === 1}
      >
        <ChevronsLeft class="size-4" />
      </a>
    {:else if hasUrls}
      <a
        href={getPageUrl(1)}
        class={cn(
          "pagination-btn btn-sm-icon-outline",
          currentPage === 1 && "pointer-events-none opacity-50",
        )}
        aria-label="First page"
        aria-disabled={currentPage === 1}
      >
        <ChevronsLeft class="size-4" />
      </a>
    {:else}
      <button
        type="button"
        class="pagination-btn btn-sm-icon-outline"
        onclick={() => goToPage(1)}
        disabled={currentPage === 1}
        aria-label="First page"
      >
        <ChevronsLeft class="size-4" />
      </button>
    {/if}
  {/if}

  {#if useSpaNav}
    <a
      href={getPageUrl(Math.max(1, currentPage - 1))}
      use:inertiaAction
      class={cn(
        "pagination-btn btn-sm-icon-outline",
        currentPage === 1 && "pointer-events-none opacity-50",
      )}
      aria-label="Previous page"
      aria-disabled={currentPage === 1}
    >
      <ChevronLeft class="size-4" />
    </a>
  {:else if hasUrls}
    <a
      href={getPageUrl(Math.max(1, currentPage - 1))}
      class={cn(
        "pagination-btn btn-sm-icon-outline",
        currentPage === 1 && "pointer-events-none opacity-50",
      )}
      aria-label="Previous page"
      aria-disabled={currentPage === 1}
    >
      <ChevronLeft class="size-4" />
    </a>
  {:else}
    <button
      type="button"
      class="pagination-btn btn-sm-icon-outline"
      onclick={() => goToPage(currentPage - 1)}
      disabled={currentPage === 1}
      aria-label="Previous page"
    >
      <ChevronLeft class="size-4" />
    </button>
  {/if}

  {#each pageNumbers as pageNum, i (typeof pageNum === "number" ? pageNum : `${pageNum}-${i}`)}
    {#if pageNum === "ellipsis"}
      <!-- Fixed-size ellipsis matching button dimensions to prevent layout shift -->
      <span
        class="text-muted-foreground flex size-8 items-center justify-center select-none"
        aria-hidden="true">...</span
      >
    {:else if useSpaNav}
      <a
        href={getPageUrl(pageNum)}
        use:inertiaAction
        class={cn(
          "pagination-btn btn-sm-icon-ghost tabular-nums",
          currentPage === pageNum && "btn-sm-icon-outline",
        )}
        aria-current={currentPage === pageNum ? "page" : undefined}
        aria-label={`Page ${pageNum}`}
      >
        {pageNum}
      </a>
    {:else if hasUrls}
      <a
        href={getPageUrl(pageNum)}
        class={cn(
          "pagination-btn btn-sm-icon-ghost tabular-nums",
          currentPage === pageNum && "btn-sm-icon-outline",
        )}
        aria-current={currentPage === pageNum ? "page" : undefined}
        aria-label={`Page ${pageNum}`}
      >
        {pageNum}
      </a>
    {:else}
      <button
        type="button"
        class={cn(
          "pagination-btn btn-sm-icon-ghost tabular-nums",
          currentPage === pageNum && "btn-sm-icon-outline",
        )}
        onclick={() => goToPage(pageNum)}
        aria-current={currentPage === pageNum ? "page" : undefined}
        aria-label={`Page ${pageNum}`}
      >
        {pageNum}
      </button>
    {/if}
  {/each}

  {#if useSpaNav}
    <a
      href={getPageUrl(Math.min(totalPagesCount, currentPage + 1))}
      use:inertiaAction
      class={cn(
        "pagination-btn btn-sm-icon-outline",
        currentPage === totalPagesCount && "pointer-events-none opacity-50",
      )}
      aria-label="Next page"
      aria-disabled={currentPage === totalPagesCount}
    >
      <ChevronRight class="size-4" />
    </a>
  {:else if hasUrls}
    <a
      href={getPageUrl(Math.min(totalPagesCount, currentPage + 1))}
      class={cn(
        "pagination-btn btn-sm-icon-outline",
        currentPage === totalPagesCount && "pointer-events-none opacity-50",
      )}
      aria-label="Next page"
      aria-disabled={currentPage === totalPagesCount}
    >
      <ChevronRight class="size-4" />
    </a>
  {:else}
    <button
      type="button"
      class="pagination-btn btn-sm-icon-outline"
      onclick={() => goToPage(currentPage + 1)}
      disabled={currentPage === totalPagesCount}
      aria-label="Next page"
    >
      <ChevronRight class="size-4" />
    </button>
  {/if}

  {#if showEdges}
    {#if useSpaNav}
      <a
        href={getPageUrl(totalPagesCount)}
        use:inertiaAction
        class={cn(
          "pagination-btn btn-sm-icon-outline",
          currentPage === totalPagesCount && "pointer-events-none opacity-50",
        )}
        aria-label="Last page"
        aria-disabled={currentPage === totalPagesCount}
      >
        <ChevronsRight class="size-4" />
      </a>
    {:else if hasUrls}
      <a
        href={getPageUrl(totalPagesCount)}
        class={cn(
          "pagination-btn btn-sm-icon-outline",
          currentPage === totalPagesCount && "pointer-events-none opacity-50",
        )}
        aria-label="Last page"
        aria-disabled={currentPage === totalPagesCount}
      >
        <ChevronsRight class="size-4" />
      </a>
    {:else}
      <button
        type="button"
        class="pagination-btn btn-sm-icon-outline"
        onclick={() => goToPage(totalPagesCount)}
        disabled={currentPage === totalPagesCount}
        aria-label="Last page"
      >
        <ChevronsRight class="size-4" />
      </button>
    {/if}
  {/if}
</nav>

<style>
  /* Smooth transition for active state changes - prevents flashing */
  .pagination-btn {
    transition:
      background-color 150ms ease-out,
      color 150ms ease-out,
      opacity 150ms ease-out;
  }

  /* Respect reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .pagination-btn {
      transition: none;
    }
  }
</style>
