<script lang="ts">
  import type { FormComponentSlotProps } from "@inertiajs/core"
  import { Form, page } from "@inertiajs/svelte"

  import Badge from "@/components/ui/Badge.svelte"
  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import Field from "@/components/ui/Field.svelte"
  import Input from "@/components/ui/Input.svelte"
  import Select from "@/components/ui/Select.svelte"
  import Textarea from "@/components/ui/Textarea.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import { playgroundSubmitContactFormPath } from "@/routes"

  type FormData = {
    name: string | null
    email: string | null
    subject: string | null
    message: string | null
    priority: string
  }

  type Props = {
    form: FormData
    submitted_params?: Record<string, unknown>
  }

  let { form, submitted_params }: Props = $props()

  // Use page.props.errors directly - it's always authoritative from server
  let errors = $derived($page.props.errors || {})

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ]
</script>

<PlaygroundLayout
  title="Contact Form"
  description="Simple inquiry with validation (subject max 100, message 20-1000)"
>
  <div class="mx-auto max-w-xl">
    <Form action={playgroundSubmitContactFormPath()} method="post">
      {#snippet children({
        processing,
        isDirty,
        recentlySuccessful,
      }: FormComponentSlotProps)}
        <Card title="Send us a message">
          <div class="grid gap-4">
            <div class="grid gap-4 sm:grid-cols-2">
              <Field label="Name" name="name" error={errors.name} required>
                <Input
                  id="field-name"
                  name="name"
                  placeholder="Your name"
                  defaultValue={form.name ?? ""}
                  invalid={!!errors.name}
                />
              </Field>

              <Field label="Email" name="email" error={errors.email} required>
                <Input
                  id="field-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  defaultValue={form.email ?? ""}
                  invalid={!!errors.email}
                />
              </Field>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <Field
                label="Subject"
                name="subject"
                error={errors.subject}
                required
              >
                <Input
                  id="field-subject"
                  name="subject"
                  placeholder="What's this about?"
                  defaultValue={form.subject ?? ""}
                  invalid={!!errors.subject}
                />
              </Field>

              <Field label="Priority" name="priority" error={errors.priority}>
                <Select
                  id="priority"
                  name="priority"
                  options={priorityOptions}
                  value={form.priority}
                  triggerClass="w-full"
                />
              </Field>
            </div>

            <Field
              label="Message"
              name="message"
              description="Min 20, max 1000 characters"
              error={errors.message}
              required
            >
              <Textarea
                id="field-message"
                name="message"
                placeholder="Tell us what's on your mind..."
                rows={5}
                defaultValue={form.message ?? ""}
                invalid={!!errors.message}
              />
            </Field>
          </div>

          {#snippet footer()}
            <div class="flex items-center gap-4">
              <Button type="submit" disabled={processing}>
                {processing ? "Sending..." : "Send Message"}
              </Button>
              <Button type="reset" variant="outline">Clear</Button>
              {#if isDirty}
                <Badge variant="secondary">Unsaved</Badge>
              {/if}
              {#if recentlySuccessful}
                <Badge class="bg-green-100 text-green-800">Sent!</Badge>
              {/if}
            </div>
          {/snippet}
        </Card>

        <!-- Debug Panels -->
        {#if submitted_params && Object.keys(submitted_params).length > 0}
          <Card class="border-primary/50 bg-primary/5 mt-6">
            {#snippet header()}
              <h2 class="text-primary">Submitted Params</h2>
            {/snippet}
            <pre class="text-primary overflow-auto text-sm">{JSON.stringify(
                submitted_params,
                null,
                2,
              )}</pre>
          </Card>
        {/if}

        {#if Object.keys(errors).length > 0}
          <Card class="border-destructive/50 bg-destructive/5 mt-6">
            {#snippet header()}
              <h2 class="text-destructive">Validation Errors</h2>
            {/snippet}
            <pre class="text-destructive overflow-auto text-sm">{JSON.stringify(
                errors,
                null,
                2,
              )}</pre>
          </Card>
        {/if}
      {/snippet}
    </Form>
  </div>
</PlaygroundLayout>
