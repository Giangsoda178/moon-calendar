<script lang="ts">
  import {
    AlertCircle,
    Bell,
    CheckCircle,
    Info,
    Radio,
    Send,
    Trash2,
    Wifi,
    WifiOff,
    XCircle,
  } from "@lucide/svelte"
  import { onDestroy, onMount } from "svelte"
  import type { Component } from "svelte"

  import Button from "@/components/ui/Button.svelte"
  import Card from "@/components/ui/Card.svelte"
  import Field from "@/components/ui/Field.svelte"
  import Input from "@/components/ui/Input.svelte"
  import PlaygroundLayout from "@/layouts/PlaygroundLayout.svelte"
  import { playgroundSendNotificationPath } from "@/routes"
  import { toast } from "@/runes/toast.svelte"
  import {
    type ConnectionStatus,
    actionCable,
  } from "@/runes/use-actioncable.svelte"
  import {
    type NotificationType,
    notifications,
  } from "@/runes/use-notifications.svelte"

  // Form state
  let notificationType = $state<NotificationType>("info")
  let notificationTitle = $state("")
  let notificationMessage = $state("")
  let sending = $state(false)

  // Connection status styling
  const statusConfig: Record<
    ConnectionStatus,
    { color: string; icon: Component; label: string }
  > = {
    disconnected: {
      color: "text-red-500",
      icon: WifiOff,
      label: "Disconnected",
    },
    connecting: {
      color: "text-yellow-500",
      icon: Radio,
      label: "Connecting...",
    },
    connected: { color: "text-green-500", icon: Wifi, label: "Connected" },
  }

  // Notification type config
  const typeConfig: Record<
    NotificationType,
    { color: string; bgColor: string; icon: Component }
  > = {
    info: { color: "text-blue-500", bgColor: "bg-blue-500/10", icon: Info },
    success: {
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      icon: CheckCircle,
    },
    warning: {
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      icon: AlertCircle,
    },
    error: { color: "text-red-500", bgColor: "bg-red-500/10", icon: XCircle },
  }

  const notificationTypes: NotificationType[] = [
    "info",
    "success",
    "warning",
    "error",
  ]

  // Lifecycle
  onMount(() => {
    notifications.subscribe()
  })

  onDestroy(() => {
    notifications.unsubscribe()
  })

  // Send notification
  async function sendNotification() {
    if (sending || !notificationTitle.trim()) return

    sending = true
    try {
      const response = await fetch(playgroundSendNotificationPath(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token":
            document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
              ?.content ?? "",
        },
        body: JSON.stringify({
          type: notificationType,
          title: notificationTitle,
          message: notificationMessage,
        }),
      })

      if (!response.ok) {
        toast.error("Failed to send notification", {
          description: `Server returned ${response.status}`,
        })
        return
      }

      // Reset form
      notificationTitle = ""
      notificationMessage = ""
    } catch {
      toast.error("Failed to send notification", {
        description: "Network error - check your connection",
      })
    } finally {
      sending = false
    }
  }

  function formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleTimeString()
  }
</script>

<PlaygroundLayout
  title="WebSocket Notifications"
  description="Real-time push notifications via Action Cable"
