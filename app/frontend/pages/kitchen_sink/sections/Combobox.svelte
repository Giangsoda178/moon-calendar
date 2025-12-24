<script lang="ts">
  import { CirclePlus } from "@lucide/svelte"

  import Combobox, {
    type ComboboxOption,
    type ComboboxOptionGroup,
  } from "@/components/ui/Combobox.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Combobox.svelte?raw"

  // Demo data
  const frameworks: ComboboxOption[] = [
    { value: "Next.js", label: "Next.js" },
    { value: "SvelteKit", label: "SvelteKit" },
    { value: "Nuxt.js", label: "Nuxt.js" },
    { value: "Remix", label: "Remix" },
    { value: "Astro", label: "Astro" },
  ]

  const timezones: ComboboxOptionGroup[] = [
    {
      label: "Americas",
      options: [
        { value: "America/New_York", label: "(GMT-5) New York" },
        { value: "America/Los_Angeles", label: "(GMT-8) Los Angeles" },
        { value: "America/Chicago", label: "(GMT-6) Chicago" },
        { value: "America/Toronto", label: "(GMT-5) Toronto" },
        { value: "America/Vancouver", label: "(GMT-8) Vancouver" },
        { value: "America/Sao_Paulo", label: "(GMT-3) São Paulo" },
      ],
    },
    {
      label: "Europe",
      options: [
        { value: "Europe/London", label: "(GMT+0) London" },
        { value: "Europe/Paris", label: "(GMT+1) Paris" },
        { value: "Europe/Berlin", label: "(GMT+1) Berlin" },
        { value: "Europe/Rome", label: "(GMT+1) Rome" },
        { value: "Europe/Madrid", label: "(GMT+1) Madrid" },
        { value: "Europe/Amsterdam", label: "(GMT+1) Amsterdam" },
      ],
    },
    {
      label: "Asia/Pacific",
      options: [
        { value: "Asia/Tokyo", label: "(GMT+9) Tokyo" },
        { value: "Asia/Shanghai", label: "(GMT+8) Shanghai" },
        { value: "Asia/Singapore", label: "(GMT+8) Singapore" },
        { value: "Asia/Dubai", label: "(GMT+4) Dubai" },
        { value: "Australia/Sydney", label: "(GMT+11) Sydney" },
        { value: "Asia/Seoul", label: "(GMT+9) Seoul" },
      ],
    },
  ]

  // State for demos
  let frameworkValue = $state("Next.js")
  let timezoneValue = $state("America/New_York")
</script>

<Section id="combobox" title="Combobox" code={rawCode}>
  <div class="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:flex-wrap">
    <!-- Simple Combobox -->
    <Combobox
      id="framework-select"
      options={frameworks}
      bind:value={frameworkValue}
      placeholder="Select framework..."
      emptyMessage="No framework found."
      popoverClass="w-48"
    />

    <!-- Grouped Combobox with Footer -->
    <Combobox
      id="timezone-select"
      options={timezones}
      bind:value={timezoneValue}
      placeholder="Select timezone..."
      emptyMessage="No timezone found."
      popoverClass="w-72"
    >
      {#snippet footer()}
        <div
          role="option"
          aria-selected="false"
          aria-disabled="false"
          tabindex="-1"
          onclick={() => alert("Create timezone clicked!")}
          onkeydown={() => {}}
        >
          <CirclePlus class="size-4" />
          Create timezone
        </div>
      {/snippet}
    </Combobox>
  </div>
</Section>
