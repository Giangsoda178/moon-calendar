<!--
  @component Textarea
  Multi-line text input with auto-sizing via CSS field-sizing.

  Works with native forms, Inertia `<Form>` component, and `useForm` helper.
  Uses `aria-invalid` to trigger destructive styling from CSS.

  @example Basic usage
  ```svelte
  <script>
    let message = $state("")
  </script>
  <Textarea placeholder="Enter your message..." bind:value={message} />
  ```

  @example With rows and resize disabled
  ```svelte
  <Textarea rows={6} class="resize-none" />
  ```

  @example With validation
  ```svelte
  <Field label="Bio" name="bio" error={errors.bio}>
    <Textarea name="bio" invalid={!!errors.bio} />
  </Field>
  ```
-->
<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements"

  import { cn } from "@/utils"

  type Props = HTMLTextareaAttributes & {
    /** Current value (bindable) */
    value?: string
    /** Invalid state (shows error styling via aria-invalid) */
    invalid?: boolean
    /** CSS class override */
    class?: string
  }

  let {
    value = $bindable(""),
    invalid = false,
    class: className,
    ...restProps
  }: Props = $props()
</script>

<textarea
  bind:value
  aria-invalid={invalid || undefined}
  class={cn("textarea", className)}
  {...restProps}
></textarea>
