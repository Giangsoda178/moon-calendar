<!--
  @component RadioGroup
  Radio button group with fieldset semantics.

  Uses native radio inputs with CSS styling from application.css.
  Works with native forms, Inertia `<Form>` component, and `useForm` helper.

  @example Basic usage
  ```svelte
  <script>
    let plan = $state("free")
    const plans = [
      { value: "free", label: "Free" },
      { value: "pro", label: "Pro ($9/mo)" },
      { value: "enterprise", label: "Enterprise" },
    ]
  </script>
  <RadioGroup name="plan" options={plans} bind:value={plan} />
  ```

  @example Horizontal layout
  ```svelte
  <RadioGroup
    name="size"
    orientation="horizontal"
    options={[
      { value: "sm", label: "Small" },
      { value: "md", label: "Medium" },
      { value: "lg", label: "Large" },
    ]}
    bind:value={size}
  />
  ```

  @example With disabled option
  ```svelte
  <RadioGroup
    name="tier"
    options={[
      { value: "basic", label: "Basic" },
      { value: "premium", label: "Premium", disabled: true },
    ]}
    bind:value={tier}
  />
  ```

  @example Custom card-style options
  ```svelte
  <RadioGroup
    name="plan"
    options={plans}
    bind:value={selectedPlan}
    optionClass="items-start gap-3 rounded-lg border p-4 hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5"
  >
    {#snippet option(opt, checked)}
      <div class="grid gap-1 font-normal">
        <h2 class="font-medium">{opt.label}</h2>
        <p class="text-muted-foreground leading-snug">{opt.description}</p>
      </div>
    {/snippet}
  </RadioGroup>
  ```

  @example With Inertia Form
  ```svelte
  <Form action="/settings" method="post">
    <RadioGroup name="plan" options={plans} value={form.plan} />
  </Form>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type RadioOption = {
    value: string
    label: string
    disabled?: boolean
    [key: string]: unknown
  }

  type Props = {
    /** Group name (required for form submission) */
    name: string
    /** Options to render */
    options: RadioOption[]
    /** Selected value (bindable) */
    value?: string
    /** Group ID prefix */
    id?: string
    /** Disabled state for entire group */
    disabled?: boolean
    /** Invalid state */
    invalid?: boolean
    /** Layout orientation */
    orientation?: "vertical" | "horizontal"
    /** CSS class for fieldset */
    class?: string
    /** CSS class for individual labels */
    optionClass?: string
    /** CSS class for radio input */
    inputClass?: string
    /** Custom option content snippet */
    option?: Snippet<[RadioOption, boolean]>
  }

  let {
    name,
    options,
    value = $bindable(""),
    id,
    disabled = false,
    invalid = false,
    orientation = "vertical",
    class: className,
    optionClass,
    inputClass,
    option: optionSnippet,
  }: Props = $props()

  const groupId = $derived(id ?? `radio-${name}`)
</script>

<fieldset
  class={cn(
    "flex gap-3",
    orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
    className,
  )}
  role="radiogroup"
  aria-invalid={invalid || undefined}
>
  {#each options as opt (opt.value)}
    {@const optionId = `${groupId}-${opt.value}`}
    {@const isChecked = value === opt.value}
    <label
      for={optionId}
      class={cn(
        "flex cursor-pointer gap-3 text-sm font-medium",
        !optionClass && "items-center",
        (disabled || opt.disabled) && "cursor-not-allowed opacity-50",
        optionClass,
      )}
    >
      <input
        type="radio"
        {name}
        id={optionId}
        value={opt.value}
        disabled={disabled || opt.disabled}
        bind:group={value}
        class={cn("input", inputClass)}
      />
      {#if optionSnippet}
        {@render optionSnippet(opt, isChecked)}
      {:else}
        {opt.label}
      {/if}
    </label>
  {/each}
</fieldset>
