<script lang="ts">
  import type { FormComponentSlotProps } from "@inertiajs/core"
  import { Form, page } from "@inertiajs/svelte"
  import { RotateCcw, Sparkles, Zap } from "@lucide/svelte"

  import Badge from "@/components/ui/Badge.svelte"
  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import Checkbox from "@/components/ui/Checkbox.svelte"
  import Field from "@/components/ui/Field.svelte"
  import Input from "@/components/ui/Input.svelte"
  import Label from "@/components/ui/Label.svelte"
  import RadioGroup from "@/components/ui/RadioGroup.svelte"
  import Select from "@/components/ui/Select.svelte"
  import Switch from "@/components/ui/Switch.svelte"
  import Textarea from "@/components/ui/Textarea.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import { playgroundSubmitUserFormPath } from "@/routes"

  type UserData = {
    name: string
    email: string
    bio: string
    plan: string
    notifications: string
    dob: string
    marketing_emails: boolean
    terms: boolean
    tags: string[]
    profile_attributes: {
      avatar_url: string
      timezone: string
    }
    address_attributes: {
      street: string
      city: string
      state: string
      zip: string
      country: string
    }
  }

  type Props = {
    user: UserData
    submitted_params?: Record<string, unknown>
  }

  let { user, submitted_params }: Props = $props()

  // Prefill presets for quick testing
  const presets = {
    valid: {
      name: "John Doe",
      email: "john@example.com",
      bio: "I'm a software developer passionate about building great products.",
      plan: "pro",
      notifications: "direct",
      dob: "1990-05-15",
      marketing_emails: true,
      terms: true,
      tags: ["developer", "designer"],
      profile_attributes: {
        avatar_url: "https://github.com/johndoe.png",
        timezone: "America/New_York",
      },
      address_attributes: {
        street: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zip: "94102",
        country: "US",
      },
    },
    invalid: {
      name: "",
      email: "not-an-email",
      bio: "Short",
      plan: "starter",
      notifications: "all",
      dob: "",
      marketing_emails: false,
      terms: false,
      tags: [],
      profile_attributes: {
        avatar_url: "",
        timezone: "UTC",
      },
      address_attributes: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    },
    nested: {
      name: "Jane Smith",
      email: "jane@company.com",
      bio: "Testing nested attributes with address and profile data.",
      plan: "enterprise",
      notifications: "none",
      dob: "1985-12-01",
      marketing_emails: false,
      terms: true,
      tags: ["admin", "manager"],
      profile_attributes: {
        avatar_url: "https://github.com/janesmith.png",
        timezone: "Europe/London",
      },
      address_attributes: {
        street: "456 Business Ave, Suite 100",
        city: "London",
        state: "Greater London",
        zip: "EC1A 1BB",
        country: "UK",
      },
    },
  } as const

  // Form ref for prefill
  let formRef: HTMLDivElement | null = $state(null)

  function prefillForm(preset: keyof typeof presets) {
    if (!formRef) return
    const data = presets[preset]

    // Fill basic fields
    const fields = formRef.querySelectorAll("input, textarea, select")
    fields.forEach((field) => {
      const input = field as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLSelectElement
      const name = input.name

      if (name === "name") input.value = data.name
      else if (name === "email") input.value = data.email
      else if (name === "bio") (input as HTMLTextAreaElement).value = data.bio
      else if (name === "dob") input.value = data.dob
      else if (name === "plan") input.value = data.plan
      else if (name === "notifications" && input.value === data.notifications) {
        ;(input as HTMLInputElement).checked = true
      } else if (name === "marketing_emails") {
        ;(input as HTMLInputElement).checked = data.marketing_emails
      } else if (name === "terms") {
        ;(input as HTMLInputElement).checked = data.terms
      } else if (name === "profile_attributes[avatar_url]") {
        input.value = data.profile_attributes.avatar_url
      } else if (name === "profile_attributes[timezone]") {
        input.value = data.profile_attributes.timezone
      } else if (name === "address_attributes[street]") {
        input.value = data.address_attributes.street
      } else if (name === "address_attributes[city]") {
        input.value = data.address_attributes.city
      } else if (name === "address_attributes[state]") {
        input.value = data.address_attributes.state
      } else if (name === "address_attributes[zip]") {
        input.value = data.address_attributes.zip
      } else if (name === "address_attributes[country]") {
        input.value = data.address_attributes.country
      }

      // Trigger input event for reactivity
      input.dispatchEvent(new Event("input", { bubbles: true }))
    })
  }

  // Options
  const planOptions = [
    { value: "starter", label: "Starter Plan" },
    { value: "pro", label: "Pro Plan" },
    { value: "enterprise", label: "Enterprise" },
  ]

  const notificationOptions = [
    { value: "all", label: "All new messages" },
    { value: "direct", label: "Direct messages only" },
    { value: "none", label: "Nothing" },
  ]

  const timezoneOptions = [
    { value: "UTC", label: "UTC" },
    { value: "America/New_York", label: "Eastern Time" },
    { value: "America/Los_Angeles", label: "Pacific Time" },
    { value: "Europe/London", label: "London" },
    { value: "Australia/Sydney", label: "Sydney" },
  ]

  const countryOptions = [
    { value: "", label: "Select country..." },
    { value: "US", label: "United States" },
    { value: "CA", label: "Canada" },
    { value: "UK", label: "United Kingdom" },
    { value: "AU", label: "Australia" },
  ]

  // Use page.props.errors directly - it's always authoritative from server
  let errors = $derived($page.props.errors || {})
