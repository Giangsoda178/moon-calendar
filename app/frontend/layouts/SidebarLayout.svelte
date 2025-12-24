<!--
  @component SidebarLayout
  Reusable layout with sidebar navigation and sticky header.
  Uses Basecoat's Sidebar component and event system.

  @example Basic usage with menu
  ```svelte
  <script lang="ts">
    import SidebarLayout from "@/layouts/SidebarLayout.svelte"
    import { Home, Settings } from "@lucide/svelte"

    const menu = [
      {
        type: "group",
        label: "Navigation",
        items: [
          { label: "Home", url: "/", icon: Home },
          { label: "Settings", url: "/settings", icon: Settings },
        ]
      }
    ]
  </script>

  <SidebarLayout sidebarMenu={menu}>
    <YourContent />
  </SidebarLayout>
  ```

  @example With custom sidebar header/footer
  ```svelte
  <SidebarLayout sidebarMenu={menu}>
    {#snippet sidebarHeader()}
      <Logo />
    {/snippet}

    {#snippet sidebarFooter()}
      <UserMenu />
    {/snippet}

    <Content />
  </SidebarLayout>
  ```
-->
<script lang="ts">
  import { Github, PanelLeft } from "@lucide/svelte"
  import type { Snippet } from "svelte"

  import Sidebar, { type SidebarMenu } from "@/components/ui/Sidebar.svelte"
  import ThemeToggle from "@/components/ui/ThemeToggle.svelte"
  import { sidebarState } from "@/runes/sidebar-state.svelte"

  type Props = {
    /** Unique ID for the sidebar */
    sidebarId?: string
    /** Data-driven sidebar menu */
    sidebarMenu?: SidebarMenu
    /** Show theme variant selector in header */
    showThemeVariants?: boolean
    /** Show dark mode toggle in header */
    showDarkModeToggle?: boolean
    /** Show GitHub link in header */
    showGithubLink?: boolean
    /** GitHub repository URL */
    githubUrl?: string
    /** CSS class for sidebar */
    sidebarClass?: string
    /** CSS class for main content area */
    contentClass?: string
    /** Custom sidebar header snippet */
    sidebarHeader?: Snippet
    /** Custom sidebar footer snippet */
    sidebarFooter?: Snippet
    /** Custom header controls (replaces default controls) */
    headerControls?: Snippet
    /** Main content */
    children: Snippet
  }

  let {
    sidebarId = "app-sidebar",
    sidebarMenu,
    showThemeVariants = false,
    showDarkModeToggle = true,
    showGithubLink = false,
    githubUrl = "https://github.com/brodienguyen",
    sidebarClass,
    contentClass,
    sidebarHeader,
    sidebarFooter,
    headerControls,
    children,
  }: Props = $props()

  function toggleSidebar() {
    sidebarState.toggle(sidebarId)
  }
</script>

<Sidebar
  id={sidebarId}
  menu={sidebarMenu}
  class={sidebarClass}
  header={sidebarHeader}
  footer={sidebarFooter}
/>

<main class="h-dvh min-w-0 overflow-x-hidden overflow-y-auto">
  <header
    class="bg-background sticky inset-x-0 top-0 isolate z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4"
  >
    <!-- Sidebar Toggle -->
    <button
      type="button"
      onclick={toggleSidebar}
      aria-label="Toggle sidebar"
      data-tooltip="Toggle sidebar"
      data-side="bottom"
      data-align="start"
      class="btn-sm-icon-ghost mr-auto -ml-1.5 size-7"
    >
      <PanelLeft class="size-4" />
    </button>

    {#if headerControls}
      {@render headerControls()}
    {:else}
      <!-- Default Header Controls -->
      <ThemeToggle
        showVariants={showThemeVariants}
        showMode={showDarkModeToggle}
      />

      {#if showGithubLink}
        <a
          href={githubUrl}
          class="btn-icon size-8"
          target="_blank"
          rel="noopener noreferrer"
          data-tooltip="GitHub repository"
          data-side="bottom"
          data-align="end"
        >
          <Github class="size-4" />
        </a>
      {/if}
    {/if}
  </header>

  <!-- Content Area -->
  <div class={contentClass ?? "min-w-0 p-4 md:p-6 xl:p-12"}>
    {@render children()}
  </div>
</main>
