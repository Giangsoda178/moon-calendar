<!--
  @component SettingsSection
  Groups related settings items with a title and card container.
  Automatically handles dividers between items.

  @example Basic usage
  ```svelte
  <SettingsSection title="Account">
    <SettingsItem icon={User} label="Profile" action="chevron" />
    <div class="border-t"></div>
    <SettingsItem icon={Lock} label="Password" action="chevron" />
  </SettingsSection>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Section title */
    title: string
    /** Children content (SettingsItem components) */
    children: Snippet
    /** Additional CSS classes */
    class?: string
  }

  let { title, children, class: className }: Props = $props()
</script>

<div class={cn("settings-section", className)}>
  <h3>{title}</h3>
  <div class="bg-card overflow-hidden rounded-xl border shadow-sm">
    {@render children()}
  </div>
</div>
