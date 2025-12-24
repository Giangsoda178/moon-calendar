<!--
  @component Spinner
  Loading indicator using animated Lucide icon.

  @example Basic usage
  ```svelte
  <Spinner />
  <Spinner size="lg" />
  ```

  @example In button
  ```svelte
  <button class="btn" disabled>
    <Spinner size="sm" />
    Loading...
  </button>
  ```
-->
<script lang="ts">
  import { LoaderCircle } from "@lucide/svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Size variant */
    size?: "sm" | "md" | "lg"
    /** Accessible label */
    label?: string
    /** CSS class override */
    class?: string
  }

  let { size = "md", label = "Loading", class: className }: Props = $props()

  const sizeClasses = {
    sm: "size-3",
    md: "size-4",
    lg: "size-6",
  }
</script>

<LoaderCircle
  class={cn("animate-spin", sizeClasses[size], className)}
  role="status"
  aria-label={label}
/>
