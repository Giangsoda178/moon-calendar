<script lang="ts">
  import CalendarLayout from "@/layouts/CalendarLayout.svelte"
  import { ChevronLeft, ChevronRight } from "@lucide/svelte"

  // Default display month/year to the current date
  let displayYear = $state(new Date().getFullYear())
  let displayMonth = $state(new Date().getMonth())

  // Get today's date for highlight
  const today = new Date()
  const todayISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  // Selected date as ISO string (YYYY-MM-DD)
  let selectedISO = $state<string | null>(null)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const monthShortNames = monthNames.map((m) => m.slice(0, 3))
  const weekdayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]
