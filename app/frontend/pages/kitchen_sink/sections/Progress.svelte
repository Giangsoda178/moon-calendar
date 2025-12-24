<script lang="ts">
  import Button from "@/components/ui/Button.svelte"
  import Progress from "@/components/ui/Progress.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Progress.svelte?raw"

  let demoValue = $state(33)

  // Animate the demo progress
  $effect(() => {
    const interval = setInterval(() => {
      demoValue = demoValue >= 100 ? 0 : demoValue + 10
    }, 1000)
    return () => clearInterval(interval)
  })
</script>

<Section id="progress" title="Progress" code={rawCode}>
  <div class="flex flex-col gap-6">
    <!-- Basic usage -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Basic Usage:</p>
      <div class="max-w-md space-y-4">
        <Progress value={25} />
        <Progress value={50} />
        <Progress value={75} />
        <Progress value={100} />
      </div>
    </div>

    <!-- Animated -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">
        Animated (updates every second):
      </p>
      <div class="max-w-md space-y-2">
        <Progress value={demoValue} />
        <p class="text-muted-foreground text-sm">{demoValue}%</p>
      </div>
    </div>

    <!-- Custom max -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Custom Max Value:</p>
      <div class="max-w-md space-y-4">
        <div class="space-y-1">
          <Progress value={150} max={500} />
          <p class="text-muted-foreground text-xs">150 MB of 500 MB</p>
        </div>
        <div class="space-y-1">
          <Progress value={5} max={10} />
          <p class="text-muted-foreground text-xs">3 of 10 items</p>
        </div>
      </div>
    </div>

    <!-- Custom styling -->
    <div>
      <p class="text-muted-foreground mb-2 text-sm">Custom Styling:</p>
      <div class="max-w-md space-y-4">
        <Progress value={60} class="h-3" />
        <Progress value={45} class="h-1" />
        <Progress value={80} indicatorClass="bg-green-500" />
        <Progress value={30} indicatorClass="bg-destructive" />
      </div>
    </div>

    <!-- In context -->
    <div class="w-full max-w-md">
      <p class="text-muted-foreground mb-2 text-sm">In Card Context:</p>
      <div class="card">
        <header>
          <h2>Uploading files...</h2>
          <p>3 of 5 files uploaded</p>
        </header>
        <section>
          <Progress value={60} />
        </section>
        <footer class="justify-end gap-2">
          <Button>Cancel</Button>
        </footer>
      </div>
    </div>
  </div>
</Section>
