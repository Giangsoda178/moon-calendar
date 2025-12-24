/**
 * Shared types for playground demo pages
 * Used by: once_props.svelte, once_props_page2.svelte
 */

export type Country = {
  code: string
  name: string
  flag: string
}

export type CountriesData = {
  generated_at: string
  items: Country[]
}

export type Plan = {
  id: string
  name: string
  price: number
  features: string[]
}

export type PlansData = {
  generated_at: string
  items: Plan[]
}

export type Metric = {
  id: number
  name: string
  value: number
  unit: string
}

export type HeavyData = {
  generated_at: string
  metrics: Metric[]
  summary: string
}
