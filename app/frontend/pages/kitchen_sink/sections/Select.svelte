<script lang="ts">
  import { ChartBar, ChartLine, ChartPie } from "@lucide/svelte"

  import Select from "@/components/ui/Select.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Select.svelte?raw"

  // State for demos
  let fruitValue = $state("blueberry")
  let scrollValue = $state("item-0")
  let chartValue = $state("bar")
</script>

<Section id="select" title="Select" code={rawCode}>
  <!-- Native select -->
  <p class="text-muted-foreground mb-2 text-sm">Native Select:</p>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-2 md:flex-row">
      <select class="select w-[180px]">
        <optgroup label="Fruits">
          <option>Apple</option>
          <option>Banana</option>
          <option>Blueberry</option>
        </optgroup>
        <optgroup label="Grapes">
          <option>Pineapple</option>
        </optgroup>
      </select>
      <select class="select w-[180px]" disabled>
        <option>Disabled</option>
      </select>
    </div>
  </div>

  <!-- Component demos -->
  <p class="text-muted-foreground mt-6 mb-2 text-sm">Custom Select:</p>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-2 md:flex-row">
      <!-- Grouped options -->
      <Select
        id="select-grouped"
        triggerClass="w-[180px]"
        options={[
          {
            label: "Fruits",
            options: [
              { value: "apple", label: "Apple" },
              { value: "banana", label: "Banana" },
              { value: "blueberry", label: "Blueberry" },
            ],
          },
          {
            label: "Grapes",
            options: [{ value: "pineapple", label: "Pineapple" }],
          },
        ]}
        bind:value={fruitValue}
      />

      <!-- Scrollable list -->
      <Select
        id="select-scrollable"
        triggerClass="w-[180px]"
        popoverClass="max-h-64 overflow-y-auto scrollbar"
        options={Array.from({ length: 50 }, (_, i) => ({
          value: `item-${i}`,
          label: `Item ${i}`,
        }))}
        bind:value={scrollValue}
      />

      <!-- Disabled -->
      <Select
        id="select-disabled"
        triggerClass="w-[180px]"
        options={[{ value: "disabled", label: "Disabled" }]}
        placeholder="Disabled"
        disabled
      />

      <!-- With icons -->
      <Select
        id="select-chart"
        triggerClass="w-[180px]"
        options={[
          { value: "bar", label: "Bar", icon: ChartBar },
          { value: "line", label: "Line", icon: ChartLine },
          { value: "pie", label: "Pie", icon: ChartPie },
        ]}
        bind:value={chartValue}
      />
    </div>
  </div>
</Section>
