<!--
  @component Dialog
  A modal dialog component using native HTML dialog element.
  Prevents body scroll when open and restores on close.

  @example Basic usage with external trigger
  ```svelte
  <script lang="ts">
    import Dialog from "@/components/ui/Dialog.svelte"

    let open = $state(false)
  </script>

  <button class="btn-outline" onclick={() => (open = true)}>Open Dialog</button>

  <Dialog id="my-dialog" title="Edit Profile" bind:open>
    <p>Dialog content here</p>

    {#snippet footer()}
      <button class="btn" onclick={() => (open = false)}>Save</button>
    {/snippet}
  </Dialog>
  ```

  @example With built-in trigger button
  The trigger prop renders a button that opens the dialog automatically.
  ```svelte
  <script lang="ts">
    import Dialog from "@/components/ui/Dialog.svelte"

    let editProfileOpen = $state(false)
  </script>

  <Dialog
    id="confirm-dialog"
    title="Confirm Action"
    description="Are you sure you want to proceed?"
    trigger="Delete Item"
    triggerClass="btn-destructive"
    bind:open={editProfileOpen}
  >
    {#snippet footer()}
      <button class="btn-outline" onclick={() => (editProfileOpen = false)}>Cancel</button>
      <button class="btn-destructive" onclick={() => (editProfileOpen = false)}>Delete</button>
    {/snippet}
  </Dialog>
  ```

  @example Scrollable content
  ```svelte
  <script lang="ts">
    import Dialog from "@/components/ui/Dialog.svelte"

    let scrollableOpen = $state(false)
  </script>

  <Dialog
    id="terms"
    title="Terms of Service"
    trigger="View Terms"
    bodyClass="scrollbar overflow-y-auto"
    bind:open={scrollableOpen}
  >
    <div class="space-y-4 text-sm">
      <p>Long scrollable content here...</p>
      <p>More content...</p>
    </div>

    {#snippet footer()}
      <button class="btn" onclick={() => (scrollableOpen = false)}>Accept</button>
    {/snippet}
  </Dialog>
  ```
-->
<script lang="ts">
  import { X } from "@lucide/svelte"
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Unique identifier for the dialog */
    id: string
    /** Dialog title */
    title?: string
    /** Dialog description (appears below title) */
    description?: string
    /** Whether dialog is open (bindable) */
    open?: boolean
    /** Trigger button text (if provided, renders a trigger button) */
    trigger?: string
    /** Show close X button (default: true) */
    closeButton?: boolean
    /** Close when clicking overlay/backdrop (default: true) */
    closeOnOverlayClick?: boolean
    /** Callback when dialog closes */
    onclose?: () => void
    /** CSS class for trigger button */
    triggerClass?: string
    /** CSS class for dialog element */
    class?: string
    /** CSS class for body/content section */
    bodyClass?: string
    /** CSS class for header */
    headerClass?: string
    /** CSS class for footer */
    footerClass?: string
    /** Dialog body content (default slot) */
    children?: Snippet
    /** Footer content (typically action buttons) */
    footer?: Snippet
  }

  let {
    id,
    title,
    description,
    open = $bindable(false),
    trigger,
    closeButton = true,
    closeOnOverlayClick = true,
    onclose,
    triggerClass,
    class: className = "w-full sm:max-w-[425px] max-h-[612px]",
    bodyClass,
    headerClass,
    footerClass,
    children,
    footer,
  }: Props = $props()

  let dialogEl = $state<HTMLDialogElement | null>(null)

  // Sync open state with dialog element
  $effect(() => {
    if (!dialogEl) return

    if (open && !dialogEl.open) {
      dialogEl.showModal()
      // Prevent body scroll when dialog is open
      document.body.style.overflow = "hidden"
    } else if (!open && dialogEl.open) {
      dialogEl.close()
    }
  })

  // Handle native dialog close (ESC key, form submission, etc.)
  function handleClose() {
    open = false
    // Restore body scroll
    document.body.style.overflow = ""
    onclose?.()
  }

  function handleBackdropClick(event: MouseEvent) {
    if (closeOnOverlayClick && event.target === dialogEl) {
      open = false
    }
  }

  function openDialog() {
    open = true
  }

  function closeDialog() {
    open = false
  }
</script>

{#if trigger}
  <button
    type="button"
    class={cn("btn-outline", triggerClass)}
    onclick={openDialog}
  >
    {trigger}
  </button>
{/if}

<dialog
  {id}
  bind:this={dialogEl}
  class={cn("dialog", className)}
  aria-labelledby="{id}-title"
  aria-describedby={description ? `${id}-description` : undefined}
  onclick={handleBackdropClick}
  onclose={handleClose}
>
  <div>
    {#if title || description}
      <header class={headerClass}>
        {#if title}
          <h2 id="{id}-title">{title}</h2>
        {/if}
        {#if description}
          <p id="{id}-description">{description}</p>
        {/if}
      </header>
    {/if}

    {#if children}
      <section class={bodyClass}>
        {@render children()}
      </section>
    {/if}

    {#if footer}
      <footer class={footerClass}>
        {@render footer()}
      </footer>
    {/if}

    {#if closeButton}
      <button type="button" aria-label="Close dialog" onclick={closeDialog}>
        <X class="size-4" />
      </button>
    {/if}
  </div>
</dialog>
