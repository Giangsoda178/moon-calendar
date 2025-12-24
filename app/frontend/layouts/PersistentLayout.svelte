<script lang="ts">
  import type { Snippet } from "svelte"

  import Toaster from "@/components/ui/Toaster.svelte"
  import { useFlashSvelte } from "@/runes/use-flash.svelte"

  interface Props {
    children: Snippet
  }

  let { children }: Props = $props()

  useFlashSvelte()
</script>

{@render children()}
<Toaster />
