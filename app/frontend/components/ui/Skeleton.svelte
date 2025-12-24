<!--
  @component Skeleton
  Loading placeholder with pulse animation.

  @example Basic usage
  ```svelte
  <Skeleton class="h-4 w-48" />
  <Skeleton class="h-12 w-12" rounded="full" />
  ```

  @example Card skeleton
  ```svelte
  <div class="flex items-center gap-4">
    <Skeleton class="size-12" rounded="full" />
    <div class="space-y-2">
      <Skeleton class="h-4 w-32" />
      <Skeleton class="h-3 w-24" />
    </div>
  </div>
  ```
-->
<script lang="ts">
  import { cn } from "@/utils"

  type Props = {
    /** Width (CSS value) */
    width?: string
    /** Height (CSS value) */
    height?: string
    /** Border radius variant */
    rounded?: "none" | "sm" | "md" | "lg" | "full"
    /** CSS class override */
    class?: string
  }

  let { width, height, rounded = "md", class: className }: Props = $props()

  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }
</script>

<div
  class={cn("bg-muted animate-pulse", roundedClasses[rounded], className)}
  style:width
  style:height
  aria-hidden="true"
></div>
