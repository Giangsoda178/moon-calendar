<script lang="ts">
  import Input from "@/components/ui/Input.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Input.svelte?raw"

  let textValue = $state("")
  let emailValue = $state("")
</script>

<Section id="input" title="Input" code={rawCode}>
  <div class="flex flex-col gap-y-4">
    <div class="grid gap-2">
      <Input
        type="text"
        placeholder="Text (bind:value)"
        bind:value={textValue}
      />
      {#if textValue}
        <p class="text-muted-foreground text-sm">
          You typed: <span class="font-medium">{textValue}</span>
        </p>
      {/if}
    </div>
    <Input type="text" disabled placeholder="Disabled" />
    <Input type="text" invalid placeholder="Error state" />
    <Input type="email" placeholder="Email" bind:value={emailValue} />
    <Input type="password" placeholder="Password" />
    <Input type="number" placeholder="Number" />
    <Input type="file" />
    <Input type="tel" placeholder="Tel" />
    <Input type="url" placeholder="URL" />
    <Input type="search" placeholder="Search" />
    <Input type="date" />
    <Input type="datetime-local" />
    <Input type="month" />
    <Input type="week" />
    <Input type="time" />
  </div>
</Section>
