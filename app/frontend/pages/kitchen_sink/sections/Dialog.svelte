<script lang="ts">
  import Button from "@/components/ui/Button.svelte"
  import Dialog from "@/components/ui/Dialog.svelte"
  import Field from "@/components/ui/Field.svelte"
  import Input from "@/components/ui/Input.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Dialog.svelte?raw"

  // Form state for Edit Profile dialog
  let name = $state("Brodie Nguyen")
  let username = $state("@brodienguyen")

  // Dialog open states (using $bindable from Dialog component)
  let editProfileOpen = $state(false)
  let scrollableOpen = $state(false)
</script>

<Section id="dialog" title="Dialog" code={rawCode}>
  <div class="flex flex-wrap items-center gap-4">
    <!-- Edit Profile Dialog with inline trigger -->
    <Dialog
      id="demo-dialog-edit-profile"
      title="Edit profile"
      description="Make changes to your profile here. Click save when you're done."
      trigger="Edit Profile"
      bind:open={editProfileOpen}
    >
      <form class="form grid gap-4">
        <Field label="Name" name="name">
          <Input id="field-name" bind:value={name} />
        </Field>
        <Field label="Username" name="username">
          <Input id="field-username" bind:value={username} />
        </Field>
      </form>

      {#snippet footer()}
        <Button variant="outline" onclick={() => (editProfileOpen = false)}>
          Cancel
        </Button>
        <Button onclick={() => (editProfileOpen = false)}>Save changes</Button>
      {/snippet}
    </Dialog>

    <!-- Scrollable Content Dialog with inline trigger -->
    <Dialog
      id="dialog-scrollable"
      title="Scrollable Content"
      description="This is a dialog with scrollable content."
      trigger="Scrollable Content"
      bodyClass="scrollbar overflow-y-auto"
      bind:open={scrollableOpen}
    >
      <div class="space-y-4 text-sm">
        {#each { length: 10 } as _, i (i)}
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        {/each}
      </div>

      {#snippet footer()}
        <Button variant="outline" onclick={() => (scrollableOpen = false)}>
          Close
        </Button>
      {/snippet}
    </Dialog>
  </div>
</Section>
