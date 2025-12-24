<script lang="ts">
  import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Command, { type CommandItems } from "@/components/ui/Command.svelte"
  import Kbd from "@/components/ui/Kbd.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"
  import { toast } from "@/runes/toast.svelte"

  import rawCode from "./Command.svelte?raw"

  let dialogOpen = $state(false)

  // Data-driven items configuration
  // - filterText: Primary search text (defaults to label). Use when label differs from searchable text.
  // - keywords: Additional synonyms users might search by. Try typing "schedule", "money", or "config"!
  const commandItems: CommandItems = [
    {
      type: "group",
      label: "Suggestions",
      items: [
        {
          label: "Calendar",
          icon: Calendar,
          filterText: "calendar",
          keywords: "event date schedule appointment meeting", // Try: "schedule"
          onclick: () => toast.info("Opening Calendar..."),
        },
        {
          label: "Search Emoji",
          icon: Smile,
          filterText: "emoji",
          keywords: "emoticon smiley face expression", // Try: "smiley"
          onclick: () => toast.info("Opening Emoji Picker..."),
        },
        {
          label: "Calculator",
          icon: Calculator,
          keywords: "math compute numbers arithmetic", // Try: "math"
          disabled: true,
        },
      ],
    },
    { type: "separator" },
    {
      type: "group",
      label: "Settings",
      items: [
        {
          label: "Profile",
          icon: User,
          keywords: "account user me personal", // Try: "account"
          shortcut: "⌘P",
          onclick: () => toast.info("Opening Profile..."),
        },
        {
          label: "Billing",
          icon: CreditCard,
          keywords: "payment subscription money invoice card", // Try: "money"
          shortcut: "⌘B",
          onclick: () => toast.info("Opening Billing..."),
        },
        {
          label: "Settings",
          icon: Settings,
          keywords: "preferences config options customize", // Try: "config"
          shortcut: "⌘S",
          onclick: () => toast.info("Opening Settings..."),
        },
      ],
    },
  ]
</script>

<Section id="command" title="Command" code={rawCode}>
  <div class="flex flex-col gap-8">
    <!-- Standalone Command Menu -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Standalone:</p>
      <p class="text-muted-foreground mb-2 text-xs">
        💡 Try searching: <code class="bg-muted rounded px-1">schedule</code>,
        <code class="bg-muted rounded px-1">money</code>, or
        <code class="bg-muted rounded px-1">config</code> to see keyword matching
      </p>
      <div class="w-full max-w-[450px]">
        <Command items={commandItems} class="rounded-lg border shadow-md" />
      </div>
    </div>

    <!-- Dialog Command Menu (hidden in preview to avoid duplicate shortcut listeners) -->
    <div class="preview-hide">
      <p class="text-muted-foreground mb-2 text-sm">
        Dialog (press <Kbd>⌘K</Kbd> to open):
      </p>
      <Button variant="outline" onclick={() => (dialogOpen = true)}>
        Open command menu
        <Kbd>⌘K</Kbd>
      </Button>

      <Command
        dialog
        bind:open={dialogOpen}
        shortcut="cmd+K"
        items={commandItems}
      />
    </div>

    <!-- Note shown only in preview modal -->
    <p class="preview-show text-muted-foreground text-sm italic">
      Note: Dialog variant hidden in preview (duplicate shortcut listeners
      conflict).
    </p>
  </div>
</Section>
