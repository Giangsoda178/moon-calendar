<script lang="ts">
  import Button from "@/components/ui/Button.svelte"
  import Checkbox from "@/components/ui/Checkbox.svelte"
  import Field from "@/components/ui/Field.svelte"
  import Input from "@/components/ui/Input.svelte"
  import Label from "@/components/ui/Label.svelte"
  import RadioGroup from "@/components/ui/RadioGroup.svelte"
  import Select from "@/components/ui/Select.svelte"
  import Switch from "@/components/ui/Switch.svelte"
  import Textarea from "@/components/ui/Textarea.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Form.svelte?raw"

  // Form state using $state for reactivity
  let username = $state("brodienguyen")
  let email = $state("m@example.com")
  let bio = $state("")
  let notifications = $state("all")
  let mobileSettings = $state(false)
  let sidebarItems = $state(["recents", "home"])
  let dob = $state("")
  let marketingEmails = $state(false)

  // Select options
  const emailOptions = [
    { value: "m@example.com", label: "m@example.com" },
    { value: "m@google.com", label: "m@google.com" },
    { value: "m@support.com", label: "m@support.com" },
  ]

  // RadioGroup options
  const notificationOptions = [
    { value: "all", label: "All new messages" },
    { value: "direct", label: "Direct messages and mentions" },
    { value: "none", label: "Nothing" },
  ]

  // Sidebar checkbox options
  const sidebarOptions = [
    { value: "recents", label: "Recents" },
    { value: "home", label: "Home" },
    { value: "applications", label: "Applications" },
    { value: "desktop", label: "Desktop" },
    { value: "downloads", label: "Downloads" },
    { value: "documents", label: "Documents" },
  ]

  function toggleSidebarItem(value: string) {
    if (sidebarItems.includes(value)) {
      sidebarItems = sidebarItems.filter((v) => v !== value)
    } else {
      sidebarItems = [...sidebarItems, value]
    }
  }
</script>

<Section id="form" title="Form" code={rawCode}>
  <form class="form grid w-full max-w-sm gap-6">
    <!-- Text input with Field -->
    <Field
      label="Username"
      name="username"
      description="This is your public display name."
    >
      <Input
        id="field-username"
        name="username"
        placeholder="brodienguyen"
        bind:value={username}
      />
    </Field>

    <!-- Select with Field -->
    <Field
      label="Email"
      name="email"
      description="You can manage email addresses in your email settings."
    >
      <Select
        id="email"
        name="email"
        options={emailOptions}
        bind:value={email}
        triggerClass="w-full"
      />
    </Field>

    <!-- Textarea with Field -->
    <Field
      label="Bio"
      name="bio"
      description="You can @mention other users and organizations."
    >
      <Textarea
        id="field-bio"
        name="bio"
        placeholder="I like to..."
        rows={3}
        bind:value={bio}
      />
    </Field>

    <!-- RadioGroup with Field -->
    <Field label="Notify me about..." name="notifications">
      <RadioGroup
        name="notifications"
        options={notificationOptions}
        bind:value={notifications}
      />
    </Field>

    <!-- Checkbox card style -->
    <Label class="input-card">
      <Checkbox name="mobile_settings" bind:checked={mobileSettings} />
      <div class="flex flex-col gap-1">
        <span class="leading-snug"
          >Use different settings for my mobile devices</span
        >
        <p class="text-muted-foreground text-sm leading-snug font-normal">
          You can manage your mobile notifications in the mobile settings page.
        </p>
      </div>
    </Label>

    <!-- Checkbox group -->
    <div class="flex flex-col gap-4">
      <header>
        <p class="text-base leading-normal font-medium">Sidebar</p>
        <p class="text-muted-foreground text-sm">
          Select the items you want to display in the sidebar.
        </p>
      </header>
      <div class="flex flex-col gap-2">
        {#each sidebarOptions as option (option.value)}
          <Label class="cursor-pointer items-center gap-3 font-normal">
            <Checkbox
              name="sidebar[]"
              value={option.value}
              checked={sidebarItems.includes(option.value)}
              onchange={() => toggleSidebarItem(option.value)}
            />
            {option.label}
          </Label>
        {/each}
      </div>
    </div>

    <!-- Date input with Field -->
    <Field
      label="Date of birth"
      name="dob"
      description="Your date of birth is used to calculate your age."
    >
      <Input id="field-dob" type="date" name="dob" bind:value={dob} />
    </Field>

    <!-- Switch card section -->
    <section class="grid gap-4">
      <p class="text-lg font-medium">Email Notifications</p>

      <!-- Switch enabled -->
      <Label class="input-card justify-between">
        <div class="flex flex-col gap-0.5">
          <span class="leading-normal">Marketing emails</span>
          <p class="text-muted-foreground text-sm font-normal">
            Receive emails about new products, features, and more.
          </p>
        </div>
        <Switch name="marketing_emails" bind:checked={marketingEmails} />
      </Label>

      <!-- Switch disabled -->
      <Label class="input-card justify-between">
        <div class="flex flex-col gap-0.5">
          <span class="leading-normal">Security emails</span>
          <p class="text-muted-foreground text-sm font-normal">
            Receive emails about your account security.
          </p>
        </div>
        <Switch name="security_emails" checked={false} disabled />
      </Label>
    </section>

    <Button type="submit">Submit</Button>
  </form>
</Section>
