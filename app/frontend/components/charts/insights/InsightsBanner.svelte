<!--
  @component InsightsBanner
  Displays a health status banner with icon, label, and action message.
  Uses RETENTION_STATE_COLORS via DEFAULT_HEALTH_STATES for consistent styling.

  @example Default usage with status
  ```svelte
  <InsightsBanner
    status="warning"
    message="Re-engage 120 lapsing users before they churn"
  />
  ```

  @example Custom label override
  ```svelte
  <InsightsBanner
    status="warning"
    label="Optimize"
    message="Improve checkout flow to reduce 35% drop-off"
  />
  ```

  @example Custom health states
  ```svelte
  <InsightsBanner
    status="custom"
    message="Custom insight message"
    healthStates={{ custom: { color: "#8b5cf6", label: "Review", icon: Info, priority: 2 } }}
  />
  ```
-->
<script lang="ts">
  import type { Component } from "svelte"

  import {
    DEFAULT_HEALTH_STATES,
    type HealthStateConfig,
    type HealthStatus,
  } from "./insights-config"

  interface Props {
    /** Health status key (e.g., "critical", "warning", "healthy", or custom) */
    status: HealthStatus
    /** Message to display */
    message: string
    /** Override default label */
    label?: string
    /** Custom icon (overrides state config icon) */
    icon?: Component
    /** Custom color (overrides state config color) */
    color?: string
    /** Custom health states (merged with defaults) */
    healthStates?: Partial<Record<string, HealthStateConfig>>
    class?: string
  }

  let {
    status,
    message,
    label,
    icon,
    color,
    healthStates,
    class: className = "",
  }: Props = $props()

  // Merge custom states with defaults
  const mergedStates = $derived({ ...DEFAULT_HEALTH_STATES, ...healthStates })
  const stateConfig = $derived(
    mergedStates[status] ?? DEFAULT_HEALTH_STATES.healthy,
  )

  // Allow prop overrides
  const displayColor = $derived(color ?? stateConfig.color)
  const displayLabel = $derived(label ?? stateConfig.label)
  const Icon = $derived(icon ?? stateConfig.icon)
</script>

<div
  class="flex items-start gap-3 rounded-lg border p-3 {className}"
  style:border-color="{displayColor}40"
  style:background-color="{displayColor}08"
>
  <div
    class="flex h-10 w-10 items-center justify-center rounded-full text-lg"
    style:background-color="{displayColor}20"
    style:color={displayColor}
  >
    <Icon class="size-4" />
  </div>
  <div class="min-w-0 flex-1">
    <span class="text-sm font-semibold" style:color={displayColor}>
      {displayLabel}
    </span>
    <p class="text-muted-foreground mt-0.5 text-sm">
      {message}
    </p>
  </div>
</div>
