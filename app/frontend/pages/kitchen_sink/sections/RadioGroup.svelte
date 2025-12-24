<script lang="ts">
  import RadioGroup from "@/components/ui/RadioGroup.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./RadioGroup.svelte?raw"

  let density = $state("default")
  let size = $state("md")
  let plan = $state("starter")

  const densityOptions = [
    { value: "default", label: "Default" },
    { value: "comfortable", label: "Comfortable" },
    { value: "compact", label: "Compact" },
  ]

  const sizeOptions = [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ]

  const planOptions = [
    {
      value: "starter",
      label: "Starter Plan",
      description:
        "Perfect for small businesses getting started with our platform",
    },
    {
      value: "pro",
      label: "Pro Plan",
      description:
        "Advanced features for growing businesses with higher demands",
    },
  ]
</script>

<Section id="radio-group" title="Radio Group" code={rawCode}>
  <div class="flex flex-col gap-y-6">
    <!-- Vertical layout -->
    <p class="text-muted-foreground text-sm">Vertical layout:</p>

    <RadioGroup name="density" options={densityOptions} bind:value={density} />

    <!-- Horizontal layout -->
    <p class="text-muted-foreground text-sm">Horizontal layout:</p>
    <RadioGroup
      name="size"
      options={sizeOptions}
      orientation="horizontal"
      bind:value={size}
    />

    <!-- With disabled option -->
    <p class="text-muted-foreground text-sm">With disabled option:</p>
    <RadioGroup
      name="tier"
      options={[
        { value: "free", label: "Free" },
        { value: "pro", label: "Pro ($9/mo)" },
        { value: "enterprise", label: "Enterprise", disabled: true },
      ]}
    />

    <!-- Custom card-style -->
    <p class="text-muted-foreground text-sm">Custom card-style:</p>
    <RadioGroup
      name="plan"
      options={planOptions}
      bind:value={plan}
      class="max-w-sm"
      optionClass="input-card has-[:checked]:border-green-600 has-[:checked]:bg-green-50 dark:has-[:checked]:border-green-900 dark:has-[:checked]:bg-green-950"
      inputClass="checked:border-green-600 checked:bg-green-600 [&:checked]:before:bg-background dark:checked:bg-input/30 dark:[&:checked]:before:bg-primary"
    >
      {#snippet option(opt)}
        <div class="grid gap-1 font-normal">
          <h2 class="leading-none font-medium">{opt.label}</h2>
          <p class="text-muted-foreground leading-snug">{opt.description}</p>
        </div>
      {/snippet}
    </RadioGroup>
  </div>
</Section>
