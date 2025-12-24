<script lang="ts">
  import {
    Check,
    Component,
    Copy,
    Mail,
    Monitor,
    RefreshCw,
    Send,
    Smartphone,
    Tablet,
  } from "@lucide/svelte"

  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import Combobox, {
    type ComboboxOptionGroup,
  } from "@/components/ui/Combobox.svelte"
  import Input from "@/components/ui/Input.svelte"
  import Label from "@/components/ui/Label.svelte"
  import Select from "@/components/ui/Select.svelte"
  import TabPanel from "@/components/ui/TabPanel.svelte"
  import Tabs from "@/components/ui/Tabs.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import {
    playgroundEmailPreviewPath,
    playgroundPartialPreviewPath,
    playgroundSendTestEmailPath,
  } from "@/routes"
  import { toast } from "@/runes/toast.svelte"
  import { useAppearance } from "@/runes/use-appearance.svelte"

  interface Props {
    email_types: string[]
    email_type_labels: Record<string, string>
  }

  let { email_types: _email_types, email_type_labels }: Props = $props()

  // Shared appearance state - synced across all components
  const appearance = useAppearance()

  // Derive theme and mode from shared appearance (auto-synced with header switcher)
  const selectedTheme = $derived(appearance.variant)
  const selectedMode = $derived<"light" | "dark">(
    appearance.isDark ? "dark" : "light",
  )

  // Shared state
  let selectedTab = $state(0)

  // Email templates state
  let selectedEmailType = $state("welcome")
  let previewHtml = $state("")
  let isLoading = $state(false)
  let isSending = $state(false)
  let previewViewport = $state<"mobile" | "tablet" | "desktop">("desktop")

  // Partials state
  let selectedPartial = $state("button")
  // eslint-disable-next-line svelte/prefer-writable-derived -- partialProps needs manual editing capability
  let partialProps = $state<Record<string, string>>({})
  let partialPreviewHtml = $state("")
  let isLoadingPartial = $state(false)
  let partialPreviewViewport = $state<"mobile" | "tablet" | "desktop">(
    "desktop",
  )

  // Viewport widths
  const viewportWidths = {
    mobile: "375px",
    tablet: "768px",
    desktop: "100%",
  }

  // Mailer folder mapping (for template paths)
  const mailerFolders: Record<string, string> = {
    password_reset: "transactional_mailer",
    email_verification: "transactional_mailer",
    magic_login: "transactional_mailer",
    welcome: "transactional_mailer",
    account_verified: "transactional_mailer",
    account_deleted: "transactional_mailer",
    activity_alert: "notification_mailer",
    status_update: "notification_mailer",
    reminder: "notification_mailer",
    security_alert: "notification_mailer",
    invoice: "notification_mailer",
    newsletter: "marketing_mailer",
    promotion: "marketing_mailer",
    announcement: "marketing_mailer",
    product_update: "marketing_mailer",
  }

  function getEmailTemplateFullPath(type: string): string {
    const folder = mailerFolders[type]
    return folder ? `app/views/${folder}/${type}.html.erb` : "unknown"
  }

  function getEmailTemplateShortPath(type: string): string {
    return `${type}.html.erb`
  }

  function getPartialFullPath(partial: string): string {
    return `app/views/mailers/shared/_${partial}.html.erb`
  }

  // Copy to clipboard state
  let copiedEmail = $state(false)
  let copiedPartial = $state(false)

  async function copyToClipboard(text: string, type: "email" | "partial") {
    await navigator.clipboard.writeText(text)
    if (type === "email") {
      copiedEmail = true
      setTimeout(() => (copiedEmail = false), 2000)
    } else {
      copiedPartial = true
      setTimeout(() => (copiedPartial = false), 2000)
    }
  }

  // Build option groups for email type selector (Combobox format)
  const emailTypeOptions: ComboboxOptionGroup[] = [
    {
      label: "Transactional",
      options: [
        { value: "password_reset", label: "Password Reset" },
        { value: "email_verification", label: "Email Verification" },
        { value: "magic_login", label: "Magic Login" },
        { value: "welcome", label: "Welcome" },
        { value: "account_verified", label: "Account Verified" },
        { value: "account_deleted", label: "Account Deleted" },
      ],
    },
    {
      label: "Notifications",
      options: [
        { value: "activity_alert", label: "Activity Alert" },
        { value: "status_update", label: "Status Update" },
        { value: "reminder", label: "Reminder" },
        { value: "security_alert", label: "Security Alert" },
        { value: "invoice", label: "Invoice" },
      ],
    },
    {
      label: "Marketing",
      options: [
        { value: "newsletter", label: "Newsletter" },
        { value: "promotion", label: "Promotion" },
        { value: "announcement", label: "Announcement" },
        { value: "product_update", label: "Product Update" },
      ],
    },
  ]

  // Partial options
  const partialOptions = [
    { value: "header", label: "Header" },
    { value: "footer", label: "Footer" },
    { value: "button", label: "Button" },
    { value: "card", label: "Card" },
    { value: "divider", label: "Divider" },
    { value: "badge", label: "Badge" },
    { value: "alert", label: "Alert" },
    { value: "progress", label: "Progress" },
    { value: "social_icons", label: "Social Icons" },
    { value: "line_items", label: "Line Items" },
    { value: "key_value", label: "Key-Value" },
  ]

  // Partial configs - defines editable props
  const partialConfigs: Record<
    string,
    { props: string[]; hasContent: boolean }
  > = {
    header: { props: [], hasContent: false },
    footer: { props: [], hasContent: false },
    button: { props: ["text", "url"], hasContent: false },
    card: { props: [], hasContent: true },
    divider: { props: [], hasContent: false },
    badge: { props: ["text", "variant"], hasContent: false },
    alert: { props: ["variant"], hasContent: true },
    progress: { props: ["percent", "label"], hasContent: false },
    social_icons: { props: [], hasContent: false },
    line_items: { props: [], hasContent: false },
    key_value: { props: [], hasContent: false },
  }

  // Default prop values for each partial - FIXED to match actual ERB variants
  const defaultProps: Record<string, Record<string, string>> = {
    button: { text: "Click Here", url: "https://example.com" },
    badge: { text: "New", variant: "primary" },
    alert: { variant: "default" }, // alert uses: default, destructive
    progress: { percent: "65", label: "65% complete" },
    header: { logo_url: "" },
  }

  // Variant options per partial type
  const variantOptions: Record<string, { value: string; label: string }[]> = {
    badge: [
      { value: "primary", label: "Primary" },
      { value: "secondary", label: "Secondary" },
      { value: "destructive", label: "Destructive" },
      { value: "outline", label: "Outline" },
    ],
    alert: [
      { value: "default", label: "Default" },
      { value: "destructive", label: "Destructive" },
    ],
  }

  async function loadPreview() {
    isLoading = true
    try {
      const params = new URLSearchParams({
        email_type: selectedEmailType,
        theme: selectedTheme,
        mode: selectedMode,
      })
      const response = await fetch(`${playgroundEmailPreviewPath()}?${params}`)
      const data = await response.json()
      previewHtml = data.html
    } catch (error) {
      console.error("Failed to load preview:", error)
    } finally {
      isLoading = false
    }
  }

  async function loadPartialPreview() {
    isLoadingPartial = true
    try {
      const params = new URLSearchParams({
        partial: selectedPartial,
        theme: selectedTheme,
        mode: selectedMode,
        ...partialProps,
      })
      const response = await fetch(
        `${playgroundPartialPreviewPath()}?${params}`,
      )
      const data = await response.json()
      partialPreviewHtml = data.html
    } catch (error) {
      console.error("Failed to load partial preview:", error)
    } finally {
      isLoadingPartial = false
    }
  }

  async function sendTestEmail() {
    isSending = true
    try {
      const csrfToken = document.querySelector<HTMLMetaElement>(
        'meta[name="csrf-token"]',
      )?.content

      const response = await fetch(playgroundSendTestEmailPath(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken || "",
        },
        body: JSON.stringify({
          email_type: selectedEmailType,
          theme: selectedTheme,
          mode: selectedMode,
          recipient: "test@example.com",
        }),
      })

      if (response.ok) {
        toast.success("Test email sent!", {
          description: "Check your inbox!",
          action: {
            label: "Open Mailpit",
            onclick: () => window.open("http://localhost:8025", "_blank"),
          },
        })
      } else {
        const error = await response.json()
        toast.error("Failed to send email", {
          description: error.error || "Unknown error",
        })
      }
    } catch (error) {
      console.error("Failed to send email:", error)
      toast.error("Failed to send email", {
        description: "Check console for details",
      })
    } finally {
      isSending = false
    }
  }

  // Reset props when partial changes
  $effect(() => {
    partialProps = { ...(defaultProps[selectedPartial] || {}) }
  })

  // Load email preview when tab is templates and options change
  $effect(() => {
    if (selectedTab === 0) {
      // Track dependencies
      void selectedEmailType
      void selectedTheme
      void selectedMode
      loadPreview()
    }
  })

  // Load partial preview when tab is partials and options change
  $effect(() => {
    if (selectedTab === 1) {
      // Track dependencies
      void selectedPartial
      void selectedTheme
      void selectedMode
      void JSON.stringify(partialProps) // trigger on props changes
      loadPartialPreview()
    }
  })
