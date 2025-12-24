<!--
  @component KitchenSinkLayout
  Layout for the kitchen sink page with sidebar navigation.
  Uses AppLayout with kitchen sink specific menu and branding.

  @example
  ```svelte
  <KitchenSinkLayout>
    <Accordion />
    <Alert />
  </KitchenSinkLayout>
  ```
-->
<script lang="ts">
  import {
    ChevronsUpDown,
    FlaskConical,
    Github,
    House,
    LayoutDashboard,
    Smartphone,
  } from "@lucide/svelte"
  import type { Snippet } from "svelte"

  import Logo from "@/assets/logo/Logo.svelte"
  import Popover from "@/components/ui/Popover.svelte"
  import type { SidebarMenu } from "@/components/ui/Sidebar.svelte"
  import SidebarLayout from "@/layouts/SidebarLayout.svelte"
  import {
    kitchenSinkMobileIndexPath,
    kitchenSinkPath,
    playgroundIndexPath,
    rootPath,
  } from "@/routes"

  type Props = {
    children: Snippet
  }

  let { children }: Props = $props()

  // Kitchen sink navigation menu
  const sidebarMenu: SidebarMenu = [
    {
      type: "group",
      label: "Navigation",
      items: [
        { label: "Home", url: rootPath(), icon: House },
        {
          label: "Kitchen Sink",
          url: kitchenSinkPath(),
          icon: LayoutDashboard,
        },
        {
          label: "Mobile Demo",
          url: kitchenSinkMobileIndexPath(),
          icon: Smartphone,
        },
        { label: "Playground", url: playgroundIndexPath(), icon: FlaskConical },
        {
          label: "GitHub",
          url: "https://github.com/brodienguyen",
          icon: Github,
        },
      ],
    },
    {
      type: "group",
      label: "Components",
      items: [
        { label: "Accordion", url: "#accordion" },
        { label: "Alert", url: "#alert" },
        { label: "Alert Dialog", url: "#alert-dialog" },
        { label: "Avatar", url: "#avatar" },
        { label: "Badge", url: "#badge" },
        { label: "Breadcrumb", url: "#breadcrumb" },
        { label: "Button", url: "#button" },
        { label: "Button Group", url: "#button-group" },
        { label: "Card", url: "#card" },
        { label: "Checkbox", url: "#checkbox" },
        { label: "Combobox", url: "#combobox" },
        { label: "Command", url: "#command" },
        { label: "Charts", url: "#charts" },
        { label: "Data Table", url: "#data-table" },
        { label: "Dialog", url: "#dialog" },
        { label: "Dropdown Menu", url: "#dropdown-menu" },
        { label: "Empty", url: "#empty" },
        { label: "Form", url: "#form" },
        { label: "Input", url: "#input" },
        { label: "Input Group", url: "#input-group" },
        { label: "Kbd", url: "#kbd" },
        { label: "Label", url: "#label" },
        { label: "Pagination", url: "#pagination" },
        { label: "Popover", url: "#popover" },
        { label: "Progress", url: "#progress" },
        { label: "Radio Group", url: "#radio-group" },
        { label: "Select", url: "#select" },
        { label: "Skeleton", url: "#skeleton" },
        { label: "Slider", url: "#slider" },
        { label: "Spinner", url: "#spinner" },
        { label: "Switch", url: "#switch" },
        { label: "Tabs", url: "#tabs" },
        { label: "Textarea", url: "#textarea" },
        { label: "Theme Switcher", url: "#theme-switcher" },
        { label: "Toaster", url: "#toaster" },
        { label: "Tooltip", url: "#tooltip" },
      ],
    },
  ]
</script>

<SidebarLayout
  sidebarId="kitchen-sink-sidebar"
  {sidebarMenu}
  sidebarClass="border-r"
  showThemeVariants
  showDarkModeToggle
  showGithubLink
>
  {#snippet sidebarHeader()}
    <a
      href={rootPath()}
      class="btn-ghost flex h-12 w-full items-center justify-start gap-2 p-2"
    >
      <Logo class="size-8" invert />
      <div class="grid flex-1 text-left text-sm leading-tight">
        <span class="truncate font-medium">Component Library</span>
        <span class="text-muted-foreground truncate text-xs">for Svelte 5</span>
      </div>
    </a>
  {/snippet}

  {#snippet sidebarFooter()}
    <Popover
      id="sidebar-popover"
      side="top"
      class="w-full"
      matchTriggerWidth
      triggerClass="text-secondary-foreground p-2 h-12 w-full flex items-center justify-start"
    >
      {#snippet trigger()}
        <img
          src="https://github.com/brodienguyen.png"
          class="size-8 shrink-0 rounded-lg"
          alt="User"
        />
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">brodienguyen</span>
          <span class="truncate text-xs">@brodienguyen</span>
        </div>
        <ChevronsUpDown class="size-4" />
      {/snippet}

      <div class="grid gap-4">
        <header class="grid gap-1.5">
          <h2 class="font-semibold">Component Library for Svelte 5</h2>
          <p class="text-muted-foreground text-sm">
            This is a Svelte 5 UI library based on top of Basecoat UI
            components. If you find it useful, please star the repository on
            GitHub.
          </p>
        </header>
        <footer class="grid gap-2">
          <a
            href="https://github.com/brodienguyen"
            class="btn-sm"
            target="_blank"
          >
            Star on GitHub
          </a>
        </footer>
      </div>
    </Popover>
  {/snippet}

  {@render children()}
</SidebarLayout>
