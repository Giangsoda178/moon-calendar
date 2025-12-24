<script lang="ts">
  import { Code } from "@lucide/svelte"
  import type { Snippet } from "svelte"

  import CodeBlock from "@/components/ui/CodeBlock.svelte"
  import Dialog from "@/components/ui/Dialog.svelte"
  import { cn } from "@/utils"

  type Props = {
    id: string
    title: string
    /** Raw source code of the section component (import with ?raw) */
    code?: string
    sectionClass?: string
    headerClass?: string
    bodyClass?: string
    children: Snippet
  }

  let {
    id,
    title,
    code,
    sectionClass,
    headerClass,
    bodyClass,
    children,
  }: Props = $props()

  let codeDialogOpen = $state(false)
</script>

<section
  {id}
  class={cn("w-full min-w-0 scroll-mt-14 rounded-lg border", sectionClass)}
>
  <header
    class={cn(
      "flex items-center justify-between border-b px-4 py-3",
      headerClass,
    )}
  >
    <h2 class="text-sm font-medium">{title}</h2>
    <div class="flex items-center gap-1">
      {#if code}
        <button
          type="button"
          onclick={() => (codeDialogOpen = true)}
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 rounded-xs p-1 outline-none focus-visible:ring-[3px]"
          title="View source code"
        >
          <Code class="size-4" />
        </button>
      {/if}
    </div>
  </header>

  {#if children}
    <div class={cn("min-w-0 p-4", bodyClass)}>
      {@render children()}
    </div>
  {/if}
</section>

{#if code && codeDialogOpen}
  <Dialog
    id="{id}-code"
    {title}
    bind:open={codeDialogOpen}
    class="[&>*]:h-[85vh] [&>*]:max-h-[85vh] [&>*]:w-[95vw] [&>*]:max-w-[1400px]"
    bodyClass="!p-0 overflow-hidden flex-1 min-h-0"
  >
    <div class="grid h-full min-h-0 grid-cols-1 lg:grid-cols-2">
      <!-- Preview panel -->
      <div
        class="scrollbar flex items-start justify-center overflow-auto border-b p-6 lg:border-r lg:border-b-0"
      >
        <div class="w-full">
          {@render children()}
        </div>
      </div>
      <!-- Code panel -->
      <div class="scrollbar min-h-0 overflow-auto">
        <CodeBlock {code} class="rounded-none [&>div]:rounded-none" />
      </div>
    </div>
  </Dialog>
{/if}
