<!--
  @component Avatar
  User avatar with image, fallback initials, and automatic error handling.

  @example Basic with image
  ```svelte
  <Avatar src="https://github.com/user.png" alt="@username" />
  ```

  @example Fallback initials (when no image or image fails to load)
  ```svelte
  <Avatar fallback="JD" />
  <Avatar fallback="AB" size="lg" />
  ```

  @example Size variants: sm (32px), md (40px), lg (48px), xl (64px)
  ```svelte
  <Avatar src="/avatar.jpg" size="sm" />
  <Avatar src="/avatar.jpg" size="md" />
  <Avatar src="/avatar.jpg" size="lg" />
  <Avatar src="/avatar.jpg" size="xl" />
  ```

  @example Shape variants: circle (default), square
  ```svelte
  <Avatar src="/avatar.jpg" shape="circle" />
  <Avatar src="/avatar.jpg" shape="square" />
  ```

  @example Avatar group (stacked with overlap)
  ```svelte
  <div class="flex -space-x-2">
    <Avatar src="/user1.jpg" class="ring-2 ring-background" />
    <Avatar src="/user2.jpg" class="ring-2 ring-background" />
    <Avatar fallback="+3" class="ring-2 ring-background" />
  </div>
  ```

  @example Avatar group with hover expand effect
  ```svelte
  <div class="flex -space-x-2 transition-all hover:space-x-1">
    <Avatar src="/user1.jpg" class="ring-2 ring-background transition-all" />
    <Avatar src="/user2.jpg" class="ring-2 ring-background transition-all" />
    <Avatar src="/user3.jpg" class="ring-2 ring-background transition-all" />
  </div>
  ```

  @example Custom styling via class props
  ```svelte
  <Avatar
    src="/avatar.jpg"
    class="ring-2 ring-primary"
    imageClass="grayscale hover:grayscale-0 transition-all"
  />
  ```
-->
<script lang="ts">
  import { cn } from "@/utils"

  type Props = {
    /** Image source URL */
    src?: string
    /** Alt text for image */
    alt?: string
    /** Fallback text (initials) */
    fallback?: string
    /** Size variant */
    size?: "sm" | "md" | "lg" | "xl"
    /** Shape variant */
    shape?: "circle" | "square"
    /** CSS class override */
    class?: string
    /** CSS class for image */
    imageClass?: string
    /** CSS class for fallback */
    fallbackClass?: string
  }

  let {
    src,
    alt = "",
    fallback,
    size = "md",
    shape = "circle",
    class: className,
    imageClass,
    fallbackClass,
  }: Props = $props()

  let imageError = $state(false)

  const sizeClasses = {
    sm: "size-8 text-xs",
    md: "size-10 text-sm",
    lg: "size-12 text-base",
    xl: "size-16 text-lg",
  }

  const shapeClasses = {
    circle: "rounded-full",
    square: "rounded-md",
  }

  function handleImageError() {
    imageError = true
  }
</script>

<span
  class={cn(
    "bg-muted relative inline-flex items-center justify-center overflow-hidden",
    sizeClasses[size],
    shapeClasses[shape],
    className,
  )}
>
  {#if src && !imageError}
    <img
      {src}
      {alt}
      class={cn("aspect-square size-full object-cover", imageClass)}
      onerror={handleImageError}
    />
  {:else if fallback}
    <span
      class={cn("text-muted-foreground font-medium select-none", fallbackClass)}
    >
      {fallback}
    </span>
  {:else}
    <svg
      class="text-muted-foreground size-1/2"
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
      />
    </svg>
  {/if}
</span>
