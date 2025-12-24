<!--
  @component DataTable
  A configurable data table with sorting, selection, search, and action column.

  @example Basic usage
  ```svelte
  <script lang="ts">
    import DataTable from "@/components/ui/DataTable.svelte"

    const columns = [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
    ]
    const data = [
      { id: 1, name: "John", email: "john@example.com" },
      { id: 2, name: "Jane", email: "jane@example.com" },
    ]
  </script>

  <DataTable {columns} {data} />
  ```

  @example With sorting and selection
  ```svelte
  <DataTable
    {columns}
    {data}
    sortable
    selectable
    bind:selected
  />
  ```

  @example With alignment
  ```svelte
  const columns = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "amount", label: "Amount", align: "right" },
  ]
  ```

  @example With action column
  ```svelte
  <DataTable {columns} {data}>
    {#snippet action(row)}
      <DropdownMenu id="actions-{row.id}" triggerClass="btn-icon-ghost" popoverClass="min-w-32">
        {#snippet trigger()}
          <Ellipsis class="size-4" />
        {/snippet}
        <div role="menuitem">Edit</div>
        <div role="menuitem">Delete</div>
      </DropdownMenu>
    {/snippet}
  </DataTable>
  ```

  @example With pagination
  ```svelte
  <script>
    let page = $state(1)
  </script>
  <DataTable
    {columns}
    {data}
    paginated
    perPage={10}
    bind:page
  />
  ```

  @example With custom cell rendering
  ```svelte
  <DataTable {columns} {data}>
    {#snippet cell(row, key, value)}
      {#if key === "status"}
        <span class="badge">{value}</span>
      {:else}
        {value}
      {/if}
    {/snippet}
  </DataTable>
  ```
-->
<script lang="ts" module>
  export type Column<T> = {
    /** Key to access data property */
    key: keyof T & string
    /** Display label for header */
    label: string
    /** Column is sortable */
    sortable?: boolean
    /** Text alignment: left (default), center, right */
    align?: "left" | "center" | "right"
    /** Custom class for header */
    headerClass?: string
    /** Custom class for cells */
    cellClass?: string
  }
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
  import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "@lucide/svelte"
  import type { Snippet } from "svelte"
  import { SvelteSet } from "svelte/reactivity"

  import Pagination from "@/components/ui/Pagination.svelte"
  import { cn } from "@/utils"

  type Props = {
    /** Column definitions */
    columns: Column<T>[]
    /** Data rows */
    data: T[]
    /** Unique key for each row */
    rowKey?: keyof T & string
    /** Enable sorting on all columns (or per-column via column.sortable) */
    sortable?: boolean
    /** Enable row selection */
    selectable?: boolean
    /** Selected row keys (bindable) - use SvelteSet for reactive selection */
    selected?: SvelteSet<T[keyof T]>
    /** Enable search */
    searchable?: boolean
    /** Keys to search in (defaults to all column keys) */
    searchKeys?: (keyof T & string)[]
    /** Search query (bindable) - for external control */
    search?: string
    /** Search placeholder */
    searchPlaceholder?: string
    /** Caption text */
    caption?: string
    /** CSS class for table */
    class?: string
    /** Action column snippet - receives the row data */
    action?: Snippet<[T]>
    /** Custom cell renderer - receives (row, column key, cell value) */
    cell?: Snippet<[T, keyof T & string, T[keyof T]]>
    /** Enable pagination */
    paginated?: boolean
    /** Items per page (when paginated) */
    perPage?: number
    /** Current page (1-indexed, bindable) */
    page?: number
    /** Callback when page changes */
    onPageChange?: (page: number) => void
  }

  let {
    columns,
    data,
    rowKey = "id" as keyof T & string,
    sortable = false,
    selectable = false,
    selected = $bindable(new SvelteSet()),
    searchable = false,
    searchKeys = [],
    search = $bindable(""),
    searchPlaceholder = "Search...",
    caption,
    class: className,
    action,
    cell,
    paginated = false,
    perPage = 10,
    page = $bindable(1),
    onPageChange,
  }: Props = $props()

  // Sort state
  let sortKey = $state<keyof T | null>(null)
  let sortDir = $state<"asc" | "desc">("asc")

  // Filtered and sorted data
  const filteredData = $derived.by(() => {
    let result = [...data]

    // Search filter
    if (searchable && search.trim()) {
      const query = search.toLowerCase()
      const keys =
        searchKeys.length > 0 ? searchKeys : columns.map((c) => c.key)
      result = result.filter((row) =>
        keys.some((key) => String(row[key]).toLowerCase().includes(query)),
      )
    }

    // Sort
    if (sortKey) {
      result.sort((a, b) => {
        const aVal = a[sortKey!]
        const bVal = b[sortKey!]
        if (aVal < bVal) return sortDir === "asc" ? -1 : 1
        if (aVal > bVal) return sortDir === "asc" ? 1 : -1
        return 0
      })
    }

    return result
  })

  // Pagination: total items count from filtered data
  const totalItems = $derived(filteredData.length)

  // Reset page to 1 when search changes (filtered data changes)
  let prevSearch = search
  $effect(() => {
    if (paginated && search !== prevSearch) {
      page = 1
      prevSearch = search
    }
  })

  // Apply pagination to get display data
  const displayData = $derived.by(() => {
    if (!paginated) return filteredData
    const start = (page - 1) * perPage
    return filteredData.slice(start, start + perPage)
  })

  // Pagination info for "Showing X-Y of Z"
  const paginationStart = $derived(paginated ? (page - 1) * perPage + 1 : 1)
  const paginationEnd = $derived(
    paginated ? Math.min(page * perPage, totalItems) : totalItems,
  )

  // Selection state using SvelteSet
  const allSelected = $derived(
    filteredData.length > 0 &&
      filteredData.every((row) => selected.has(row[rowKey])),
  )
  const someSelected = $derived(selected.size > 0 && !allSelected)

  function toggleSort(key: keyof T & string) {
    if (sortKey === key) {
      sortDir = sortDir === "asc" ? "desc" : "asc"
    } else {
      sortKey = key
      sortDir = "asc"
    }
  }

  function toggleRow(rowKeyValue: T[keyof T]) {
    if (selected.has(rowKeyValue)) {
      selected.delete(rowKeyValue)
    } else {
      selected.add(rowKeyValue)
    }
  }

  function toggleAll() {
    if (allSelected) {
      selected.clear()
    } else {
      filteredData.forEach((row) => selected.add(row[rowKey]))
    }
  }

  function isColumnSortable(col: Column<T>): boolean {
    return col.sortable ?? sortable
  }

  // Alignment class helper
  function alignClass(align?: "left" | "center" | "right"): string {
    if (align === "right") return "text-right"
    if (align === "center") return "text-center"
    return ""
  }
