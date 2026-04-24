import type React from "react";

export type DeviceMode = "desktop" | "large-tablet" | "tablet" | "mobile" | "small-mobile";

// ── Site-level auth configuration ───────────────────────────────────────────

export type SiteAuthProvider = "supabase" | "firebase" | "custom" | "none";

// ── Site-level database schema definition ────────────────────────────────────

export type SchemaColumnType =
  | "text" | "varchar" | "integer" | "bigint" | "numeric" | "boolean"
  | "date" | "timestamptz" | "uuid" | "jsonb";

export type SchemaRLSPolicy =
  | "none"
  | "public_read"
  | "public_all"
  | "authenticated_read"
  | "authenticated_all"
  | "owner_only";

export interface SchemaColumn {
  id: string;
  name: string;
  type: SchemaColumnType;
  varcharLength?: number;   // only for varchar
  isPrimary?: boolean;
  isNotNull?: boolean;
  isUnique?: boolean;
  defaultValue?: string;
  references?: string;      // "other_table.column_name"
}

export interface SchemaTable {
  id: string;
  name: string;
  columns: SchemaColumn[];
  addTimestamps?: boolean;  // auto-add created_at / updated_at
  rlsPolicy?: SchemaRLSPolicy;
  enableRls?: boolean;
}

export interface SiteSchema {
  tables: SchemaTable[];
}

export interface SiteAuthConfig {
  provider: SiteAuthProvider;
  enabled: boolean;
  /** Supabase project URL + anon key */
  supabase?: {
    url: string;
    anonKey: string;
  };
  /** Firebase Web SDK config */
  firebase?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
  };
  /** Custom REST endpoints (must accept / return the shapes documented in the API route) */
  custom?: {
    signInUrl: string;
    signUpUrl: string;
    signOutUrl: string;
    sessionUrl: string;
  };
  /** Where to send the user after a successful sign-in (page slug, e.g. "/dashboard") */
  redirectAfterSignIn?: string;
  /** Where to send the user after sign-out */
  redirectAfterSignOut?: string;
  /** Where to redirect an already-authenticated user who tries to visit an auth-only page (e.g. login/signup) */
  redirectIfAuthenticated?: string;
  /** Which OAuth social providers to expose */
  allowedProviders?: Array<"email" | "google" | "github" | "magic-link">;
  /** Slug of the page that contains the sign-in form (used by the route guard) */
  signInPageSlug?: string;
  /** Slug of the page that contains the sign-up form */
  signUpPageSlug?: string;
}

export type ElementType =
  // ── Layout ──
  | "section"
  | "container"
  | "flex-row"
  | "flex-col"
  | "grid"
  | "two-col"
  | "three-col"
  | "four-col"
  | "sidebar-left"
  | "sidebar-right"
  | "divider"
  | "spacer"
  | "columns"
  // ── Typography ──
  | "heading"
  | "paragraph"
  | "rich-text"
  | "list"
  | "blockquote"
  | "code-block"
  | "badge"
  | "eyebrow"
  | "alert"
  | "kbd"
  | "number-display"
  | "text-link"
  // ── Media ──
  | "image"
  | "video"
  | "embed"
  | "audio"
  | "icon"
  | "logo"
  | "avatar"
  | "avatar-group"
  | "gallery"
  | "lottie"
  | "svg"
  // ── Forms & Inputs ──
  | "form"
  | "input"
  | "textarea"
  | "select"
  | "multi-select"
  | "checkbox"
  | "radio-group"
  | "toggle"
  | "slider"
  | "rating"
  | "date-picker"
  | "file-upload"
  | "search-input"
  | "otp-input"
  | "button"
  | "button-group"
  // ── Navigation ──
  | "navbar"
  | "sidebar"
  | "mobile-menu"
  | "mega-menu"
  | "dropdown-menu"
  | "footer"
  | "breadcrumbs"
  | "pagination"
  | "tabs"
  | "accordion"
  | "steps"
  // ── Sections ──
  | "hero"
  | "hero-split"
  | "feature-grid"
  | "feature-highlight"
  | "bento-grid"
  | "testimonials"
  | "pricing"
  | "pricing-card"
  | "stats"
  | "logos"
  | "faq"
  | "team"
  | "team-member"
  | "timeline"
  | "how-it-works"
  | "cta"
  | "newsletter"
  | "blog-grid"
  | "blog-card"
  | "portfolio-grid"
  | "portfolio-item"
  | "comparison"
  | "before-after"
  | "metric-card"
  | "announcement"
  | "cookie-banner"
  // ── E-Commerce ──
  | "product-card"
  | "price-display"
  | "add-to-cart"
  | "product-gallery"
  | "wishlist-btn"
  | "stock-indicator"
  | "coupon-code"
  | "product-reviews"
  // ── Advanced ──
  | "chart"
  | "data-table"
  | "map"
  | "countdown"
  | "progress"
  | "carousel"
  // ── Legacy (kept for canvas renderer compat) ──
  | "features"
  | "card"
  | "form"
  | "testimonial"
  | "code"
  | "modal"
  | "tooltip"
  | "social-links"
  | "share-buttons"
  | "banner"
  | "image-gallery"
  | "video-embed"
  | "profile-card"
  | "comparison-table"
  | "cta-banner"
  | "nav-announcement"
  | "product-grid"
  // ── Phase 4 Interactive ──
  | "drawer"
  | "popover"
  | "notification-toast"
  | "progress-bar"
  | "countdown-timer"
  | "like-button"
  // ── Phase 4 E-Commerce ──
  | "cart"
  | "product-price"
  | "product-badge"
  | "quantity-selector"
  | "checkout-steps"
  | "order-summary"
  | "wishlist"
  | "auth-gate"
  | "cms-list"
  | "cms-item"
  // ── Auth Forms (functional) ──
  | "auth-signin-form"
  | "auth-signup-form"
  | "auth-forgot-form"
  | "auth-reset-form"
  | "user-profile-card"
  | "logout-button";

