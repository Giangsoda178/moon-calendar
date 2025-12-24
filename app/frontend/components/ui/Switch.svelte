<!--
  @component Switch
  Toggle switch input (checkbox with role="switch").

  CSS handles the visual toggle appearance via the role="switch" attribute.
  Works with native forms, Inertia `<Form>` component, and `useForm` helper.

  @example Basic usage
  ```svelte
  <script>
    let darkMode = $state(false)
  </script>
  <Switch bind:checked={darkMode} />
  ```

  @example With label
  ```svelte
  <Label class="cursor-pointer items-center gap-3">
    <Switch bind:checked={airplaneMode} />
    Airplane Mode
  </Label>
  ```

  @example In form field
  ```svelte
  <div class="field" data-orientation="horizontal">
    <Switch id="marketing" name="marketing" />
    <Label for="marketing">Receive marketing emails</Label>
  </div>
  ```
-->
<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"

  import { cn } from "@/utils"

  type Props = Omit<HTMLInputAttributes, "type" | "role"> & {
    /** Checked state (bindable) */
    checked?: boolean
    /** CSS class override */
    class?: string
  }

  let {
    checked = $bindable(false),
    class: className,
    ...restProps
  }: Props = $props()
</script>

<input
  type="checkbox"
  role="switch"
  bind:checked
  aria-checked={checked}
  class={cn("input", className)}
  {...restProps}
/>
