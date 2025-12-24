<script lang="ts">
  import Skeleton from "@/components/ui/Skeleton.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Skeleton.svelte?raw"
</script>

<Section id="skeleton" title="Skeleton" code={rawCode}>
  <div class="flex flex-col gap-6">
    <!-- Using Skeleton Component -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        Using Skeleton Component:
      </p>
      <div class="flex items-center gap-4">
        <Skeleton class="size-10" rounded="full" />
        <div class="grid gap-2">
          <Skeleton class="h-4 w-[150px]" />
          <Skeleton class="h-4 w-[100px]" />
        </div>
      </div>
    </div>

    <!-- Different rounded variants -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Rounded Variants:</p>
      <div class="flex items-center gap-4">
        <Skeleton class="h-8 w-20" rounded="none" />
        <Skeleton class="h-8 w-20" rounded="sm" />
        <Skeleton class="h-8 w-20" rounded="md" />
        <Skeleton class="h-8 w-20" rounded="lg" />
        <Skeleton class="size-8" rounded="full" />
      </div>
    </div>

    <!-- Card Skeleton -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Card Skeleton:</p>
      <div class="flex w-full gap-4 max-sm:flex-col">
        <div class="card w-full @md:w-auto @md:min-w-sm">
          <header>
            <Skeleton class="h-4 w-2/3" />
            <Skeleton class="h-4 w-1/2" />
          </header>
          <section>
            <Skeleton class="aspect-square w-full" />
          </section>
        </div>

        <div class="card w-full @md:w-auto @md:min-w-sm">
          <header>
            <Skeleton class="h-4 w-2/3" />
            <Skeleton class="h-4 w-1/2" />
          </header>
          <section>
            <Skeleton class="aspect-square w-full" />
          </section>
        </div>
      </div>
    </div>

    <!-- Text lines skeleton -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Text Content Skeleton:</p>
      <div class="max-w-md space-y-2">
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-full" />
        <Skeleton class="h-4 w-3/4" />
      </div>
    </div>
  </div>
</Section>
