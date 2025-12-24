# Theme System

## Adding a New Theme

**2 steps only:**

### Step 1: Create CSS file

Create `themes/yourtheme.css`:

```css
/* YourTheme - Light */
[data-theme="yourtheme"] {
    --background: oklch(1 0 0);
    --foreground: oklch(0.145 0 0);
    --primary: oklch(0.6 0.2 250);
    --primary-foreground: oklch(1 0 0);
    /* ... copy other vars from claude.css as template */
}

/* YourTheme - Dark */
[data-theme="yourtheme"].dark {
    --background: oklch(0.145 0 0);
    --foreground: oklch(0.985 0 0);
    /* ... dark mode overrides */
}
```

Then import in `themes/index.css`:

```css
@import "./yourtheme.css";
```

### Step 2: Register in theme registry

Edit `themes/index.ts`:

```typescript
export const THEME_VARIANTS = {
  default: { label: "Default" },
  claude: { label: "Claude" },
  myfoodlink: { label: "MyFoodLink" },
  yourtheme: { label: "Your Theme" },  // Add this line
} as const
```

**Done.** Type safety and UI auto-update from the registry.

## Architecture

```
themes/
├── index.ts          # Theme registry (single source of truth)
├── index.css         # CSS imports
├── claude.css        # Claude theme (light + dark)
├── myfoodlink.css    # MyFoodLink theme (light + dark)
└── README.md         # This file
```

## How It Works

1. **Registry** (`index.ts`) defines available themes with labels
2. **Type** `ThemeVariant` is derived from registry keys
3. **UI** auto-generates variant picker from registry
4. **CSS** uses `[data-theme="name"]` attribute selector
5. **Rune** applies `data-theme` attribute to `<html>`

## CSS Variable Reference

Copy these from an existing theme (e.g., `claude.css`):

| Variable | Purpose |
|----------|---------|
| `--background` | Page background |
| `--foreground` | Default text |
| `--primary` | Primary buttons, links |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary elements |
| `--muted` | Muted backgrounds |
| `--accent` | Accent highlights |
| `--destructive` | Error/delete states |
| `--border` | Borders |
| `--input` | Form inputs |
| `--ring` | Focus rings |
| `--chart-1` to `--chart-5` | Chart colors |
| `--sidebar-*` | Sidebar variants |

## OKLCH Color Format

We use OKLCH for perceptual uniformity:

```
oklch(L C H)
- L: Lightness (0-1)
- C: Chroma (0-0.4, higher = more saturated)
- H: Hue (0-360 degrees)
```

Example: `oklch(0.6 0.15 250)` = medium blue
