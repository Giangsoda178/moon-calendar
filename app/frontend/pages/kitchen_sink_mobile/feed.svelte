<script lang="ts">
  import {
    Bell,
    Bookmark,
    Heart,
    MessageCircle,
    MoreHorizontal,
    Plus,
    Send,
    Share,
  } from "@lucide/svelte"

  import Avatar from "@/components/ui/Avatar.svelte"
  import AppBar from "@/components/ui/mobile/AppBar.svelte"
  import BottomNav from "@/components/ui/mobile/BottomNav.svelte"
  import BottomSheet from "@/components/ui/mobile/BottomSheet.svelte"
  import MobileLayout from "@/components/ui/mobile/MobileLayout.svelte"
  import PullToRefresh from "@/components/ui/mobile/PullToRefresh.svelte"
  import { kitchenSinkMobileIndexPath } from "@/routes"

  import DeviceFrame from "./shared/DeviceFrame.svelte"
  import { navItems } from "./shared/nav-items"

  // Sample posts data
  const initialPosts = [
    {
      id: 1,
      author: {
        name: "Alex Rivera",
        username: "@alexrivera",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      },
      content:
        "Just shipped a new feature that I've been working on for months. So excited to see it live! What do you all think?",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
      time: "2h",
      likes: 142,
      comments: 28,
      liked: false,
      bookmarked: false,
    },
    {
      id: 2,
      author: {
        name: "Maya Johnson",
        username: "@mayaj",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      },
      content:
        "The new design system is coming along nicely. Here's a sneak peek at some of the components we've been building.",
      time: "4h",
      likes: 89,
      comments: 15,
      liked: true,
      bookmarked: true,
    },
    {
      id: 3,
      author: {
        name: "Chris Taylor",
        username: "@christaylor",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      },
      content:
        "Working on mobile-first responsive designs. The key is to start small and scale up, not the other way around. Here's my process:",
      image:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
      time: "6h",
      likes: 256,
      comments: 42,
      liked: false,
      bookmarked: false,
    },
    {
      id: 4,
      author: {
        name: "Jordan Lee",
        username: "@jordanlee",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      },
      content:
        "TIL: The secret to good UX is empathy. Understanding your users' pain points is the first step to solving them.",
      time: "8h",
      likes: 178,
      comments: 31,
      liked: true,
      bookmarked: false,
    },
  ]

  let posts = $state([...initialPosts])
  let refreshCount = $state(0)
  let shareSheetOpen = $state(false)

  async function handleRefresh() {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    refreshCount++

    // Add a new post at the top
    const newPost = {
      id: Date.now(),
      author: {
        name: "New User",
        username: "@newuser",
        avatar:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
      },
      content: `Fresh content just dropped! Refresh #${refreshCount}. Pull down again to see more updates.`,
      time: "Just now",
      likes: 0,
      comments: 0,
      liked: false,
      bookmarked: false,
    }

    posts = [newPost, ...posts]
  }

  function toggleLike(postId: number) {
    posts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1,
          }
        : post,
    )
  }

  function toggleBookmark(postId: number) {
    posts = posts.map((post) =>
      post.id === postId
        ? {
            ...post,
            bookmarked: !post.bookmarked,
          }
        : post,
    )
  }
</script>

