<script lang="ts">
  import {
    Calendar,
    Edit,
    Heart,
    MapPin,
    MessageCircle,
    MoreHorizontal,
    Share2,
  } from "@lucide/svelte"

  import Avatar from "@/components/ui/Avatar.svelte"
  import Badge from "@/components/ui/Badge.svelte"
  import Button from "@/components/ui/Button.svelte"
  import AppBar from "@/components/ui/mobile/AppBar.svelte"
  import BottomNav from "@/components/ui/mobile/BottomNav.svelte"
  import BottomSheet from "@/components/ui/mobile/BottomSheet.svelte"
  import MobileLayout from "@/components/ui/mobile/MobileLayout.svelte"
  import { kitchenSinkMobileIndexPath } from "@/routes"

  import DeviceFrame from "./shared/DeviceFrame.svelte"
  import { navItems } from "./shared/nav-items"

  // Profile data
  const profile = {
    name: "Sarah Chen",
    username: "@sarahchen",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    bio: "Product Designer at Acme Inc. Passionate about creating beautiful and functional user experiences.",
    location: "San Francisco, CA",
    joinDate: "March 2022",
    stats: {
      posts: 142,
      followers: "2.4K",
      following: 891,
    },
  }

  // Recent activity
  const recentActivity = [
    {
      id: 1,
      type: "post",
      title: "New design system launched",
      time: "2 hours ago",
      likes: 24,
      comments: 8,
    },
    {
      id: 2,
      type: "post",
      title: "Tips for mobile-first design",
      time: "Yesterday",
      likes: 156,
      comments: 42,
    },
    {
      id: 3,
      type: "post",
      title: "Dark mode best practices",
      time: "3 days ago",
      likes: 89,
      comments: 21,
    },
  ]

  let moreSheetOpen = $state(false)
</script>

{#snippet appBarActions()}
  <button
    type="button"
    class="text-foreground hover:bg-accent inline-flex size-10 items-center justify-center rounded-md transition-colors"
    aria-label="Share profile"
  >
    <Share2 class="size-5" />
  </button>
  <button
    type="button"
    class="text-foreground hover:bg-accent inline-flex size-10 items-center justify-center rounded-md transition-colors"
    aria-label="More options"
    onclick={() => (moreSheetOpen = true)}
  >
    <MoreHorizontal class="size-5" />
  </button>
{/snippet}

<DeviceFrame>
  <MobileLayout>
    {#snippet header()}
      <AppBar
        title="Profile"
        backHref={kitchenSinkMobileIndexPath()}
        actions={appBarActions}
      />
    {/snippet}

    <div class="flex flex-col pb-20">
      <!-- Profile Header -->
      <div class="flex flex-col items-center border-b px-4 pt-4 pb-6">
        <Avatar
          src={profile.avatar}
          alt={profile.name}
          size="xl"
          class="ring-background shadow-lg ring-4"
        />
        <h1 class="mt-4 text-xl font-bold">{profile.name}</h1>
        <p class="text-muted-foreground text-sm">{profile.username}</p>

        <!-- Stats -->
        <div class="mt-4 flex gap-6">
          <div class="text-center">
            <p class="text-lg font-bold">{profile.stats.posts}</p>
            <p class="text-muted-foreground text-xs">Posts</p>
          </div>
          <div class="text-center">
            <p class="text-lg font-bold">{profile.stats.followers}</p>
            <p class="text-muted-foreground text-xs">Followers</p>
          </div>
          <div class="text-center">
            <p class="text-lg font-bold">{profile.stats.following}</p>
            <p class="text-muted-foreground text-xs">Following</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="mt-4 flex w-full gap-2">
          <Button class="flex-1" size="sm">
            <Edit class="mr-2 size-4" />
            Edit Profile
          </Button>
          <Button variant="outline" class="flex-1" size="sm">
            <Share2 class="mr-2 size-4" />
            Share
          </Button>
        </div>
      </div>

      <!-- Bio Section -->
      <div class="border-b p-4">
        <p class="text-sm leading-relaxed">{profile.bio}</p>
        <div class="text-muted-foreground mt-3 flex flex-wrap gap-3 text-xs">
          <div class="flex items-center gap-1">
            <MapPin class="size-3.5" />
            <span>{profile.location}</span>
          </div>
          <div class="flex items-center gap-1">
            <Calendar class="size-3.5" />
            <span>Joined {profile.joinDate}</span>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="p-4">
        <h2
          class="text-muted-foreground mb-3 text-sm font-medium tracking-wider uppercase"
        >
          Recent Activity
        </h2>
        <div class="flex flex-col gap-3">
          {#each recentActivity as activity (activity.id)}
            <div class="bg-card rounded-xl border p-4 shadow-sm">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <p class="leading-tight font-medium">{activity.title}</p>
                  <p class="text-muted-foreground mt-1 text-xs">
                    {activity.time}
                  </p>
                </div>
                <Badge variant="secondary" class="text-xs">Post</Badge>
              </div>
              <div
                class="text-muted-foreground mt-3 flex items-center gap-4 text-sm"
              >
                <button
                  type="button"
                  class="flex items-center gap-1.5 transition-colors hover:text-red-500"
                >
                  <Heart class="size-4" />
                  <span>{activity.likes}</span>
                </button>
                <button
                  type="button"
                  class="hover:text-primary flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle class="size-4" />
                  <span>{activity.comments}</span>
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>

    {#snippet footer()}
      <BottomNav items={navItems} />
    {/snippet}
  </MobileLayout>
</DeviceFrame>

<!-- More Options Sheet -->
<BottomSheet bind:open={moreSheetOpen} title="More Options">
  <div class="flex flex-col">
    <button
      type="button"
      class="hover:bg-muted p-4 text-left transition-colors"
      onclick={() => (moreSheetOpen = false)}
    >
      Block User
    </button>
    <button
      type="button"
      class="hover:bg-muted p-4 text-left transition-colors"
      onclick={() => (moreSheetOpen = false)}
    >
      Report Profile
    </button>
    <button
      type="button"
      class="hover:bg-muted p-4 text-left transition-colors"
      onclick={() => (moreSheetOpen = false)}
    >
      Copy Profile Link
    </button>
    <button
      type="button"
      class="text-destructive hover:bg-muted p-4 text-left transition-colors"
      onclick={() => (moreSheetOpen = false)}
    >
      Cancel
    </button>
  </div>
</BottomSheet>
