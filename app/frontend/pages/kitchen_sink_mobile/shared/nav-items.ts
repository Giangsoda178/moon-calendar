import { House, LayoutGrid, Settings } from "@lucide/svelte"

import {
  kitchenSinkMobileComponentsPath,
  kitchenSinkMobileIndexPath,
  kitchenSinkMobileSettingsPath,
} from "@/routes"

export const navItems = [
  { icon: House, label: "Home", href: kitchenSinkMobileIndexPath() },
  {
    icon: LayoutGrid,
    label: "Components",
    href: kitchenSinkMobileComponentsPath(),
  },
  { icon: Settings, label: "Settings", href: kitchenSinkMobileSettingsPath() },
]
