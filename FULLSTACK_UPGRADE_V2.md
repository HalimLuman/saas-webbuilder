# BuildStack v2 — Full-Stack Web Application Builder

## Vision

Upgrade BuildStack from a UI-only visual builder to a **full-stack web application builder**. Users should be able to create complete, production-ready web applications with real backend logic: form submissions that write to a database, e-commerce flows that create orders, authenticated dashboards that query live data, and custom API endpoints — all configured visually inside the editor.

---

## Current State (v1 Gaps)

| Area | Current State | Gap |
|------|--------------|-----|
| Form submission | Canvas `form` element is UI-only; submissions go to a generic `/api/v1/forms/[formId]` | No visual binding to custom tables, no server actions, no triggered side effects (email, webhook) |
| Database queries | Schema designer generates SQL DDL for copy-paste only | No runtime data binding on any element; no query execution in published sites |
| Interactions | `callWebhook` action exists but no UI to bind it to a named backend action | Raw webhook URL only — no parameterized calls, no response handling |
| E-commerce | `add-to-cart`, `cart`, `product-card` renderers exist | No order creation, no inventory write-back, no payment flow triggered from canvas |
| API routes | Pre-built platform routes only | Users cannot define custom API route logic in the editor |
| Export | `export-nextjs.ts` emits UI-only code | Exported Next.js project has no API routes, form handlers, or data fetching |
| Auth gate | `auth-gate` element type exists | Renderer is minimal; no role-based access logic, no profile data binding |

---

## Core Architecture Changes

### 1. Backend Action System

Replace the current loose `callWebhook` interaction with a typed **Backend Action** model. Every canvas element can bind its events to named backend actions. Actions are defined once per site and reused across elements.

#### Action Types

```typescript
type BackendActionType =
  | "db.insert"       // Insert a row into a user-defined table
  | "db.update"       // Update rows matching a filter
  | "db.delete"       // Delete rows matching a filter
  | "db.query"        // Fetch rows (data binding, not a trigger)
  | "auth.signup"     // Create a new end-user account
  | "auth.login"      // Authenticate an end-user
  | "auth.logout"     // Sign out the current user
  | "email.send"      // Send a transactional email (via Resend)
  | "webhook.call"    // POST to an external URL
  | "cart.addItem"    // Add product to cart
  | "cart.removeItem" // Remove product from cart
  | "order.create"    // Create an order record
  | "order.update"    // Update order status
  | "stripe.checkout" // Initiate a Stripe Checkout session
  | "custom.function" // Run a user-authored server function (edge function)
```

#### BackendAction Schema (stored as site-level JSON)

```typescript
interface BackendAction {
  id: string;
  name: string;                       // "Submit Contact Form"
  type: BackendActionType;
  config: ActionConfig;               // type-discriminated config
  onSuccess?: BackendActionStep[];    // chained actions on success
  onError?: BackendActionStep[];      // chained actions on error
  auth?: "public" | "authenticated" | "role:admin"; // access control
}

interface ActionConfig {
  // db.insert example:
  table: string;
  data: Record<string, FieldBinding>; // field name → form field binding or literal
  returning?: string[];

  // email.send example:
  to: FieldBinding;
  subject: string;
  templateId?: string;
  body?: string;
}

// A FieldBinding resolves at runtime to a value
type FieldBinding =
  | { source: "formField"; field: string }     // value from current form
  | { source: "auth.user"; field: string }     // current user's profile field
  | { source: "urlParam"; param: string }      // URL path/query param
  | { source: "literal"; value: unknown }      // hard-coded value
  | { source: "elementState"; elementId: string; key: string } // canvas element state
```

**Storage:** Each site stores its backend actions as JSON in `sites.backend_actions` (new JSONB column). The editor exposes a Backend Actions registry in the Backend panel.

---

### 2. Form-to-Backend Binding

#### Canvas `form` Element Changes

The `form` element gets a new `backendBinding` prop:

```typescript
interface FormBackendBinding {
  actionId: string;           // ID of a BackendAction
  fieldMappings: {
    formField: string;        // input element's `name` prop
    actionParam: string;      // target param in the BackendAction config
  }[];
  redirectOnSuccess?: string; // page slug to navigate to after success
  toastOnSuccess?: string;    // toast message on success
  toastOnError?: string;      // toast message on error
}
```

#### Properties Panel — Form Tab

Add a **"Submission" tab** to the form element's properties panel:

