import { untrack } from "svelte"

import { toast } from "@/runes/toast.svelte"
import type { Flash } from "@/types"
import { inertiaPage, inertiaRouter } from "@/utils"

const emptyFlash: Flash = {}

/**
 * Flash message handler for Inertia.js applications.
 * Subscribes to page changes and displays toasts for flash messages.
 *
 * Call this in your layout component.
 *
 * @example
 * ```svelte
 * <script>
 *   import { useFlashSvelte } from "@/runes/use-flash.svelte"
 *   useFlashSvelte()
 * </script>
 * ```
 */
export const useFlashSvelte = () => {
  // Skip if Inertia is not available
  if (!inertiaPage || !inertiaRouter) {
    return
  }

  let currentFlash = $state<Flash>(emptyFlash)

  inertiaRouter.on("start", () => {
    currentFlash = emptyFlash
  })

  $effect(() => {
    return inertiaPage.subscribe(($page) => {
      currentFlash = $page.props.flash as Flash
    })
  })

  $effect(() => {
    // Read flash values (creates dependency)
    const { alert, notice, success } = currentFlash

    // Show toasts without tracking (prevents reactive loops)
    untrack(() => {
      if (alert) toast.error(alert)
      if (notice) toast.info(notice)
      if (success) toast.success(success)
    })
  })
}