>
  <!-- Connection Status -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Bell class="size-5" />
        <h2>Connection Status</h2>
      </div>
    {/snippet}

    {#if true}
      {@const config = statusConfig[actionCable.status]}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-full {config.color} bg-current/10"
          >
            <config.icon class="size-5" />
          </div>
          <div>
            <p class="font-medium {config.color}">{config.label}</p>
            <p class="text-muted-foreground text-sm">
              {actionCable.status === "connected"
                ? "Receiving live notifications"
                : "Waiting for connection"}
            </p>
          </div>
        </div>

        <Button
          variant={actionCable.status === "connected" ? "outline" : "primary"}
          onclick={() =>
            actionCable.status === "connected"
              ? notifications.unsubscribe()
              : notifications.subscribe()}
        >
          {#if actionCable.status === "connected"}
            <WifiOff class="size-4" />
            Disconnect
          {:else}
            <Radio class="size-4" />
            Connect
          {/if}
        </Button>
      </div>
    {/if}
  </Card>

  <!-- Send Notification Form -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Send class="size-5" />
        <h2>Send Test Notification</h2>
      </div>
    {/snippet}

    <p class="text-muted-foreground mb-4 text-sm">
      Trigger a server broadcast via POST to <code class="bg-muted rounded px-1"
        >/playground/websocket/notify</code
      >. All connected clients receive the notification.
    </p>

    <div class="space-y-4">
      <!-- Type Selector -->
      <div>
        <span class="text-sm font-medium">Notification Type</span>
        <div class="mt-2 flex flex-wrap gap-2">
          {#each notificationTypes as type (type)}
            {@const config = typeConfig[type]}
            <button
              type="button"
              class="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors
                {notificationType === type
                ? `border-current ${config.color} ${config.bgColor}`
                : 'border-border hover:bg-muted'}"
              onclick={() => (notificationType = type)}
            >
              <config.icon class="size-4 {config.color}" />
              <span class="capitalize">{type}</span>
            </button>
          {/each}
        </div>
      </div>

      <!-- Title -->
      <Field label="Title" name="title">
        <Input
          name="title"
          bind:value={notificationTitle}
          placeholder="Notification title"
        />
      </Field>

      <!-- Message -->
      <Field label="Message (optional)" name="message">
        <Input
          name="message"
          bind:value={notificationMessage}
          placeholder="Additional details..."
        />
      </Field>

      <!-- Send Button -->
      <Button
        onclick={sendNotification}
        disabled={sending || !notificationTitle.trim()}
        class="w-full sm:w-auto"
      >
        {#if sending}
          Sending...
        {:else}
          <Send class="size-4" />
          Send Notification
        {/if}
      </Button>
    </div>
  </Card>

  <!-- Notification Feed -->
  <Card>
    {#snippet header()}
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <Bell class="size-5" />
          <h2>Notification Feed</h2>
          {#if notifications.items.length > 0}
            <span
              class="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs"
            >
              {notifications.items.length}
            </span>
          {/if}
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              bind:checked={notifications.showToasts}
              class="accent-primary"
            />
            Show toasts
          </label>
          {#if notifications.items.length > 0}
            <Button
              variant="ghost"
              size="sm"
              onclick={() => notifications.clear()}
            >
              <Trash2 class="size-4" />
              Clear
            </Button>
          {/if}
        </div>
      </div>
    {/snippet}

    {#if notifications.items.length === 0}
      <div class="text-muted-foreground py-8 text-center">
        <Bell class="mx-auto mb-2 size-8 opacity-50" />
        <p>No notifications yet</p>
        <p class="text-sm">Send a test notification to see it appear here</p>
      </div>
    {:else}
      <div class="divide-border -mx-4 divide-y sm:-mx-6">
        {#each notifications.items as notification (notification.id)}
          {@const config = typeConfig[notification.type]}
          <div class="flex items-start gap-3 px-4 py-3 sm:px-6">
            <div
              class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full {config.bgColor}"
            >
              <config.icon class="size-4 {config.color}" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="font-medium">{notification.title}</p>
                <span
                  class="rounded px-1.5 py-0.5 text-xs capitalize {config.bgColor} {config.color}"
                >
                  {notification.type}
                </span>
              </div>
              {#if notification.message}
                <p class="text-muted-foreground mt-0.5 text-sm">
                  {notification.message}
                </p>
              {/if}
              <p class="text-muted-foreground mt-1 text-xs">
                {formatTime(notification.timestamp)}
              </p>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </Card>

  <!-- How It Works -->
  <Card>
    {#snippet header()}
      <div class="flex items-center gap-2">
        <Info class="size-5" />
        <h2>How WebSocket Differs from Polling</h2>
      </div>
    {/snippet}

    <div class="bg-muted/30 rounded-lg p-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 class="mb-2 font-medium">Polling (realtime.svelte)</h4>
          <ul class="text-muted-foreground space-y-1 text-sm">
            <li>Client requests data every N seconds</li>
            <li>Simple to implement</li>
            <li>More server load / bandwidth</li>
            <li>Delay = polling interval</li>
          </ul>
        </div>
        <div>
          <h4 class="mb-2 font-medium">WebSocket (this demo)</h4>
          <ul class="text-muted-foreground space-y-1 text-sm">
            <li>Server pushes data when available</li>
            <li>Persistent connection overhead</li>
            <li>Lower latency, real-time</li>
            <li>Efficient for high-frequency updates</li>
          </ul>
        </div>
      </div>
    </div>
  </Card>
</PlaygroundLayout>
