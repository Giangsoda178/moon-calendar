<script lang="ts">
  import Slider from "@/components/ui/Slider.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Slider.svelte?raw"

  let value = $state(50)
  let stepValue = $state(25)
  let nativeValue = $state(50)

  // Calculate percentage for native range
  const nativePercent = $derived((nativeValue / 100) * 100)
</script>

<Section id="slider" title="Slider" code={rawCode}>
  <!-- Native range input -->
  <p class="text-muted-foreground mb-2 text-sm">Native Range:</p>
  <div class="flex flex-col gap-4">
    <input
      type="range"
      class="input w-full max-w-sm"
      min="0"
      max="100"
      bind:value={nativeValue}
      style:--slider-value="{nativePercent}%"
    />
  </div>

  <!-- Component demos -->
  <p class="text-muted-foreground mt-6 mb-2 text-sm">Slider Component:</p>
  <div class="flex flex-col gap-6">
    <!-- Default -->
    <div class="grid w-full max-w-sm gap-2">
      <div class="flex justify-between text-sm">
        <span class="text-muted-foreground">Volume</span>
        <span class="font-medium">{value}</span>
      </div>
      <Slider bind:value />
    </div>

    <!-- With step -->
    <div class="grid w-full max-w-sm gap-2">
      <div class="flex justify-between text-sm">
        <span class="text-muted-foreground">Temperature (step: 25)</span>
        <span class="font-medium">{stepValue}°</span>
      </div>
      <Slider bind:value={stepValue} min={0} max={100} step={25} />
    </div>

    <!-- Disabled -->
    <div class="grid w-full max-w-sm gap-2">
      <span class="text-muted-foreground text-sm">Disabled</span>
      <Slider value={30} disabled />
    </div>
  </div>
</Section>
