<script lang="ts">
  import { Bell, House, Search, User } from "@lucide/svelte"

  import BottomNavItem from "@/components/ui/mobile/BottomNavItem.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"
</script>

<Section id="bottom-nav" title="Bottom Nav">
  <div class="flex flex-col gap-4">
    <p class="text-muted-foreground text-sm">
      Fixed bottom tab navigation with icons, labels, and badges.
    </p>

    <div class="flex flex-col gap-3">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        Basic Items
      </div>
      <div class="overflow-hidden rounded border">
        <nav class="bg-background flex border-t">
          <BottomNavItem icon={House} label="Home" href="#" active />
          <BottomNavItem icon={Search} label="Search" href="#" />
          <BottomNavItem icon={Bell} label="Alerts" href="#" />
          <BottomNavItem icon={User} label="Profile" href="#" />
        </nav>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        With Badges
      </div>
      <div class="overflow-hidden rounded border">
        <nav class="bg-background flex border-t">
          <BottomNavItem icon={House} label="Home" href="#" />
          <BottomNavItem icon={Search} label="Search" href="#" active />
          <BottomNavItem icon={Bell} label="Alerts" href="#" badge={5} />
          <BottomNavItem icon={User} label="Profile" href="#" badge />
        </nav>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <div class="text-muted-foreground text-xs font-medium uppercase">
        3 Items
      </div>
      <div class="overflow-hidden rounded border">
        <nav class="bg-background flex border-t">
          <BottomNavItem icon={House} label="Home" href="#" active />
          <BottomNavItem icon={Search} label="Search" href="#" />
          <BottomNavItem icon={User} label="Profile" href="#" />
        </nav>
      </div>
    </div>
  </div>
</Section>
