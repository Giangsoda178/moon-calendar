/**
 * Toast notification system using Svelte 5 runes.
 * Provides a reactive store for managing toast notifications.
 *
 * Features:
 * - Auto-dismiss with configurable duration
 * - Pause on hover
 * - Swipe to dismiss (touch/mouse)
 * - Close button on hover
 * - Loading state with spinner
 * - Promise toast (loading → success/error)
 * - Action buttons with onclick or href
 *
 * @example
 * import { toast } from "@/runes/toast.svelte"
 *
 * // Simple notifications
 * toast.success("Changes saved!")
 * toast.error("Something went wrong")
 * toast.info("New update available")
 * toast.warning("Your session expires soon")
 *
 * // With options
 * toast.success("Saved!", { description: "Your changes have been saved.", duration: 5000 })
 *
 * // With action button
 * toast.info("File deleted", {
 *   action: { label: "Undo", onclick: () => restoreFile() }
 * })
 *
 * // Loading toast (stays until dismissed)
 * const id = toast.loading("Uploading...")
 * // Later: toast.dismiss(id)
 *
 * // Promise toast (auto-transitions loading → success/error)
 * toast.promise(saveData(), {
 *   loading: "Saving...",
 *   success: "Saved!",
 *   error: "Failed to save"
 * })
 */

export type ToastCategory = "success" | "error" | "info" | "warning" | "loading"

export type ToastAction = {
  label: string
  onclick?: () => void
  href?: string
}

export type ToastOptions = {
  description?: string
  duration?: number
  action?: ToastAction
  cancel?: ToastAction
}

export type Toast = {
  id: string
  category: ToastCategory
  title: string
  description?: string
  duration: number
  action?: ToastAction
  cancel?: ToastAction
  createdAt: number
}

// Default durations (ms)
const DEFAULT_DURATION = 3000
const ERROR_DURATION = 5000
const LOADING_DURATION = -1 // -1 means no auto-dismiss

export type PromiseOptions<T> = {
  loading: string
  success: string | ((data: T) => string)
  error: string | ((error: unknown) => string)
  description?: string
}

// Generate unique ID
const generateId = () =>
  `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

// Reactive toast store using Svelte 5 runes
class ToastStore {
  toasts = $state<Toast[]>([])

  private add(
    category: ToastCategory,
    title: string,
    options: ToastOptions = {},
  ): string {
    const id = generateId()
    const duration =
      options.duration ??
      (category === "error" ? ERROR_DURATION : DEFAULT_DURATION)

    const toast: Toast = {
      id,
      category,
      title,
      description: options.description,
      duration,
      action: options.action,
      cancel: options.cancel,
      createdAt: Date.now(),
    }

    this.toasts.push(toast)
    return id
  }

  success(title: string, options?: ToastOptions): string {
    return this.add("success", title, options)
  }

  error(title: string, options?: ToastOptions): string {
    return this.add("error", title, options)
  }

  info(title: string, options?: ToastOptions): string {
    return this.add("info", title, options)
  }

  warning(title: string, options?: ToastOptions): string {
    return this.add("warning", title, options)
  }

  loading(title: string, options?: Omit<ToastOptions, "duration">): string {
    return this.add("loading", title, {
      ...options,
      duration: LOADING_DURATION,
    })
  }

  /**
   * Show loading toast while promise is pending, then success/error based on result.
   * @example
   * toast.promise(saveData(), {
   *   loading: "Saving...",
   *   success: "Saved!",
   *   error: "Failed to save"
   * })
   */
  promise<T>(promise: Promise<T>, options: PromiseOptions<T>): Promise<T> {
    const id = this.loading(options.loading, {
      description: options.description,
    })

    promise
      .then((data) => {
        this.update(id, {
          category: "success",
          title:
            typeof options.success === "function"
              ? options.success(data)
              : options.success,
          duration: DEFAULT_DURATION,
        })
      })
      .catch((error) => {
        this.update(id, {
          category: "error",
          title:
            typeof options.error === "function"
              ? options.error(error)
              : options.error,
          duration: ERROR_DURATION,
        })
      })

    return promise
  }

  /** Update an existing toast's properties */
  private update(
    id: string,
    updates: Partial<Omit<Toast, "id" | "createdAt">>,
  ): void {
    const toast = this.toasts.find((t) => t.id === id)
    if (toast) {
      Object.assign(toast, updates)
    }
  }

  dismiss(id: string): void {
    const index = this.toasts.findIndex((t) => t.id === id)
    if (index !== -1) {
      this.toasts.splice(index, 1)
    }
  }

  clear(): void {
    this.toasts = []
  }
}

// Singleton instance
export const toast = new ToastStore()
