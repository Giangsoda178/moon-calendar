# Chart Insights System

Data-driven health status banners and metrics grids for chart components.

## Overview

The insights system provides configurable threshold-based health evaluation with visual indicators. All insight-capable charts share common components for consistent UX.

## Quick Start

```svelte
<script>
  import { FunnelChart } from "@/components/charts"
</script>

<FunnelChart data={data} showInsights />
```

## Available Insights

### FunnelChart
- **Metrics**: Conversion %, converted count, lost count, biggest drop
- **Health**: Based on overall conversion rate
- **Default Thresholds**: `conversionRate < 10%` = critical, `< 25%` = warning

### RetentionJourney
- **Metrics**: Active time %, at-risk time %, lapse count, recoveries
- **Health**: Based on current state and at-risk percentage
- **Default Thresholds**: `atRiskPct >= 30%` = critical, `>= 15%` = warning

### RetentionSankeyChart
- **Metrics**: Retention %, at-risk %, churn %, conversion %
- **Health**: Based on at-risk and churn rates
- **Default Thresholds**: Same as RetentionJourney

### HistogramChart
- **Metrics**: Mean, median, std dev, range (min-max)
- **Health**: Based on coefficient of variation (CV)
- **Default Thresholds**: `CV >= 1.0` = critical, `>= 0.5` = warning

### GaugeChart
- **Metrics**: Current value, percentage, zone, range
- **Health**: Derived from threshold colors (red = critical, amber = warning)

## Custom Thresholds

### Using InsightsConfig

```svelte
<script>
  import { FunnelChart, createInsightsConfig, createRule } from "@/components/charts"

  const strictConfig = createInsightsConfig([
    createRule("conversionRate", "<", 15, "critical"),
    createRule("conversionRate", "<", 35, "warning"),
  ])
</script>

<FunnelChart data={data} showInsights insightsConfig={strictConfig} />
```

### Using HistogramThresholds

```svelte
<script>
  import { HistogramChart } from "@/components/charts"

  const customThresholds = {
    cvWarning: 0.3,    // 30% CV triggers warning
    cvCritical: 0.6,   // 60% CV triggers critical
    skewWarning: 0.8,
    skewCritical: 1.5,
  }
</script>

<HistogramChart data={data} showInsights insightsConfig={customThresholds} />
```

#### Statistical Metrics Explained

**Coefficient of Variation (CV)** measures data spread relative to the mean:
- `CV = Standard Deviation / Mean`
- CV of 0.3 means std dev is 30% of the mean (tight distribution)
- CV of 1.0 means std dev equals the mean (high variability)

| CV Value | Interpretation | Example |
|----------|---------------|---------|
| < 0.3 | Very consistent | Order values tightly clustered around average |
| 0.3–0.5 | Moderate spread | Normal business variation |
| 0.5–1.0 | High variability | Wide range of outcomes |
| > 1.0 | Extreme spread | Likely outliers or multiple segments |

**Skewness** measures distribution asymmetry:
- Skew = 0: Symmetric (normal distribution)
- Skew > 0: Right-skewed (long tail on right, many low values)
- Skew < 0: Left-skewed (long tail on left, many high values)

| Skew Value | Interpretation | Business Example |
|------------|---------------|------------------|
| -0.5 to 0.5 | Approximately symmetric | Balanced customer behaviors |
| 0.5 to 1.0 | Moderately right-skewed | Many small orders, some large ones |
| > 1.0 | Highly right-skewed | Power-law distribution (whales) |

## Components

### InsightsBanner

Health status banner with icon, label, and action message.

```svelte
<script>
  import { InsightsBanner } from "@/components/charts/insights"
</script>

<InsightsBanner
  status="warning"
  message="Re-engage 120 lapsing users before they churn"
/>
```