- **Action dropdown:** Select from site's registered Backend Actions, or create a new one inline.
- **Field mapping UI:** Auto-detect all child `input`/`select`/`textarea` elements by their `name` prop; map each to an action parameter.
- **On Success / On Error:** Choose from "Show toast", "Navigate to page", "Run another action", "Stay on page".
- **Access control toggle:** Public / Requires login.

#### Runtime Execution

When the user submits a form in a published site:

1. The form element renderer intercepts `onSubmit`.
2. Resolves all `FieldBinding` values (form data, auth user, URL params).
3. POSTs to `/api/v1/sites/[siteId]/actions/[actionId]` with the resolved payload.
4. The API route validates, executes the backend action (DB write, email, etc.), and returns `{ success, data, error }`.
5. The form renderer handles the response with the configured success/error behavior.

---

### 3. Data Binding System

Allow any element that displays content to pull data from a backend source.

#### DataSource Schema

```typescript
interface DataSource {
  id: string;
  name: string;
  type: "db.query" | "cms.collection" | "api.get" | "auth.profile";
  config: DataSourceConfig;
  refreshOn?: "pageLoad" | "interval" | "event";
  refreshInterval?: number; // seconds, for interval mode
}

interface DbQueryConfig {
  table: string;
  select: string[];          // columns to fetch
  where?: FilterGroup;
  orderBy?: { column: string; dir: "asc" | "desc" }[];
  limit?: number;
  offset?: number;           // or "page" for pagination
}
```

#### Element Data Binding

Any element's `props` can include a `dataBinding`:

```typescript
interface DataBinding {
  sourceId: string;            // DataSource ID
  path: string;                // dot-path into the result, e.g. "rows[0].email"
  fallback?: string;           // shown while loading or on error
}
```

**Supported binding targets:**
- `paragraph` / `heading` / `badge` — binds `content` to a query result field.
- `image` — binds `src` to a URL field.
- `data-table` — binds the entire row set to a `DbQueryConfig`.
- `cms-list` — binds to a CMS collection with optional per-item template.
- `product-card` — binds price, title, image from a `products` table row.
- `number-display` — binds to an aggregate (COUNT, SUM, AVG) result.

#### Data Binding Panel (Properties Panel Tab)

A new **"Data" tab** in the properties panel:

1. Select or create a DataSource.
2. Choose which prop to bind.
3. For list elements: configure the item template (which child element maps to which field).
4. Filter builder: visual `WHERE` clause builder with support for URL params and auth user as filter values.

---

### 4. Custom API Route Builder

Users can define custom API endpoints for their site inside the editor.

#### SiteRoute Schema

```typescript
interface SiteRoute {
  id: string;
  path: string;             // e.g. "/api/contact"
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  auth: "public" | "authenticated" | "api-key";
  steps: RouteStep[];       // ordered execution pipeline
}

type RouteStep =
  | { type: "db.query";    config: DbQueryConfig }
  | { type: "db.insert";   config: DbInsertConfig }
  | { type: "db.update";   config: DbUpdateConfig }
  | { type: "db.delete";   config: DbDeleteConfig }
  | { type: "email.send";  config: EmailConfig }
  | { type: "webhook.call"; config: WebhookConfig }
  | { type: "transform";   expression: string }  // lightweight JS expression
  | { type: "respond";     body: unknown; status: number }
```

#### API Routes Tab (Backend Panel)

A new **"Routes"** tab in the existing Backend panel:

- List of all defined site routes.
- Route builder: method, path, auth level.
- Step builder: drag-to-reorder pipeline of steps (similar to Zapier/n8n).
- Test panel: send a test request and see the full response inline.

#### Runtime Execution

Site routes are stored in `sites.site_routes` (new JSONB column). A single dynamic handler at `/api/v1/sites/[siteId]/run/[...path]` interprets the route definition and executes each step in sequence.

---

### 5. E-Commerce Backend Flows

#### New DB Tables (user-defined per site via schema designer)

The schema designer should ship with an **E-Commerce schema preset** that creates:

```sql
-- products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id),
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  stock_quantity INT,
  image_url TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id),
  user_id UUID,                         -- end-user (nullable for guest checkout)
  status TEXT DEFAULT 'pending',        -- pending / paid / fulfilled / cancelled
  total_amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  stripe_payment_intent_id TEXT,
  shipping_address JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- order_items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  metadata JSONB
);
```

