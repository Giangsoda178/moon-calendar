<script lang="ts">
  import Field from "@/components/ui/Field.svelte"
  import Textarea from "@/components/ui/Textarea.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Textarea.svelte?raw"

  let message = $state("")
</script>

<Section id="textarea" title="Textarea" code={rawCode}>
  <div class="flex flex-col gap-6">
    <p class="text-muted-foreground text-sm">Using Textarea component:</p>
    <Textarea placeholder="Type your message here" bind:value={message} />
    <Textarea placeholder="Error state" invalid />

    <Field label="With Label" name="textarea-label">
      <Textarea placeholder="Type your message here" />
    </Field>

    <Field
      label="With description"
      name="textarea-desc"
      description="Type your message and press enter to send."
    >
      <Textarea placeholder="Type your message here" />
    </Field>

    <Field label="Disabled" name="textarea-disabled">
      <Textarea placeholder="Type your message here" disabled />
    </Field>

    <Field
      label="With error"
      name="textarea-error"
      error="This field is required"
    >
      <Textarea placeholder="Type your message here" invalid />
    </Field>
  </div>
</Section>
