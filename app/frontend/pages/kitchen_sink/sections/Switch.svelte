<script lang="ts">
  import Label from "@/components/ui/Label.svelte"
  import Switch from "@/components/ui/Switch.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Switch.svelte?raw"

  let airplaneMode = $state(false)
  let bluetooth = $state(true)
  let shareDevices = $state(false)
</script>

<Section id="switch" title="Switch" code={rawCode}>
  <div class="inline-flex flex-col gap-y-6">
    <p class="text-muted-foreground text-sm">Using Switch component:</p>

    <Label class="cursor-pointer items-center gap-3">
      <Switch bind:checked={airplaneMode} />
      Airplane Mode
    </Label>

    <Label class="cursor-pointer items-center gap-3">
      <Switch
        bind:checked={bluetooth}
        class="checked:bg-blue-500 dark:checked:bg-blue-600"
      />
      Bluetooth
    </Label>

    <label class="input-card justify-between">
      <div class="grid gap-2">
        <h2 class="text-sm leading-none font-medium">Share across devices</h2>
        <p class="text-muted-foreground text-sm">
          Focus is shared across devices, and turns off when you leave the app.
        </p>
      </div>
      <Switch bind:checked={shareDevices} />
    </label>
  </div>
</Section>
