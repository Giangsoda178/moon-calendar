<script lang="ts">
  import { Link } from "@inertiajs/svelte"
  import {
    Activity,
    Compass,
    Database,
    DatabaseZap,
    FileText,
    KeyRound,
    List,
    Mail,
    Radio,
    Users,
  } from "@lucide/svelte"
  import type { Component } from "svelte"

  import Card from "@/components/ui/Card.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import {
    playgroundContactFormPath,
    playgroundDataLoadingPath,
    playgroundEmailsPath,
    playgroundListsStatePath,
    playgroundLoginFormPath,
    playgroundNavigationDemoPath,
    playgroundOncePropsPath,
    playgroundRealtimePath,
    playgroundUserFormPath,
    playgroundWebsocketPath,
  } from "@/routes"

  type PlaygroundItem = {
    title: string
    description: string
    href: string
    icon: Component
    tags: string[]
  }

  type PlaygroundSection = {
    title: string
    description: string
    icon: Component
    items: PlaygroundItem[]
  }

  const sections: PlaygroundSection[] = [
    {
      title: "Forms & Validation",
      description: "Inertia form patterns with Rails ActiveModel validation",
      icon: FileText,
      items: [
        {
          title: "Login Form",
          description: "Basic auth pattern with email, password, remember me",
          href: playgroundLoginFormPath(),
          icon: KeyRound,
          tags: ["auth", "simple"],
        },
        {
          title: "Contact Form",
          description: "Inquiry form with validation and select inputs",
          href: playgroundContactFormPath(),
          icon: Mail,
          tags: ["validation", "select"],
        },
        {
          title: "User Form",
          description: "Nested attributes, all input types, presets",
          href: playgroundUserFormPath(),
          icon: Users,
          tags: ["nested", "complex"],
        },
      ],
    },
    {
      title: "Advanced Patterns",
      description: "Inertia.js advanced features and optimizations",
      icon: Database,
      items: [
        {
          title: "Navigation",
          description: "preserveScroll and preserveState behavior",
          href: playgroundNavigationDemoPath(),
          icon: Compass,
          tags: ["scroll", "state"],
        },
        {
          title: "Data Loading",
          description: "Partial reloads, deferred props, WhenVisible",
          href: playgroundDataLoadingPath(),
          icon: Database,
          tags: ["deferred", "lazy"],
        },
        {
          title: "Once Props",
          description: "Client-cached props, expiration, custom keys",
          href: playgroundOncePropsPath(),
          icon: DatabaseZap,
          tags: ["cache", "performance"],
        },
        {
          title: "Real-time",
          description: "Polling dashboard and prefetching links",
          href: playgroundRealtimePath(),
          icon: Activity,
          tags: ["polling", "prefetch"],
        },
        {
          title: "Lists & State",
          description: "Infinite scroll, merge props, useRemember",
          href: playgroundListsStatePath(),
          icon: List,
          tags: ["infinite", "merge"],
        },
        {
          title: "WebSocket",
          description: "Action Cable live notifications demo",
          href: playgroundWebsocketPath(),
          icon: Radio,
          tags: ["websocket", "realtime"],
        },
      ],
    },
    {
      title: "Email",
      description: "Email template system with theme support",
      icon: Mail,
      items: [
        {
          title: "Email Templates",
          description: "Preview themed emails with live rendering",
          href: playgroundEmailsPath(),
          icon: Mail,
          tags: ["email", "theme"],
        },
      ],
    },
  ]
</script>

<PlaygroundLayout
  title="Playground"
  description="Interactive demos showcasing Inertia.js patterns with Rails backend integration"
>
  {#each sections as section (section.title)}
    <section class="space-y-4">
      <div class="flex items-center gap-3">
        <div class="bg-primary/10 text-primary rounded-lg p-2">
          <section.icon class="size-5" />
        </div>
        <div>
          <h2 class="text-lg font-semibold">{section.title}</h2>
          <p class="text-muted-foreground text-sm">{section.description}</p>
        </div>
      </div>

      <div class="grid grid-rows-1 gap-3 sm:grid-cols-2">
        {#each section.items as { title, description, href, icon: Icon, tags } (href)}
          <Link {href} class="group block">
            <Card
              class="hover:border-primary/50 group-hover:bg-muted/30 h-full transition-all"
            >
              <div class="flex items-start gap-3">
                <div
                  class="bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary rounded-lg p-2 transition-colors"
                >
                  <Icon class="size-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <h3 class="font-medium">{title}</h3>
                  <p class="text-muted-foreground mt-1 text-sm">
                    {description}
                  </p>
                  <div class="mt-2 flex flex-wrap gap-1">
                    {#each tags as tag (tag)}
                      <span
                        class="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs"
                      >
                        {tag}
                      </span>
                    {/each}
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        {/each}
      </div>
    </section>
  {/each}
</PlaygroundLayout>
