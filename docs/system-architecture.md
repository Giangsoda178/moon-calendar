# System Architecture

## Architecture Overview

This application follows a **monolithic hybrid architecture** that combines:
- Traditional server-side MVC pattern (Rails)
- Modern SPA client-side rendering (Svelte)
- Hybrid approach via Inertia.js (no separate API layer)

### Architecture Type
**Monolithic with Frontend Integration**
- Single codebase containing both backend and frontend
- Shared deployment unit
- No separate API server needed
- Database-backed infrastructure (Solid* suite)

### High-Level Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Svelte 5 Application                       │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │  │
│  │  │   Pages    │  │ Components │  │   Runes    │    │  │
│  │  └────────────┘  └────────────┘  └────────────┘    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/XHR (Inertia.js Protocol)
┌─────────────────────▼───────────────────────────────────────┐
│                   Web Server (Puma)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Rails 8.1 Application                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Controllers  │  │    Models    │  │     Jobs     │     │
│  │  (Inertia)   │  │ ActiveRecord │  │ Solid Queue  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                    SQLite3 Database                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ App Tables   │  │ Solid Queue  │  │ Solid Cache  │     │
│  │              │  │   Tables     │  │   Tables     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  Build Pipeline (Vite 7)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Svelte     │  │  TypeScript  │  │  Tailwind    │      │
│  │  Compiler    │  │   Compiler   │  │     CSS      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Layer

#### Core Technologies
- **Framework:** Svelte 5.37+
  - Reactive UI framework
  - Compiled components (no virtual DOM)
  - Runes-based reactivity system
  - Scoped styles by default

- **Language:** TypeScript 5.8+
  - Static type checking
  - Enhanced IDE support
  - Compile-time error detection

- **Styling:** TailwindCSS 4.1+
  - Utility-first CSS framework
  - JIT compilation
  - Dark mode support with CSS variables
  - Responsive design utilities
  - Comprehensive component library (1371 lines): alerts, badges, buttons, cards, checkboxes, dialogs, forms, sidebar, tables, tabs, tooltips, toasts

- **Build Tool:** Vite 7.0+
  - Fast HMR (Hot Module Replacement)
  - ES modules-based
  - Optimized production builds
  - Plugin ecosystem

#### Supporting Libraries & Runes
- **Inertia.js 2.0+:** Frontend adapter for Rails integration
- **@lucide/svelte:** Icon library
- **mode-watcher:** Theme management
- **clsx + tailwind-merge:** CSS class utilities
- **Custom Runes (5):**
  - `use-appearance.svelte.ts`: Theme management (light/dark/system)
  - `use-flash.svelte.ts`: Flash notification handling
  - `is-mobile.svelte.ts`: Responsive detection
  - `use-initials.ts`: Name initials utility
  - `toast.svelte.ts`: Toast notification system (auto-dismiss, swipe, promise)

### Backend Layer

#### Core Framework
- **Rails 8.1.1**
  - MVC web framework
  - ActiveRecord ORM
  - Action Cable for WebSockets
  - Active Job for background processing
  - Active Storage for file uploads
  - Active Mailer for email

#### Key Components
- **Inertia Rails 3.10+:** Server adapter for Inertia.js
- **Vite Rails 3.0+:** Asset pipeline integration
- **JS Routes:** JavaScript route generation
- **Propshaft:** Asset delivery
- **Puma:** Multi-threaded web server

#### Database & Infrastructure
- **Database:** SQLite3 2.1+ (development)
  - Simple setup for development
  - File-based storage
  - PostgreSQL recommended for production
  - Main schema: Version 0 (empty, awaiting user models)
  - Solid Queue schema: 11 tables for job processing
  - Solid Cache schema: 1 table for caching
  - Solid Cable schema: 1 table for WebSockets

- **Background Jobs:** Solid Queue
  - Database-backed job queue
  - No Redis dependency
  - Scheduled jobs support
  - Retry logic

- **Caching:** Solid Cache
  - Database-backed cache store
  - No Redis dependency
  - Configurable expiration
  - Fragment caching

- **WebSockets:** Solid Cable
  - Database-backed Action Cable adapter
  - No Redis dependency
  - Real-time communication support

