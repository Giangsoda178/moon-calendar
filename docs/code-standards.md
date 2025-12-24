# Code Standards & Structure

## Codebase Structure

### Directory Organization

```
moon-calendar/
├── app/
│   ├── controllers/          # Rails controllers (Inertia responses)
│   ├── frontend/            # Svelte frontend code
│   │   ├── components/      # Reusable UI components
│   │   ├── entrypoints/     # Vite entry points (inertia.ts, CSS)
│   │   ├── layouts/         # Page layouts
│   │   ├── pages/           # Inertia page components
│   │   ├── routes/          # Auto-generated Rails routes for JS
│   │   ├── runes/           # Svelte runes (composables)
│   │   ├── ssr/             # Server-side rendering setup
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils.ts         # Utility functions
│   ├── helpers/             # Rails view helpers
│   ├── jobs/                # Background jobs (Solid Queue)
│   ├── mailers/             # Action Mailer classes
│   ├── models/              # ActiveRecord models
│   └── views/               # ERB templates (layouts, mailers)
├── bin/                     # Executable scripts
├── config/                  # Application configuration
│   ├── environments/        # Environment-specific configs
│   ├── initializers/        # Rails initializers
│   └── locales/            # I18n translations
├── db/                      # Database files
│   ├── migrate/            # Database migrations
│   └── schema.rb           # Database schema
├── docs/                    # Project documentation
├── lib/                     # Library code
│   └── tasks/              # Rake tasks
├── log/                     # Application logs
├── public/                  # Static files
├── spec/                    # RSpec tests
│   ├── factories/          # FactoryBot factories
│   ├── requests/           # Request specs
│   └── support/            # Test support files
├── storage/                 # Active Storage files
├── tmp/                     # Temporary files
└── vendor/                  # Third-party code
```

### Frontend Structure (app/frontend/)

#### Components (`components/`)
- **Purpose:** Reusable UI components
- **Naming:** PascalCase (e.g., `Button.svelte`, `UserCard.svelte`)
- **Organization:** Can be nested by feature/domain
- **API Standards:** All components use `$props()` rune with TypeScript Props interfaces

#### Entrypoints (`entrypoints/`)
- **inertia.ts:** Main Inertia.js setup and initialization
- **application.css:** Global styles and TailwindCSS framework (1371 lines)
  - Includes complete component library: alerts, badges, buttons, cards, checkboxes, dialogs, forms, sidebar, tables, tabs, tooltips, toasts
  - Dark mode support with CSS variables
  - Responsive design utilities
  - Custom component variants and extensions
- **mobile.css:** Mobile-specific utilities (129 lines)
  - Safe area insets for notched devices (iPhone, etc.)
  - Settings component styles: `.settings-section`, `.settings-item`, `.settings-item-button`
  - Data attribute selectors for slots: `[data-icon]`, `[data-content]`, `[data-action]`
  - Touch action utilities for interactive elements
  - DeviceFrame preview overrides
- **Purpose:** Vite entry points loaded by Rails

#### Layouts (`layouts/`)
- **persistent-layout.svelte:** Default layout wrapper for all pages
- **Purpose:** Common page structure (header, footer, navigation)
- **Convention:** Layouts wrap page content

#### Pages (`pages/`)
- **Organization:** Mirrors Rails controller structure
- **Naming:** lowercase with index (e.g., `kitchen_sink/index.svelte`)
- **Purpose:** Top-level Inertia page components
- **Props:** Receive data from Rails controllers
- **Current Pages:**
  - `kitchen_sink/index.svelte`: Component showcase and demo page
  - `kitchen_sink/sections/ThemeSwitcher.svelte`: Theme switching component
  - `kitchen_sink/shared/Section.svelte`: Reusable section wrapper component

#### Routes (`routes/`)
- **index.js:** Auto-generated Rails routes for JavaScript
- **index.d.ts:** TypeScript definitions for routes
- **Generation:** Run `rake js:routes` to regenerate
- **Usage:** Import from `@/routes` in frontend code

#### Runes (`runes/`)
- **Purpose:** Svelte 5 runes (reactive utilities/composables)
- **Available Runes (4 files):**
  - `use-appearance.svelte.ts`: Theme management (light/dark/system modes)
  - `use-flash.svelte.ts`: Flash message/notification handling
  - `is-mobile.svelte.ts`: Responsive design detection
  - `use-initials.ts`: Utility function for generating name initials
