<script lang="ts">
  import Checkbox from "@/components/ui/Checkbox.svelte"
  import Label from "@/components/ui/Label.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Checkbox.svelte?raw"

  let notifications = $state(true)
  let terms = $state(false)
</script>

<Section id="checkbox" title="Checkbox" code={rawCode}>
  <div class="flex max-w-lg flex-col gap-6">
    <!-- Basic with label -->
    <Label class="cursor-pointer items-center gap-3">
      <Checkbox />
      Accept terms and conditions
    </Label>

    <!-- With label and description -->
    <div class="flex items-start gap-3">
      <Checkbox id="demo-checkbox-label-and-description" />
      <div class="grid gap-2">
        <label for="demo-checkbox-label-and-description" class="label"
          >Accept terms and conditions</label
        >
        <p class="text-muted-foreground text-sm">
          By clicking this checkbox, you agree to the terms and conditions.
        </p>
      </div>
    </div>

    <!-- Disabled -->
    <Label class="cursor-pointer items-center gap-3">
      <Checkbox disabled />
      Enable notifications (disabled)
    </Label>

    <!-- Invalid/error state -->
    <Label class="cursor-pointer items-center gap-3">
      <Checkbox invalid bind:checked={terms} />
      You must accept the terms
    </Label>

    <!-- Card-style checkbox (default primary color) -->
    <label class="input-card">
      <Checkbox bind:checked={notifications} />
      <div class="grid gap-2">
        <h2 class="text-sm leading-none font-medium">Enable notifications</h2>
        <p class="text-muted-foreground text-sm">
          You can enable or disable notifications at any time.
        </p>
      </div>
    </label>

    <!-- Card-style checkbox (custom blue color) -->
    <label
      class="input-card has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:has-[:checked]:border-blue-900 dark:has-[:checked]:bg-blue-950"
    >
      <Checkbox
        checked={true}
        class="checked:border-blue-600 checked:bg-blue-600 checked:after:bg-white dark:checked:border-blue-700 dark:checked:bg-blue-700"
      />
      <div class="grid gap-2">
        <h2 class="text-sm leading-none font-medium">
          Enable email notifications
        </h2>
        <p class="text-muted-foreground text-sm">
          You can enable or disable email notifications at any time.
        </p>
      </div>
    </label>
  </div>
</Section>
