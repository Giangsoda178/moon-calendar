<script lang="ts">
  import { Info } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"
  import { toast } from "@/runes/toast.svelte"

  import rawCode from "./Toaster.svelte?raw"
</script>

<Section id="toaster" title="Toaster" code={rawCode}>
  <div class="space-y-6">
    <!-- Basic Toast Types -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Basic Types:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onclick={() =>
            toast.success("Success!", {
              description: "Your changes have been saved.",
            })}
        >
          Success
        </Button>
        <Button
          variant="outline"
          onclick={() =>
            toast.error("Error!", { description: "Something went wrong." })}
        >
          Error
        </Button>
        <Button
          variant="outline"
          onclick={() =>
            toast.info("Info", { description: "A new version is available." })}
        >
          Info
        </Button>
        <Button
          variant="outline"
          onclick={() =>
            toast.warning("Warning", {
              description: "Your session expires soon.",
            })}
        >
          Warning
        </Button>
      </div>
    </div>

    <!-- Actions & Loading -->
    <div class="border-t pt-4">
      <p class="text-muted-foreground mb-2 text-sm">Actions & Loading:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onclick={() =>
            toast.info("Item deleted", {
              action: {
                label: "Undo",
                onclick: () => toast.success("Restored!"),
              },
            })}
        >
          With Action
        </Button>
        <Button
          variant="outline"
          onclick={() =>
            toast.info("New feature available", {
              action: {
                label: "Learn more",
                href: "#toast",
              },
            })}
        >
          With Link
        </Button>
        <Button
          variant="outline"
          onclick={() =>
            toast.warning("Delete this item?", {
              description: "This action cannot be undone.",
              action: {
                label: "Delete",
                onclick: () => toast.success("Deleted!"),
              },
              cancel: {
                label: "Cancel",
                onclick: () => toast.info("Cancelled"),
              },
            })}
        >
          Confirm Dialog
        </Button>
        <Button variant="outline" onclick={() => toast.loading("Loading...")}>
          Loading
        </Button>
      </div>
    </div>

    <!-- Promise Toast -->
    <div class="border-t pt-4">
      <p class="text-muted-foreground mb-2 text-sm">Promise Toast:</p>
      <div class="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onclick={() =>
            toast.promise(new Promise((r) => setTimeout(r, 2000)), {
              loading: "Saving...",
              success: "Saved successfully!",
              error: "Failed to save",
            })}
        >
          Async Success
        </Button>
        <Button
          variant="outline"
          onclick={() =>
            toast.promise(
              new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Network error")), 2000),
              ),
              {
                loading: "Uploading...",
                success: "Uploaded!",
                error: "Upload failed",
              },
            )}
        >
          Async Error
        </Button>
      </div>
    </div>

    <!-- Stacking & Behavior -->
    <div class="border-t pt-4">
      <p class="text-muted-foreground mb-2 flex items-center gap-1.5 text-sm">
        Stacking & Behavior:
        <span
          class="text-muted-foreground hover:text-muted-foreground cursor-help"
          data-tooltip="Hover to pause • Swipe to dismiss • Click X to close"
        >
          <Info class="size-3.5" />
        </span>
      </p>
      <div class="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          onclick={() => {
            toast.success("First notification")
            toast.info("Second notification")
            toast.warning("Third notification")
          }}
        >
          Stack Multiple
        </Button>
        <Button
          variant="outline"
          onclick={() =>
            toast.success("Long duration", {
              description: "This toast will stay for 10 seconds.",
              duration: 10000,
            })}
        >
          Long Duration
        </Button>
        <Button variant="outline" onclick={() => toast.clear()}>
          Clear All
        </Button>
      </div>
    </div>
  </div>
</Section>
