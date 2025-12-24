<script lang="ts">
  import Button from "@/components/ui/Button.svelte"
  import Dialog from "@/components/ui/Dialog.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./AlertDialog.svelte?raw"

  // AlertDialog is just a Dialog with closeButton=false and closeOnOverlayClick=false
  let alertOpen = $state(false)
</script>

<Section id="alert-dialog" title="Alert Dialog" code={rawCode}>
  <Dialog
    id="alert-dialog-demo"
    title="Are you absolutely sure?"
    description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
    trigger="Open alert dialog"
    closeButton={false}
    closeOnOverlayClick={false}
    bind:open={alertOpen}
  >
    {#snippet footer()}
      <Button variant="outline" onclick={() => (alertOpen = false)}>
        Cancel
      </Button>
      <Button onclick={() => (alertOpen = false)}>Continue</Button>
    {/snippet}
  </Dialog>
</Section>
