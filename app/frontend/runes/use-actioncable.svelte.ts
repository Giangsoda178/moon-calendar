import {
  type Consumer,
  type Subscription,
  createConsumer,
} from "@rails/actioncable"

export type ConnectionStatus = "disconnected" | "connecting" | "connected"

/**
 * ActionCable connection manager using Svelte 5 runes.
 * Provides reactive connection status and subscription management.
 *
 * @example
 * const cable = useActionCable()
 *
 * $effect(() => {
 *   console.log("Status:", cable.status)
 * })
 *
 * const subscription = cable.subscribe("NotificationsChannel", {
 *   received: (data) => console.log(data)
 * })
 */
class ActionCableStore {
  private consumer: Consumer | null = null
  private subscriptions: Map<string, Subscription> = new Map()

  status = $state<ConnectionStatus>("disconnected")

  connect(): Consumer {
    if (this.consumer) return this.consumer

    this.status = "connecting"
    this.consumer = createConsumer()

    return this.consumer
  }

  subscribe<T = unknown>(
    channelName: string,
    params: Record<string, unknown> = {},
    callbacks: {
      received?: (data: T) => void
      connected?: () => void
      disconnected?: () => void
      rejected?: () => void
    } = {},
  ): Subscription | null {
    const consumer = this.connect()

    const key = JSON.stringify({ channel: channelName, ...params })
    if (this.subscriptions.has(key)) {
      return this.subscriptions.get(key)!
    }

    const subscription = consumer.subscriptions.create(
      { channel: channelName, ...params },
      {
        connected: () => {
          this.status = "connected"
          callbacks.connected?.()
        },
        disconnected: () => {
          this.status = "disconnected"
          callbacks.disconnected?.()
        },
        rejected: () => {
          this.status = "disconnected"
          callbacks.rejected?.()
        },
        received: (data: T) => {
          callbacks.received?.(data)
        },
      },
    )

    this.subscriptions.set(key, subscription)
    return subscription
  }

  unsubscribe(channelName: string, params: Record<string, unknown> = {}): void {
    const key = JSON.stringify({ channel: channelName, ...params })
    const subscription = this.subscriptions.get(key)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(key)
    }
  }

  disconnect(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
    this.subscriptions.clear()
    this.consumer?.disconnect()
    this.consumer = null
    this.status = "disconnected"
  }
}

// Singleton instance
export const actionCable = new ActionCableStore()

// Hook-style export for component usage
export function useActionCable() {
  return actionCable
}
