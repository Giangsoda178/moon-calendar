<!--
  @component Input
  Text input with validation states and type variants.

  Works with native forms, Inertia `<Form>` component, and `useForm` helper.
  Uses `aria-invalid` to trigger destructive styling from CSS.

  @example Basic usage
  ```svelte
  <script>
    let email = $state("")
  </script>
  <Input type="email" placeholder="you@example.com" bind:value={email} />
  ```

  @example With validation
  ```svelte
  <Input type="email" invalid={!isValidEmail} class="w-full" />
  ```

  @example Within Field wrapper
  ```svelte
  <Field label="Username" name="username" error={errors.username}>
    <Input id="username" name="username" invalid={!!errors.username} required />
  </Field>
  ```

  @example With Inertia Form
  ```svelte
  <Form action="/users" method="post">
    <Input name="email" type="email" />
  </Form>
  ```
-->
<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements"

  import { cn } from "@/utils"

  type Props = HTMLInputAttributes & {
    /** Invalid state (shows error styling via aria-invalid) */
    invalid?: boolean
    /** CSS class override */
    class?: string
  }

  let {
    type = "text",
    value = $bindable(""),
    invalid = false,
    class: className,
    ...restProps
  }: Props = $props()
</script>

<input
  {type}
  bind:value
  aria-invalid={invalid || undefined}
  class={cn("input", className)}
  {...restProps}
/>