- **Request Context:** Current.rb (ActiveSupport::CurrentAttributes)
  - Stores session, user_agent, ip_address
  - Available throughout request lifecycle
  - Used by application_controller for request tracking

### Development Tools

#### Testing
- **RSpec:** Ruby testing framework
- **FactoryBot:** Test data factories
- **Capybara:** System/integration tests
- **Selenium WebDriver:** Browser automation

#### Code Quality
- **ESLint 9:** JavaScript/TypeScript linting
- **Prettier:** Code formatting
- **RuboCop:** Ruby linting (Rails Omakase)
- **Svelte Check:** Svelte type checking
- **Brakeman:** Security static analysis
- **Bundler Audit:** Dependency vulnerability scanning

#### Development Environment
- **run-pty:** Process management
- **Docker:** Containerization
- **Kamal 2.0:** Deployment orchestration

## Data Flow

### Request/Response Cycle

#### Initial Page Load
```
1. Browser → GET /path → Rails Router
2. Rails Router → Controller Action
3. Controller → Render Inertia Response
4. Rails → HTML Page with:
   - Inertia JSON payload embedded
   - Vite-compiled JavaScript bundles
   - CSS bundles
5. Browser → Parse HTML
6. Browser → Execute Inertia.js
7. Inertia.js → Mount Svelte Component with props
8. Svelte → Render UI
```

#### Subsequent Navigation (SPA-style)
```
1. User → Click Inertia Link
2. Inertia.js → XHR Request to Rails
   Headers: X-Inertia, X-Inertia-Version
3. Rails → Process Request
4. Controller → Render Inertia Response (JSON)
5. Rails → JSON Response with:
   - Component name
   - Props data
   - Flash messages
6. Inertia.js → Receive JSON
7. Inertia.js → Swap Svelte Component
8. Svelte → Render New Component
9. Browser → Update URL without reload
```

### Data Flow Example

**Route:** `GET /users`

```ruby
# config/routes.rb
resources :users

# app/controllers/users_controller.rb
class UsersController < InertiaController
  def index
    users = User.all
    render inertia: {
      users: users.as_json(only: [:id, :name, :email]) # Renders app/frontend/pages/users/index.svelte with {users} props
    }
  end
end
```

```svelte
<!-- app/frontend/pages/users/index.svelte -->
<script lang="ts">
  interface Props {
    users: Array<{ id: number; name: string; email: string }>
  }
  let { users }: Props = $props()
</script>

<div>
  <h1>Users</h1>
  <ul>
    {#each users as user}
      <li>{user.name} - {user.email}</li>
    {/each}
  </ul>
</div>
```

**Flow:**
1. Browser requests `/users`
2. Rails routes to `UsersController#index`
3. Controller queries database: `User.all`
4. Controller renders Inertia response with user data
5. Inertia.js receives component name `users/index` and props
6. Svelte component `pages/users/index.svelte` is mounted
7. Component receives `users` array as prop
8. Svelte renders user list

## Component Interactions

### Frontend Component Hierarchy

```
Application Root (inertia.ts)
    ├── Inertia App Component (runtime)
    │   └── Persistent Layout (persistent-layout.svelte)
    │       ├── Header (optional)
    │       ├── Page Component (dynamic based on route)
    │       │   ├── Child Components
    │       │   └── Shared Components
    │       └── Footer (optional)
    └── Global Services
        ├── Theme Manager (use-appearance)
        ├── Flash Messages (use-flash)
        └── Mobile Detection (is-mobile)
```

### Backend Component Architecture

```
HTTP Request
    ├── Routes (config/routes.rb)
    │   └── Controller
    │       ├── Before Actions (authentication, authorization)
    │       ├── Action Method
    │       │   ├── Model Layer (ActiveRecord)
    │       │   │   └── Database
    │       │   ├── Service Objects (optional)
    │       │   └── Background Jobs (optional)
    │       └── Inertia Response
    └── Inertia Middleware
        └── JSON Response to Frontend
```

### State Management Flow

```
Browser Component State ($state)
    ↕ (User Interaction)
Form Submission / Link Click
    ↓ (XHR via Inertia.js)
Rails Controller
    ↓ (Database Operation)
ActiveRecord Model
    ↓ (SQL)
Database
    ↑ (Query Results)
Rails Controller
    ↑ (JSON Props)
Inertia Response
    ↑ (Component Props)
Svelte Component Update
    ↑ (Reactive Rendering)
UI Updates
```