export interface ElementStyles {
  color?: string;
  background?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  textDecoration?: string;
  textDecorationColor?: string;
  textDecorationStyle?: React.CSSProperties["textDecorationStyle"];
  textDecorationThickness?: string;
  textUnderlineOffset?: string;
  textTransform?: React.CSSProperties["textTransform"];
  textAlign?: React.CSSProperties["textAlign"];
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  borderTopWidth?: string;
  borderRightWidth?: string;
  borderBottomWidth?: string;
  borderLeftWidth?: string;
  borderTop?: string;
  borderRight?: string;
  borderBottom?: string;
  borderLeft?: string;
  alignSelf?: string;
  justifySelf?: string;
  flexWrap?: React.CSSProperties["flexWrap"];
  flexGrow?: React.CSSProperties["flexGrow"];
  flexShrink?: React.CSSProperties["flexShrink"];
  flex?: React.CSSProperties["flex"];
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
  gridColumn?: string;
  gridRow?: string;
  borderRadius?: string;
  border?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  width?: string;
  minWidth?: string;
  maxWidth?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  display?: string;
  flexDirection?: React.CSSProperties["flexDirection"];
  alignItems?: string;
  justifyContent?: string;
  gap?: string;
  opacity?: string;
  boxShadow?: string;
  lineHeight?: string;
  letterSpacing?: string;
  whiteSpace?: React.CSSProperties["whiteSpace"];
  transform?: string;
  transition?: string;
  cursor?: string;
  filter?: string;
  backdropFilter?: string;
  textShadow?: string;
  position?: React.CSSProperties["position"];
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  zIndex?: string;
  overflow?: React.CSSProperties["overflow"];
  overflowX?: React.CSSProperties["overflowX"];
  overflowY?: React.CSSProperties["overflowY"];
  objectFit?: React.CSSProperties["objectFit"];
  pointerEvents?: React.CSSProperties["pointerEvents"];
  inset?: string;
  resize?: React.CSSProperties["resize"];
  textOverflow?: React.CSSProperties["textOverflow"];
  userSelect?: React.CSSProperties["userSelect"];
  aspectRatio?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
  backgroundAttachment?: string;
  backgroundBlendMode?: React.CSSProperties["backgroundBlendMode"];
  backgroundClip?: React.CSSProperties["backgroundClip"];
  WebkitBackgroundClip?: React.CSSProperties["backgroundClip"];
  WebkitTextFillColor?: string;
  WebkitTextStroke?: string;
  mixBlendMode?: React.CSSProperties["mixBlendMode"];
  isolation?: React.CSSProperties["isolation"];
  hover?: Partial<ElementStyles>;
  [key: string]: unknown;
}

export interface PageSEO {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterCard?: "summary" | "summary_large_image";
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: string; // JSON-LD string
}

// Allow using ElementStyles as React.CSSProperties
export type StyleProps = React.CSSProperties & ElementStyles;

export interface AnimationConfig {
  preset: "none" | "fadeIn" | "fadeUp" | "fadeDown" | "fadeLeft" | "fadeRight" | "scaleIn" | "slideUp" | "slideDown";
  trigger: "scroll" | "load" | "hover";
  duration: number;   // ms
  delay: number;      // ms
  easing: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "spring";
}

