<!--
  @component Progress
  Progress bar indicating completion percentage.

  @example Basic usage
  ```svelte
  <Progress value={66} />
  <Progress value={33} max={100} />
  ```

  @example Custom styling
  ```svelte
  <Progress value={75} class="h-3" indicatorClass="bg-green-500" />
  ```
-->
<script lang="ts">
  import { cn } from "@/utils"

  type Props = {
    /** Current value */
    value?: number
    /** Maximum value */
    max?: number
    /** CSS class for track */
    class?: string
    /** CSS class for indicator */
    indicatorClass?: string
  }

  let {
    value = 0,
    max = 100,
    class: className,
    indicatorClass,
  }: Props = $props()

  const percent = $derived(max === 0 ? 0 : Math.min(100, (value / max) * 100))
</script>

<div
  class={cn(
    "bg-progress/20 relative h-2 w-full overflow-hidden rounded-full",
    className,
  )}
  role="progressbar"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={max}
>
  <div
    class={cn("bg-progress h-full transition-all", indicatorClass)}
    style:width="{percent}%"
  ></div>
</div>
