<script lang="ts">
  import Button from "@/components/ui/Button.svelte"
  import Kbd from "@/components/ui/Kbd.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Kbd.svelte?raw"
</script>

<Section id="kbd" title="Kbd" code={rawCode}>
  <div class="flex flex-col items-start gap-4">
    <!-- Single keys -->
    <div class="inline-flex items-center gap-1">
      <Kbd>⌘</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
    </div>

    <!-- Key combination -->
    <div class="inline-flex items-center gap-1">
      <Kbd>Ctrl</Kbd>
      <span>+</span>
      <Kbd>B</Kbd>
    </div>

    <!-- In buttons -->
    <div class="flex flex-wrap items-center gap-4">
      <Button variant="outline" size="sm" class="pr-2"
        >Accept <Kbd>⏎</Kbd></Button
      >
      <Button variant="outline" size="sm" class="pr-2"
        >Cancel <Kbd>Esc</Kbd></Button
      >
    </div>

    <!-- In text -->
    <p class="text-muted-foreground text-sm">
      Use
      <span class="inline-flex items-center gap-1">
        <Kbd>Ctrl + B</Kbd>
        <Kbd>Ctrl + K</Kbd>
      </span>
      to open the command palette
    </p>
  </div>
</Section>
