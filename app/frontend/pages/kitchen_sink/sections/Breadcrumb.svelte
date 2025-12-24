<script lang="ts">
  import Breadcrumb from "@/components/ui/Breadcrumb.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Breadcrumb.svelte?raw"

  const items = [
    { label: "Home", href: "#" },
    {
      ellipsis: true as const,
      items: [
        { label: "Documentation", href: "#" },
        { label: "Themes", href: "#" },
        { label: "GitHub", href: "#" },
      ],
    },
    { label: "Components", href: "#" },
    { label: "Breadcrumb" },
  ]
</script>

<Section id="breadcrumb" title="Breadcrumb" code={rawCode}>
  <Breadcrumb {items} />
</Section>
