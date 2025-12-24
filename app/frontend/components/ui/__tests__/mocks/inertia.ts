/**
 * Inertia.js mocks for component testing
 * Provides mock implementations for router and Link component
 */

import { vi } from "vitest"

// ============================================================================
// ROUTER MOCK
// ============================================================================

export const mockRouter = {
  visit: vi.fn(),
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  patch: vi.fn(),
  delete: vi.fn(),
  reload: vi.fn(),
  replace: vi.fn(),
  on: vi.fn(),
  off: vi.fn(),
}

/**
 * Reset all router mocks between tests
 */
export function resetRouterMocks(): void {
  Object.values(mockRouter).forEach((fn) => fn.mockReset())
}

// ============================================================================
// INERTIA MODULE MOCK
// ============================================================================

/**
 * Setup Inertia mocks - call this in your test setup
 *
 * Usage in test file:
 * ```ts
 * import { setupInertiaMocks } from './__tests__/mocks/inertia'
 *
 * beforeAll(() => {
 *   setupInertiaMocks()
 * })
 * ```
 */
export function setupInertiaMocks(): void {
  vi.mock("@inertiajs/svelte", () => ({
    router: mockRouter,
    Link: "a", // Stub as anchor element
    createInertiaApp: vi.fn(),
    usePage: vi.fn(() => ({
      props: {},
      url: "/",
      component: "Test",
    })),
    useForm: vi.fn((initial) => ({
      ...initial,
      data: initial,
      errors: {},
      processing: false,
      progress: null,
      wasSuccessful: false,
      recentlySuccessful: false,
      transform: vi.fn(),
      reset: vi.fn(),
      clearErrors: vi.fn(),
      submit: vi.fn(),
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    })),
    useRemember: vi.fn((initial) => initial),
  }))
}

// ============================================================================
// PAGE CONTEXT MOCK
// ============================================================================

export interface MockPageProps {
  url?: string
  component?: string
  props?: Record<string, unknown>
  version?: string
}

/**
 * Creates a mock page context
 */
export function createMockPage(overrides: MockPageProps = {}) {
  return {
    url: overrides.url ?? "/",
    component: overrides.component ?? "TestPage",
    props: overrides.props ?? {},
    version: overrides.version ?? "1.0.0",
  }
}

// ============================================================================
// FORM MOCK
// ============================================================================

export interface MockFormData {
  [key: string]: unknown
}

/**
 * Creates a mock Inertia form
 */
export function createMockForm<T extends MockFormData>(initialData: T) {
  const data = { ...initialData }
  const errors: Partial<Record<keyof T, string>> = {}

  return {
    data,
    errors,
    processing: false,
    progress: null,
    wasSuccessful: false,
    recentlySuccessful: false,
    setData: vi.fn((key: keyof T, value: unknown) => {
      data[key] = value as T[keyof T]
    }),
    transform: vi.fn((callback: (data: T) => T) => callback(data)),
    reset: vi.fn(() => {
      Object.assign(data, initialData)
    }),
    clearErrors: vi.fn(() => {
      Object.keys(errors).forEach((key) => delete errors[key as keyof T])
    }),
    submit: vi.fn(),
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  }
}