</script>

<PlaygroundLayout
  title="Email Templates"
  description="Preview and test themed email templates with live rendering"
>
  <Tabs id="email-playground" bind:selected={selectedTab}>
    {#snippet tabs()}
      <button><Mail class="mr-2 size-4" /> Email Templates</button>
      <button><Component class="mr-2 size-4" /> Component Partials</button>
    {/snippet}

    {#snippet panels()}
      <!-- Email Templates Tab -->
      <TabPanel id="email-playground" index={0} selected={selectedTab}>
        <div class="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
          <!-- Controls Panel -->
          <div class="space-y-4">
            <Card class="p-4">
              <div class="space-y-4">
                <!-- Email Type Selector (Combobox for searchable 18 options) -->
                <div class="space-y-2">
                  <Label for="email_type">Email Type</Label>
                  <Combobox
                    id="email_type"
                    class="w-full"
                    options={emailTypeOptions}
                    bind:value={selectedEmailType}
                    placeholder="Select email..."
                    searchPlaceholder="Search emails..."
                    popoverClass="w-64"
                  />
                </div>
              </div>
            </Card>

            <!-- Actions -->
            <Card class="p-4">
              <div class="space-y-2">
                <Button
                  variant="outline"
                  class="w-full"
                  onclick={loadPreview}
                  disabled={isLoading}
                >
                  <RefreshCw
                    class="mr-2 size-4 {isLoading ? 'animate-spin' : ''}"
                  />
                  Refresh Preview
                </Button>
              </div>

              <p class="text-muted-foreground mt-2 space-y-2 text-xs">
                {#if import.meta.env.DEV}
                  <Button
                    class="w-full"
                    onclick={sendTestEmail}
                    disabled={isSending}
                  >
                    <Send class="mr-2 size-4" />
                    {isSending ? "Sending..." : "Send Test Email"}
                  </Button>
                {:else}
                  <Button class="w-full" onclick={sendTestEmail} disabled>
                    <Send class="mr-2 size-4" />
                    {isSending ? "Sending..." : "Send Test Email"}
                  </Button>

                  <span class="text-destructive">
                    Email sending is only supported development environment.
                  </span>
                {/if}
              </p>
            </Card>

            <!-- Info -->
            <Card class="p-4">
              <h3 class="mb-2 text-sm font-medium">Current Selection</h3>
              <dl class="text-muted-foreground space-y-1 text-xs">
                <div class="flex justify-between">
                  <dt>Theme:</dt>
                  <dd class="text-foreground font-medium">{selectedTheme}</dd>
                </div>
                <div class="flex justify-between">
                  <dt>Mode:</dt>
                  <dd class="text-foreground font-medium">{selectedMode}</dd>
                </div>
                <div class="flex justify-between">
                  <dt>Email:</dt>
                  <dd class="text-foreground font-medium">
                    {email_type_labels[selectedEmailType]}
                  </dd>
                </div>
              </dl>
            </Card>
          </div>

          <!-- Preview Panel -->
          <Card class="overflow-hidden">
            {#snippet header()}
              <div
                class="bg-muted/30 flex items-center gap-2 border-b px-4 py-2"
              >
                <Mail class="text-muted-foreground size-4" />
                <span class="text-sm font-medium">Preview</span>

                <button
                  type="button"
                  class="bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs transition-colors"
                  onclick={() =>
                    copyToClipboard(
                      getEmailTemplateFullPath(selectedEmailType),
                      "email",
                    )}
                  aria-label="Copy full path"
                >
                  <span>{getEmailTemplateShortPath(selectedEmailType)}</span>
                  {#if copiedEmail}
                    <Check class="size-3 text-green-500" />
                  {:else}
                    <Copy class="size-3" />
                  {/if}
                </button>

                {#if isLoading}
                  <span class="text-muted-foreground text-xs">Loading...</span>
                {/if}

                <!-- Viewport toggle -->
                <div class="ml-auto flex gap-1">
                  <Button
                    variant={previewViewport === "mobile"
                      ? "secondary"
                      : "ghost"}
                    size="sm-icon"
                    onclick={() => (previewViewport = "mobile")}
                    aria-label="Mobile (375px)"
                  >
                    <Smartphone class="size-4" />
                  </Button>
                  <Button
                    variant={previewViewport === "tablet"
                      ? "secondary"
                      : "ghost"}
                    size="sm-icon"
                    onclick={() => (previewViewport = "tablet")}
                    aria-label="Tablet (768px)"
                  >
                    <Tablet class="size-4" />
                  </Button>
                  <Button
                    variant={previewViewport === "desktop"
                      ? "secondary"
                      : "ghost"}
                    size="sm-icon"
                    onclick={() => (previewViewport = "desktop")}
                    aria-label="Desktop (100%)"
                  >
                    <Monitor class="size-4" />
                  </Button>
                </div>
              </div>
            {/snippet}

            <div class="bg-muted/20 flex justify-center p-4">
              {#if previewHtml}
                <iframe
                  srcdoc={previewHtml}
                  title="Email Preview"
                  class="h-[700px] rounded border bg-white shadow-sm transition-all"
                  style="width: {viewportWidths[
                    previewViewport
                  ]}; max-width: 100%;"
                  sandbox=""
                />
              {:else}
                <div
                  class="text-muted-foreground flex h-[800px] w-full items-center justify-center"
                >
                  {isLoading
                    ? "Loading preview..."
                    : "Select options to preview email"}
                </div>
              {/if}
            </div>
          </Card>
        </div>
      </TabPanel>

      <!-- Component Partials Tab -->
      <TabPanel id="email-playground" index={1} selected={selectedTab}>
        <div class="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
          <!-- Controls Panel -->
          <div class="space-y-4">
            <Card class="p-4">
              <div class="space-y-4">
                <!-- Partial Selector -->
                <div class="space-y-2">
                  <Label for="partial">Partial</Label>
                  <Select
                    id="partial"
                    options={partialOptions}
                    bind:value={selectedPartial}
                  />
                </div>
              </div>
            </Card>

            <!-- Props Editor -->
            <Card class="p-4">
              <h3 class="mb-3 text-sm font-medium">Props</h3>
              {#each partialConfigs[selectedPartial]?.props || [] as prop (prop)}
                <div class="mb-3 space-y-1">
                  <Label for={prop}>{prop}</Label>
                  {#if prop === "variant"}
                    <Select
                      id={prop}
                      options={variantOptions[selectedPartial] || []}
                      value={partialProps[prop] ??
                        (defaultProps[selectedPartial]?.[prop] || "")}
                      onchange={(v) => (partialProps[prop] = v)}
                    />
                  {:else}
                    <Input
                      id={prop}
                      value={partialProps[prop] ?? ""}
                      oninput={(e) =>
                        (partialProps[prop] = e.currentTarget.value)}
                      placeholder={prop}
                    />
                  {/if}
                </div>
              {/each}
              {#if (partialConfigs[selectedPartial]?.props.length ?? 0) === 0}
                <p class="text-muted-foreground text-xs">
                  No configurable props
                </p>
              {/if}
            </Card>

            <!-- Refresh -->
            <Button
              variant="outline"
              class="w-full"
              onclick={loadPartialPreview}
              disabled={isLoadingPartial}
            >
              <RefreshCw
                class="mr-2 size-4 {isLoadingPartial ? 'animate-spin' : ''}"
              />
              Refresh Preview
            </Button>
          </div>

          <!-- Partial Preview -->
          <Card class="overflow-hidden">
            {#snippet header()}
              <div
                class="bg-muted/30 flex items-center gap-2 border-b px-4 py-2"
              >
                <Component class="text-muted-foreground size-4" />
                <span class="text-sm font-medium">Preview</span>

                <button
                  type="button"
                  class="bg-muted text-muted-foreground hover:text-foreground flex items-center gap-1 rounded px-2 py-0.5 font-mono text-xs transition-colors"
                  onclick={() =>
                    copyToClipboard(
                      getPartialFullPath(selectedPartial),
                      "partial",
                    )}
                  aria-label="Copy full path"
                >
                  <span>_{selectedPartial}.html.erb</span>
                  {#if copiedPartial}
                    <Check class="size-3 text-green-500" />
                  {:else}
                    <Copy class="size-3" />
                  {/if}
                </button>

                {#if isLoadingPartial}
                  <span class="text-muted-foreground text-xs">Loading...</span>
                {/if}

                <!-- Viewport toggle -->
                <div class="ml-auto flex gap-1">
                  <Button
                    variant={partialPreviewViewport === "mobile"
                      ? "secondary"
                      : "ghost"}
                    size="sm-icon"
                    onclick={() => (partialPreviewViewport = "mobile")}
                    aria-label="Mobile (375px)"
                  >
                    <Smartphone class="size-4" />
                  </Button>
                  <Button
                    variant={partialPreviewViewport === "tablet"
                      ? "secondary"
                      : "ghost"}
                    size="sm-icon"
                    onclick={() => (partialPreviewViewport = "tablet")}
                    aria-label="Tablet (768px)"
                  >
                    <Tablet class="size-4" />
                  </Button>
                  <Button
                    variant={partialPreviewViewport === "desktop"
                      ? "secondary"
                      : "ghost"}
                    size="sm-icon"
                    onclick={() => (partialPreviewViewport = "desktop")}
                    aria-label="Desktop (100%)"
                  >
                    <Monitor class="size-4" />
                  </Button>
                </div>
              </div>
            {/snippet}

            <div class="bg-muted/20 flex justify-center p-4">
              {#if partialPreviewHtml}
                <iframe
                  srcdoc={partialPreviewHtml}
                  title="Partial Preview"
                  class="h-[300px] rounded border bg-white shadow-sm transition-all"
                  style="width: {viewportWidths[
                    partialPreviewViewport
                  ]}; max-width: 100%;"
                  sandbox=""
                />
              {:else}
                <div
                  class="text-muted-foreground flex h-[300px] w-full items-center justify-center"
                >
                  {isLoadingPartial
                    ? "Loading preview..."
                    : "Select a partial to preview"}
                </div>
              {/if}
            </div>
          </Card>
        </div>
      </TabPanel>
    {/snippet}
  </Tabs>
</PlaygroundLayout>
