<!--
  @component Slider
  A range input for selecting a value within a given range.

  @example Basic usage
  ```svelte
  <script lang="ts">
    import Slider from "@/components/ui/Slider.svelte"

    let volume = $state(50)
  </script>

  <Slider bind:value={volume} />
  ```

  @example With min/max/step
  ```svelte
  <Slider
    bind:value={temperature}
    min={0}
    max={100}
    step={5}
  />
  ```

  @example Disabled
  ```svelte
  <Slider value={30} disabled />
  ```
-->
<script lang="ts">
  import { cn } from "@/utils"

  type Props = {
    /** Unique identifier for the slider */
    id?: string
    /** Current value (bindable) */
    value?: number
    /** Minimum value */
    min?: number
    /** Maximum value */
    max?: number
    /** Step increment */
    step?: number
    /** Whether the slider is disabled */
    disabled?: boolean
    /** Form field name */
    name?: string
    /** Callback when value changes */
    onchange?: (value: number) => void
    /** CSS class for the input */
    class?: string
  }

  let {
    id,
    value = $bindable(0),
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    name,
    onchange,
    class: className,
  }: Props = $props()

  // Calculate percentage for CSS variable
  const percent = $derived(
    max === min ? 0 : ((value - min) / (max - min)) * 100,
  )

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement
    value = parseFloat(target.value)
    onchange?.(value)
  }
</script>

<input
  type="range"
  {id}
  {name}
  {min}
  {max}
  {step}
  {disabled}
  {value}
  class={cn(
    "input w-full",
    disabled && "cursor-not-allowed opacity-50",
    className,
  )}
  style:--slider-value="{percent}%"
  oninput={handleInput}
/>
