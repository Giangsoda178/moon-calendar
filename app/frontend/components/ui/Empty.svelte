<!--
  @component Empty
  Display empty states with icons, titles, descriptions, and actions.

  @example Basic usage
  ```svelte
  <script>
    import { FolderCode } from "@lucide/svelte"
  </script>
  <Empty title="No Projects Yet" description="You haven't created any projects yet.">
    {#snippet icon()}<FolderCode />{/snippet}
  </Empty>
  ```

  @example With actions
  ```svelte
  <Empty title="No Results" description="Try adjusting your search filters.">
    {#snippet icon()}<Search />{/snippet}
    {#snippet actions()}
      <Button>Clear Filters</Button>
      <Button variant="outline">Help</Button>
    {/snippet}
  </Empty>
  ```

  @example Outline variant with border
  ```svelte
  <Empty variant="outline" title="Cloud Storage Empty" description="Upload files to access them anywhere.">
    {#snippet icon()}<Cloud />{/snippet}
    {#snippet actions()}
      <Button size="sm" variant="outline">Upload Files</Button>
    {/snippet}
  </Empty>
  ```

  @example With avatar
  ```svelte
  <Empty title="User Offline" description="This user is currently offline.">
    {#snippet avatar()}
      <img src="https://github.com/shadcn.png" alt="User" class="size-12 rounded-full grayscale" />
    {/snippet}
    {#snippet actions()}
      <Button size="sm">Leave Message</Button>
    {/snippet}
  </Empty>
  ```

  @example With link
  ```svelte
  <Empty title="No Projects" description="Get started by creating your first project.">
    {#snippet icon()}<FolderPlus />{/snippet}
    {#snippet actions()}
      <Button>Create Project</Button>
    {/snippet}
    {#snippet link()}
      <a href="/docs" class="btn-link text-muted-foreground">
        Learn More
        <ArrowUpRight class="size-4" />
      </a>
    {/snippet}
  </Empty>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Visual variant */
    variant?: "default" | "outline"
    /** Empty state title */
    title?: string
    /** Empty state description */
    description?: string
    /** CSS class for container */
    class?: string
    /** Icon slot (renders in muted background box) */
    icon?: Snippet
    /** Avatar slot (alternative to icon, renders avatar/image) */
    avatar?: Snippet
    /** Actions slot for buttons */
    actions?: Snippet
    /** Link slot for secondary action */
    link?: Snippet
    /** Children slot for custom content */
    children?: Snippet
  }

  let {
    variant = "default",
    title,
    description,
    class: className,
    icon,
    avatar,
    actions,
    link,
    children,
  }: Props = $props()

  const baseClasses =
    "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12 text-neutral-800 dark:text-neutral-300"

  const variantClasses = {
    default: "",
    outline: "border",
  }
</script>

<div class={cn(baseClasses, variantClasses[variant], className)}>
  <header class="flex max-w-sm flex-col items-center gap-2 text-center">
    {#if icon}
      <div
        class="bg-muted text-foreground mb-2 flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6"
      >
        {@render icon()}
      </div>
    {:else if avatar}
      <div class="mb-2 flex items-center justify-center">
        {@render avatar()}
      </div>
    {/if}

    {#if title}
      <h3 class="text-lg font-medium tracking-tight">{title}</h3>
    {/if}

    {#if description}
      <p
        class="text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4"
      >
        {description}
      </p>
    {/if}

    {#if children}
      {@render children()}
    {/if}
  </header>

  {#if actions}
    <section
      class="flex w-full max-w-sm min-w-0 flex-col items-center gap-4 text-sm text-balance"
    >
      <div class="flex gap-2">
        {@render actions()}
      </div>
    </section>
  {/if}

  {#if link}
    {@render link()}
  {/if}
</div>
