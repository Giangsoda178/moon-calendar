/**
 * Inertia.js Integration
 *
 * Re-exports Inertia for use in components.
 * Components check if `inertiaAction` exists before using.
 *
 * For non-Inertia projects (SvelteKit, plain Svelte), replace this file with:
 * ```typescript
 * export const inertiaAction = undefined
 * export const router = undefined
 * export const page = undefined
 * ```
 */

export { inertia as inertiaAction, page, router } from "@inertiajs/svelte"
