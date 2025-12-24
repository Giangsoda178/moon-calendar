<!--
  @component DeviceFrame
  iPhone-style device frame for previewing mobile UI on desktop.
  Only shows frame on larger screens, renders content directly on mobile.

  @example
  ```svelte
  <DeviceFrame>
    <MobileLayout>
      <div>Mobile content here</div>
    </MobileLayout>
  </DeviceFrame>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Device type to simulate */
    device?: "iphone" | "android"
    /** Additional CSS classes */
    class?: string
    /** Content to display */
    children: Snippet
  }

  let { device = "iphone", class: className, children }: Props = $props()
</script>

<!-- Desktop: show device frame -->
<div
  class={cn(
    "bg-muted/30 hidden min-h-screen items-center justify-center p-8 md:flex",
    className,
  )}
>
  <div
    class={cn(
      "bg-secondary relative rounded-[3rem] border-8 shadow-xl",
      device === "iphone" && "border-border",
    )}
  >
    <!-- Dynamic Island / Notch (iPhone) -->
    {#if device === "iphone"}
      <div
        class="bg-secondary absolute top-2 left-1/2 z-10 h-9 w-32 -translate-x-1/2 rounded-3xl"
      ></div>
    {/if}

    <!-- Screen - transform creates containing block for fixed elements -->
    <div
      class="bg-background relative flex flex-col overflow-hidden rounded-[2.5rem]"
      style="width: 375px; height: 812px; transform: translateZ(0);"
      data-device-frame
    >
      <!-- Content area - sole scrollable container -->
      <div class="flex-1 overflow-y-auto overscroll-contain">
        {@render children()}
      </div>
    </div>

    <!-- Home indicator (iPhone) -->
    {#if device === "iphone"}
      <div
        class="bg-border absolute bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full"
      ></div>
    {/if}
  </div>
</div>

<!-- Mobile: render content directly -->
<div class="h-dvh md:hidden">
  {@render children()}
</div>