export interface HoverStyles {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
  transform?: string;
  boxShadow?: string;
  opacity?: string;
}

// Reuse the same shape for :focus and :active pseudo-states
export type FocusStyles = HoverStyles;
export type ActiveStyles = HoverStyles;

// ── v2: Backend Action System ────────────────────────────────────────────────

export type BackendActionType =
  | "db.insert"
  | "db.update"
  | "db.delete"
  | "db.query"
  | "auth.signup"
  | "auth.login"
  | "auth.logout"
  | "email.send"
  | "webhook.call"
  | "cart.addItem"
  | "cart.removeItem"
  | "order.create"
  | "order.update"
  | "paddle.checkout"
  | "custom.function";

/** A FieldBinding resolves at runtime to a value */
export type FieldBinding =
  | { source: "formField"; field: string }
  | { source: "auth.user"; field: string }
  | { source: "urlParam"; param: string }
  | { source: "literal"; value: unknown }
  | { source: "elementState"; elementId: string; key: string };

export type FilterOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "like" | "in" | "is";

export interface FilterCondition {
  column: string;
  operator: FilterOperator;
  value: FieldBinding | unknown;
}

export interface FilterGroup {
  logic: "AND" | "OR";
  conditions: (FilterCondition | FilterGroup)[];
}

export interface BackendActionStep {
  type: BackendActionType;
  config: Record<string, unknown>;
}

export interface BackendAction {
  id: string;
  name: string;
  type: BackendActionType;
  config: Record<string, unknown>;
  onSuccess?: BackendActionStep[];
  onError?: BackendActionStep[];
  auth?: "public" | "authenticated" | "role:admin";
}

// ── v2: Data Source System ────────────────────────────────────────────────────

export interface DbQueryConfig {
  table: string;
  select: string[];
  where?: FilterGroup;
  orderBy?: { column: string; dir: "asc" | "desc" }[];
  limit?: number;
  offset?: number | "page";
}

export interface DataSource {
  id: string;
  name: string;
  type: "db.query" | "cms.collection" | "api.get" | "auth.profile";
  config: Record<string, unknown>;
  refreshOn?: "pageLoad" | "interval" | "event";
  refreshInterval?: number;
}

export interface DataBinding {
  sourceId: string;
  path: string;
  fallback?: string;
}

// ── v2: Form-to-Backend Binding ───────────────────────────────────────────────

export interface FormFieldMapping {
  formField: string;
  actionParam: string;
}

export interface FormBackendBinding {
  actionId: string;
  fieldMappings: FormFieldMapping[];
  redirectOnSuccess?: string;
  toastOnSuccess?: string;
  toastOnError?: string;
}

// ── v2: Add-to-Cart Binding ───────────────────────────────────────────────────

export interface AddToCartBinding {
  productIdSource: FieldBinding;
  quantitySource: FieldBinding;
  cartStorageMode: "localStorage" | "server";
}

// ── v2: Custom Site Routes ────────────────────────────────────────────────────

export type RouteStep =
  | { type: "db.query"; config: DbQueryConfig }
  | { type: "db.insert"; config: Record<string, unknown> }
  | { type: "db.update"; config: Record<string, unknown> }
  | { type: "db.delete"; config: Record<string, unknown> }
  | { type: "email.send"; config: Record<string, unknown> }
  | { type: "webhook.call"; config: Record<string, unknown> }
  | { type: "transform"; expression: string }
  | { type: "respond"; body: unknown; status: number };

export interface SiteRoute {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  auth: "public" | "authenticated" | "api-key";
  steps: RouteStep[];
}

// ── v2: Interaction Action Types (extended) ───────────────────────────────────

export type InteractionActionType =
  | "navigate"
  | "openModal"
  | "toggleElement"
  | "scrollTo"
  | "showToast"
  | "copyClipboard"
  | "runJS"
  | "callWebhook"
  | "db.insert"
  | "db.update"
  | "db.delete"
  | "auth.signup"
  | "auth.login"
  | "auth.logout"
  | "email.send"
  | "cart.addItem"
  | "cart.removeItem"
  | "order.create"
  | "paddle.checkout"
  | "runBackendAction";

export interface InteractionAction {
  id: string;
  type: InteractionActionType;
  config: Record<string, unknown>;
  delay?: number;
  onSuccess?: InteractionAction[];
  onError?: InteractionAction[];
  condition?: string;
}

