<!--
  @component TabPanel
  A tab panel component to be used with the Tabs component.

  @example Basic usage
  ```svelte
  <script lang="ts">
    import Tabs from "@/components/ui/Tabs.svelte"
    import TabPanel from "@/components/ui/TabPanel.svelte"

    let selected = $state(0)
  </script>

  <Tabs id="demo" bind:selected>
    {#snippet tabs()}
      <button>Tab 1</button>
      <button>Tab 2</button>
    {/snippet}

    {#snippet panels()}
      <TabPanel id="demo" index={0} {selected}>Panel 1 content</TabPanel>
      <TabPanel id="demo" index={1} {selected}>Panel 2 content</TabPanel>
    {/snippet}
  </Tabs>
  ```

  @example With custom styling
  ```svelte
  <TabPanel id="styled" index={0} {selected} class="p-4 bg-muted rounded-lg">
    Custom styled content
  </TabPanel>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** The parent Tabs component id */
    id: string
    /** The index of this panel (0-based) */
    index: number
    /** The currently selected tab index */
    selected: number
    /** CSS class for the panel */
    class?: string
    /** Panel content */
    children: Snippet
  }

  let { id, index, selected, class: className, children }: Props = $props()

  const isActive = $derived(index === selected)
</script>

<div
  role="tabpanel"
  id="{id}-panel-{index}"
  aria-labelledby="{id}-tab-{index}"
  tabindex={isActive ? 0 : -1}
  hidden={!isActive}
  class={cn(className)}
>
  {#if isActive}
    {@render children()}
  {/if}
</div>