## External Integrations

### Currently Configured

#### Development Tools
- **GitHub:** Version control and CI/CD
- **GitHub Actions:** CI pipeline
  - Lint checks (JS/Ruby)
  - Security scans
  - Test execution
  - Deployment automation

- **Dependabot:** Automated dependency updates
  - Weekly checks for Bundler
  - Weekly checks for GitHub Actions

#### Asset Delivery
- **Vite Dev Server:** Development asset serving (port 5173)
- **Propshaft:** Production asset delivery
- **CDN Ready:** Assets can be served from CDN in production

### Potential Integrations (Not Configured)

#### Monitoring & Logging
- Application Performance Monitoring (APM)
- Error tracking (e.g., Sentry, Rollbar)
- Log aggregation (e.g., Papertrail, Logentries)

#### Email Delivery
- SMTP provider (e.g., SendGrid, Mailgun)
- Transactional email service

#### File Storage
- Cloud storage (S3, GCS, Azure)
- CDN for asset delivery

#### Authentication
- OAuth providers (Google, GitHub, etc.)
- SSO integration

## Deployment Architecture

### Development Environment

```
Developer Machine
├── Ruby 3.3+ (via rbenv/rvm)
├── Node.js 20+ (via nvm/nodenv)
├── SQLite3
├── pnpm package manager
└── Docker (optional, for testing)

Running Services (via bin/dev):
├── Rails Server (port 3000, proxied to 8888)
├── Vite Dev Server (port 8836 - HMR for CSS/JS updates)
├── Vite Test Server (port 8837 - test runs)
└── Background Job Processor (Solid Queue)

Access: http://localhost:8888 (proxied by run-pty)
```

### Production Environment (Kamal + Docker)

```
Production Server (Docker Host)
├── Docker Engine
├── Kamal (deployed containers)
│   ├── Web Container (Rails + Compiled Assets)
│   │   ├── Puma Web Server
│   │   ├── Compiled Vite Assets
│   │   └── Application Code
│   ├── Job Container (Background Workers)
│   │   └── Solid Queue Workers
│   └── SSR Container (Optional)
│       └── Node.js SSR Server
└── Database
    ├── PostgreSQL (recommended)
    └── Shared Volume for SQLite (dev only)

Load Balancer / Reverse Proxy
├── SSL Termination
├── HTTP/2 Support
└── Static Asset Caching

External Services (optional):
├── CDN for Assets
├── Email Service
└── Monitoring/Logging
```

### Deployment Flow

```
1. Code Push to GitHub
2. GitHub Actions CI Runs
   ├── Lint Checks
   ├── Security Scans
   └── Test Suite
3. On Success (main branch)
4. GitHub Actions Deployment
5. Kamal Build
   ├── Docker Image Build
   ├── Asset Precompilation (Vite)
   └── Push to Registry
6. Kamal Deploy
   ├── Pull Image on Server
   ├── Health Check Old Container
   ├── Start New Container
   ├── Health Check New Container
   ├── Switch Traffic
   └── Stop Old Container (zero-downtime)
```

## Security Architecture

### Transport Security
- **HTTPS Enforced:** In production (configured in Rails)
- **HSTS Headers:** Strict-Transport-Security
- **Secure Cookies:** HTTPOnly, Secure, SameSite

### Application Security

#### Frontend
- **XSS Protection:** Svelte auto-escapes output
- **CSRF Protection:** Rails CSRF tokens in forms
- **Content Security Policy:** Configured in initializers
- **Input Validation:** Client-side + server-side

#### Backend
- **SQL Injection Protection:** ActiveRecord parameterized queries
- **Mass Assignment Protection:** Strong parameters
- **Authentication:** bcrypt password hashing
- **Session Management:** Encrypted session cookies
- **Rate Limiting:** Can be added via Rack::Attack (not configured)

### Secret Management
- **Rails Credentials:** Encrypted credentials file
- **Environment Variables:** For deployment secrets
- **Master Key:** Required for decryption (not in repository)
- **Kamal Secrets:** Injected at deployment time

