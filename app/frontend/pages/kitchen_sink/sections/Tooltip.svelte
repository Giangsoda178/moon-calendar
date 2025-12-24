<script lang="ts">
  import Button from "@/components/ui/Button.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Tooltip.svelte?raw"
</script>

<Section id="tooltip" title="Tooltip" code={rawCode}>
  <div class="flex min-w-0 flex-wrap items-center gap-4">
    <Button variant="outline" data-tooltip="Top tooltip">Top</Button>
    <Button variant="outline" data-tooltip="Right tooltip" data-side="right">
      Right
    </Button>
    <Button variant="outline" data-tooltip="Bottom tooltip" data-side="bottom">
      Bottom
    </Button>
    <Button variant="outline" data-tooltip="Left tooltip" data-side="left">
      Left
    </Button>
  </div>
</Section>
