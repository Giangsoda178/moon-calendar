<!--
  @component Checkbox
  Checkbox input with custom styling via CSS.

  Works with native forms, Inertia `<Form>` component, and `useForm` helper.
  Uses `aria-invalid` to trigger destructive styling from CSS.

  @example Basic usage
  ```svelte
  <script>
    let agreed = $state(false)
  </script>
  <Checkbox bind:checked={agreed} />
  ```

  @example With label (use Label component)
  ```svelte
  <Label class="cursor-pointer items-center gap-3">
    <Checkbox bind:checked={notifications} />
    Enable notifications
  </Label>
  ```

  @example In form field (horizontal layout)
  ```svelte
  <div class="field" data-orientation="horizontal">
    <Checkbox id="terms" name="terms" required />
    <Label for="terms">I agree to the terms of service</Label>
  </div>
  ```

  @example With Inertia Form
  ```svelte
  <Form action="/settings" method="post">
    <Checkbox name="newsletter" value="1" />
  </Form>
  ```
-->
<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"

  import { cn } from "@/utils"

  type Props = Omit<HTMLInputAttributes, "type"> & {
    /** Checked state (bindable) */
    checked?: boolean
    /** Invalid state (shows error styling via aria-invalid) */
    invalid?: boolean
    /** CSS class override */
    class?: string
  }

  let {
    checked = $bindable(false),
    invalid = false,
    class: className,
    ...restProps
  }: Props = $props()
</script>

<input
  type="checkbox"
  bind:checked
  aria-invalid={invalid || undefined}
  class={cn("input", className)}
  {...restProps}
/>