#### `add-to-cart` Element Upgrade

The `add-to-cart` renderer gets a `backendBinding`:

```typescript
interface AddToCartBinding {
  productIdSource: FieldBinding;   // resolves the product ID
  quantitySource: FieldBinding;    // resolves quantity (default literal 1)
  cartStorageMode: "localStorage" | "server"; // where cart state lives
}
```

- In `localStorage` mode: cart state is stored locally and sent on checkout (current behavior).
- In `server` mode: clicking Add to Cart calls a `cart.addItem` backend action that writes to a `cart_items` table.

#### `order.create` Backend Action

When a user clicks "Place Order" or "Checkout":

1. Resolves cart items (from localStorage or `cart_items` table).
2. Calls a `stripe.checkout` action → creates a Stripe Checkout Session.
3. On Stripe success webhook: fires `order.create` to write the order + items to the DB.
4. Optionally fires `email.send` to send an order confirmation.

All of this is wired visually using the Backend Action builder, not custom code.

---

### 6. Upgrade to `Interaction` System

#### New Interaction Action Types

Extend `InteractionAction.type` to include all `BackendActionType` values:

```typescript
type InteractionActionType =
  // existing UI actions:
  | "navigate" | "openModal" | "toggleElement" | "scrollTo"
  | "showToast" | "copyClipboard" | "runJS" | "callWebhook"
  // new backend actions:
  | "db.insert" | "db.update" | "db.delete"
  | "auth.signup" | "auth.login" | "auth.logout"
  | "email.send"
  | "cart.addItem" | "cart.removeItem"
  | "order.create" | "stripe.checkout"
  | "runBackendAction" // references a named BackendAction by ID
```

When an interaction action type is a backend type, its config is the same as `ActionConfig`. When `runBackendAction` is used, it references a named action defined in the Backend Actions registry.

#### Interaction Properties Panel Enhancement

The Interactions tab in the properties panel should show:

- For backend action types: a dropdown of registered backend actions, with an inline "Create new action" shortcut.
- After-action handlers: "On Success" → pick from UI actions (toast, navigate, emit event to another element). "On Error" → show error toast with customizable message.
- Conditional actions: a `condition` field using a simple expression (e.g., `auth.user != null`) that gates execution.

---

### 7. Per-Site Dynamic Route Handler

A new Next.js catch-all route handles all custom site API calls from published sites:

```
src/app/api/v1/sites/[siteId]/actions/[actionId]/route.ts
src/app/api/v1/sites/[siteId]/run/[...path]/route.ts
src/app/api/v1/sites/[siteId]/data/[sourceId]/route.ts
```

**`/actions/[actionId]`** — Executes a registered BackendAction by ID.
**`/run/[...path]`** — Matches and executes a user-defined SiteRoute.
**`/data/[sourceId]`** — Executes a DataSource query and returns the result (used by data-bound elements in preview/published mode).

All three handlers:
1. Load the site record to get `backend_actions`, `site_routes`, and `data_sources` JSON.
2. Validate auth level of the requested action/route.
3. Resolve FieldBindings from the incoming request body + headers.
4. Execute steps against the site's Supabase project (or platform DB if using platform-managed tables).
5. Return a structured JSON response.

---

### 8. Export Upgrade (`export-nextjs.ts`)

The Next.js export should emit full-stack code:

| Exported File | Content |
|---------------|---------|
| `app/page.tsx` | UI with data fetching via `getServerSideProps`-equivalent RSC |
| `app/api/[...route]/route.ts` | User-defined custom API routes as Next.js Route Handlers |
| `lib/db.ts` | Supabase client initialization |
| `lib/actions.ts` | Server Actions for each form submission / backend action |
| `app/(site)/layout.tsx` | Auth session wrapper if site uses authentication |

**Form components in export:**

Instead of `<form>` with a `callWebhook` interaction, the export emits a React Server Action:

```typescript
// lib/actions.ts (generated)
"use server";
import { createClient } from "@/lib/db";

export async function submitContactForm(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("contact_submissions").insert({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}
```

And the exported form component imports and calls this server action directly.

---

## Database Schema Changes

### New Columns (migrations required)