- **Naming:** kebab-case with `.svelte.ts` extension
- **Usage:** Export reactive utilities for component reuse across pages

#### Types (`types/`)
- **globals.d.ts:** Inertia PageProps augmentation
- **index.d.ts:** Exported type definitions (Auth, User, Session, Flash, AppPageProps, NavItem interfaces)
- **vite-env.d.ts:** Vite client environment types
- **Purpose:** TypeScript type safety and frontend-backend type alignment

### Backend Structure (app/)

#### Controllers (`controllers/`)
- **Purpose:** Handle HTTP requests, render Inertia responses
- **Base:** Inherit from `InertiaController` (which extends `ApplicationController`)
- **Convention:** RESTful actions when possible
- **Current Controllers:**
  - `application_controller.rb`: Base with authentication hooks, request tracking
  - `inertia_controller.rb`: Inertia-specific base with auth/flash sharing
  - `home_controller.rb`: Redirects root to kitchen_sink_path
  - `kitchen_sink_controller.rb`: Demo page controller
- **Example:**
  ```ruby
  class KitchenSinkController < InertiaController
    def index
      render inertia: {}  # Renders app/frontend/pages/kitchen_sink/index.svelte
    end
  end
  ```

#### Models (`models/`)
- **Base:** Inherit from `ApplicationRecord`
- **Location:** `app/models/`
- **Concerns:** Shared behavior in `app/models/concerns/`
- **Current Models (2 files):**
  - `application_record.rb`: Base ActiveRecord model
  - `current.rb`: ActiveSupport::CurrentAttributes for request-scoped data
    - Stores: session, user_agent, ip_address
    - Accessible throughout request lifecycle via `Current` class

#### Jobs (`jobs/`)
- **Base:** Inherit from `ApplicationJob`
- **Queue:** Solid Queue (database-backed)
- **Purpose:** Background processing

#### Mailers (`mailers/`)
- **Base:** Inherit from `ApplicationMailer`
- **Templates:** Located in `app/views/`
- **Purpose:** Email sending

## Naming Conventions

### Frontend (Svelte/TypeScript)

#### Files
- **Components:** PascalCase (e.g., `Button.svelte`)
- **Pages:** lowercase folders, `index.svelte` (e.g., `home/index.svelte`)
- **Utilities:** kebab-case (e.g., `use-appearance.svelte.ts`)
- **Types:** PascalCase for interfaces/types

#### Code
- **Variables:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **Functions:** camelCase
- **Classes:** PascalCase
- **Components:** PascalCase
- **Props:** camelCase

#### CSS Classes
- **Convention:** TailwindCSS utility classes
- **Custom classes:** kebab-case
- **BEM not required** (utility-first approach)

### Backend (Ruby/Rails)

#### Files
- **Controllers:** snake_case ending in `_controller.rb`
- **Models:** singular snake_case (e.g., `user.rb`)
- **Jobs:** snake_case ending in `_job.rb`
- **Mailers:** snake_case ending in `_mailer.rb`

#### Code
- **Classes:** PascalCase
- **Modules:** PascalCase
- **Methods:** snake_case
- **Constants:** UPPER_SNAKE_CASE
- **Variables:** snake_case
- **Instance variables:** @snake_case

#### Database
- **Tables:** plural snake_case (e.g., `users`)
- **Columns:** snake_case
- **Foreign keys:** `table_id` (e.g., `user_id`)
- **Indexes:** descriptive names

## Code Organization Patterns

### Svelte Components

#### Component Structure
```svelte
<script lang="ts">
  // 1. Imports
  import { page } from '@inertiajs/svelte'
  import Button from '@/components/Button.svelte'

  // 2. Props (with types)
  interface Props {
    title: string
    count?: number
  }
  let { title, count = 0 }: Props = $props()

  // 3. State (using runes)
  let isOpen = $state(false)

  // 4. Derived values
  let doubled = $derived(count * 2)

  // 5. Effects
  $effect(() => {
    console.log('Count changed:', count)
  })

  // 6. Functions
  function handleClick() {
    isOpen = !isOpen
  }
</script>

<!-- 7. Template -->
<div>
  <h1>{title}</h1>
  <p>Count: {count}</p>
  <Button onclick={handleClick}>Toggle</Button>
</div>

<!-- 8. Styles (scoped) -->
<style>
  div {
    /* Component-specific styles */
  }
</style>
```

