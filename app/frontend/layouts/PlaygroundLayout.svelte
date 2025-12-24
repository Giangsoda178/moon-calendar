<!--
  @component PlaygroundLayout
  Layout for playground demo pages with sidebar navigation.
  Uses AppLayout with playground-specific menu.

  @example Basic usage
  ```svelte
  <PlaygroundLayout>
    <YourDemoContent />
  </PlaygroundLayout>
  ```

  @example With custom content class
  ```svelte
  <PlaygroundLayout contentClass="p-6">
    <FormDemo />
  </PlaygroundLayout>
  ```
-->
<script lang="ts">
  import {
    Activity,
    ChevronsUpDown,
    Compass,
    Database,
    DatabaseZap,
    FlaskConical,
    Github,
    House,
    KeyRound,
    LayoutDashboard,
    List,
    Mail,
    Radio,
    Users,
  } from "@lucide/svelte"
  import type { Snippet } from "svelte"

  import Button from "@/components/ui/Button.svelte"
  import Popover from "@/components/ui/Popover.svelte"
  import type { SidebarMenu } from "@/components/ui/Sidebar.svelte"
  import SidebarLayout from "@/layouts/SidebarLayout.svelte"
  import {
    kitchenSinkPath,
    playgroundContactFormPath,
    playgroundDataLoadingPath,
    playgroundEmailsPath,
    playgroundIndexPath,
    playgroundListsStatePath,
    playgroundLoginFormPath,
    playgroundNavigationDemoPath,
    playgroundOncePropsPath,
    playgroundRealtimePath,
    playgroundUserFormPath,
    playgroundWebsocketPath,
    rootPath,
  } from "@/routes"

  type Props = {
    /** Page title (shown as header) */
    title?: string
    /** Page description */
    description?: string
    /** CSS class for content area */
    contentClass?: string
    /** Main content */
    children: Snippet
  }

  let {
    title,
    description,
    contentClass = "p-4 md:p-6",
    children,
  }: Props = $props()

  // Playground navigation menu
  const sidebarMenu: SidebarMenu = [
    {
      type: "group",
      label: "Navigation",
      items: [
        { label: "Home", url: rootPath(), icon: House },
        { label: "Playground", url: playgroundIndexPath(), icon: FlaskConical },
        {
          label: "Kitchen Sink",
          url: kitchenSinkPath(),
          icon: LayoutDashboard,
        },
        {
          label: "GitHub",
          url: "https://github.com/brodienguyen",
          icon: Github,
        },
      ],
    },
    {
      type: "group",
      label: "Forms & Validation",
      items: [
        { label: "Login Form", url: playgroundLoginFormPath(), icon: KeyRound },
        { label: "Contact Form", url: playgroundContactFormPath(), icon: Mail },
        { label: "User Form", url: playgroundUserFormPath(), icon: Users },
      ],
    },
    {
      type: "group",
      label: "Advanced Patterns",
      items: [
        {
          label: "Navigation",
          url: playgroundNavigationDemoPath(),
          icon: Compass,
        },
        {
          label: "Data Loading",
          url: playgroundDataLoadingPath(),
          icon: Database,
        },
        {
          label: "Once Props",
          url: playgroundOncePropsPath(),
          icon: DatabaseZap,
        },
        { label: "Real-time", url: playgroundRealtimePath(), icon: Activity },
        { label: "Lists & State", url: playgroundListsStatePath(), icon: List },
        { label: "WebSocket", url: playgroundWebsocketPath(), icon: Radio },
      ],
    },
    {
      type: "group",
      label: "Email",
      items: [
        { label: "Email Templates", url: playgroundEmailsPath(), icon: Mail },
      ],
    },
  ]
</script>

<SidebarLayout
  sidebarId="playground-sidebar"
  {sidebarMenu}
  sidebarClass="border-r"
  showThemeVariants
  showDarkModeToggle
  showGithubLink
  {contentClass}
>
  {#snippet sidebarHeader()}
    <a
      href={rootPath()}
      class="btn-ghost flex h-12 w-full items-center justify-start gap-2 p-2"
    >
      <div
        class="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 items-center justify-center rounded-lg"
      >
        <FlaskConical class="size-4" />
      </div>
      <div class="grid flex-1 text-left text-sm leading-tight">
        <span class="truncate font-medium">Playground</span>
        <span class="text-muted-foreground truncate text-xs">v0.1.0</span>
      </div>
    </a>
  {/snippet}

  {#snippet sidebarFooter()}
    <Popover
      id="playground-sidebar-popover"
      side="top"
      class="w-full"
      matchTriggerWidth
      triggerClass="btn-ghost p-2 h-12 w-full flex items-center justify-start"
    >
      {#snippet trigger()}
        <div
          class="bg-muted flex size-8 shrink-0 items-center justify-center rounded-lg"
        >
          <FlaskConical class="text-muted-foreground size-4" />
        </div>
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">Playground</span>
          <span class="truncate text-xs">Demo Patterns</span>
        </div>
        <ChevronsUpDown class="size-4" />
      {/snippet}

      <div class="grid gap-4">
        <header class="grid gap-1.5">
          <h2 class="font-semibold">Playground Demos</h2>
          <p class="text-muted-foreground text-sm">
            Interactive demos showcasing Inertia.js patterns with Rails backend
            integration.
          </p>
        </header>
        <footer class="grid gap-2">
          <Button href={kitchenSinkPath()} size="sm">
            <LayoutDashboard class="size-4" />
            View Kitchen Sink
          </Button>
          <Button href="https://inertiajs.com" variant="outline">
            Inertia.js Docs
          </Button>
        </footer>
      </div>
    </Popover>
  {/snippet}

  <div class="space-y-6">
    {#if title}
      <header>
        <h1 class="text-3xl font-bold">{title}</h1>
        {#if description}
          <p class="text-muted-foreground mt-1">{description}</p>
        {/if}
      </header>
    {/if}

    {@render children()}
  </div>
</SidebarLayout>