{#snippet appBarActions()}
  <button
    type="button"
    class="text-foreground hover:bg-accent relative inline-flex size-10 items-center justify-center rounded-md transition-colors"
    aria-label="Notifications"
  >
    <Bell class="size-5" />
    <span
      class="bg-destructive absolute top-1.5 right-1.5 flex size-2 rounded-full"
      aria-hidden="true"
    ></span>
  </button>
{/snippet}

<DeviceFrame>
  <MobileLayout>
    {#snippet header()}
      <AppBar
        title="Feed"
        backHref={kitchenSinkMobileIndexPath()}
        actions={appBarActions}
      />
    {/snippet}

    <PullToRefresh onrefresh={handleRefresh}>
      <div class="flex flex-col pb-20">
        <!-- Refresh indicator -->
        {#if refreshCount > 0}
          <div
            class="bg-primary/5 text-muted-foreground border-b px-4 py-2 text-center text-xs"
          >
            Refreshed {refreshCount} time{refreshCount !== 1 ? "s" : ""} - Pull down
            for more
          </div>
        {/if}

        <!-- Posts -->
        {#each posts as post (post.id)}
          <article class="border-b">
            <!-- Post Header -->
            <div class="flex items-center gap-3 p-4 pb-0">
              <Avatar
                src={post.author.avatar}
                alt={post.author.name}
                size="md"
              />
              <div class="flex-1">
                <p class="leading-none font-semibold">{post.author.name}</p>
                <p class="text-muted-foreground mt-0.5 text-xs">
                  {post.author.username} · {post.time}
                </p>
              </div>
              <button
                type="button"
                class="hover:bg-accent flex size-8 items-center justify-center rounded-full transition-colors"
                aria-label="More options"
              >
                <MoreHorizontal class="text-muted-foreground size-5" />
              </button>
            </div>

            <!-- Post Content -->
            <div class="px-4 py-3">
              <p class="text-sm leading-relaxed">{post.content}</p>
            </div>

            <!-- Post Image (if exists) -->
            {#if post.image}
              <div class="px-4">
                <img
                  src={post.image}
                  alt=""
                  class="w-full rounded-xl object-cover"
                  style="aspect-ratio: 4/3;"
                />
              </div>
            {/if}

            <!-- Post Actions -->
            <div class="flex items-center justify-between px-4 py-3">
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  class="flex items-center gap-1.5 transition-colors {post.liked
                    ? 'text-red-500'
                    : 'text-muted-foreground hover:text-red-500'}"
                  onclick={() => toggleLike(post.id)}
                >
                  <Heart
                    class="size-5"
                    fill={post.liked ? "currentColor" : "none"}
                  />
                  <span class="text-sm">{post.likes}</span>
                </button>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle class="size-5" />
                  <span class="text-sm">{post.comments}</span>
                </button>
                <button
                  type="button"
                  class="text-muted-foreground hover:text-primary flex items-center gap-1.5 transition-colors"
                  onclick={() => (shareSheetOpen = true)}
                >
                  <Share class="size-5" />
                </button>
              </div>
              <button
                type="button"
                class="transition-colors {post.bookmarked
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'}"
                onclick={() => toggleBookmark(post.id)}
              >
                <Bookmark
                  class="size-5"
                  fill={post.bookmarked ? "currentColor" : "none"}
                />
              </button>
            </div>
          </article>
        {/each}

        <!-- End of feed -->
        <div class="text-muted-foreground p-8 text-center text-sm">
          You're all caught up! Pull down to refresh.
        </div>
      </div>
    </PullToRefresh>

    <!-- FAB -->
    <button
      type="button"
      class="bg-primary text-primary-foreground fixed right-4 bottom-20 z-40 flex size-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 md:right-8 md:bottom-24"
      aria-label="Create new post"
    >
      <Plus class="size-6" />
    </button>

    {#snippet footer()}
      <BottomNav items={navItems} />
    {/snippet}
  </MobileLayout>
</DeviceFrame>

<!-- Share Sheet -->
<BottomSheet bind:open={shareSheetOpen} title="Share">
  <div class="grid grid-cols-4 gap-4 py-4">
    <button
      type="button"
      class="flex flex-col items-center gap-2"
      onclick={() => (shareSheetOpen = false)}
    >
      <div
        class="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full"
      >
        <Send class="size-6" />
      </div>
      <span class="text-xs">Message</span>
    </button>
    <button
      type="button"
      class="flex flex-col items-center gap-2"
      onclick={() => (shareSheetOpen = false)}
    >
      <div
        class="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full"
      >
        <MessageCircle class="size-6" />
      </div>
      <span class="text-xs">WhatsApp</span>
    </button>
    <button
      type="button"
      class="flex flex-col items-center gap-2"
      onclick={() => (shareSheetOpen = false)}
    >
      <div
        class="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full"
      >
        <Share class="size-6" />
      </div>
      <span class="text-xs">Twitter</span>
    </button>
    <button
      type="button"
      class="flex flex-col items-center gap-2"
      onclick={() => (shareSheetOpen = false)}
    >
      <div
        class="bg-muted text-muted-foreground flex size-14 items-center justify-center rounded-full"
      >
        <MoreHorizontal class="size-6" />
      </div>
      <span class="text-xs">More</span>
    </button>
  </div>
  <div class="border-t pt-4">
    <button
      type="button"
      class="hover:bg-muted w-full rounded-lg border p-3 text-sm font-medium transition-colors"
      onclick={() => (shareSheetOpen = false)}
    >
      Copy Link
    </button>
  </div>
</BottomSheet>
