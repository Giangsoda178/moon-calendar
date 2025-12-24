<script lang="ts">
  import {
    Bell,
    ChevronRight,
    CircleHelp,
    Globe,
    Info,
    KeyRound,
    LogOut,
    Moon,
    Palette,
    Search,
    ShieldCheck,
    Smartphone,
    Sun,
    Volume2,
  } from "@lucide/svelte"

  import Avatar from "@/components/ui/Avatar.svelte"
  import Button from "@/components/ui/Button.svelte"
  import InputGroup from "@/components/ui/InputGroup.svelte"
  import AppBar from "@/components/ui/mobile/AppBar.svelte"
  import BottomNav from "@/components/ui/mobile/BottomNav.svelte"
  import BottomSheet from "@/components/ui/mobile/BottomSheet.svelte"
  import MobileLayout from "@/components/ui/mobile/MobileLayout.svelte"
  import SettingsItem from "@/components/ui/mobile/SettingsItem.svelte"
  import SettingsSection from "@/components/ui/mobile/SettingsSection.svelte"
  import { kitchenSinkMobileIndexPath } from "@/routes"
  import { useAppearance } from "@/runes/use-appearance.svelte"
  import { type ThemeVariant, getThemeLabel, themeVariantKeys } from "@/themes"

  import DeviceFrame from "./shared/DeviceFrame.svelte"
  import { navItems } from "./shared/nav-items"

  const appearance = useAppearance()

  // Settings state
  let notifications = $state(true)
  let sounds = $state(true)
  let biometrics = $state(false)
  let twoFactorAuth = $state(true)

  // Search state
  let searchQuery = $state("")

  // Sheet state
  let languageSheetOpen = $state(false)
  let themeSheetOpen = $state(false)
  let selectedLanguage = $state("English")

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Chinese",
  ]

  function selectLanguage(lang: string) {
    selectedLanguage = lang
    languageSheetOpen = false
  }

  function selectTheme(variant: ThemeVariant) {
    appearance.updateVariant(variant)
    themeSheetOpen = false
  }
</script>

