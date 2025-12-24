<script lang="ts">
  import {
    ArrowUpRight,
    Cloud,
    FolderCode,
    Plus,
    Search,
    Users,
  } from "@lucide/svelte"

  import Avatar from "@/components/ui/Avatar.svelte"
  import Button from "@/components/ui/Button.svelte"
  import Empty from "@/components/ui/Empty.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Empty.svelte?raw"
</script>

<Section id="empty" title="Empty" code={rawCode}>
  <div class="grid gap-8">
    <!-- Basic Empty State -->
    <div class="max-w-md">
      <p class="text-muted-foreground mb-2 text-sm">Basic:</p>
      <Empty
        title="No Projects Yet"
        description="You haven't created any projects yet. Get started by creating your first project."
      >
        {#snippet icon()}<FolderCode />{/snippet}
        {#snippet actions()}
          <Button>Create Project</Button>
          <Button variant="outline">Import Project</Button>
        {/snippet}
        {#snippet link()}
          <button
            type="button"
            class="text-muted-foreground inline-flex items-center gap-1.5 text-sm hover:underline"
          >
            Learn More
            <ArrowUpRight class="size-4" />
          </button>
        {/snippet}
      </Empty>
    </div>

    <!-- Outline Variant -->
    <div class="max-w-md">
      <p class="text-muted-foreground mb-2 text-sm">Outline Variant:</p>
      <Empty
        variant="outline"
        title="Cloud Storage Empty"
        description="Upload files to your cloud storage to access them anywhere."
      >
        {#snippet icon()}<Cloud />{/snippet}
        {#snippet actions()}
          <Button size="sm" variant="outline">Upload Files</Button>
        {/snippet}
      </Empty>
    </div>

    <!-- With Avatar -->
    <div class="max-w-md">
      <p class="text-muted-foreground mb-2 text-sm">With Avatar:</p>
      <Empty
        variant="outline"
        title="User Offline"
        description="This user is currently offline. You can leave a message to notify them."
      >
        {#snippet avatar()}
          <img
            src="https://github.com/shadcn.png"
            alt="User"
            class="size-12 rounded-full object-cover grayscale"
          />
        {/snippet}
        {#snippet actions()}
          <Button size="sm">Leave Message</Button>
        {/snippet}
      </Empty>
    </div>

    <!-- Avatar Group -->
    <div class="max-w-md">
      <p class="text-muted-foreground mb-2 text-sm">Avatar Group:</p>
      <Empty
        variant="outline"
        title="No Team Members"
        description="Invite your team to collaborate on this project."
      >
        {#snippet avatar()}
          <div class="flex -space-x-2">
            <Avatar
              src="https://github.com/brodienguyen.png"
              class="ring-background ring-2 transition-all duration-300"
            />
            <Avatar
              src="https://github.com/shadcn.png"
              class="ring-background ring-2 transition-all duration-300"
            />
            <Avatar
              src="https://github.com/hunvreus.png"
              class="ring-background ring-2 transition-all duration-300"
            />
            <Avatar
              fallback="+3"
              class="ring-background ring-2 transition-all duration-300"
            />
          </div>
        {/snippet}
        {#snippet actions()}
          <Button size="sm">
            <Plus class="size-4" />
            Invite Members
          </Button>
        {/snippet}
      </Empty>
    </div>

    <!-- Search Not Found -->
    <div class="max-w-md">
      <p class="text-muted-foreground mb-2 text-sm">Search Not Found:</p>
      <Empty
        variant="outline"
        title="No Results Found"
        description="Try adjusting your search or filter to find what you're looking for."
      >
        {#snippet icon()}<Search />{/snippet}
        {#snippet actions()}
          <Button size="sm" variant="outline">Clear Search</Button>
        {/snippet}
      </Empty>
    </div>

    <!-- No Team Members -->
    <div class="max-w-md">
      <p class="text-muted-foreground mb-2 text-sm">Minimal:</p>
      <Empty
        variant="outline"
        title="No Users"
        description="No users have been added to this workspace."
      >
        {#snippet icon()}<Users />{/snippet}
      </Empty>
    </div>
  </div>
</Section>
