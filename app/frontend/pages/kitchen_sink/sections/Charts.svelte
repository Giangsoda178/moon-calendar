<script lang="ts">
  import { TrendingDown, TrendingUp } from "@lucide/svelte"
  import { SvelteDate } from "svelte/reactivity"

  import {
    AreaChart,
    BarChart,
    CalendarChart,
    ChartTooltip,
    FunnelChart,
    GaugeChart,
    HistogramChart,
    LineChart,
    PieChart,
    RadialProgressChart,
    RetentionJourney,
    RetentionSankeyChart,
    type RetentionSankeyData,
    type RetentionTimelineDataPoint,
    SparklineChart,
    TreemapChart,
    createInsightsConfig,
    createRule,
  } from "@/components/charts"
  import Card from "@/components/ui/Card.svelte"
  import Section from "@/pages/kitchen_sink/shared/Section.svelte"

  import rawCode from "./Charts.svelte?raw"

  // Define typed data interfaces - generics infer type automatically
  interface MonthlyData {
    month: string
    desktop: number
    mobile: number
  }

  interface SalesData {
    product: string
    sales: number
  }

  interface RevenueData {
    quarter: string
    revenue: number
    expenses: number
  }

  interface BrowserData {
    browser: string
    visitors: number
    [key: string]: unknown
  }

  interface FunnelStage {
    stage: string
    value: number
  }

  // Sample data - monthly metrics
  const monthlyData: MonthlyData[] = [
    { month: "Jan", desktop: 186, mobile: 80 },
    { month: "Feb", desktop: 305, mobile: 200 },
    { month: "Mar", desktop: 237, mobile: 120 },
    { month: "Apr", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "Jun", desktop: 214, mobile: 140 },
  ]

  // Sample data - sales by product
  const salesData: SalesData[] = [
    { product: "Alpha", sales: 4500 },
    { product: "Beta", sales: 3200 },
    { product: "Gamma", sales: 2800 },
    { product: "Delta", sales: 2100 },
    { product: "Epsilon", sales: 1500 },
  ]

  // Sample data - revenue trend
  const revenueData: RevenueData[] = [
    { quarter: "Q1", revenue: 12000, expenses: 8000 },
    { quarter: "Q2", revenue: 15000, expenses: 9500 },
    { quarter: "Q3", revenue: 18000, expenses: 11000 },
    { quarter: "Q4", revenue: 22000, expenses: 13000 },
  ]

  // Sample data - browser share
  const browserData: BrowserData[] = [
    { browser: "Chrome", visitors: 275 },
    { browser: "Safari", visitors: 200 },
    { browser: "Firefox", visitors: 187 },
    { browser: "Edge", visitors: 173 },
    { browser: "Other", visitors: 90 },
  ]

  // Sample data - funnel
  const funnelData: FunnelStage[] = [
    { stage: "Visitors", value: 10000 },
    { stage: "Product Views", value: 6800 },
    { stage: "Add to Cart", value: 3400 },
    { stage: "Checkout", value: 2040 },
    { stage: "Purchase", value: 1530 },
  ]

  // Sample data - sparklines
  const sparklineRevenue = [12, 15, 18, 14, 22, 28, 25]
  const sparklineOrders = [45, 52, 38, 65, 58, 72, 80]
  const sparklineVisitors = [1200, 1350, 980, 1500, 1420]

  // Sample data - year-over-year sales comparison
  interface YoYSalesData {
    month: string
    thisYear: number
    lastYear: number
  }

  const yoySalesData: YoYSalesData[] = [
    { month: "Jan", thisYear: 4200, lastYear: 3800 }, // +10.5%
    { month: "Feb", thisYear: 4800, lastYear: 4100 }, // +17.1%
    { month: "Mar", thisYear: 4300, lastYear: 4500 }, // -4.4% (decrease)
    { month: "Apr", thisYear: 4100, lastYear: 4700 }, // -12.8% (decrease)
    { month: "May", thisYear: 5600, lastYear: 4900 }, // +14.3%
    { month: "Jun", thisYear: 6200, lastYear: 5200 }, // +19.2%
    { month: "Jul", thisYear: 5200, lastYear: 5500 }, // -5.5% (decrease)
    { month: "Aug", thisYear: 6400, lastYear: 5800 }, // +10.3%
    { month: "Sep", thisYear: 6100, lastYear: 5600 }, // +8.9%
    { month: "Oct", thisYear: 5800, lastYear: 6000 }, // -3.3% (decrease)
    { month: "Nov", thisYear: 7200, lastYear: 6400 }, // +12.5%
    { month: "Dec", thisYear: 8100, lastYear: 7100 }, // +14.1%
  ]

  // Bindable state for funnel hover
  let funnelHoveredIndex = $state<number | null>(null)

  // ============================================================================
  // Extended Chart Data
  // ============================================================================

  // Histogram data - grocery/liquor order value distribution
  interface OrderValue {
    value: number
    [key: string]: unknown
  }
  // Realistic order values: most orders $30-80, some bulk orders $100-200
  const histogramData: OrderValue[] = Array.from({ length: 150 }, () => {
    const rand = Math.random()
    let value: number
    if (rand < 0.15) {
      // 15% small orders ($15-30)
      value = 15 + Math.random() * 15
    } else if (rand < 0.7) {
      // 55% typical orders ($30-80)
      value = 30 + Math.random() * 50
    } else if (rand < 0.9) {
      // 20% larger orders ($80-150)
      value = 80 + Math.random() * 70
    } else {
      // 10% bulk/party orders ($150-300)
      value = 150 + Math.random() * 150
    }
    return { value: Math.round(value) }
  })

  // Calendar chart data - activity heatmap
  interface ActivityData {
    date: string
    commits: number
    [key: string]: unknown
  }
  const calendarData: ActivityData[] = Array.from({ length: 180 }, (_, i) => {
    const date = new SvelteDate()
    date.setDate(date.getDate() - (180 - i))
    return {
      date: date.toISOString().split("T")[0],
      commits: Math.floor(Math.random() * 10),
    }
  })

  // Treemap data - supermarket ecommerce revenue breakdown
  interface CategoryBreakdown {
    name: string
    children?: CategoryBreakdown[]
    value?: number
    [key: string]: unknown
  }
  const treemapData: CategoryBreakdown = {
    name: "Sales",
    children: [
      {
        name: "Grocery",
        children: [
          { name: "Fresh Produce", value: 42000 },
          { name: "Dairy & Eggs", value: 35000 },
          { name: "Meat & Seafood", value: 38000 },
          { name: "Bakery", value: 18000 },
          { name: "Pantry", value: 28000 },
        ],
      },
      {
        name: "Liquor",
        children: [
          { name: "Wine", value: 32000 },
          { name: "Beer & Cider", value: 24000 },
          { name: "Spirits", value: 19000 },
        ],
      },
      {
        name: "Household",
        children: [
          { name: "Cleaning", value: 15000 },
          { name: "Personal Care", value: 12000 },
          { name: "Pet Supplies", value: 8000 },
        ],
      },
    ],
  }

  // ============================================================================
  // Retention Lifecycle Data
  // ============================================================================

  // Single user timeline - state transitions over time
  const retentionTimelineData: RetentionTimelineDataPoint[] = [
    { date: "2025-01-01", state: "new", daysInState: 7 },
    { date: "2025-01-08", state: "active", daysInState: 45 },
    { date: "2025-02-22", state: "lapsing", daysInState: 14 },
    { date: "2025-03-07", state: "active", daysInState: 60 },
    { date: "2025-05-06", state: "lapsing", daysInState: 21 },
  ]

  // Sankey data - shop-wide user transitions (DAG - no cycles)
  // Models single period flow: potential → new → active → lapsing → lapsed → lost
  const retentionSankeyData: RetentionSankeyData = {
    nodes: [
      { id: "potential", label: "Potential", value: 1000 },
      { id: "new", label: "New Users", value: 800 },
      { id: "active", label: "Active", value: 650 },
      { id: "lapsing", label: "Lapsing", value: 200 },
      { id: "lapsed", label: "Lapsed", value: 120 },
      { id: "lost", label: "Lost", value: 230 },
    ],
    links: [
      // From Potential
      { source: "potential", target: "new", value: 800 },
      { source: "potential", target: "lost", value: 200 },
      // From New
      { source: "new", target: "active", value: 650 },
      { source: "new", target: "lapsing", value: 100 },
      { source: "new", target: "lost", value: 50 },
      // From Active
      { source: "active", target: "lapsing", value: 100 },
      // From Lapsing
      { source: "lapsing", target: "lapsed", value: 120 },
      { source: "lapsing", target: "lost", value: 80 },
      // From Lapsed (only forward to lost)
      { source: "lapsed", target: "lost", value: 100 },
    ],
  }

  // Activity data for state cards (recent activity trend)
  const activeUserActivity = [8, 10, 12, 9, 11, 14, 13]
  const lapsingUserActivity = [5, 4, 3, 2, 2, 1, 1]

  // Custom insights configuration example (stricter thresholds)
  const strictFunnelConfig = createInsightsConfig([
    createRule("conversionRate", "<", 20, "critical"),
    createRule("conversionRate", "<", 40, "warning"),
  ])
