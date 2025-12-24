<!--
  @component Tabs
  A set of layered sections of content—known as tab panels—that are displayed one at a time.
  This component uses a two-component pattern (Tabs + TabPanel)

  @example Basic usage with TabPanel
  ```svelte
  <script lang="ts">
    import Tabs from "@/components/ui/Tabs.svelte"
    import TabPanel from "@/components/ui/TabPanel.svelte"

    let selected = $state(0)
  </script>

  <Tabs id="demo" bind:selected>
    {#snippet tabs()}
      <button>Account</button>
      <button>Password</button>
    {/snippet}

    {#snippet panels()}
      <TabPanel id="demo" index={0} {selected}>Account content</TabPanel>
      <TabPanel id="demo" index={1} {selected}>Password content</TabPanel>
    {/snippet}
  </Tabs>
  ```

  @example Controlled selection with callback
  ```svelte
  <Tabs id="controlled" bind:selected onchange={(i) => console.log('Tab:', i)}>
    {#snippet tabs()}
      <button>First</button>
      <button>Second</button>
    {/snippet}

    {#snippet panels()}
      <TabPanel id="controlled" index={0} {selected}>First panel</TabPanel>
      <TabPanel id="controlled" index={1} {selected}>Second panel</TabPanel>
    {/snippet}
  </Tabs>
  ```

  @example Tabs with icons
  ```svelte
  <Tabs id="icons" bind:selected>
    {#snippet tabs()}
      <button><User /> Profile</button>
      <button><Settings /> Settings</button>
    {/snippet}

    {#snippet panels()}
      <TabPanel id="icons" index={0} {selected}>Profile content</TabPanel>
      <TabPanel id="icons" index={1} {selected}>Settings content</TabPanel>
    {/snippet}
  </Tabs>
  ```

  @example Navigation style (no panels)
  ```svelte
  <Tabs id="nav" onchange={(index) => goto(routes[index])}>
    {#snippet tabs()}
      <button>Home</button>
      <button>Settings</button>
    {/snippet}
  </Tabs>
  ```

  @example Disabled tab
  ```svelte
  <Tabs id="disabled" bind:selected>
    {#snippet tabs()}
      <button>Home</button>
      <button disabled>Disabled</button>
    {/snippet}

    {#snippet panels()}
      <TabPanel id="disabled" index={0} {selected}>Home content</TabPanel>
      <TabPanel id="disabled" index={1} {selected}>Never shown</TabPanel>
    {/snippet}
  </Tabs>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Unique identifier for the tabs (used for ARIA) */
    id: string
    /** Currently selected tab index (0-based, bindable) */
    selected?: number
    /** Callback when tab changes */
    onchange?: (index: number) => void
    /** CSS class for the container */
    class?: string
    /** CSS class for the tablist nav */
    tablistClass?: string
    /** Tab buttons snippet */
    tabs: Snippet
    /** Tab panels snippet (optional for navigation-style tabs) */
    panels?: Snippet
  }

  let {
    id,
    selected = $bindable(0),
    onchange,
    class: className,
    tablistClass,
    tabs,
    panels,
  }: Props = $props()

  let tablistEl = $state<HTMLDivElement | null>(null)
  let tabButtons: HTMLButtonElement[] = []

  function getTabButtons(): HTMLButtonElement[] {
    if (!tablistEl) return []
    return Array.from(tablistEl.querySelectorAll("button"))
  }

  function selectTab(index: number) {
    if (index === selected) return
    const tab = tabButtons[index]
    if (tab?.disabled) return

    selected = index
    onchange?.(index)
  }

  function handleClick(event: MouseEvent) {
    const { target } = event
    if (!(target instanceof Element)) return

    const tab = target.closest("button")
    if (tab instanceof HTMLButtonElement) {
      const index = tabButtons.indexOf(tab)
      if (index !== -1) selectTab(index)
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!tablistEl) return

    const currentIndex = tabButtons.findIndex(
      (tab) => tab === document.activeElement,
    )
    if (currentIndex === -1) return

    let nextIndex: number | undefined

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (currentIndex + 1) % tabButtons.length
        break
      case "ArrowLeft":
        nextIndex = (currentIndex - 1 + tabButtons.length) % tabButtons.length
        break
      case "Home":
        nextIndex = 0
        break
      case "End":
        nextIndex = tabButtons.length - 1
        break
      default:
        return
    }

    // Skip disabled tabs
    while (tabButtons[nextIndex]?.disabled) {
      if (event.key === "ArrowRight" || event.key === "End") {
        nextIndex = (nextIndex + 1) % tabButtons.length
      } else {
        nextIndex = (nextIndex - 1 + tabButtons.length) % tabButtons.length
      }
      // Prevent infinite loop if all tabs are disabled
      if (nextIndex === currentIndex) return
    }

    event.preventDefault()
    selectTab(nextIndex)
    tabButtons[nextIndex]?.focus()
  }

  // Apply ARIA attributes to tab buttons after mount and on selection change
  $effect(() => {
    if (!tablistEl) return

    // Re-query buttons on each effect run to handle dynamic content
    tabButtons = getTabButtons()

    tabButtons.forEach((tab, index) => {
      tab.setAttribute("role", "tab")
      tab.setAttribute("type", "button")
      tab.setAttribute("id", `${id}-tab-${index}`)
      tab.setAttribute("aria-controls", `${id}-panel-${index}`)
      tab.setAttribute("aria-selected", index === selected ? "true" : "false")
      tab.setAttribute("tabindex", index === selected ? "0" : "-1")
    })
  })
</script>

<div class={cn("tabs", className)} data-tabs-initialized="true">
  <div
    bind:this={tablistEl}
    role="tablist"
    aria-orientation="horizontal"
    tabindex="-1"
    class={tablistClass}
    onclick={handleClick}
    onkeydown={handleKeydown}
  >
    {@render tabs()}
  </div>

  {#if panels}
    {@render panels()}
  {/if}
</div>
