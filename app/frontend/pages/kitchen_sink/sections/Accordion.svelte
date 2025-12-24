<script lang="ts">
  import type { AccordionItemData } from "@/components/ui/Accordion.svelte"
  import Accordion from "@/components/ui/Accordion.svelte"
  import AccordionItem from "@/components/ui/AccordionItem.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Accordion.svelte?raw"

  // Data for data-driven mode
  const faqItems: AccordionItemData[] = [
    {
      value: "accessible",
      title: "Is it accessible?",
      content: "Yes. It adheres to the WAI-ARIA design pattern.",
    },
    {
      value: "styled",
      title: "Is it styled?",
      content:
        "Yes. It comes with default styles that matches the other components' aesthetic.",
    },
    {
      value: "animated",
      title: "Is it animated?",
      content:
        "Yes. It's animated by default using Svelte transitions, but you can disable it if you prefer.",
    },
  ]

  const advancedItems: AccordionItemData[] = [
    {
      value: "auth",
      title:
        "What are the key considerations when implementing enterprise-level authentication?",
      content:
        "Implementing robust enterprise authentication requires secure password hashing, MFA, session management, OAuth2/SSO integration, rate limiting, and compliance with GDPR/HIPAA.",
    },
    {
      value: "distributed",
      title: "How does distributed architecture handle eventual consistency?",
      content:
        "Modern distributed systems use CRDT, vector clocks, gossip protocols, event sourcing, and message queues. Solutions like DynamoDB and Spanner balance CAP theorem trade-offs.",
    },
  ]

  const itemsWithDisabled: AccordionItemData[] = [
    {
      value: "enabled",
      title: "Enabled Item",
      content: "This item can be expanded.",
    },
    {
      value: "disabled",
      title: "Disabled Item",
      content: "This cannot be expanded.",
      disabled: true,
    },
    {
      value: "another",
      title: "Another Enabled Item",
      content: "This item also works normally.",
    },
  ]
</script>

<Section id="accordion" title="Accordion" code={rawCode}>
  <div class="grid w-full max-w-xl gap-8">
    <!-- Data-driven mode - Single expand (default) -->
    <div class="space-y-2">
      <p class="text-muted-foreground mb-2 text-sm">
        Data-driven Mode - Single Expand (default):
      </p>
      <Accordion items={faqItems} />
    </div>

    <!-- Data-driven mode - Multiple expand -->
    <div class="space-y-2">
      <p class="text-muted-foreground mb-2 text-sm">
        Data-driven Mode - Multiple Expand:
      </p>
      <Accordion type="multiple" items={advancedItems}>
        {#snippet content(item)}
          <p class="text-muted-foreground leading-relaxed">{item.content}</p>
        {/snippet}
      </Accordion>
    </div>

    <!-- Composition mode (AccordionItem for full control) -->
    <div class="space-y-2">
      <p class="text-muted-foreground mb-2 text-sm">
        Composition Mode (AccordionItem):
      </p>
      <Accordion type="single" value="item-2">
        <AccordionItem value="item-1" title="First Item">
          This item is closed by default.
        </AccordionItem>
        <AccordionItem value="item-2" title="Second Item (Default Open)">
          This item is open by default because we passed value="item-2" to the
          Accordion.
        </AccordionItem>
        <AccordionItem value="item-3" title="Third Item">
          This item is also closed by default.
        </AccordionItem>
      </Accordion>
    </div>

    <!-- Data-driven with disabled item -->
    <div class="space-y-2">
      <p class="text-muted-foreground mb-2 text-sm">With Disabled Item:</p>
      <Accordion items={itemsWithDisabled} />
    </div>
  </div>
</Section>