<DeviceFrame>
  <MobileLayout>
    {#snippet header()}
      <AppBar title="Settings" backHref={kitchenSinkMobileIndexPath()} />
    {/snippet}

    <div class="flex flex-col gap-5 p-4">
      <!-- Search Bar -->
      <InputGroup>
        {#snippet prefix()}<Search class="size-4" />{/snippet}
        <input
          type="text"
          class="input bg-secondary/50 rounded-lg border-0 py-2 pr-9 pl-9"
          placeholder="Search"
          aria-label="Search settings"
          bind:value={searchQuery}
        />
      </InputGroup>

      <!-- Profile Section -->
      {#if !searchQuery || "profile account cloud storage".includes(searchQuery.toLowerCase())}
        <div class="bg-card overflow-hidden rounded-xl border shadow-sm">
          <button
            type="button"
            class="hover:bg-accent/50 flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
            aria-label="View account settings"
          >
            <Avatar
              size="lg"
              src="https://github.com/brodienguyen.png"
              fallback="BN"
            />
            <div class="min-w-0 flex-1">
              <p class="font-medium">Brodie Nguyen</p>
              <p class="text-muted-foreground truncate text-sm">
                Manage your account
              </p>
            </div>
            <ChevronRight class="text-muted-foreground size-5" />
          </button>
          <div class="border-t"></div>
          <button
            type="button"
            class="hover:bg-accent/50 flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
            aria-label="View Family settings"
          >
            <div class="flex -space-x-2">
              <Avatar
                src="https://github.com/brodienguyen.png"
                fallback="BN"
                size="sm"
                class="ring-background ring-1"
              />
              <Avatar fallback="JN" size="sm" class="ring-background ring-1" />
            </div>
            <span class="flex-1">Family</span>
            <ChevronRight class="text-muted-foreground size-5" />
          </button>
        </div>
      {/if}

      <!-- Preferences Section -->
      {#if !searchQuery || "notifications sounds appearance theme language".includes(searchQuery.toLowerCase())}
        <SettingsSection title="Preferences">
          {#if !searchQuery || "notifications".includes(searchQuery.toLowerCase())}
            <SettingsItem
              icon={Bell}
              label="Notifications"
              action="toggle"
              bind:checked={notifications}
            />
          {/if}
          {#if !searchQuery || "sounds".includes(searchQuery.toLowerCase())}
            <div class="border-t"></div>
            <SettingsItem
              icon={Volume2}
              label="Sounds"
              action="toggle"
              bind:checked={sounds}
            />
          {/if}
          {#if !searchQuery || "appearance dark light".includes(searchQuery.toLowerCase())}
            <div class="border-t"></div>
            <SettingsItem
              icon={appearance.value === "dark" ? Moon : Sun}
              label="Appearance"
              action="value"
              value={appearance.value === "dark" ? "Dark" : "Light"}
              onclick={() =>
                appearance.update(
                  appearance.value === "dark" ? "light" : "dark",
                )}
            />
          {/if}
          {#if !searchQuery || "theme default claude myfoodlink".includes(searchQuery.toLowerCase())}
            <div class="border-t"></div>
            <SettingsItem
              icon={Palette}
              label="Theme"
              action="value"
              value={getThemeLabel(appearance.variant)}
              onclick={() => (themeSheetOpen = true)}
            />
          {/if}
          {#if !searchQuery || "language".includes(searchQuery.toLowerCase())}
            <div class="border-t"></div>
            <SettingsItem
              icon={Globe}
              label="Language"
              action="value"
              value={selectedLanguage}
              onclick={() => (languageSheetOpen = true)}
            />
          {/if}
        </SettingsSection>
      {/if}

      <!-- Security Section -->
      {#if !searchQuery || "biometrics password 2fa two-factor security".includes(searchQuery.toLowerCase())}
        <SettingsSection title="Security">
          {#if !searchQuery || "biometrics".includes(searchQuery.toLowerCase())}
            <SettingsItem
              icon={Smartphone}
              label="Biometrics"
              action="toggle"
              bind:checked={biometrics}
            />
          {/if}
          {#if !searchQuery || "password".includes(searchQuery.toLowerCase())}
            <div class="border-t"></div>
            <SettingsItem
              icon={KeyRound}
              label="Password Manager"
              action="chevron"
            />
          {/if}
          {#if !searchQuery || "2fa two-factor".includes(searchQuery.toLowerCase())}
            <div class="border-t"></div>
            <SettingsItem
              icon={ShieldCheck}
              label="Two-Factor Auth"
              action="toggle"
              bind:checked={twoFactorAuth}
            />
          {/if}
        </SettingsSection>
      {/if}

      <!-- About Section -->
      {#if !searchQuery || "help about version".includes(searchQuery.toLowerCase())}
        <SettingsSection title="About">
          {#if !searchQuery || "help".includes(searchQuery.toLowerCase())}
            <SettingsItem
              icon={CircleHelp}
              label="Help Center"
              action="chevron"
            />
          {/if}
          {#if !searchQuery || "about version".includes(searchQuery.toLowerCase())}
            <div class="border-t"></div>
            <SettingsItem
              icon={Info}
              label="About"
              action="value"
              value="v0.1.0"
            />
          {/if}
        </SettingsSection>
      {/if}

      <!-- Logout Button -->
      {#if !searchQuery}
        <Button variant="destructive">
          <LogOut class="size-5" />
          <span class="font-medium">Sign Out</span>
        </Button>
      {/if}
    </div>

    {#snippet footer()}
      <BottomNav items={navItems} />
    {/snippet}
  </MobileLayout>
</DeviceFrame>

<!-- Language Selection Sheet -->
<BottomSheet bind:open={languageSheetOpen} title="Select Language">
  <div class="flex flex-col">
    {#each languages as lang (lang)}
      <button
        type="button"
        class="hover:bg-muted flex items-center justify-between p-4 text-left transition-colors"
        onclick={() => selectLanguage(lang)}
      >
        <span
          class={lang === selectedLanguage ? "text-primary font-medium" : ""}
          >{lang}</span
        >
        {#if lang === selectedLanguage}
          <div class="bg-primary size-2 rounded-full"></div>
        {/if}
      </button>
    {/each}
  </div>
</BottomSheet>

<!-- Theme Selection Sheet -->
<BottomSheet bind:open={themeSheetOpen} title="Select Theme">
  <div class="flex flex-col">
    {#each themeVariantKeys as variant (variant)}
      <button
        type="button"
        class="hover:bg-muted flex items-center justify-between p-4 text-left transition-colors"
        onclick={() => selectTheme(variant)}
      >
        <span
          class={variant === appearance.variant
            ? "text-primary font-medium"
            : ""}>{getThemeLabel(variant)}</span
        >
        {#if variant === appearance.variant}
          <div class="bg-primary size-2 rounded-full"></div>
        {/if}
      </button>
    {/each}
  </div>
</BottomSheet>
