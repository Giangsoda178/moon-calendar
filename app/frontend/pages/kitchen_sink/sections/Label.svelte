<script lang="ts">
  import Label from "@/components/ui/Label.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Label.svelte?raw"
</script>

<Section id="label" title="Label" code={rawCode}>
  <div class="flex flex-col gap-y-6">
    <!-- Using Label Component -->
    <div>
      <div class="grid w-full max-w-sm gap-6">
        <div class="grid gap-3">
          <Label for="label-comp-text">Username</Label>
          <input
            type="text"
            id="label-comp-text"
            class="input"
            placeholder="Username"
          />
        </div>
        <div class="grid gap-3">
          <Label for="label-comp-disabled">Disabled Input</Label>
          <input
            type="text"
            id="label-comp-disabled"
            class="input"
            placeholder="Disabled"
            disabled
          />
        </div>
      </div>
    </div>

    <!-- Label with Checkbox inside -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Label wrapping checkbox:</p>
      <div class="grid w-full max-w-sm gap-4">
        <Label class="cursor-pointer items-center gap-3">
          <input type="checkbox" class="input" />
          Remember me
        </Label>
        <Label class="cursor-pointer items-center gap-3">
          <input type="checkbox" class="input" checked />
          Subscribe to newsletter
        </Label>
      </div>
    </div>
  </div>
</Section>
