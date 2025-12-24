<!--
  @component Label
  Form label with consistent styling.

  Disabled state is auto-detected via CSS :has() when:
  - Label contains a disabled input: `<Label><input disabled /></Label>`
  - Label is followed by a disabled input: `<Label for="x" /><input id="x" disabled />`

  @example Basic usage
  ```svelte
  <Label for="email">Email address</Label>
  <input id="email" type="email" class="input" />
  ```

  @example With checkbox (use cursor-pointer and items-center for alignment)
  ```svelte
  <Label class="cursor-pointer items-center gap-3">
    <input type="checkbox" class="input" />
    Accept terms
  </Label>
  ```
-->
<script lang="ts">
  import type { Snippet } from "svelte"

  import { cn } from "@/utils"

  type Props = {
    /** Associated input ID */
    for?: string
    /** CSS class override */
    class?: string
    /** Content slot */
    children: Snippet
  }

  let { for: htmlFor, class: className, children }: Props = $props()
</script>

<label for={htmlFor} class={cn("label", className)}>
  {@render children()}
</label>