### Security Scanning
- **Brakeman:** Static analysis for Rails security issues
- **Bundler Audit:** Dependency vulnerability scanning
- **Dependabot:** Automated security updates
- **CI Enforcement:** All scans must pass before merge

## Performance Architecture

### Frontend Performance

#### Build Optimization
- **Code Splitting:** Automatic by Vite
- **Tree Shaking:** Removes unused code
- **Minification:** Production builds minified
- **CSS Purging:** TailwindCSS removes unused styles
- **Asset Hashing:** Cache busting via content hashing

#### Runtime Performance
- **Component Compilation:** Svelte compiles to vanilla JS
- **No Virtual DOM:** Direct DOM manipulation
- **Lazy Loading:** Dynamic imports for routes
- **Prefetching:** Inertia.js prefetch on hover

### Backend Performance

#### Caching Strategy
- **Fragment Caching:** Rails view fragment caching
- **HTTP Caching:** ETag, Last-Modified headers
- **Solid Cache:** Database-backed cache store
- **Query Caching:** ActiveRecord automatic query cache

#### Database Optimization
- **Indexes:** Add indexes for frequently queried columns
- **Eager Loading:** Use `includes` to avoid N+1 queries
- **Connection Pooling:** Configured in database.yml
- **Database Migrations:** Schema optimization

#### Background Processing
- **Solid Queue:** Async job processing
- **Job Priorities:** Configure job queue priorities
- **Scheduled Jobs:** Cron-like scheduling
- **Retry Logic:** Failed job retry mechanism

### Scaling Considerations

#### Horizontal Scaling
- **Stateless App:** Sessions in cookies, cache in database
- **Load Balancer Ready:** Multiple app containers supported
- **Database:** Switch from SQLite to PostgreSQL for production
- **Shared Storage:** Use cloud storage for Active Storage

#### Vertical Scaling
- **Puma Threads:** Increase worker threads
- **Database Connections:** Tune connection pool
- **Memory:** Monitor and optimize memory usage

## Monitoring & Observability

### Currently Available
- **Rails Logs:** Standard Rails logging
- **Vite Build Logs:** Asset compilation logs
- **Health Check Endpoint:** `/up` for monitoring
- **Git Revision:** Available in Docker images

### Recommended Additions
- **APM:** Application Performance Monitoring
- **Error Tracking:** Exception notification service
- **Metrics:** Request rates, response times, error rates
- **Uptime Monitoring:** External health checks
- **Log Aggregation:** Centralized log management

## Technology Choices & Rationale

### Why Inertia.js?
- **Simplicity:** No separate API layer needed
- **Productivity:** Leverage Rails routing and controllers
- **Full-Stack Types:** Share types between backend and frontend
- **SEO Ready:** SSR support available
- **Progressive Enhancement:** Works without JavaScript

### Why Svelte 5?
- **Performance:** Compiled to vanilla JS, no runtime overhead
- **Developer Experience:** Less boilerplate than React/Vue
- **Reactivity:** Simpler reactive model with runes
- **Bundle Size:** Smaller bundles than React/Vue
- **Modern:** Cutting-edge features (runes, transitions)

### Why Vite?
- **Speed:** Lightning-fast HMR
- **Modern:** ES modules, no bundling in dev
- **Plugin Ecosystem:** Rich plugin support
- **Build Performance:** Faster than Webpack
- **Rails Integration:** vite-rails plugin available

### Why Solid* Suite?
- **Simplicity:** No Redis/Memcached dependency
- **Development:** Easier local setup
- **Cost:** Reduce infrastructure costs
- **Scaling:** Can switch to Redis when needed
- **Rails 8:** Official Rails 8 defaults

### Trade-offs

#### Pros
- ✅ Single deployment unit
- ✅ Shared routing and validation logic
- ✅ Faster development (no API contracts)
- ✅ Better DX with Vite HMR
- ✅ Simpler architecture

#### Cons
- ❌ Couples frontend to Rails
- ❌ Not suitable for mobile apps (without API)
- ❌ Smaller community than React/Next.js
- ❌ SQLite not production-ready at scale
- ❌ Solid* suite less battle-tested than Redis