</script>

<PlaygroundLayout
  title="User Form"
  description="Nested attributes, all input types, and Rails params conventions"
>
  <!-- Quick Actions Card -->
  <Card
    title="Quick Actions"
    description="Prefill form with test data for different scenarios"
  >
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="btn-sm-outline"
        onclick={() => prefillForm("valid")}
      >
        <Sparkles class="size-4" />
        Valid Data
      </button>
      <button
        type="button"
        class="btn-sm-outline"
        onclick={() => prefillForm("invalid")}
      >
        <Zap class="size-4" />
        Invalid Data
      </button>
      <button
        type="button"
        class="btn-sm-outline"
        onclick={() => prefillForm("nested")}
      >
        <Sparkles class="size-4" />
        Nested Attrs
      </button>
      <button
        type="button"
        class="btn-sm-outline"
        onclick={() => document.querySelector("form")?.reset()}
      >
        <RotateCcw class="size-4" />
        Reset Form
      </button>
    </div>
  </Card>

  <Form action={playgroundSubmitUserFormPath()} method="post">
    {#snippet children({
      processing,
      isDirty,
      recentlySuccessful,
    }: FormComponentSlotProps)}
      <!-- Bind form ref for prefill buttons -->
      <div bind:this={formRef} class="contents">
        <div class="space-y-6">
          <!-- Status Bar -->
          {#if isDirty || recentlySuccessful || Object.keys(errors).length > 0}
            <div class="flex flex-wrap gap-2">
              {#if isDirty}
                <Badge variant="secondary">Unsaved changes</Badge>
              {/if}
              {#if recentlySuccessful}
                <Badge
                  class="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Saved successfully!
                </Badge>
              {/if}
              {#if Object.keys(errors).length > 0}
                <Badge variant="destructive">
                  {Object.keys(errors).length} validation error(s)
                </Badge>
              {/if}
            </div>
          {/if}

          <!-- Basic Information -->
          <Card
            title="Basic Information"
            description="Standard form fields with validation"
          >
            <div class="grid gap-6">
              <div class="grid gap-6 sm:grid-cols-2">
                <Field label="Name" name="name" error={errors.name} required>
                  <Input
                    id="field-name"
                    name="name"
                    placeholder="John Doe"
                    defaultValue={user.name}
                    invalid={!!errors.name}
                  />
                </Field>

                <Field label="Email" name="email" error={errors.email} required>
                  <Input
                    id="field-email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    defaultValue={user.email}
                    invalid={!!errors.email}
                  />
                </Field>
              </div>

              <Field
                label="Bio"
                name="bio"
                description="Minimum 10 characters"
                error={errors.bio}
              >
                <Textarea
                  id="field-bio"
                  name="bio"
                  placeholder="Tell us about yourself..."
                  rows={3}
                  defaultValue={user.bio}
                  invalid={!!errors.bio}
                />
              </Field>

              <Field label="Date of Birth" name="dob">
                <Input
                  id="field-dob"
                  name="dob"
                  type="date"
                  defaultValue={user.dob}
                  class="max-w-xs"
                />
              </Field>

              <!-- Hidden field for tags (preserves data during form submission) -->
              {#each user.tags as tag (tag)}
                <input type="hidden" name="tags[]" value={tag} />
              {/each}
            </div>
          </Card>

          <!-- Subscription & Preferences -->
          <Card
            title="Subscription"
            description="Plan selection and notification preferences"
          >
            <div class="grid gap-6">
              <Field label="Plan" name="plan">
                <Select
                  id="plan"
                  name="plan"
                  options={planOptions}
                  value={user.plan}
                  triggerClass="w-full max-w-xs"
                />
              </Field>

              <Field label="Notifications" name="notifications">
                <RadioGroup
                  name="notifications"
                  options={notificationOptions}
                  value={user.notifications}
                />
              </Field>

              <Label class="input-card max-w-md justify-between">
                <div class="flex flex-col gap-0.5">
                  <span class="leading-normal">Marketing emails</span>
                  <p class="text-muted-foreground text-sm font-normal">
                    Receive product updates and announcements
                  </p>
                </div>
                <Switch
                  name="marketing_emails"
                  value="1"
                  defaultChecked={user.marketing_emails}
                />
              </Label>
            </div>
          </Card>

          <!-- Nested: Profile Attributes -->
          <Card>
            {#snippet header()}
              <div class="flex items-center justify-between">
                <div>
                  <h2>Profile Settings</h2>
                  <p>Nested attributes using Rails convention</p>
                </div>
                <Badge variant="secondary">profile_attributes</Badge>
              </div>
            {/snippet}

            <div class="grid gap-6">
              <Field label="Avatar URL" name="profile_attributes.avatar_url">
                <Input
                  id="field-avatar"
                  name="profile_attributes[avatar_url]"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  defaultValue={user.profile_attributes.avatar_url}
                />
              </Field>

              <Field label="Timezone" name="profile_attributes.timezone">
                <Select
                  id="timezone"
                  name="profile_attributes[timezone]"
                  options={timezoneOptions}
                  value={user.profile_attributes.timezone}
                  triggerClass="w-full max-w-xs"
                />
              </Field>
            </div>
          </Card>

          <!-- Nested: Address Attributes -->
          <Card>
            {#snippet header()}
              <div class="flex items-center justify-between">
                <div>
                  <h2>Address</h2>
                  <p>Nested attributes with validation</p>
                </div>
                <Badge variant="secondary">address_attributes</Badge>
              </div>
            {/snippet}

            <div class="grid gap-6">
              <Field label="Street" name="address_attributes.street">
                <Input
                  id="field-street"
                  name="address_attributes[street]"
                  placeholder="123 Main St"
                  defaultValue={user.address_attributes.street}
                />
              </Field>

              <div class="grid gap-4 sm:grid-cols-2">
                <Field
                  label="City"
                  name="address_attributes.city"
                  error={errors["address_attributes.city"]}
                  required
                >
                  <Input
                    id="field-city"
                    name="address_attributes[city]"
                    placeholder="San Francisco"
                    defaultValue={user.address_attributes.city}
                    invalid={!!errors["address_attributes.city"]}
                  />
                </Field>

                <Field label="State" name="address_attributes.state">
                  <Input
                    id="field-state"
                    name="address_attributes[state]"
                    placeholder="CA"
                    defaultValue={user.address_attributes.state}
                  />
                </Field>
              </div>

              <div class="grid gap-4 sm:grid-cols-2">
                <Field label="ZIP Code" name="address_attributes.zip">
                  <Input
                    id="field-zip"
                    name="address_attributes[zip]"
                    placeholder="94102"
                    defaultValue={user.address_attributes.zip}
                  />
                </Field>

                <Field
                  label="Country"
                  name="address_attributes.country"
                  error={errors["address_attributes.country"]}
                  required
                >
                  <Select
                    id="country"
                    name="address_attributes[country]"
                    options={countryOptions}
                    value={user.address_attributes.country}
                    triggerClass="w-full"
                  />
                </Field>
              </div>
            </div>
          </Card>

          <!-- Submit -->
          <Card title="Confirmation">
            <div class="grid gap-6">
              <div class="field" data-invalid={!!errors.terms || undefined}>
                <Label class="cursor-pointer items-center gap-3">
                  <Checkbox
                    name="terms"
                    value="1"
                    defaultChecked={user.terms}
                    invalid={!!errors.terms}
                  />
                  I agree to the terms and conditions
                </Label>
                {#if errors.terms}
                  <div role="alert">{errors.terms}</div>
                {/if}
              </div>

              <div class="flex flex-wrap items-center gap-4">
                <Button type="submit" disabled={processing}>
                  {processing ? "Submitting..." : "Submit Form"}
                </Button>
                <Button type="reset" variant="outline">Reset</Button>
                <span class="text-muted-foreground text-sm">
                  POST to <code class="bg-muted rounded px-1.5 py-0.5"
                    >/playground/form</code
                  >
                </span>
              </div>
            </div>
          </Card>

          <!-- Debug Panels -->
          {#if submitted_params && Object.keys(submitted_params).length > 0}
            <Card class="border-primary/50 bg-primary/5">
              {#snippet header()}
                <h2 class="text-primary">Submitted Params</h2>
                <p>Rails params received from form submission</p>
              {/snippet}
              <pre class="text-primary overflow-auto text-sm">{JSON.stringify(
                  submitted_params,
                  null,
                  2,
                )}</pre>
            </Card>
          {/if}

          {#if Object.keys(errors).length > 0}
            <Card class="border-destructive/50 bg-destructive/5">
              {#snippet header()}
                <h2 class="text-destructive">Validation Errors</h2>
                <p>Server returned the following errors</p>
              {/snippet}
              <pre
                class="text-destructive overflow-auto text-sm">{JSON.stringify(
                  errors,
                  null,
                  2,
                )}</pre>
            </Card>
          {/if}
        </div>
      </div>
    {/snippet}
  </Form>
</PlaygroundLayout>
