<script lang="ts">
  import type { FormComponentSlotProps } from "@inertiajs/core"
  import { Form, page } from "@inertiajs/svelte"

  import Badge from "@/components/ui/Badge.svelte"
  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import Checkbox from "@/components/ui/Checkbox.svelte"
  import Field from "@/components/ui/Field.svelte"
  import Input from "@/components/ui/Input.svelte"
  import Label from "@/components/ui/Label.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import { playgroundSubmitLoginFormPath } from "@/routes"

  type FormData = {
    email: string | null
    password: string | null
    remember_me: boolean
  }

  type Props = {
    form: FormData
    submitted_params?: Record<string, unknown>
  }

  let { form, submitted_params }: Props = $props()

  // Use page.props.errors directly - it's always authoritative from server
  // The Form component's errors slot prop has a bug where errors accumulate
  let errors = $derived($page.props.errors || {})
</script>

<PlaygroundLayout
  title="Login Form"
  description="Basic authentication pattern with email, password, and remember me"
>
  <div class="mx-auto max-w-sm">
    <Form action={playgroundSubmitLoginFormPath()} method="post">
      {#snippet children({
        processing,
        isDirty,
        recentlySuccessful,
      }: FormComponentSlotProps)}
        <Card title="Sign In" description="Enter your credentials to continue">
          <div class="grid gap-4">
            <Field label="Email" name="email" error={errors.email} required>
              <Input
                id="field-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={form.email ?? ""}
                invalid={!!errors.email}
                autocomplete="email"
              />
            </Field>

            <Field
              label="Password"
              name="password"
              error={errors.password}
              required
            >
              <Input
                id="field-password"
                name="password"
                type="password"
                placeholder="••••••••"
                defaultValue={form.password ?? ""}
                invalid={!!errors.password}
                autocomplete="current-password"
              />
            </Field>

            <Label class="cursor-pointer items-center gap-2">
              <Checkbox
                name="remember_me"
                value="1"
                defaultChecked={form.remember_me}
              />
              Remember me
            </Label>
          </div>

          {#snippet footer()}
            <div class="flex flex-col gap-4">
              <Button type="submit" class="w-full" disabled={processing}>
                {processing ? "Signing in..." : "Sign In"}
              </Button>

              {#if isDirty}
                <Badge variant="secondary" class="self-center"
                  >Unsaved changes</Badge
                >
              {/if}
              {#if recentlySuccessful}
                <Badge class="self-center bg-green-100 text-green-800"
                  >Success!</Badge
                >
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
