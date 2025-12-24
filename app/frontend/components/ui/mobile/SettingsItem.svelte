<!--
  @component SettingsItem
  Individual item for settings lists. iOS-style with icon + label (no description by default).
  Supports toggle, navigation, and value display modes.

  @example Toggle mode
  ```svelte
  <SettingsItem
    icon={Bell}
    label="Notifications"
    action="toggle"
    bind:checked={notifications}
  />
  ```

  @example Navigation mode (SPA)
  ```svelte
  <SettingsItem
    icon={User}
    label="Profile"
    action="chevron"
    href="/profile"
  />
  ```

  @example Navigation with onclick fallback
  ```svelte
  <SettingsItem
    icon={User}
    label="Profile"
    action="chevron"
    onclick={() => openModal()}
  />
  ```

  @example Value display
  ```svelte
  <SettingsItem
    icon={Info}
    label="Version"
    action="value"
    value="v1.0.0"
  />
  ```
-->
<script lang="ts">
  import { ChevronRight } from "@lucide/svelte"
  import type { IconProps } from "@lucide/svelte"
  import type { Component, Snippet } from "svelte"

  import Switch from "@/components/ui/Switch.svelte"
  import { analyzeLink, cn, inertiaAction } from "@/utils"

  type Props = {
    /** Lucide icon component */
    icon?: Component<IconProps>
    /** Icon text color class (e.g., "text-blue-500") */
    iconColor?: string
    /** Icon background color class (e.g., "bg-blue-500/10") */
    iconBgColor?: string
    /** Primary label */
    label: string
    /** Action type */
    action?: "toggle" | "chevron" | "value" | "custom"
    /** Checked state for toggle action (bindable) */
    checked?: boolean
    /** Value text for value action */
    value?: string
    /** Click handler (for chevron/value/custom actions) */
    onclick?: () => void
    /** Custom action slot */
    actionSlot?: Snippet
    /** Additional CSS classes */
    class?: string
    /** URL for navigation (uses Inertia by default) */
    href?: string
    /** HTTP method for navigation (default: GET) */
    method?: "get" | "post" | "put" | "patch" | "delete"
    /** Preserve scroll position after navigation */
    preserveScroll?: boolean
    /** Preserve component state after navigation */
    preserveState?: boolean
    /** Enable SPA navigation (default: true for internal links) */
    inertia?: boolean
    /** Force external link behavior */
    external?: boolean
  }

  let {
    icon: Icon,
    iconColor = "text-muted-foreground",
    iconBgColor = "",
    label,
    action = "chevron",
    checked = $bindable(false),
    value,
    onclick,
    actionSlot,
    class: className,
    href,
    method = "get",
    preserveScroll = false,
    preserveState,
    inertia = true,
    external = false,
  }: Props = $props()

  const isClickable = $derived(action !== "toggle")
  const baseClass = $derived(
    isClickable ? "settings-item-button" : "settings-item",
  )

  // Analyze link for navigation behavior
  const link = $derived(analyzeLink(href, { inertia, external }))

  // Navigation options for Inertia
  const navOptions = $derived({
    method,
    preserveScroll,
    preserveState: preserveState ?? method !== "get",
  })
</script>

{#snippet itemContent()}
  {#if Icon}
    <div data-icon class={cn(iconBgColor && "rounded-lg", iconBgColor)}>
      <Icon class={cn("size-5", iconColor)} />
    </div>
  {/if}
  <div data-content>
    <p>{label}</p>
  </div>
  <div data-action class="text-muted-foreground flex items-center gap-2">
    {#if action === "chevron"}
      <ChevronRight class="size-5" />
    {:else if action === "value"}
      <span class="text-sm">{value}</span>
      <ChevronRight class="size-5" />
    {:else if action === "custom" && actionSlot}
      {@render actionSlot()}
    {/if}
  </div>
{/snippet}

{#if link.href && link.useInertia && inertiaAction}
  <!-- SPA navigation with Inertia -->
  <a
    href={link.href}
    use:inertiaAction={navOptions}
    class={cn(baseClass, className)}
    {onclick}
  >
    {@render itemContent()}
  </a>
{:else if link.href && !link.useInertia}
  <!-- External or fallback navigation -->
  <a
    href={link.href}
    class={cn(baseClass, className)}
    rel={link.isExternal ? "noopener noreferrer" : undefined}
    target={link.isExternal ? "_blank" : undefined}
    {onclick}
  >
    {@render itemContent()}
  </a>
{:else if isClickable}
  <!-- Button with onclick handler -->
  <button type="button" class={cn(baseClass, className)} {onclick}>
    {@render itemContent()}
  </button>
{:else}
  <!-- Toggle mode -->
  <div class={cn("settings-item", className)}>
    {#if Icon}
      <div data-icon class={cn(iconBgColor && "rounded-lg", iconBgColor)}>
        <Icon class={cn("size-5", iconColor)} />
      </div>
    {/if}
    <div data-content>
      <p>{label}</p>
    </div>
    <div data-action>
      <Switch bind:checked />
    </div>
  </div>
{/if}