**Props:**
- `status: HealthStatus` - "healthy" | "warning" | "critical" | "info" | custom
- `message: string` - Action or info message
- `label?: string` - Override default label
- `icon?: Component` - Override default icon
- `color?: string` - Override default color
- `healthStates?: Record<string, HealthStateConfig>` - Custom states

### MetricsGrid

Responsive grid of metric cards with optional colors and trends.

```svelte
<script>
  import { MetricsGrid } from "@/components/charts/insights"
</script>

<MetricsGrid
  metrics={[
    { label: "Conversion", value: "25", unit: "%" },
    { label: "Revenue", value: "$12.5k", color: "#10b981", trend: "up" },
  ]}
/>
```

**Props:**
- `metrics: MetricItem[]` - Array of metrics to display
- `columns?: 2 | 4` - Grid columns (default: 4)

**MetricItem:**
- `label: string` - Metric label
- `value: string | number` - Metric value
- `unit?: string` - Unit suffix (e.g., "%")
- `color?: string` - Value color
- `secondaryValue?: string` - Secondary text
- `trend?: "up" | "down" | "flat"` - Trend indicator

## Health States

Three standardized states with colors from `RETENTION_STATE_COLORS`:

| Status | Color | Label | Priority |
|--------|-------|-------|----------|
| `critical` | #ef4444 (red) | Action Required | 0 (highest) |
| `warning` | #f59e0b (amber) | Needs Attention | 1 |
| `info` | #3b82f6 (blue) | For Your Information | 2 |
| `healthy` | #10b981 (green) | Performing Well | 3 (lowest) |

## Rule Evaluation

Rules are evaluated in order - first match wins:

```typescript
const config = createInsightsConfig([
  createRule("conversionRate", "<", 10, "critical"),  // Checked first
  createRule("conversionRate", "<", 25, "warning"),   // Checked second
])
// If no rules match, defaultStatus ("healthy") is used
```

**Operators:** `<`, `<=`, `>`, `>=`, `==`, `!=`

## DB-Driven Configuration

The system supports JSON-serializable configs for database storage:

```typescript
// Store in DB as JSON
const dbConfig = {
  rules: [
    { metric: "conversionRate", operator: "<", value: 10, status: "critical" },
    { metric: "conversionRate", operator: "<", value: 25, status: "warning" },
  ],
  defaultStatus: "healthy"
}

// Pass from Rails via Inertia
<FunnelChart data={data} showInsights insightsConfig={dbConfig} />
```

## Dark Mode

All components automatically support dark mode via TailwindCSS and use CSS custom properties for theming.

## Extending

### Custom Health States

```svelte
<InsightsBanner
  status="review"
  message="Review these metrics"
  healthStates={{
    review: {
      color: "#8b5cf6",
      label: "Needs Review",
      icon: Info,
      priority: 2
    }
  }}
/>
```

### Icon Registry

For DB configs, use string keys that map to Lucide icons:

```typescript
import { getIcon, INSIGHT_ICONS } from "@/components/charts/insights"

// Available: "alert", "warning", "info", "check"
const icon = getIcon("warning")  // Returns AlertTriangle component
```

## RetentionJourney Deep Dive

### How It Works

RetentionJourney visualizes a customer's lifecycle as a proportional timeline bar. Each segment represents time spent in a retention state:

```
[███ New ███][██████████ Active ██████████][██ Lapsing ██][████ Active ████]
    7 days              45 days                14 days          60 days
```

**States (in order of health):**

| State | Meaning | Trigger Example |
|-------|---------|-----------------|
| `active` | Engaged customer | Purchase within last 30 days |
| `new` | Recently acquired | First purchase within 14 days |
| `potential` | Prospect | Browsed but hasn't purchased |
| `lapsing` | At-risk | No purchase in 30-60 days |
| `lapsed` | Gone quiet | No purchase in 60-90 days |
| `lost` | Churned | No purchase in 90+ days |

### Health Status Logic

The insights panel evaluates health based on:

