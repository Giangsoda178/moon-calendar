<!--
  @component Field
  Form field wrapper with label, description, and error display.

  Uses the `.field` CSS class from application.css which provides:
  - Vertical layout with gap-3
  - Horizontal layout via `data-orientation="horizontal"`
  - Error styling via `data-invalid="true"`
  - Auto-styles h2/h3 as labels, [role="alert"] for errors

  Works with Inertia Form errors via slot props.

  @example Basic usage
  ```svelte
  <Field label="Email" name="email">
    <Input type="email" name="email" />
  </Field>
  ```

  @example With Inertia Form errors
  ```svelte
  <Form action="/users" method="post">
    {#snippet children({ errors })}
      <Field label="Email" name="email" error={errors.email}>
        <Input type="email" name="email" invalid={!!errors.email} />
      </Field>
    {/snippet}
  </Form>
  ```

  @example With description
  ```svelte
  <Field label="Password" description="Must be at least 8 characters" required>
    <Input type="password" name="password" required />
  </Field>
  ```

  @example Horizontal layout (checkbox/switch)
  ```svelte
  <Field orientation="horizontal">
    <Checkbox id="terms" name="terms" />
    <Label for="terms">I agree to the terms</Label>
  </Field>
  ```

  @example With custom label via snippet
  ```svelte
  <Field name="avatar" error={errors.avatar}>
    {#snippet labelSnippet()}
      <h3>Profile Photo <Badge variant="secondary">Optional</Badge></h3>
    {/snippet}
    <Input type="file" name="avatar" accept="image/*" />
  </Field>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Field name (for ID generation and error lookup) */
    name?: string
    /** Field label text */
    label?: string
    /** Helper/description text */
    description?: string
    /** Error message (from Inertia errors or manual) */
    error?: string | string[]
    /** Required indicator */
    required?: boolean
    /** Layout orientation */
    orientation?: "vertical" | "horizontal"
    /** CSS class override */
    class?: string
    /** Custom label snippet (replaces label prop) */
    labelSnippet?: Snippet
    /** Content slot (input element) */
    children: Snippet
  }

  let {
    name,
    label,
    description,
    error,
    required = false,
    orientation = "vertical",
    class: className,
    labelSnippet,
    children,
  }: Props = $props()

  const fieldId = $derived(name ? `field-${name}` : undefined)
  const hasError = $derived(
    !!error &&
      (typeof error === "string" ? error.length > 0 : error.length > 0),
  )
  const errorArray = $derived(
    typeof error === "string" ? [error] : (error ?? []),
  )
</script>

<div
  class={cn("field", className)}
  data-orientation={orientation !== "vertical" ? orientation : undefined}
  data-invalid={hasError || undefined}
>
  {#if labelSnippet}
    {@render labelSnippet()}
  {:else if label}
    <label for={fieldId} class="label items-center">
      {label}
      {#if required}
        <span class="text-destructive">*</span>
      {/if}
    </label>
  {/if}

  {@render children()}

  {#if description && !hasError}
    <p>{description}</p>
  {/if}

  {#if hasError}
    <div role="alert">
      {#if errorArray.length === 1}
        {errorArray[0]}
      {:else}
        <ul>
          {#each errorArray as err, i (i)}
            <li>{err}</li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}
</div>