```sql
-- Backend actions registry per site
ALTER TABLE public.sites
  ADD COLUMN backend_actions JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN site_routes JSONB DEFAULT '[]'::jsonb,
  ADD COLUMN data_sources JSONB DEFAULT '[]'::jsonb;

-- Per-site user-managed tables tracking
CREATE TABLE public.site_tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  table_name TEXT NOT NULL,
  schema JSONB NOT NULL,              -- column definitions
  rls_policy TEXT,                    -- auto-generated RLS SQL
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(site_id, table_name)
);

-- E-commerce tables (template, applied per-site via schema presets)
-- (products, orders, order_items — see section 5 above)

-- Cart state (server mode)
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES public.sites(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,           -- anonymous session token
  user_id UUID,                       -- set after login
  product_id UUID NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Editor UI Changes

### Backend Panel Tabs (expanded)

| Tab | Current | v2 |
|-----|---------|-----|
| Auth Config | ✅ Exists | Unchanged |
| Database | ✅ Exists (data browser) | Add: query builder, row insert/edit/delete |
| Schema | ✅ Exists (DDL generator) | Add: schema presets (e-commerce, blog, auth), one-click apply via API |
| **Actions** | ❌ Missing | New: BackendAction registry — create/edit/delete named actions |
| **Routes** | ❌ Missing | New: Custom API route builder with step pipeline |
| **Data Sources** | ❌ Missing | New: DataSource registry — named queries for data binding |

### Properties Panel New Tabs

| Element | New Tab | Content |
|---------|---------|---------|
| `form` | Submission | Action binding, field mapping, success/error behavior |
| `button` | Backend | Bind `onClick` to a backend action (beyond current Interactions tab) |
| `data-table` | Data | Bind to a DataSource, configure columns |
| `cms-list` | Data | Bind to CMS collection or DB query |
| `product-card` | Data | Bind each prop to a products table field |
| `add-to-cart` | Backend | Bind product ID, quantity, storage mode |
| `chart` | Data | Bind to a DataSource, configure axes |
| `number-display` | Data | Bind to an aggregate query result |

### Interaction Action Config Panel

When a user selects a backend interaction action type in the Interactions tab, show the appropriate config UI:

- **`db.insert`:** Table picker → column-to-field mapper → returning fields.
- **`email.send`:** To (field binding), subject, template picker.
- **`stripe.checkout`:** Line items source, success URL, cancel URL.
- **`runBackendAction`:** Dropdown of named BackendActions.

---

## API Route Changes

### New Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/sites/[siteId]/actions` | GET, POST | List/create backend actions |
| `/api/v1/sites/[siteId]/actions/[actionId]` | GET, PUT, DELETE, POST | CRUD + execute a backend action |
| `/api/v1/sites/[siteId]/routes` | GET, POST, DELETE | CRUD custom site routes |
| `/api/v1/sites/[siteId]/run/[...path]` | ANY | Execute a user-defined site route |
| `/api/v1/sites/[siteId]/data` | GET, POST | List/create data sources |
| `/api/v1/sites/[siteId]/data/[sourceId]` | GET, PUT, DELETE, POST | CRUD + execute a data source query |
| `/api/v1/sites/[siteId]/tables` | GET, POST | List/create site-managed tables |
| `/api/v1/sites/[siteId]/tables/[tableName]` | GET, PUT, DELETE | Table schema CRUD + apply migration |
| `/api/v1/sites/[siteId]/tables/[tableName]/rows` | GET, POST, PUT, DELETE | Live row CRUD (used by data browser + published sites) |
| `/api/v1/sites/[siteId]/cart` | GET, POST, DELETE | Server-side cart management |
| `/api/v1/sites/[siteId]/orders` | GET, POST | Order creation and listing |
| `/api/v1/sites/[siteId]/orders/[orderId]` | GET, PATCH | Order detail + status update |

### Modified Routes

| Route | Change |
|-------|--------|
| `POST /api/v1/forms/[formId]` | Add support for triggering chained backend actions on submission (email, webhook, DB insert) |
| `POST /api/v1/sites/[siteId]/publish` | Export and deploy full-stack site (emit API routes in export) |

---

## TypeScript Type Changes

### New / Modified Types in `src/lib/types.ts`