</script>

<Section id="charts" title="Charts" code={rawCode}>
  <p class="text-muted-foreground mb-4 text-sm">
    Data visualization using LayerChart v2 with Svelte 5 snippet API. New
    simplified props: <code class="text-xs">x</code>,
    <code class="text-xs">y</code>
    or
    <code class="text-xs">series</code> arrays, and custom
    <code class="text-xs">{"{#snippet tooltip()}"}</code>.
  </p>

  <div class="@container">
    <div class="grid gap-6 @3xl:grid-cols-2">
      <!-- Area Chart -->
      <Card
        class="min-w-0"
        title="Area Chart"
        description="Multi-series with snippet API"
      >
        <div class="h-[250px]">
          <AreaChart
            data={monthlyData}
            x="month"
            series={["desktop", "mobile"]}
            colors={["var(--chart-1)", "var(--chart-2)"]}
          />
        </div>
      </Card>

      <!-- Bar Chart -->
      <Card
        class="min-w-0"
        title="Bar Chart"
        description="With custom tooltip snippet"
      >
        <div class="h-[250px]">
          <BarChart
            data={salesData}
            x="product"
            y="sales"
            color="var(--chart-3)"
          >
            {#snippet tooltip({ data, color })}
              <ChartTooltip {color}>
                <p class="font-medium">{data.product}</p>
                <p class="text-muted-foreground">
                  ${data.sales.toLocaleString()}
                </p>
              </ChartTooltip>
            {/snippet}
          </BarChart>
        </div>
      </Card>

      <!-- Line Chart -->
      <Card
        class="min-w-0"
        title="Line Chart (Basic)"
        description="Legend on right side"
      >
        <div class="h-[250px]">
          <LineChart
            data={revenueData}
            x="quarter"
            series={["revenue", "expenses"]}
            colors={["var(--chart-1)", "var(--chart-5)"]}
            legendPosition="right"
          />
        </div>
      </Card>

      <!-- Line Chart - Year-over-Year Sales with Custom Tooltip -->
      <Card
        class="min-w-0"
        title="Line Chart (YoY)"
        description="Custom tooltip with YoY % change"
      >
        <div class="h-[250px]">
          <LineChart
            data={yoySalesData}
            x="month"
            series={["thisYear", "lastYear"]}
            labels={{ thisYear: "2025", lastYear: "2024" }}
            xAxis={{
              format: (d: string, i: number) => (i % 2 === 0 ? d : ""),
            }}
            colors={["var(--chart-1)", "var(--chart-2)"]}
          >
            {#snippet tooltip({ data })}
              <ChartTooltip>
                <p class="mb-1 font-medium">{data.month}</p>
                <div class="grid gap-1">
                  <div class="flex items-center gap-2">
                    <span
                      class="size-2 rounded-full"
                      style:background-color="var(--chart-1)"
                    ></span>
                    <span class="text-muted-foreground">2025</span>
                    <span class="ml-auto font-mono font-medium tabular-nums">
                      ${data.thisYear.toLocaleString()}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <span
                      class="size-2 rounded-full"
                      style:background-color="var(--chart-2)"
                    ></span>
                    <span class="text-muted-foreground">2024</span>
                    <span class="ml-auto font-mono font-medium tabular-nums">
                      ${data.lastYear.toLocaleString()}
                    </span>
                  </div>
                  <div class="mt-1 border-t pt-1 text-xs">
                    {#if data.thisYear >= data.lastYear}
                      <span
                        class="flex items-center gap-1 text-green-600 dark:text-green-400"
                      >
                        <TrendingUp class="size-3" />
                        +{Math.round(
                          ((data.thisYear - data.lastYear) / data.lastYear) *
                            100,
                        )}% YoY
                      </span>
                    {:else}
                      <span
                        class="flex items-center gap-1 text-red-600 dark:text-red-400"
                      >
                        <TrendingDown class="size-3" />
                        {Math.round(
                          ((data.thisYear - data.lastYear) / data.lastYear) *
                            100,
                        )}% YoY
                      </span>
                    {/if}
                  </div>
                </div>
              </ChartTooltip>
            {/snippet}
          </LineChart>
        </div>
      </Card>

      <!-- Pie Chart -->
      <Card
        class="min-w-0"
        title="Pie Chart"
        description="With hover highlight"
      >
        <div class="h-[250px]">
          <PieChart
            data={browserData}
            x="browser"
            y="visitors"
            highlightOffset={1}
          />
        </div>
      </Card>

      <!-- Donut Chart -->
      <Card
        class="min-w-0"
        title="Donut Chart"
        description="Donut with hover highlight"
      >
        <div class="h-[250px]">
          <PieChart
            data={browserData}
            x="browser"
            y="visitors"
            innerRadius={60}
            highlightOffset={1}
          />
        </div>
      </Card>

      <!-- Horizontal Bar Chart -->
      <Card
        class="min-w-0"
        title="Horizontal Bar"
        description="Bar chart rotated"
      >
        <div class="h-[250px]">
          <BarChart
            data={salesData}
            x="product"
            y="sales"
            color="var(--chart-4)"
            horizontal
          >
            {#snippet tooltip({ data, color })}
              <ChartTooltip {color}>
                <p class="font-medium">{data.product}</p>
                <p class="text-muted-foreground">
                  ${data.sales.toLocaleString()}
                </p>
              </ChartTooltip>
            {/snippet}
          </BarChart>
        </div>
      </Card>

      <!-- Funnel Chart -->
      <Card
        class="min-w-0"
        title="Funnel Chart"
        description="Conversion funnel without insights"
      >
        <FunnelChart
          data={funnelData}
          showPercentages
          bind:hoveredIndex={funnelHoveredIndex}
        >
          {#snippet tooltip({ data, percentage, color })}
            <ChartTooltip {color}>
              <p class="font-medium">{data.stage}</p>
              <p class="text-muted-foreground">
                {data.value.toLocaleString()} ({percentage}%)
              </p>
            </ChartTooltip>
          {/snippet}
        </FunnelChart>
      </Card>

      <!-- Radial Progress Charts -->
      <Card
        class="min-w-0"
        title="Radial Progress"
        description="Circular metric indicators"
      >
        <div class="flex flex-wrap items-center justify-around py-4">
          <RadialProgressChart
            value={67}
            label="Sales"
            color="var(--chart-1)"
          />
          <RadialProgressChart
            value={850}
            max={1000}
            label="Revenue"
            color="var(--chart-2)"
          />
          <RadialProgressChart
            value={92}
            label="Quota"
            color="var(--chart-3)"
            size={80}
            strokeWidth={6}
          />
        </div>
      </Card>

      <!-- Sparklines -->
      <Card
        class="min-w-0"
        title="Sparklines"
        description="Compact inline trends"
      >
        <div class="space-y-4 py-2">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Revenue</span>
            <div class="flex items-center gap-2">
              <SparklineChart
                data={sparklineRevenue}
                color="var(--chart-1)"
                width={120}
                height={32}
              />
              <span class="text-muted-foreground text-sm">+12%</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Orders</span>
            <div class="flex items-center gap-2">
              <SparklineChart
                data={sparklineOrders}
                type="bar"
                color="var(--chart-3)"
                width={120}
                height={32}
              />
              <span class="text-muted-foreground text-sm">+8%</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium">Visitors</span>
            <div class="flex items-center gap-2">
              <SparklineChart
                data={sparklineVisitors}
                type="area"
                color="var(--chart-2)"
                width={120}
                height={32}
              />
              <span class="text-muted-foreground text-sm">+5%</span>
            </div>
          </div>
        </div>
      </Card>

      <!-- Gauge Chart with Insights -->
      <Card
        class="min-w-0"
        title="Gauge Chart"
        description="KPI progress with zone insights"
      >
        <GaugeChart
          value={67}
          target={80}
          showInsights
          thresholds={[
            { value: 30, color: "var(--chart-5)" },
            { value: 60, color: "var(--chart-4)" },
            { value: 100, color: "var(--chart-1)" },
          ]}
        />
      </Card>

      <!-- Histogram Chart with Insights -->
      <Card
        class="min-w-0"
        title="Histogram"
        description="Distribution with statistical insights"
      >
        <HistogramChart
          data={histogramData}
          x="value"
          binCount={12}
          color="var(--chart-4)"
          showInsights
          referenceLines={[
            { value: 75, label: "Avg Order", color: "var(--chart-5)" },
          ]}
        />
      </Card>

      <!-- Calendar Chart -->
      <Card
        class="min-w-0"
        title="Calendar Chart"
        description="GitHub-style activity heatmap"
      >
        <div class="h-[180px]">
          <CalendarChart
            data={calendarData}
            x="date"
            y="commits"
            colorScheme="greens"
            cellSize={10}
          />
        </div>
      </Card>

      <!-- Treemap Chart -->
      <Card
        class="min-w-0"
        title="Treemap"
        description="Supermarket sales by department"
      >
        <div class="h-[300px]">
          <TreemapChart data={treemapData} />
        </div>
      </Card>

      <!-- Retention Journey -->
      <Card
        class="min-w-0"
        title="Retention Journey"
        description="Single user lifecycle with insights"
      >
        <RetentionJourney data={retentionTimelineData} showInsights />

        <!-- Retention State Card -->
        <div class="mt-5 space-y-3 py-2">
          <!-- Active user - healthy engagement -->
          <div class="flex items-center gap-3 rounded-lg border p-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style:background-color="#10b98120"
            >
              <div
                class="h-4 w-4 rounded-full"
                style:background-color="#10b981"
              ></div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-2">
                <span class="text-sm font-semibold" style:color="#10b981">
                  Active
                </span>
                <span class="text-muted-foreground text-xs">45 days</span>
              </div>
              <div class="mt-1 h-6 w-full">
                <SparklineChart
                  data={activeUserActivity}
                  color="#10b981"
                  type="area"
                />
              </div>
            </div>
          </div>

          <!-- Lapsing user - declining engagement -->
          <div class="flex items-center gap-3 rounded-lg border p-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style:background-color="#f59e0b20"
            >
              <div
                class="h-4 w-4 rounded-full"
                style:background-color="#f59e0b"
              ></div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-2">
                <span class="text-sm font-semibold" style:color="#f59e0b">
                  Lapsing
                </span>
                <span class="text-muted-foreground text-xs">14 days</span>
              </div>
              <div class="mt-1 h-6 w-full">
                <SparklineChart
                  data={lapsingUserActivity}
                  color="#f59e0b"
                  type="area"
                />
              </div>
            </div>
          </div>

          <!-- Lost user - no sparkline -->
          <div class="flex items-center gap-3 rounded-lg border p-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style:background-color="#ef444420"
            >
              <div
                class="h-4 w-4 rounded-full"
                style:background-color="#ef4444"
              ></div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-2">
                <span class="text-sm font-semibold" style:color="#ef4444">
                  Lost
                </span>
                <span class="text-muted-foreground text-xs">120+ days</span>
              </div>
              <p class="text-muted-foreground mt-0.5 text-xs">
                No recent activity
              </p>
            </div>
          </div>

          <!-- New user - growing engagement -->
          <div class="flex items-center gap-3 rounded-lg border p-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
              style:background-color="#3b82f620"
            >
              <div
                class="h-4 w-4 rounded-full"
                style:background-color="#3b82f6"
              ></div>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-baseline gap-2">
                <span class="text-sm font-semibold" style:color="#3b82f6">
                  New
                </span>
                <span class="text-muted-foreground text-xs">7 days</span>
              </div>
              <div class="mt-1 h-6 w-full">
                <SparklineChart
                  data={[1, 2, 3, 4, 5, 6, 8]}
                  color="#3b82f6"
                  type="area"
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <!-- Retention Sankey Chart -->
      <Card
        class="min-w-0"
        title="Retention Sankey"
        description="Shop-wide user state transitions"
      >
        <div class="h-[650px]">
          <RetentionSankeyChart data={retentionSankeyData} showInsights />
        </div>
      </Card>

      <!-- Insights System Demo -->
      <Card
        class="min-w-0 @3xl:col-span-2"
        title="Insights System"
        description="Custom thresholds with createInsightsConfig"
      >
        <p class="text-muted-foreground mb-4 text-sm">
          Charts support <code class="text-xs">showInsights</code> for automatic
          health banners and <code class="text-xs">insightsConfig</code> for custom
          thresholds. This funnel uses stricter rules (critical &lt;20%, warning &lt;40%).
        </p>
        <FunnelChart
          data={funnelData}
          showPercentages
          showInsights
          insightsConfig={strictFunnelConfig}
        />
      </Card>
    </div>
  </div>
</Section>
