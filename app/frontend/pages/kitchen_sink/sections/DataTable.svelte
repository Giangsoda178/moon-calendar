<script lang="ts">
  import { Copy, Ellipsis, Pencil, Trash2 } from "@lucide/svelte"
  import { SvelteSet } from "svelte/reactivity"

  import DataTable, { type Column } from "@/components/ui/DataTable.svelte"
  import DropdownMenu from "@/components/ui/DropdownMenu.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"
  import { toast } from "@/runes/toast.svelte"

  import rawCode from "./DataTable.svelte?raw"

  // Sample data types
  type User = {
    id: number
    name: string
    email: string
    role: "Admin" | "Editor" | "Viewer"
    status: "Active" | "Inactive" | "Pending"
    lastLogin: string
    plan: "Free" | "Pro" | "Enterprise"
  }

  // Generate sample users
  const users: User[] = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-15",
      plan: "Enterprise",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      role: "Editor",
      status: "Active",
      lastLogin: "2024-01-14",
      plan: "Pro",
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      role: "Viewer",
      status: "Pending",
      lastLogin: "2024-01-10",
      plan: "Free",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@example.com",
      role: "Editor",
      status: "Inactive",
      lastLogin: "2024-01-05",
      plan: "Pro",
    },
    {
      id: 5,
      name: "Eva Martinez",
      email: "eva@example.com",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-15",
      plan: "Enterprise",
    },
  ]

  // Extended data for pagination demo
  const extendedUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: (["Admin", "Editor", "Viewer"] as const)[i % 3],
    status: (["Active", "Inactive", "Pending"] as const)[i % 3],
    lastLogin: `2024-01-${String(15 - (i % 15)).padStart(2, "0")}`,
    plan: (["Free", "Pro", "Enterprise"] as const)[i % 3],
  }))

  // Column definitions for different demos
  const basicColumns: Column<User>[] = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
  ]

  const sortableColumns: Column<User>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "lastLogin", label: "Last Login", sortable: true },
  ]

  const fullColumns: Column<User>[] = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "role", label: "Role", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "plan", label: "Plan", sortable: true, align: "center" },
  ]

  // State for demos (SvelteSet is already reactive)
  let selectedUsers = new SvelteSet<number>()
  let paginationPage = $state(1)

  // Badge styling helpers
  function getStatusClass(status: string): string {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "Inactive":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "Pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  function getRoleClass(role: string): string {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "Editor":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "Viewer":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  function getPlanClass(plan: string): string {
    switch (plan) {
      case "Enterprise":
        return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400"
      case "Pro":
        return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400"
      case "Free":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  // Actions
  function handleEdit(user: User) {
    toast.info(`Edit: ${user.name}`)
  }

  function handleCopy(user: User) {
    navigator.clipboard.writeText(user.email)
    toast.success(`Copied: ${user.email}`)
  }

  function handleDelete(user: User) {
    toast.error(`Delete: ${user.name}`)
  }
</script>

<Section id="data-table" title="DataTable" code={rawCode}>
  <div class="flex min-w-0 flex-col gap-8">
    <!-- Basic -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Basic</p>
      <p class="text-muted-foreground text-xs">Simple table with data</p>
      <DataTable columns={basicColumns} data={users.slice(0, 3)} />
    </div>

    <!-- Sortable -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Sortable Columns</p>
      <p class="text-muted-foreground text-xs">
        Click column headers to sort (ascending/descending)
      </p>
      <DataTable columns={sortableColumns} data={users} />
    </div>

    <!-- Selectable -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Row Selection</p>
      <p class="text-muted-foreground text-xs">
        Select individual rows or all rows with the header checkbox
      </p>
      <DataTable
        columns={basicColumns}
        data={users}
        selectable
        bind:selected={selectedUsers}
      />
    </div>

    <!-- Searchable -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Searchable</p>
      <p class="text-muted-foreground text-xs">
        Filter rows by searching across all columns
      </p>
      <DataTable columns={sortableColumns} data={users} searchable />
    </div>

    <!-- Paginated -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Paginated</p>
      <p class="text-muted-foreground text-xs">
        Navigate through large datasets with pagination controls
      </p>
      <DataTable
        columns={basicColumns}
        data={extendedUsers}
        paginated
        perPage={5}
        bind:page={paginationPage}
      />
    </div>

    <!-- Custom Cell Rendering -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Custom Cell Rendering</p>
      <p class="text-muted-foreground text-xs">
        Use the cell snippet for badges, icons, and custom formatting
      </p>
      <DataTable columns={fullColumns} data={users}>
        {#snippet cell(_row, key, value)}
          {#if key === "status"}
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {getStatusClass(
                String(value),
              )}"
            >
              {value}
            </span>
          {:else if key === "role"}
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {getRoleClass(
                String(value),
              )}"
            >
              {value}
            </span>
          {:else if key === "plan"}
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {getPlanClass(
                String(value),
              )}"
            >
              {value}
            </span>
          {:else if key === "name"}
            <span class="font-medium">{value}</span>
          {:else}
            {value}
          {/if}
        {/snippet}
      </DataTable>
    </div>

    <!-- Action Column -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Action Column</p>
      <p class="text-muted-foreground text-xs">
        Add row actions with dropdown menus
      </p>
      <DataTable columns={basicColumns} data={users}>
        {#snippet action(row)}
          <DropdownMenu
            id="action-{row.id}"
            triggerClass="btn-icon-ghost"
            popoverClass="min-w-32"
            align="end"
          >
            {#snippet trigger()}
              <Ellipsis class="size-4" />
            {/snippet}
            <button
              type="button"
              role="menuitem"
              onclick={() => handleEdit(row)}
            >
              <Pencil class="size-4" />
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              onclick={() => handleCopy(row)}
            >
              <Copy class="size-4" />
              Copy Email
            </button>
            <hr />
            <button
              type="button"
              role="menuitem"
              class="text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive [&_svg]:!text-destructive"
              onclick={() => handleDelete(row)}
            >
              <Trash2 class="size-4" />
              Delete
            </button>
          </DropdownMenu>
        {/snippet}
      </DataTable>
    </div>

    <!-- Full Featured -->
    <div class="flex flex-col gap-2">
      <p class="text-sm font-medium">Full Featured</p>
      <p class="text-muted-foreground text-xs">
        Combining search, sort, pagination, selection, custom cells, and actions
      </p>
      <DataTable
        columns={fullColumns}
        data={extendedUsers}
        sortable
        selectable
        searchable
        searchPlaceholder="Search users..."
        paginated
        perPage={5}
      >
        {#snippet cell(_row, key, value)}
          {#if key === "status"}
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {getStatusClass(
                String(value),
              )}"
            >
              {value}
            </span>
          {:else if key === "role"}
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {getRoleClass(
                String(value),
              )}"
            >
              {value}
            </span>
          {:else if key === "plan"}
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium {getPlanClass(
                String(value),
              )}"
            >
              {value}
            </span>
          {:else if key === "name"}
            <span class="font-medium">{value}</span>
          {:else}
            {value}
          {/if}
        {/snippet}
        {#snippet action(row)}
          <DropdownMenu
            id="full-action-{row.id}"
            triggerClass="btn-icon-ghost"
            popoverClass="min-w-32"
            align="end"
          >
            {#snippet trigger()}
              <Ellipsis class="size-4" />
            {/snippet}
            <button
              type="button"
              role="menuitem"
              onclick={() => handleEdit(row)}
            >
              <Pencil class="size-4" />
              Edit
            </button>
            <button
              type="button"
              role="menuitem"
              onclick={() => handleCopy(row)}
            >
              <Copy class="size-4" />
              Copy Email
            </button>
            <hr />
            <button
              type="button"
              role="menuitem"
              class="text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive [&_svg]:!text-destructive"
              onclick={() => handleDelete(row)}
            >
              <Trash2 class="size-4" />
              Delete
            </button>
          </DropdownMenu>
        {/snippet}
      </DataTable>
    </div>
  </div>
</Section>