```typescript
// Add to CanvasElement
interface CanvasElement {
  // ... existing fields ...
  dataBinding?: DataBinding;       // for data-displaying elements
  backendBinding?: FormBackendBinding | AddToCartBinding; // for interactive elements
}

// New top-level types
interface BackendAction { ... }    // see section 1
interface SiteRoute { ... }        // see section 4
interface DataSource { ... }       // see section 3
interface DataBinding { ... }      // see section 3
interface FormBackendBinding { ... } // see section 2
interface AddToCartBinding { ... } // see section 5
type FieldBinding = ...            // see section 1

// Extend Site type
interface Site {
  // ... existing fields ...
  backendActions: BackendAction[];
  siteRoutes: SiteRoute[];
  dataSources: DataSource[];
}

// Extend Interaction
interface InteractionAction {
  type: InteractionActionType;   // extended union — see section 6
  config: Record<string, unknown>;
  onSuccess?: InteractionAction[];
  onError?: InteractionAction[];
  condition?: string;            // simple expression string
}
```

---

## Phased Implementation Plan

### Phase 1 — Foundation (Weeks 1–3)

1. Add `backend_actions`, `site_routes`, `data_sources` columns to `sites` table.
2. Create `site_tables`, `cart_items` tables.
3. Implement `/api/v1/sites/[siteId]/actions` CRUD routes.
4. Build **Backend Actions** tab in Backend panel: list/create/edit/delete `BackendAction` records with a step builder UI.
5. Implement the action executor at `/api/v1/sites/[siteId]/actions/[actionId]` — start with `db.insert`, `db.update`, `db.query`.
6. Add `FieldBinding` resolver utility (server-side).

### Phase 2 — Form Binding (Weeks 4–5)

1. Add **Submission tab** to form element's properties panel.
2. Wire the form element renderer to call the action executor on submit.
3. Extend `onSuccess` / `onError` with toast and navigate options in the renderer.
4. Update `POST /api/v1/forms/[formId]` to support chained actions.
5. Test end-to-end: drag form → bind to `db.insert` action → submit in preview → verify DB row created.

### Phase 3 — Data Binding (Weeks 6–7)

1. Add `DataSource` registry to Backend panel (new **Data Sources** tab).
2. Implement `/api/v1/sites/[siteId]/data/[sourceId]` query executor.
3. Add **Data tab** to `data-table`, `cms-list`, `product-card`, `number-display`, `chart` properties panels.
4. Wire the canvas renderers to fetch from the data endpoint on mount (with loading/error states).
5. Support URL param and auth user as filter values in queries.

### Phase 4 — E-Commerce Backend (Weeks 8–9)

1. Ship e-commerce schema preset in the schema designer.
2. Upgrade `add-to-cart` renderer with `backendBinding` support.
3. Implement `/api/v1/sites/[siteId]/cart` and `/api/v1/sites/[siteId]/orders` routes.
4. Wire Stripe Checkout: `stripe.checkout` BackendAction type → create Stripe session → redirect.
5. Implement Stripe webhook handler to write orders to DB on `checkout.session.completed`.
6. Add `order.create` action type with automatic `order_items` insertion.

### Phase 5 — Custom Routes & Export (Weeks 10–11)

1. Build **Routes** tab in Backend panel with step pipeline builder.
2. Implement `/api/v1/sites/[siteId]/run/[...path]` dynamic handler.
3. Upgrade `export-nextjs.ts` to emit:
   - Server Actions for each form + backend action.
   - Route Handler files for each user-defined site route.
   - RSC data fetching for data-bound elements.
4. Update publish flow to include API routes in the deployed output.

### Phase 6 — Polish & Advanced (Weeks 12+)

1. Extend Interaction panel to support backend action types visually.
2. Add `condition` field to interaction actions.
3. Add `email.send` and `webhook.call` backend action types with template editor.
4. Add `custom.function` action type with an inline code editor (Edge Function).
5. Table management UI (apply schema migrations from the editor).
6. Role-based access on BackendActions (`auth: "role:admin"`).
7. Testing panel for backend actions and data sources (send test request, inspect response).

---

## Key Design Principles

- **No-code first, code fallback:** Every backend capability should be configurable without writing code. Power users can drop to a code editor for custom logic.
- **Portable:** Backend actions and site routes are stored as JSON alongside the site data. Exporting to Next.js should produce equivalent code.
- **Secure by default:** All action executors validate auth level. `db.*` actions run as the site's Supabase service role only for authenticated actions; public actions use restricted RLS-enforced access.
- **Progressive disclosure:** Data binding and backend actions appear as optional tabs — they don't clutter the UI for users building simple landing pages.
- **Consistent mental model:** The same `FieldBinding` concept is used everywhere (form bindings, interaction configs, route step configs, data source filters). Learn it once, use it everywhere.