1. **Current State** (highest priority)
   - `lost` or `lapsed` → **critical**
   - `lapsing` → **warning**

2. **At-Risk Percentage** (time spent lapsing + lapsed)
   - ≥30% of journey → **critical**
   - ≥15% of journey → **warning**

3. **Churn Rate** (time in lost state)
   - ≥20% of journey → **critical**
   - ≥10% of journey → **warning**

4. **Lapse Frequency**
   - Lapsed >1 time → **warning** (even if currently active)

### Data Format

```typescript
interface RetentionTimelineDataPoint {
  date: Date | string    // When this state began
  state: RetentionState  // "active" | "lapsing" | etc.
  daysInState: number    // Duration in this state
}

// Example: Customer who lapsed once but recovered
const journey = [
  { date: "2024-01-01", state: "new", daysInState: 7 },
  { date: "2024-01-08", state: "active", daysInState: 45 },
  { date: "2024-02-22", state: "lapsing", daysInState: 14 },
  { date: "2024-03-07", state: "active", daysInState: 60 },
]
```

### Business Scenario: Adjusting Thresholds

**Scenario:** Your SaaS has a 90-day trial. Default thresholds flag users too aggressively.

**Current defaults:**
```typescript
// RETENTION_INSIGHTS_CONFIG
atRiskPct: { warning: 15, critical: 30 }
churnRate: { warning: 10, critical: 20 }
```

**Problem:** Trial users show as "warning" because 15% at-risk is normal during evaluation.

**Solution:** Create lenient config for trial users:

```svelte
<script>
  import { RetentionJourney, createInsightsConfig, createRule } from "@/components/charts"

  // More tolerant thresholds for trial accounts
  const trialConfig = createInsightsConfig([
    // Critical only if >50% of journey is at-risk
    createRule("atRiskPct", ">=", 50, "critical"),
    // Warning only if >30% at-risk
    createRule("atRiskPct", ">=", 30, "warning"),
    // Critical if churned for >40% of journey
    createRule("churnRate", ">=", 40, "critical"),
    createRule("churnRate", ">=", 25, "warning"),
  ])
</script>

<!-- Trial user profile -->
<RetentionJourney
  data={trialUserJourney}
  showInsights
  insightsConfig={trialConfig}
/>
```

### Scenario: E-commerce with Seasonal Buyers

**Problem:** Holiday-only shoppers show as "lapsed" 10 months/year.

**Solution:** Industry-specific thresholds from database:

```typescript
// Rails controller
def show
  @customer = Customer.find(params[:id])
  render inertia: {
    journey: @customer.retention_journey,
    insightsConfig: @customer.account.retention_thresholds
    # Returns: { rules: [...], defaultStatus: "healthy" }
  }
end
```

```svelte
<script>
  let { journey, insightsConfig } = $props()
</script>

<RetentionJourney data={journey} showInsights {insightsConfig} />
```

**Seasonal business config example:**
```json
{
  "rules": [
    { "metric": "atRiskPct", "operator": ">=", "value": 60, "status": "critical" },
    { "metric": "atRiskPct", "operator": ">=", "value": 40, "status": "warning" },
    { "metric": "churnRate", "operator": ">=", "value": 50, "status": "critical" }
  ],
  "defaultStatus": "healthy"
}
```

### Priority Actions

The `InsightsBanner` message is contextual based on current state:

| Condition | Message |
|-----------|---------|
| State = `lost` | "Customer has churned - consider win-back campaign" |
| State = `lapsed` | "Win-back needed - {N} days inactive" |
| State = `lapsing` | "Re-engage now - {N} days lapsing" |
| Lapsed >1 time | "Has lapsed {N} times - monitor closely" |
| High at-risk % | "{N}% of journey in at-risk states" |
| Good recovery | "Good recovery - re-engaged {N} time(s)" |
| Healthy | "{N}% active - healthy engagement" |
