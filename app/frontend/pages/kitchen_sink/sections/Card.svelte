<script lang="ts">
  import { Bath, Bed, LandPlot, Settings, Star } from "@lucide/svelte"

  import Avatar from "@/components/ui/Avatar.svelte"
  import Badge from "@/components/ui/Badge.svelte"
  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import Field from "@/components/ui/Field.svelte"
  import Input from "@/components/ui/Input.svelte"
  import Label from "@/components/ui/Label.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Card.svelte?raw"
</script>

<Section id="card" title="Card" code={rawCode}>
  <div class="flex min-w-0 flex-col items-start gap-4">
    <!-- Using Card Component -->
    <p class="text-muted-foreground text-sm">Using Card Component:</p>

    <Card
      title="Login to your account"
      description="Enter your details below to login to your account"
      class="w-full max-w-sm"
      footerClass="flex flex-col items-center gap-2"
    >
      <form class="form grid gap-6">
        <Field label="Email" name="card-email">
          <Input id="field-card-email" type="email" />
        </Field>
        <div class="grid gap-2">
          <div class="flex items-center gap-2">
            <Label for="field-card-password">Password</Label>
            <Button variant="link" class="ml-auto h-auto p-0 text-sm">
              Forgot your password?
            </Button>
          </div>
          <Input id="field-card-password" type="password" />
        </div>
      </form>

      {#snippet footer()}
        <Button class="w-full">Login</Button>
        <Button variant="outline" class="w-full">Login with Google</Button>
        <p class="mt-4 text-center text-sm">
          Don't have an account?
          <Button variant="link" class="h-auto p-0">Sign up</Button>
        </p>
      {/snippet}
    </Card>

    <!-- Notification Card with Avatar -->
    <Card class="w-full max-w-sm">
      {#snippet header()}
        <div class="flex items-start gap-3">
          <Avatar
            src="https://github.com/brodienguyen.png"
            alt="@brodienguyen"
          />
          <div class="grid flex-1 gap-1.5">
            <h2>New Comment</h2>
            <p>@brodienguyen commented on your post</p>
          </div>
          <Badge variant="secondary">2m ago</Badge>
        </div>
      {/snippet}
      <p class="text-muted-foreground">
        "This is a great implementation! I especially like the use of snippets
        for flexible layouts."
      </p>
      {#snippet footer()}
        <Button variant="ghost" size="sm">Reply</Button>
        <Button variant="ghost" size="sm">Like</Button>
      {/snippet}
    </Card>

    <!-- Pricing Card -->
    <Card class="w-full max-w-sm text-center">
      {#snippet header()}
        <div class="grid items-center justify-items-center gap-1.5">
          <Badge>Popular</Badge>
          <h2>Pro Plan</h2>
          <p>For growing teams</p>
          <div class="mt-2">
            <span class="text-4xl font-bold">$29</span>
            <span class="text-muted-foreground">/month</span>
          </div>
        </div>
      {/snippet}
      <ul class="text-muted-foreground space-y-2">
        <li>Unlimited projects</li>
        <li>Priority support</li>
        <li>Advanced analytics</li>
        <li>Custom integrations</li>
      </ul>
      {#snippet footer()}
        <Button class="w-full">Get Started</Button>
      {/snippet}
    </Card>

    <!-- Settings Card with Action Button -->
    <Card class="w-full max-w-sm">
      {#snippet header()}
        <div class="flex items-start justify-between">
          <div class="grid gap-1.5">
            <h2>Account Settings</h2>
            <p>Manage your account preferences</p>
          </div>
          <Button variant="ghost" size="icon">
            <Settings class="size-4" />
          </Button>
        </div>
      {/snippet}
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <span>Email notifications</span>
          <Badge variant="outline">Enabled</Badge>
        </div>
        <div class="flex items-center justify-between">
          <span>Two-factor auth</span>
          <Badge variant="destructive">Disabled</Badge>
        </div>
      </div>
    </Card>

    <!-- Review Card with Rating -->
    <Card class="w-full max-w-sm">
      {#snippet header()}
        <div class="flex items-center gap-3">
          <Avatar fallback="JD" />
          <div class="flex flex-1 items-start justify-between">
            <div class="grid gap-1">
              <h2>John Doe</h2>
              <div class="flex gap-0.5 text-amber-500">
                {#each Array(5) as _, i (i)}
                  <Star class="size-3 fill-current" />
                {/each}
              </div>
            </div>
            <span class="text-muted-foreground text-xs">Verified Purchase</span>
          </div>
        </div>
      {/snippet}
      <p>
        Excellent product! The quality exceeded my expectations. Would
        definitely recommend to others.
      </p>
    </Card>

    <!-- Custom Header with Badge Component -->
    <Card class="w-full max-w-md">
      {#snippet header()}
        <div class="flex items-start justify-between">
          <div class="grid gap-1.5">
            <h2>Custom Header</h2>
            <p>Card with header snippet for advanced layouts.</p>
          </div>
          <Badge variant="outline">New</Badge>
        </div>
      {/snippet}
      <p>
        Use the header snippet when you need custom header layouts like badges,
        icons, or action buttons alongside the title.
      </p>
    </Card>

    <!-- Meeting Notes Card -->
    <Card
      title="Meeting Notes"
      description="Transcript from the meeting with the client."
      footerClass="flex items-center"
    >
      <p>
        Client requested dashboard redesign with focus on mobile responsiveness.
      </p>
      <ol class="mt-4 flex list-decimal flex-col gap-2 pl-6">
        <li>New analytics widgets for daily/weekly metrics</li>
        <li>Simplified navigation menu</li>
        <li>Dark mode support</li>
        <li>Timeline: 6 weeks</li>
        <li>Follow-up meeting scheduled for next Tuesday</li>
      </ol>
      {#snippet footer()}
        <div
          class="[&_img]:ring-background flex -space-x-2 [&_img]:size-8 [&_img]:shrink-0 [&_img]:rounded-full [&_img]:object-cover [&_img]:ring-2 [&_img]:grayscale"
        >
          <img alt="@brodienguyen" src="https://github.com/brodienguyen.png" />
          <img alt="@shadcn" src="https://github.com/shadcn.png" />
          <img alt="@adamwathan" src="https://github.com/adamwathan.png" />
        </div>
      {/snippet}
    </Card>

    <!-- Image Card (edge-to-edge via contentClass="px-0") -->
    <Card
      title="Is this an image?"
      description="This is a card with an image."
      contentClass="px-0"
      footerClass="flex items-center gap-2"
    >
      <img
        alt="Abstract background"
        loading="lazy"
        width="500"
        height="500"
        class="aspect-video object-cover"
        srcset="
          https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80&w=640&q=75 1x,
          https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80&w=1080&q=75 2x
        "
        src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80&w=1080&q=75"
      />
      {#snippet footer()}
        <Badge variant="outline">
          <Bed class="size-3" />
          1
        </Badge>
        <Badge variant="outline">
          <Bath class="size-3" />
          2
        </Badge>
        <Badge variant="outline">
          <LandPlot class="size-3" />
          350m²
        </Badge>
        <span class="ml-auto font-medium tabular-nums">$135,000</span>
      {/snippet}
    </Card>

    <!-- Variant Grid (matches CSS raw grid below) -->
    <p class="text-muted-foreground mt-4 text-sm">Card Variants (Component):</p>
    <div
      class="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      <Card><p>Content Only</p></Card>
      <Card
        title="Header Only"
        description="This is a card with a header and a description."
      />
      <Card
        title="Header and Content"
        description="This is a card with a header and a content."
      >
        <p>Content only.</p>
      </Card>
      <Card>
        {#snippet footer()}Footer Only{/snippet}
      </Card>
      <Card
        title="Header + Footer"
        description="This is a card with a header and a footer."
      >
        {#snippet footer()}Footer{/snippet}
      </Card>
      <Card>
        <p>Content</p>
        {#snippet footer()}Footer{/snippet}
      </Card>
      <Card
        title="Header + Content + Footer"
        description="This is a card with a header, content and footer."
      >
        <p>Content</p>
        {#snippet footer()}Footer{/snippet}
      </Card>
    </div>
  </div>
</Section>
