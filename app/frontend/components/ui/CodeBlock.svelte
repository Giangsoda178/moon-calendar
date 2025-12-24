<script lang="ts">
  import { Check, Copy } from "@lucide/svelte"
  import { codeToHtml } from "shiki"

  import { cn } from "@/utils"

  type Props = {
    code: string
    language?: string
    class?: string
  }

  let { code, language = "svelte", class: className }: Props = $props()

  let copied = $state(false)
  let highlightedCode = $state<string>("")

  // Highlight code on mount and when code changes
  $effect(() => {
    codeToHtml(code, {
      lang: language,
      themes: {
        light: "github-light-default",
        dark: "github-dark-default",
      },
      defaultColor: false, // Don't set color directly, use CSS variables only
    }).then((html) => {
      highlightedCode = html
    })
  })

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code)
      copied = true
      setTimeout(() => (copied = false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }
</script>

<div class={cn("group relative", className)}>
  <button
    type="button"
    onclick={copyToClipboard}
    class="bg-muted/80 text-muted-foreground hover:bg-accent hover:text-accent-foreground absolute top-2 right-2 z-10 rounded-md p-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
    title={copied ? "Copied!" : "Copy code"}
  >
    {#if copied}
      <Check class="size-4" />
    {:else}
      <Copy class="size-4" />
    {/if}
  </button>

  {#if highlightedCode}
    <div
      class="scrollbar bg-muted overflow-auto rounded-md text-xs [&_.shiki]:bg-transparent [&_pre]:!m-0 [&_pre]:!bg-transparent [&_pre]:!p-4"
    >
      <!-- eslint-disable-next-line svelte/no-at-html-tags -- Safe: highlightedCode from shiki syntax highlighter -->
      {@html highlightedCode}
    </div>
  {:else}
    <pre
      class="scrollbar bg-muted text-muted-foreground overflow-auto rounded-md p-4 text-xs"><code
        >{code}</code
      ></pre>
  {/if}
</div>
