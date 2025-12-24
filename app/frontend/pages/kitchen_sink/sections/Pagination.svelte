<script lang="ts">
  import DataTable, { type Column } from "@/components/ui/DataTable.svelte"
  import Pagination from "@/components/ui/Pagination.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Pagination.svelte?raw"

  let page1 = $state(1)
  let page2 = $state(26)
  let page3 = $state(1)
  let page4 = $state(5)

  // Simulated data for paginated table demo
  type Invoice = {
    id: string
    customer: string
    amount: string
    status: "Paid" | "Pending" | "Overdue"
  }

  const allData: Invoice[] = Array.from({ length: 500 }, (_, i) => ({
    id: `INV${String(i + 1).padStart(3, "0")}`,
    customer: `Customer ${i + 1}`,
    amount: `$${(Math.random() * 1000).toFixed(2)}`,
    status: (["Paid", "Pending", "Overdue"] as const)[
      Math.floor(Math.random() * 3)
    ],
  }))

  const columns: Column<Invoice>[] = [
    { key: "id", label: "Invoice" },
    { key: "customer", label: "Customer" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount", align: "right" },
  ]
</script>

<Section id="pagination" title="Pagination" code={rawCode}>
  <div class="flex min-w-0 flex-col gap-8">
    <!-- Basic examples -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Basic (10 pages): Page {page1}</p>
      <Pagination totalItems={100} perPage={10} bind:page={page1} />
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Compact mode (slots=5): Page {page4}</p>
      <p class="text-muted-foreground text-xs">
        For small screens - no first/last, just contiguous pages
      </p>
      <Pagination totalItems={500} perPage={10} slots={5} bind:page={page4} />
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Without edge buttons: Page {page3}</p>
      <Pagination
        totalItems={50}
        perPage={10}
        showEdges={false}
        bind:page={page3}
      />
    </div>

    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">With callback:</p>
      <Pagination
        totalItems={100}
        perPage={10}
        page={1}
        onchange={(p) => alert(`Navigate to page ${p}`)}
      />
    </div>

    <!-- Demo with DataTable to show integrated pagination -->
    <div class="flex flex-col gap-3">
      <p class="text-sm font-medium">
        With DataTable (50 pages, current: {page2})
      </p>
      <p class="text-muted-foreground text-xs">
        Click different pages - layout stays stable, no shifting/flashing
      </p>

      <DataTable
        {columns}
        data={allData}
        paginated
        perPage={10}
        bind:page={page2}
      >
        {#snippet cell(row, key, value)}
          {#if key === "status"}
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {row.status ===
              'Paid'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : row.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}"
            >
              {value}
            </span>
          {:else if key === "id"}
            <span class="font-medium">{value}</span>
          {:else}
            {value}
          {/if}
        {/snippet}
      </DataTable>
    </div>
  </div>
</Section>
