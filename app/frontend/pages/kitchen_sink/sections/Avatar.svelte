<script lang="ts">
  import Avatar from "@/components/ui/Avatar.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Avatar.svelte?raw"
</script>

<Section id="avatar" title="Avatar" code={rawCode}>
  <div class="flex flex-col gap-4">
    <!-- Sizes -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Sizes:</p>
      <div class="flex flex-row flex-wrap items-center gap-4">
        <div class="flex flex-col items-center gap-2">
          <Avatar
            src="https://github.com/brodienguyen.png"
            alt="@brodienguyen"
            size="sm"
          />
          <span class="text-muted-foreground text-xs">sm</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <Avatar
            src="https://github.com/brodienguyen.png"
            alt="@brodienguyen"
            size="md"
          />
          <span class="text-muted-foreground text-xs">md</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <Avatar
            src="https://github.com/brodienguyen.png"
            alt="@brodienguyen"
            size="lg"
          />
          <span class="text-muted-foreground text-xs">lg</span>
        </div>

        <div class="flex flex-col items-center gap-2">
          <Avatar
            src="https://github.com/brodienguyen.png"
            alt="@brodienguyen"
            size="xl"
          />
          <span class="text-muted-foreground text-xs">xl</span>
        </div>
      </div>
    </div>

    <!-- Shapes -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Shapes:</p>
      <div class="flex flex-row flex-wrap items-center gap-4">
        <Avatar
          src="https://github.com/brodienguyen.png"
          alt="@brodienguyen"
          shape="circle"
        />
        <Avatar
          src="https://github.com/brodienguyen.png"
          alt="@brodienguyen"
          shape="square"
        />
      </div>
    </div>

    <!-- Fallback -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        Fallback (initials or default icon):
      </p>
      <div class="flex flex-row flex-wrap items-center gap-4">
        <Avatar fallback="BN" />
        <Avatar fallback="JD" size="lg" />
        <Avatar fallback="AB" size="xl" />
        <Avatar size="xl" />
      </div>
    </div>

    <!-- Avatar Group -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Avatar Group (stacked):</p>
      <div class="flex -space-x-2">
        <Avatar
          src="https://github.com/brodienguyen.png"
          class="ring-background ring-2"
        />
        <Avatar
          src="https://github.com/shadcn.png"
          class="ring-background ring-2"
        />
        <Avatar
          src="https://github.com/hunvreus.png"
          class="ring-background ring-2"
        />
        <Avatar fallback="+3" class="ring-background ring-2" />
      </div>
    </div>

    <!-- Avatar Group with Hover Effect -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        Avatar Group with Hover Expand:
      </p>
      <div class="flex -space-x-2 transition-all duration-300 hover:space-x-1">
        <Avatar
          src="https://github.com/brodienguyen.png"
          class="ring-background ring-2 transition-all duration-300"
        />
        <Avatar
          src="https://github.com/shadcn.png"
          class="ring-background ring-2 transition-all duration-300"
        />
        <Avatar
          src="https://github.com/hunvreus.png"
          class="ring-background ring-2 transition-all duration-300"
        />
        <Avatar
          fallback="+3"
          class="ring-background ring-2 transition-all duration-300"
        />
      </div>
    </div>

    <!-- Custom Styling -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        Custom Styling (grayscale hover effect):
      </p>
      <div class="flex flex-row flex-wrap items-center gap-4">
        <Avatar
          src="https://github.com/brodienguyen.png"
          imageClass="grayscale hover:grayscale-0 transition-all duration-300"
        />
        <Avatar
          src="https://github.com/shadcn.png"
          size="lg"
          imageClass="grayscale hover:grayscale-0 transition-all duration-300"
        />
        <Avatar
          src="https://github.com/hunvreus.png"
          class="ring-primary ring-2"
          imageClass="grayscale hover:grayscale-0 transition-all duration-300"
        />
      </div>
    </div>
  </div>
</Section>