#### Runes Usage (Svelte 5)
- **$state:** Reactive state
- **$derived:** Computed values
- **$effect:** Side effects
- **$props:** Component props
- **$bindable:** Two-way binding

### Rails Controllers

#### Inertia Response Pattern
```ruby
class UsersController < InertiaController
  def index
    users = User.all
    render inertia: {
      users: users.as_json(only: [:id, :name, :email])
    }
  end

  def show
    user = User.find(params[:id])
    render inertia: {
      user: user.as_json
    }
  end
end
```

### File Organization

#### Feature-Based Organization
For larger features, organize by domain:
```
app/frontend/
  components/
    auth/
      LoginForm.svelte
      RegisterForm.svelte
    users/
      UserCard.svelte
      UserList.svelte
```

#### Shared Utilities
```
app/frontend/
  utils.ts          # Generic utilities
  runes/
    use-*.svelte.ts # Reusable reactive logic
```

## Testing Approach

### Backend Testing (RSpec)

#### Test Structure
```
spec/
  requests/         # Request specs (integration)
  models/          # Model specs (unit)
  mailers/         # Mailer specs
  jobs/            # Job specs
  factories/       # FactoryBot factories
  support/         # Test helpers
```

#### Request Spec Example
```ruby
require 'rails_helper'

RSpec.describe 'Home', type: :request do
  describe 'GET /' do
    it 'returns success' do
      get root_path
      expect(response).to have_http_status(:success)
    end
  end
end
```

#### Factories
```ruby
FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    password { 'password123' }
  end
end
```

### Frontend Testing
- **Current:** No frontend tests configured
- **Recommended:** Vitest for unit tests, Playwright for E2E
- **System tests:** Use Capybara for full-stack testing

### Test Commands
```bash
# Backend tests
bin/rspec                    # Run all specs
bin/rspec spec/requests      # Run request specs only

# CI test command
bin/rails db:test:prepare spec
```

## Linting & Formatting

### JavaScript/TypeScript (ESLint)

#### Configuration (`eslint.config.js`)
- **Parser:** TypeScript ESLint
- **Plugins:** Svelte, Import
- **Extends:** ESLint recommended, Prettier

#### Commands
```bash
pnpm lint:js      # Check for errors
pnpm fix:js       # Auto-fix errors
```

#### Rules
- TypeScript strict mode enabled
- Svelte-specific rules applied
- Import order enforcement
- No unused variables/imports

### Formatting (Prettier)

#### Configuration (`.prettierrc`)
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "plugins": [
    "prettier-plugin-svelte",
    "prettier-plugin-tailwindcss"
  ]
}
```

#### Commands
```bash
pnpm format       # Check formatting
pnpm format:fix   # Auto-format files
```

### Ruby (RuboCop)

#### Configuration (`.rubocop.yml`)
- **Standard:** Rails Omakase
- **Target Ruby:** 3.3+
- **Auto-correct:** Enabled where safe

#### Commands
```bash
bin/rubocop                  # Check all files
bin/rubocop -a               # Auto-correct
bin/rubocop app/controllers  # Check specific directory
```

#### Key Rules
- 2 spaces indentation
- 120 character line limit
- Frozen string literals required
- Prefer double quotes for strings

### Type Checking (TypeScript)

#### Configuration (`tsconfig.json`)
```json
{
  "extends": "@tsconfig/svelte/tsconfig.json",
  "compilerOptions": {
    "strict": true,
    "moduleResolution": "bundler",
    "paths": {
      "@/*": ["./app/frontend/*"]
    }
  }
}
```

#### Commands
```bash
pnpm check        # Run svelte-check and tsc
```

## CSS Utilities

### Mobile Safe Area Classes (`mobile.css`)

#### Safe Area Padding
```html
<div class="pt-safe">           <!-- Top safe area -->
<div class="pb-safe">           <!-- Bottom safe area (reduced by 16px) -->
<div class="px-safe">           <!-- Left & right safe areas -->
<div class="py-safe">           <!-- Top & bottom safe areas -->
<div class="p-safe">            <!-- All safe areas -->
```

#### Safe Area Margins & Positioning
```html
<div class="mt-safe mb-safe ml-safe mr-safe">    <!-- Individual margins -->
<div class="top-safe bottom-safe left-safe right-safe">  <!-- Positioning -->
<div class="min-h-screen-safe h-screen-safe">   <!-- Safe area-aware heights -->
```

### Settings Component Styles (`mobile.css`)

#### Section Container
```html
<div class="settings-section">
  <h3>Section Title</h3>
  <!-- Settings items -->
