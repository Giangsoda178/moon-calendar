<script lang="ts">
  import {
    Archive,
    ArrowRight,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Ellipsis,
    Minus,
    Plus,
    Search,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import DropdownMenu from "@/components/ui/DropdownMenu.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./ButtonGroup.svelte?raw"
</script>

<Section id="button-group" title="Button Group" code={rawCode}>
  <div class="flex min-w-0 flex-col gap-6">
    <p class="text-muted-foreground text-sm">
      CSS-only component using `.button-group` class:
    </p>

    <!-- Basic usage -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Basic:</p>
      <div role="group" class="button-group">
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
        <Button variant="outline">Delete</Button>
      </div>
    </div>

    <!-- Size variants -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Size Variants:</p>
      <div class="flex flex-col items-start gap-4">
        <div role="group" class="button-group">
          <Button variant="outline" size="sm">Small</Button>
          <Button variant="outline" size="sm">Button</Button>
          <Button variant="outline" size="sm-icon">
            <Plus class="size-4" />
          </Button>
        </div>
        <div role="group" class="button-group">
          <Button variant="outline">Default</Button>
          <Button variant="outline">Button</Button>
          <Button variant="outline" size="icon"><Plus class="size-4" /></Button>
        </div>
        <div role="group" class="button-group">
          <Button variant="outline" size="lg">Large</Button>
          <Button variant="outline" size="lg">Button</Button>
          <Button variant="outline" size="lg-icon">
            <Plus class="size-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- Vertical orientation -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Vertical Orientation:</p>
      <div role="group" class="button-group" data-orientation="vertical">
        <Button variant="outline" size="icon" aria-label="Zoom in">
          <Plus class="size-4" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Zoom out">
          <Minus class="size-4" />
        </Button>
      </div>
    </div>

    <!-- With separator -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">With Separator:</p>
      <div role="group" class="button-group">
        <Button variant="secondary">Copy</Button>
        <hr />
        <Button variant="secondary">Paste</Button>
      </div>
    </div>

    <!-- With input -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">With Input:</p>
      <div class="button-group">
        <input type="text" class="input" placeholder="Search..." />
        <Button variant="outline" size="icon">
          <Search class="size-4" />
        </Button>
      </div>
    </div>

    <!-- Nested groups -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Nested Groups:</p>
      <div
        role="group"
        aria-label="Pagination controls"
        class="flex w-fit items-stretch gap-2"
      >
        <div role="group" class="button-group">
          <Button variant="outline" size="sm">1</Button>
          <Button variant="outline" size="sm">2</Button>
          <Button variant="outline" size="sm">3</Button>
          <Button variant="outline" size="sm">4</Button>
          <Button variant="outline" size="sm">5</Button>
        </div>
        <div role="group" class="button-group">
          <Button variant="outline" size="sm-icon" aria-label="Previous">
            <ChevronLeft class="size-4" />
          </Button>
          <Button variant="outline" size="sm-icon" aria-label="Next">
            <ChevronRight class="size-4" />
          </Button>
        </div>
      </div>
    </div>

    <!-- With dropdown menu -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">With Dropdown Menu:</p>
      <div role="group" class="button-group">
        <Button variant="outline">
          <Archive class="size-4" />
          Archive
        </Button>
        <DropdownMenu
          id="btn-group-dropdown"
          triggerClass="btn-icon-outline"
          align="end"
        >
          {#snippet trigger()}
            <ChevronDown class="size-4" />
          {/snippet}
          <div role="menuitem">Mark as Read</div>
          <div role="menuitem">Move to Folder</div>
          <hr />
          <div role="menuitem" class="text-destructive">Delete</div>
        </DropdownMenu>
      </div>
    </div>

    <!-- Complex example -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Complex Example:</p>
      <div class="flex w-fit items-stretch gap-2">
        <Button variant="outline" size="icon" aria-label="Go Back">
          <ArrowRight class="size-4 rotate-180" />
        </Button>

        <div role="group" class="button-group">
          <Button variant="outline">Archive</Button>
          <Button variant="outline">Report</Button>
        </div>

        <div role="group" class="button-group">
          <Button variant="outline">Snooze</Button>
          <DropdownMenu
            id="btn-group-complex-dropdown"
            triggerClass="btn-icon-outline"
            align="end"
          >
            {#snippet trigger()}
              <Ellipsis class="size-4" />
            {/snippet}
            <div role="menuitem">Mark as Read</div>
            <div role="menuitem">Add to Calendar</div>
            <hr />
            <div role="menuitem" class="text-destructive">Trash</div>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>
</Section>
