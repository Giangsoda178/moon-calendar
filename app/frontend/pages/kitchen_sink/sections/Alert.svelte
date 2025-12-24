<script lang="ts">
  import {
    BookmarkCheck,
    CircleAlert,
    CircleCheck,
    Gift,
    Info,
  } from "@lucide/svelte"

  import Alert from "@/components/ui/Alert.svelte"
  import Button from "@/components/ui/Button.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Alert.svelte?raw"
</script>

<Section id="alert" title="Alert" code={rawCode}>
  <div class="grid max-w-xl items-start gap-4">
    <!-- Basic Alert -->
    <div>
      <Alert title="Heads up!" description="This action cannot be undone." />
    </div>

    <!-- Destructive Variant -->
    <div>
      <Alert
        variant="destructive"
        title="Error"
        description="Failed to save changes."
      />
    </div>

    <!-- With Custom Icon -->
    <div>
      <Alert title="Warning">
        {#snippet icon()}<CircleAlert />{/snippet}
        Please review before continuing.
      </Alert>
    </div>

    <!-- With Rich Content (inline button) -->
    <div>
      <Alert title="Update available">
        {#snippet icon()}<CircleCheck />{/snippet}
        <div class="flex items-center justify-between gap-4">
          <p>Version 2.0 is now available with new features.</p>
        </div>
        {#snippet footer()}
          <Button size="sm">Update now</Button>
        {/snippet}
      </Alert>
    </div>

    <!-- Icon Only (no title) -->
    <div>
      <Alert>
        {#snippet icon()}<BookmarkCheck />{/snippet}
        This alert has an icon and description but no title.
      </Alert>
    </div>

    <!-- Description Only -->
    <div>
      <Alert
        description="This alert has a description only. No title. No icon."
      />
    </div>

    <!-- Long Content -->
    <div>
      <Alert
        title="This is an extremely long alert title that spans multiple lines"
      >
        {#snippet icon()}<Info />{/snippet}
        This is an equally long description that contains detailed information about
        the alert. It shows how the component can accommodate extensive content while
        preserving proper spacing, alignment, and readability across different screen
        sizes.
      </Alert>
    </div>

    <!-- Destructive with List -->
    <div>
      <Alert variant="destructive" title="Something went wrong!">
        {#snippet icon()}<CircleAlert />{/snippet}
        <p>Please verify your billing information and try again:</p>
        <ul class="mt-2 list-inside list-disc">
          <li>Check your card details</li>
          <li>Ensure sufficient funds</li>
          <li>Verify billing address</li>
        </ul>
      </Alert>
    </div>

    <!-- Custom Colors -->
    <div>
      <Alert
        title="Plot Twist: This Alert is Amber!"
        class="border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100"
      >
        {#snippet icon()}<Gift />{/snippet}
        Custom colors for light and dark mode.
      </Alert>
    </div>
  </div>
</Section>