export interface Interaction {
  id: string;
  trigger: "click" | "hover" | "focus" | "scrollIntoView" | "pageLoad" | "doubleClick";
  actions: InteractionAction[];
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  name?: string;           // User-editable label in layers panel
  content?: string;
  props?: Record<string, unknown>;
  styles?: ElementStyles;
  hoverStyles?: HoverStyles;
  focusStyles?: FocusStyles;
  activeStyles?: ActiveStyles;
  animation?: AnimationConfig;
  interactions?: Interaction[];
  children?: CanvasElement[];
  order: number;
  isLocked?: boolean;
  isHidden?: boolean;
  /** Custom CSS scoped to this element (applied via a generated class) */
  customCSS?: string;
  /** Custom JavaScript run when the page loads (preview/published only) */
  customJS?: string;
  /** v2: bind element display to a data source query result */
  dataBinding?: DataBinding;
  /** v2: bind form submission or add-to-cart to a backend action */
  backendBinding?: FormBackendBinding | AddToCartBinding;
}

/**
 * Controls who can access a page and what happens when they arrive.
 *
 * - "public"    — Anyone can visit (default).
 * - "private"   — Must be signed in. Unauthenticated visitors are sent to
 *                 `authConfig.signInPageSlug`.
 * - "auth-only" — Only visible to guests. Authenticated visitors are sent to
 *                 `authConfig.redirectAfterSignIn` (e.g. sign-in / sign-up pages).
 */
export type PageRouteType = "public" | "private" | "auth-only";

export interface Page {
  id: string;
  name: string;
  slug: string;
  elements: CanvasElement[];
  seo?: PageSEO;
  seoTitle?: string;
  seoDescription?: string;
  isHome?: boolean;

  // ── Route configuration ───────────────────────────────────────────────────
  /** Access-control rule for this page (defaults to "public"). */
  routeType?: PageRouteType;
  /**
   * Organisational grouping — no URL impact, purely cosmetic.
   * Use Next.js-style names like "(auth)", "(app)", "(marketing)".
   */
  routeGroup?: string;
  /**
   * When set the page acts as a redirect rule: visitors are immediately
   * sent to this slug instead of seeing the page content.
   */
  redirectTo?: string;
  /** Designate this page as the site's 404 / not-found handler. */
  is404?: boolean;

  /** @deprecated Use routeType === "private" instead. Kept for backward compat. */
  isProtected?: boolean;
}

export interface Deployment {
  id: string;
  siteId: string;
  status: "building" | "success" | "failed";
  url: string;
  createdAt: Date;
  finishedAt?: Date;
  versionData?: string; // stringified snapshot
}

export interface Site {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  slug?: string;
  domain?: string;
  customDomain?: string;
  status: "draft" | "published" | "archived";
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  pages: Page[];
  template?: string;
  plan?: "free" | "pro" | "business" | "enterprise";
  authConfig?: SiteAuthConfig;
  schema?: SiteSchema;
  /** v2: registered backend actions (stored as JSONB in DB) */
  backendActions?: BackendAction[];
  /** v2: user-defined custom API routes (stored as JSONB in DB) */
  siteRoutes?: SiteRoute[];
  /** v2: named data source queries for data binding (stored as JSONB in DB) */
  dataSources?: DataSource[];
  /** v2: Track deployments for site publishing */
  deployments?: Deployment[];
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnail: string;
  tags: string[];
  isPro?: boolean;
  pages?: Page[];
}

export type TemplateCategory =
  | "all"
  | "saas"
  | "portfolio"
  | "blog"
  | "ecommerce"
  | "restaurant"
  | "hotel"
  | "agency"
  | "health"
  | "startup"
  | "corporate"
  | "events"
  | "local"
  | "education"
  | "finance"
  | "creator";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  plan: "free" | "pro" | "business" | "enterprise";
  sitesCount: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: {
    monthly: number | "custom";
    annual: number | "custom";
  };
  description: string;
  features: string[];
  limits: {
    sites: number | "unlimited";
    bandwidth: string;
    storage: string;
    teamMembers: number | "unlimited";
    customDomains: number | "unlimited";
  };
  highlighted?: boolean;
  badge?: string;
}

export interface DraggableElement {
  id: string;
  type: ElementType;
  label: string;
  icon: string;
  defaultContent?: string;
  defaultStyles?: ElementStyles;
  defaultProps?: Record<string, unknown>;
}

export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  typography: {
    fontHeading: string;
    fontBody: string;
    fontMono: string;
    sizeBase: number;
    scaleRatio: number;
  };
  spacing: {
    base: number;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export type NavActionType = "url" | "activity" | "scroll";

export interface NavLink {
  label: string;
  href: string;
  isDropdown?: boolean;
  actionType?: NavActionType;
  actionValue?: string;
  /** Controls visibility based on visitor auth state. Defaults to "always". */
  showWhen?: "always" | "authenticated" | "unauthenticated";
}
