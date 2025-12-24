<script lang="ts">
  import { AppWindow, Code } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Field from "@/components/ui/Field.svelte"
  import Input from "@/components/ui/Input.svelte"
  import TabPanel from "@/components/ui/TabPanel.svelte"
  import Tabs from "@/components/ui/Tabs.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Tabs.svelte?raw"

  let withPanelsSelected = $state(1)
  let withoutPanelsSelected = $state(0)
  let disabledSelected = $state(0)
  let withIconsSelected = $state(0)
</script>

<Section id="tabs" title="Tabs" code={rawCode}>
  <div class="flex flex-col gap-6">
    <!-- Tabs with panels -->
    <Tabs
      id="demo-tabs-with-panels"
      bind:selected={withPanelsSelected}
      class="max-w-[300px]"
      tablistClass="w-full"
    >
      {#snippet tabs()}
        <button>Account</button>
        <button>Password</button>
      {/snippet}

      {#snippet panels()}
        <TabPanel
          id="demo-tabs-with-panels"
          index={0}
          selected={withPanelsSelected}
        >
          <div class="card">
            <header>
              <h2>Account</h2>
              <p>
                Make changes to your account here. Click save when you're done.
              </p>
            </header>
            <section>
              <form class="form grid gap-6">
                <Field label="Name" name="tabs-account-name">
                  <Input id="field-tabs-account-name" value="Brodie Nguyen" />
                </Field>
                <Field label="Username" name="tabs-account-username">
                  <Input
                    id="field-tabs-account-username"
                    value="@brodienguyen"
                  />
                </Field>
              </form>
            </section>
            <footer>
              <Button>Save changes</Button>
            </footer>
          </div>
        </TabPanel>

        <TabPanel
          id="demo-tabs-with-panels"
          index={1}
          selected={withPanelsSelected}
        >
          <div class="card">
            <header>
              <h2>Password</h2>
              <p>
                Change your password here. After saving, you'll be logged out.
              </p>
            </header>
            <section>
              <form class="form grid gap-6">
                <Field label="Current password" name="tabs-password-current">
                  <Input id="field-tabs-password-current" type="password" />
                </Field>
                <Field label="New password" name="tabs-password-new">
                  <Input id="field-tabs-password-new" type="password" />
                </Field>
              </form>
            </section>
            <footer>
              <Button>Save Password</Button>
            </footer>
          </div>
        </TabPanel>
      {/snippet}
    </Tabs>

    <!-- Tabs without panels (navigation style) -->
    <Tabs id="demo-tabs-without-panels" bind:selected={withoutPanelsSelected}>
      {#snippet tabs()}
        <button>Home</button>
        <button>Settings</button>
      {/snippet}
    </Tabs>

    <!-- Tabs with disabled state -->
    <Tabs id="demo-tabs-disabled" bind:selected={disabledSelected}>
      {#snippet tabs()}
        <button>Home</button>
        <button disabled>Disabled</button>
      {/snippet}
    </Tabs>

    <!-- Tabs with icons -->
    <Tabs id="demo-tabs-with-icons" bind:selected={withIconsSelected}>
      {#snippet tabs()}
        <button>
          <AppWindow />
          Preview
        </button>
        <button>
          <Code />
          Code
        </button>
      {/snippet}
    </Tabs>
  </div>
</Section>