</script>

<div class="flex flex-col gap-4">
  {#if searchable}
    <div class="relative max-w-sm">
      <Search
        class="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2"
      />
      <input
        type="text"
        class="input h-9 pl-9"
        placeholder={searchPlaceholder}
        bind:value={search}
      />
    </div>
  {/if}

  <div class="relative w-full overflow-x-auto">
    <table class={cn("table", className)}>
      {#if caption}
        <caption>{caption}</caption>
      {/if}
      <thead>
        <tr>
          {#if selectable}
            <th class="w-10">
              <input
                type="checkbox"
                class="input"
                checked={allSelected}
                indeterminate={someSelected}
                onchange={toggleAll}
              />
            </th>
          {/if}
          {#each columns as col (col.key)}
            <th class={cn(alignClass(col.align), col.headerClass)}>
              {#if isColumnSortable(col)}
                <button
                  type="button"
                  class={cn(
                    "hover:text-foreground inline-flex items-center gap-1",
                    col.align === "right" && "ml-auto",
                    col.align === "center" && "mx-auto",
                  )}
                  onclick={() => toggleSort(col.key)}
                >
                  {col.label}
                  {#if sortKey === col.key}
                    {#if sortDir === "asc"}
                      <ArrowUp class="size-4" />
                    {:else}
                      <ArrowDown class="size-4" />
                    {/if}
                  {:else}
                    <ArrowUpDown class="size-4 opacity-50" />
                  {/if}
                </button>
              {:else}
                {col.label}
              {/if}
            </th>
          {/each}
          {#if action}
            <th class="w-[1%] p-0"></th>
          {/if}
        </tr>
      </thead>
      <tbody>
        {#each displayData as row (row[rowKey])}
          <tr class={selected.has(row[rowKey]) ? "bg-muted/50" : ""}>
            {#if selectable}
              <td class="w-10">
                <input
                  type="checkbox"
                  class="input"
                  checked={selected.has(row[rowKey])}
                  onchange={() => toggleRow(row[rowKey])}
                />
              </td>
            {/if}
            {#each columns as col (col.key)}
              <td class={cn(alignClass(col.align), col.cellClass)}>
                {#if cell}
                  {@render cell(row, col.key, row[col.key])}
                {:else}
                  {row[col.key]}
                {/if}
              </td>
            {/each}
            {#if action}
              <td class="w-[1%] p-0">
                {@render action(row)}
              </td>
            {/if}
          </tr>
        {:else}
          <tr>
            <td
              colspan={columns.length + (selectable ? 1 : 0) + (action ? 1 : 0)}
              class="text-muted-foreground h-24 text-center"
            >
              No results found.
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Footer: Selection count and/or Pagination -->
  {#if (selectable && selected.size > 0) || paginated}
    <div
      class="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="text-muted-foreground text-sm">
        {#if selectable && selected.size > 0}
          {selected.size} of {totalItems} row(s) selected.
        {:else if paginated && totalItems > 0}
          Showing {paginationStart}-{paginationEnd} of {totalItems}
        {/if}
      </div>
      {#if paginated && totalItems > perPage}
        <Pagination {totalItems} {perPage} bind:page onchange={onPageChange} />
      {/if}
    </div>
  {/if}
</div>
