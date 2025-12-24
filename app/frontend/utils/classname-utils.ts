/**
 * Tailwind CSS class name utilities.
 * Provides class merging with conflict resolution.
 */
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges class names with Tailwind conflict resolution.
 * Combines clsx (conditional classes) + tailwind-merge (conflict resolution).
 *
 * @example Basic usage
 * cn("px-2 py-1", "text-sm")
 * // => "px-2 py-1 text-sm"
 *
 * @example Tailwind conflict resolution (last wins)
 * cn("px-2 py-1", "px-4")
 * // => "py-1 px-4"  (px-4 overrides px-2)
 *
 * cn("bg-red-500", "bg-blue-500")
 * // => "bg-blue-500"  (last bg-* wins)
 *
 * @example Boolean conditionals
 * const isActive = true
 * const isDisabled = false
 * cn("btn", isActive && "btn-active", isDisabled && "btn-disabled")
 * // => "btn btn-active"  (false values are filtered out)
 *
 * @example Object syntax
 * cn("btn", { "btn-active": true, "btn-disabled": false, "opacity-50": false })
 * // => "btn btn-active"  (only keys with truthy values)
 *
 * @example Component with consumer override
 * // Internal: "px-4 bg-gray-100"
 * // Consumer passes: "px-2 bg-blue-500"
 * cn("px-4 bg-gray-100", consumerClass)
 * // => "px-2 bg-blue-500"  (consumer classes override internal)
 *
 * @example Combined patterns
 * const size = "lg"
 * const hasError = true
 * cn(
 *   "base-class",
 *   size === "lg" && "text-lg py-3",
 *   size === "sm" && "text-sm py-1",
 *   { "border-red-500": hasError, "border-gray-300": !hasError }
 * )
 * // => "base-class text-lg py-3 border-red-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