</div>
```
- Groups related settings with consistent spacing
- Section titles: muted, uppercase, small text

#### Settings Item (Read-Only)
```html
<div class="settings-item">
  <div data-icon><!-- Icon SVG --></div>
  <div data-content>
    <p>Label</p>
    <p>Optional description</p>
  </div>
  <div data-action><!-- Right-side icon --></div>
</div>
```

#### Settings Item Button (Interactive)
```html
<button class="settings-item-button">
  <div data-icon><!-- Icon SVG --></div>
  <div data-content>
    <p>Label</p>
    <p>Optional description</p>
  </div>
  <div data-action><!-- Right-side icon --></div>
</button>
```
- Inherits all `.settings-item` styling
- Adds hover effects and cursor pointer
- Responds to interactions with background color transition

#### Data Attributes
- `[data-icon]`: Icon slot (9x9 flex container with rounded corners)
- `[data-content]`: Label and description container (grows to fill available space)
- `[data-action]`: Right-side action/indicator (shrinks to fit content)

## Import Aliases

### Frontend Path Aliases
```typescript
// Configured in vite.config.ts and tsconfig.json
import Button from '@/components/Button.svelte'
import { useFlash } from '@/runes/use-flash.svelte'
import { cn } from '@/utils'
import routes from '@/routes'
```

### Available Aliases
- `@/*` → `app/frontend/*`

## Code Quality Standards

### Commit Standards
- **Format:** Conventional Commits recommended
- **Example:** `feat: add user authentication`
- **Types:** feat, fix, docs, style, refactor, test, chore

### Pull Request Process
1. All linters must pass
2. All tests must pass
3. Code review required
4. CI checks must succeed

### CI Pipeline (GitHub Actions)

#### Jobs
1. **lint_js:** ESLint, Prettier, TypeScript checks
2. **scan_ruby:** Brakeman, Bundler Audit
3. **lint:** RuboCop
4. **test:** RSpec with system tests

#### Running Locally
```bash
bin/ci            # Run CI checks locally
```

## Performance Guidelines

### Frontend
- **Code splitting:** Leverage Vite's automatic code splitting
- **Lazy loading:** Use dynamic imports for large components
- **Asset optimization:** Vite handles minification and tree-shaking
- **CSS:** Tailwind's purge removes unused styles

### Backend
- **Database:** Use indexes on frequently queried columns
- **N+1 queries:** Use eager loading (`includes`, `preload`)
- **Caching:** Leverage Solid Cache for expensive operations
- **Background jobs:** Use Solid Queue for long-running tasks

## Security Best Practices

### Frontend
- **XSS Prevention:**
  - Svelte escapes by default - do not bypass with {@html} unless absolutely required
  - ESLint rule `svelte/no-at-html-tags` warns on @html usage
  - If raw HTML required: sanitize with `DOMPurify.sanitize()` first
- **CSRF:** Rails handles token validation
- **Sensitive data:** Never log passwords or tokens
- **Dependencies:** Keep packages updated via Dependabot

### Backend
- **SQL Injection:** Use parameterized queries (ActiveRecord handles this)
- **Mass assignment:** Use strong parameters
- **Authentication:** Use has_secure_password
- **Headers:** CSP configured in initializers
- **Secrets:** Use Rails credentials, never commit secrets

### Security Scanning
```bash
bin/brakeman         # Static analysis
bin/bundler-audit    # Dependency vulnerabilities
```

## Documentation Standards

### Code Comments
- **Why over What:** Explain reasoning, not obvious behavior
- **Complex logic:** Add comments for non-trivial algorithms
- **TODO:** Include issue reference when applicable

### API Documentation
- **Controllers:** Document expected props for Inertia responses
- **Models:** Document associations and validations
- **Utilities:** JSDoc comments for public functions

### README Updates
- Keep installation instructions current
- Document environment variables
- Update feature list as features are added
