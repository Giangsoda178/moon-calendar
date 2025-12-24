<script lang="ts">
  import {
    Bell,
    Check,
    ChevronsUpDown,
    CreditCard,
    Ellipsis,
    LogOut,
    Pencil,
    Settings,
    Share,
    Sparkles,
    Trash2,
    User,
  } from "@lucide/svelte"

  import DropdownMenu from "@/components/ui/DropdownMenu.svelte"
  import Kbd from "@/components/ui/Kbd.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./DropdownMenu.svelte?raw"

  // Checkbox state
  let statusBar = $state(true)
  let activityBar = $state(false)
  let panel = $state(false)

  // Radio state
  let position = $state<"top" | "bottom" | "right">("bottom")
</script>

<Section id="dropdown-menu" title="Dropdown Menu" code={rawCode}>
  <!-- Basic Examples -->
  <div class="flex min-w-0 flex-wrap items-start gap-4">
    <DropdownMenu
      id="dropdown-menu-default"
      triggerClass="btn-outline"
      popoverClass="min-w-56"
    >
      {#snippet trigger()}
        Open
      {/snippet}

      <div role="group" aria-labelledby="account-options">
        <div role="heading" aria-level="2" id="account-options">My Account</div>
        <button type="button" role="menuitem">
          Profile
          <Kbd class="ml-auto">⇧⌘P</Kbd>
        </button>
        <button type="button" role="menuitem">
          Billing
          <Kbd class="ml-auto">⌘B</Kbd>
        </button>
        <button type="button" role="menuitem">
          Settings
          <Kbd class="ml-auto">⌘S</Kbd>
        </button>
        <button type="button" role="menuitem">
          Keyboard shortcuts
          <Kbd class="ml-auto">⌘K</Kbd>
        </button>
      </div>
      <hr />
      <button type="button" role="menuitem">GitHub</button>
      <button type="button" role="menuitem">Support</button>
      <button type="button" role="menuitem" aria-disabled="true" disabled
        >API</button
      >
      <hr />
      <button type="button" role="menuitem">
        Logout
        <Kbd class="ml-auto">⇧⌘Q</Kbd>
      </button>
    </DropdownMenu>

    <DropdownMenu
      id="dropdown-more-actions"
      triggerClass="btn-icon-ghost"
      popoverClass="min-w-32"
    >
      {#snippet trigger()}
        <Ellipsis class="size-4" />
      {/snippet}

      <button type="button" role="menuitem">
        <Pencil class="size-4" />
        Edit
      </button>
      <button type="button" role="menuitem">
        <Share class="size-4" />
        Share
      </button>
      <hr />
      <button
        type="button"
        role="menuitem"
        class="text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20 focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive [&_svg]:!text-destructive"
      >
        <Trash2 class="size-4" />
        Delete
      </button>
    </DropdownMenu>
  </div>

  <!-- Selection Types -->
  <p class="text-muted-foreground mt-6 mb-2 text-sm">Selection Types:</p>
  <div class="flex min-w-0 flex-col items-start gap-4 sm:flex-row sm:flex-wrap">
    <DropdownMenu
      id="dropdown-menu-checkboxes"
      triggerClass="btn-outline"
      popoverClass="min-w-56"
    >
      {#snippet trigger()}
        Checkboxes
      {/snippet}

      <div role="group" aria-labelledby="account-options-cb">
        <div role="heading" aria-level="2" id="account-options-cb">
          Account Options
        </div>
        <button type="button" role="menuitem">
          <User class="size-4" />
          Profile
          <Kbd class="ml-auto">⇧⌘P</Kbd>
        </button>
        <button type="button" role="menuitem">
          <CreditCard class="size-4" />
          Billing
          <Kbd class="ml-auto">⌘B</Kbd>
        </button>
        <button type="button" role="menuitem">
          <Settings class="size-4" />
          Settings
          <Kbd class="ml-auto">⌘S</Kbd>
        </button>
      </div>
      <hr />
      <div role="group" aria-labelledby="appearance-options">
        <div role="heading" aria-level="2" id="appearance-options">
          Appearance
        </div>
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={statusBar}
          class="group"
          onclick={() => (statusBar = !statusBar)}
        >
          <Check
            class="invisible size-4 group-aria-checked:visible"
            aria-hidden="true"
          />
          Status Bar
          <Kbd class="ml-auto">⇧⌘S</Kbd>
        </button>
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={activityBar}
          class="group"
          aria-disabled="true"
          disabled
        >
          <Check
            class="invisible size-4 group-aria-checked:visible"
            aria-hidden="true"
          />
          Activity Bar
          <Kbd class="ml-auto">⌘B</Kbd>
        </button>
        <button
          type="button"
          role="menuitemcheckbox"
          aria-checked={panel}
          class="group"
          onclick={() => (panel = !panel)}
        >
          <Check
            class="invisible size-4 group-aria-checked:visible"
            aria-hidden="true"
          />
          Panel
          <Kbd class="ml-auto">⌘P</Kbd>
        </button>
      </div>
      <hr />
      <button type="button" role="menuitem">
        <LogOut class="size-4" />
        Logout
        <Kbd class="ml-auto">⇧⌘Q</Kbd>
      </button>
    </DropdownMenu>

    <DropdownMenu
      id="dropdown-menu-radio-group"
      triggerClass="btn-outline"
      popoverClass="min-w-56"
    >
      {#snippet trigger()}
        Radio Group
      {/snippet}

      <div role="group" aria-labelledby="position-options">
        <span id="position-options" role="heading" aria-level="2"
          >Panel Position</span
        >
        <hr />
        <button
          type="button"
          role="menuitemradio"
          aria-checked={position === "top"}
          class="group"
          onclick={() => (position = "top")}
        >
          <div class="flex size-4 items-center justify-center">
            <div
              class="bg-foreground invisible size-2 rounded-full group-aria-checked:visible"
              aria-hidden="true"
            ></div>
          </div>
          Top
          <Kbd class="ml-auto">⇧⌘T</Kbd>
        </button>
        <button
          type="button"
          role="menuitemradio"
          aria-checked={position === "bottom"}
          class="group"
          onclick={() => (position = "bottom")}
        >
          <div class="flex size-4 items-center justify-center">
            <div
              class="bg-foreground invisible size-2 rounded-full group-aria-checked:visible"
              aria-hidden="true"
            ></div>
          </div>
          Bottom
          <Kbd class="ml-auto">⌘B</Kbd>
        </button>
        <button
          type="button"
          role="menuitemradio"
          aria-checked={position === "right"}
          class="group"
          onclick={() => (position = "right")}
        >
          <div class="flex size-4 items-center justify-center">
            <div
              class="bg-foreground invisible size-2 rounded-full group-aria-checked:visible"
              aria-hidden="true"
            ></div>
          </div>
          Right
          <Kbd class="ml-auto">⌘R</Kbd>
        </button>
      </div>
    </DropdownMenu>
  </div>

  <!-- Alignment Variants -->
  <p class="text-muted-foreground mt-6 mb-2 text-sm">Alignment Variants:</p>
  <div
    class="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start"
  >
    <div class="flex justify-start">
      <DropdownMenu
        id="dropdown-align-start"
        triggerClass="btn-outline"
        popoverClass="min-w-40"
        align="start"
      >
        {#snippet trigger()}
          Align Start
        {/snippet}
        <button type="button" role="menuitem">Option 1</button>
        <button type="button" role="menuitem">Option 2</button>
        <button type="button" role="menuitem">Option 3</button>
      </DropdownMenu>
    </div>

    <div class="flex justify-center">
      <DropdownMenu
        id="dropdown-align-center"
        triggerClass="btn-outline"
        popoverClass="min-w-40"
        align="center"
      >
        {#snippet trigger()}
          Align Center
        {/snippet}
        <button type="button" role="menuitem">Option 1</button>
        <button type="button" role="menuitem">Option 2</button>
        <button type="button" role="menuitem">Option 3</button>
      </DropdownMenu>
    </div>

    <div class="flex justify-end">
      <DropdownMenu
        id="dropdown-align-end"
        triggerClass="btn-outline"
        popoverClass="min-w-40"
        align="end"
      >
        {#snippet trigger()}
          Align End
        {/snippet}
        <button type="button" role="menuitem">Option 1</button>
        <button type="button" role="menuitem">Option 2</button>
        <button type="button" role="menuitem">Option 3</button>
      </DropdownMenu>
    </div>
  </div>

  <!-- User Menu Patterns -->
  <p class="text-muted-foreground mt-6 mb-2 text-sm">User Menu Patterns:</p>
  <div class="flex min-w-0 flex-wrap items-start gap-4">
    <DropdownMenu
      id="dropdown-user-profile"
      class="min-w-48"
      triggerClass="btn-outline h-12 w-full justify-start px-2"
      matchTriggerWidth
    >
      {#snippet trigger()}
        <img
          alt="@brodienguyen"
          src="https://github.com/brodienguyen.png"
          class="size-8 shrink-0 rounded-full"
        />
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">brodienguyen</span>
          <span class="text-muted-foreground truncate text-xs"
            >brodienguyen@example.com</span
          >
        </div>
        <ChevronsUpDown class="text-muted-foreground ml-auto size-4" />
      {/snippet}

      <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <img
          alt="@brodienguyen"
          src="https://github.com/brodienguyen.png"
          class="size-8 shrink-0 rounded-full"
        />
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">brodienguyen</span>
          <span class="text-muted-foreground truncate text-xs"
            >brodienguyen@example.com</span
          >
        </div>
      </div>
      <hr />
      <button type="button" role="menuitem">
        <Sparkles class="size-4" />
        Upgrade to Pro
      </button>
      <hr />
      <button type="button" role="menuitem">
        <User class="size-4" />
        Account
      </button>
      <button type="button" role="menuitem">
        <CreditCard class="size-4" />
        Billing
      </button>
      <button type="button" role="menuitem">
        <Bell class="size-4" />
        Notifications
      </button>
      <hr />
      <button type="button" role="menuitem">
        <LogOut class="size-4" />
        Signout
      </button>
    </DropdownMenu>

    <DropdownMenu
      id="dropdown-avatar"
      triggerClass="btn-icon-ghost size-8 rounded-full"
      popoverClass="min-w-48"
    >
      {#snippet trigger()}
        <img
          alt="@brodienguyen"
          src="https://github.com/brodienguyen.png"
          class="size-8 shrink-0 rounded-full"
        />
      {/snippet}

      <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <img
          alt="@brodienguyen"
          src="https://github.com/brodienguyen.png"
          class="size-8 shrink-0 rounded-full"
        />
        <div class="grid flex-1 text-left text-sm leading-tight">
          <span class="truncate font-medium">brodienguyen</span>
          <span class="text-muted-foreground truncate text-xs"
            >brodienguyen@example.com</span
          >
        </div>
      </div>
      <hr />
      <button type="button" role="menuitem">
        <Sparkles class="size-4" />
        Upgrade to Pro
      </button>
      <hr />
      <button type="button" role="menuitem">
        <User class="size-4" />
        Account
      </button>
      <button type="button" role="menuitem">
        <CreditCard class="size-4" />
        Billing
      </button>
      <button type="button" role="menuitem">
        <Bell class="size-4" />
        Notifications
      </button>
      <hr />
      <button type="button" role="menuitem">
        <LogOut class="size-4" />
        Signout
      </button>
    </DropdownMenu>
  </div>
</Section>
