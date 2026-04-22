# Webperia — Template Replacement Plan

This document defines **24 new templates** to replace the current 18. Each template has a clear design direction, tier, category, full page list, and section-by-section breakdown. All templates follow a consistent logic: the right sections appear in the right order on every page, nothing is redundant, and every page serves a specific conversion or information goal.

---

## Conventions

- **Section order** on each page is listed top → bottom
- **Tier** `FREE` = available to all users, `PRO` = paid plan required, `BIZ` = business plan required
- **Accent** = primary brand color (hex)
- Sections reference existing block types from `section-blocks.ts` where applicable

---

## Summary Table

| # | ID | Name | Category | Tier | Pages | Accent |
|---|----|------|----------|------|-------|--------|
| 1 | `saas-pulse` | Pulse | SaaS | FREE | 5 | `#6366F1` |
| 2 | `saas-orion` | Orion | SaaS | PRO | 7 | `#3B82F6` |
| 3 | `saas-vertex` | Vertex | SaaS | PRO | 6 | `#10B981` |
| 4 | `saas-flux` | Flux | SaaS | FREE | 5 | `#64748B` |
| 5 | `agency-prism` | Prism | Agency | FREE | 5 | `#F97316` |
| 6 | `agency-atlas` | Atlas | Agency | PRO | 6 | `#18181B` |
| 7 | `agency-cipher` | Cipher | Agency | PRO | 6 | `#7C3AED` |
| 8 | `agency-signal` | Signal | Agency | FREE | 5 | `#EF4444` |
| 9 | `portfolio-canvas` | Canvas | Portfolio | FREE | 5 | `#374151` |
| 10 | `portfolio-folio` | Folio | Portfolio | PRO | 5 | `#06B6D4` |
| 11 | `blog-ink` | Ink | Blog | FREE | 5 | `#F59E0B` |
| 12 | `blog-dispatch` | Dispatch | Blog | PRO | 6 | `#475569` |
| 13 | `ecommerce-crate` | Crate | E-Commerce | FREE | 5 | `#10B981` |
| 14 | `ecommerce-luxe` | Luxe | E-Commerce | PRO | 6 | `#1C1917` |
| 15 | `ecommerce-market` | Market | E-Commerce | BIZ | 6 | `#2563EB` |
| 16 | `startup-launch` | Launch | Startup | FREE | 3 | `#D946EF` |
| 17 | `startup-ignite` | Ignite | Startup | FREE | 4 | `#8B5CF6` |
| 18 | `startup-boost` | Boost | Startup | PRO | 6 | `#7C3AED` |
| 19 | `restaurant-savor` | Savor | Restaurant | FREE | 4 | `#D97706` |
| 20 | `restaurant-brew` | Brew | Restaurant | FREE | 4 | `#92400E` |
| 21 | `health-thrive` | Thrive | Health | FREE | 5 | `#14B8A6` |
| 22 | `health-revive` | Revive | Health | PRO | 5 | `#EF4444` |
| 23 | `corp-summit` | Summit | Corporate | PRO | 6 | `#1D4ED8` |
| 24 | `corp-meridian` | Meridian | Corporate | BIZ | 6 | `#0F172A` |

---

---

# SaaS

---

## 1. Pulse — `saas-pulse` · FREE

**Design direction:** Light mode, indigo/blue accent, clean grid layout, product-screenshot-forward. Designed for early-stage SaaS products that need a strong landing page fast. Approachable and conversion-focused.

**Pages:** Home · Features · Pricing · Blog · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | Logo left, nav center, CTA right |
| 2 | Announcement Bar | `cta-announcement` | Optional dismissible bar above fold |
| 3 | Hero | `hero-product` | Bold headline, subtext, primary + secondary CTA, product screenshot below fold |
| 4 | Logo Cloud | `logos-trust` | "Trusted by teams at" + 6 company logos |
| 5 | Feature Cards | `features-cards` | 3-column grid of 6 feature icons + titles |
| 6 | Feature Deep-Dive | `features-alternating` | 2–3 alternating text+image rows (key differentiators) |
| 7 | Testimonials | `testimonials-cards` | 3 quotes with avatar, name, company |
| 8 | Pricing Preview | `pricing-minimal` | 2-card preview (Free / Pro) with link to full pricing page |
| 9 | CTA | `cta-gradient` | Full-width gradient banner, headline + single CTA button |
| 10 | Footer | `footer-corporate` | 4-column links, social icons, copyright |

### Features
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Page Hero | `hero-editorial` | Headline + subtext only, no image |
| 3 | Feature Grid | `features-bold-grid` | 6-card grid with icon, title, description |
| 4 | Feature Deep-Dive | `features-alternating` | 3 alternating rows with screenshots |
| 5 | Comparison Table | `content-comparison-table` | Pulse vs. competitors |
| 6 | CTA | `cta-dark` | Dark CTA strip |
| 7 | Footer | `footer-corporate` | |

### Pricing
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Page Hero | `hero-editorial` | Headline + monthly/annual toggle |
| 3 | Pricing Cards | `pricing-cards` | Free / Pro / Business with feature lists |
| 4 | Comparison Table | `pricing-comparison` | Full feature matrix |
| 5 | FAQ | `content-faq` | 8–10 billing/plan questions |
| 6 | CTA | `cta-side-by-side` | Talk to sales + Start free trial |
| 7 | Footer | `footer-corporate` | |

### Blog
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Blog Hero | `blog-featured` | Featured post full-width |
| 3 | Article Grid | `blog-grid` | 3-col grid of recent posts |
| 4 | Newsletter CTA | `cta-newsletter` | Inline newsletter sign-up |
| 5 | Footer | `footer-corporate` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Contact Hero | `hero-editorial` | Headline + short intro |
| 3 | Contact Form + Info | `contact-form-map` | Form left, address/email/phone right |
| 4 | Footer | `footer-corporate` | |

---

## 2. Orion — `saas-orion` · PRO

**Design direction:** Dark mode throughout, electric blue/purple gradient accents, dashboard-forward. Designed for AI, analytics, or data platform products targeting technical and enterprise buyers.

**Pages:** Home · Product · Pricing · Customers · Company · Sign In · Sign Up

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | Transparent on scroll |
| 2 | Hero | `hero-ambient` | Large type, animated gradient BG, dashboard mockup below |
| 3 | Logo Cloud | `logos-trust` | "Used by engineering teams at…" |
| 4 | Product Feature Tour | `features-tabs` | Tabbed interface showing product areas |
| 5 | Stats Section | `stats-dark` | 4 key metrics: users, uptime, data points, etc. |
| 6 | Testimonial Wall | `testimonials-wall` | Masonry testimonial grid |
| 7 | Integration Grid | `saas-integrations` | Logo grid of supported data integrations |
| 8 | Pricing Preview | `pricing-minimal-dark` | 2 cards, link to full pricing |
| 9 | CTA | `cta-dark` | Dark strip with headline + CTA |
| 10 | Footer | `footer-dark` | Dark 4-column footer |

### Product
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | |
| 2 | Product Hero | `hero-product` | Dark, large product screenshot |
| 3 | Dashboard Preview | `saas-dashboard` | Full-bleed dashboard screenshot section |
| 4 | Feature Tour | `features-steps` | Numbered walkthrough of core product areas |
| 5 | Code Snippet Demo | `saas-code-block` | API integration example |
| 6 | Integration Grid | `saas-integrations` | |
| 7 | CTA | `cta-dark` | |
| 8 | Footer | `footer-dark` | |

### Pricing
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | |
| 2 | Pricing Hero | `hero-editorial` | Dark, with annual/monthly toggle |
| 3 | Pricing Cards | `pricing-dark` | Starter / Growth / Enterprise |
| 4 | Comparison Table | `pricing-comparison` | Full feature matrix, dark themed |
| 5 | Volume Pricing | `content-feature-list` | Callout for usage-based / volume pricing |
| 6 | FAQ | `content-faq` | |
| 7 | Sales CTA | `cta-split` | "Talk to Sales" split with self-serve |
| 8 | Footer | `footer-dark` | |

### Customers
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | |
| 2 | Customers Hero | `hero-editorial` | |
| 3 | Case Study Grid | `portfolio-grid` | Dark cards with industry + results |
| 4 | Testimonial Wall | `testimonials-wall` | |
| 5 | Logo Wall | `logos-trust` | Full logo wall of all customers |
| 6 | CTA | `cta-dark` | |
| 7 | Footer | `footer-dark` | |

### Company
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | |
| 2 | About Hero | `hero-editorial` | Mission statement as large type |
| 3 | Team Grid | `team-grid` | |
| 4 | Values Section | `features-cards` | Company values as icon cards |
| 5 | Open Roles | `content-resource-grid` | Current openings |
| 6 | Press Section | `logos-press` | As seen in / press logos |
| 7 | Footer | `footer-dark` | |

### Sign In
| Order | Section | Notes |
|-------|---------|-------|
| 1 | Auth Page | `auth-signin` | Email/password + OAuth, link to sign up |

### Sign Up
| Order | Section | Notes |
|-------|---------|-------|
| 1 | Auth Page | `auth-signup` | Name/email/password + OAuth, link to sign in |

---

## 3. Vertex — `saas-vertex` · PRO

**Design direction:** Dark code-themed, monospace typography accents, green/teal neon. Designed for developer tools, APIs, CLIs, and infrastructure products. Speaks the developer's language.

**Pages:** Home · Docs Preview · Pricing · Integrations · Blog · Sign In

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Pill Navbar | `navbar-pill` | Dark pill nav, docs + sign in links |
| 2 | Hero | `hero-feature-stack` | Terminal/code block on right, headline + CTA left |
| 3 | Logo Cloud | `logos-trust` | "Powering infrastructure at…" |
| 4 | Feature Cards | `features-cards` | 6 technical features as cards |
| 5 | Code Demo | `saas-code-block` | Live code snippet showing integration in 3 languages |
| 6 | Stats | `stats-dark` | Latency, uptime, API calls served |
| 7 | Developer Testimonials | `testimonials-cards` | Quotes from engineers/CTOs |
| 8 | Pricing Preview | `pricing-minimal-dark` | |
| 9 | Integration Grid | `saas-integrations` | |
| 10 | CTA | `cta-dark` | "Start building in 60 seconds" |
| 11 | Footer | `footer-dark` | |

### Docs Preview
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Pill Navbar | `navbar-pill` | |
| 2 | Docs Layout | `saas-dashboard` | Sidebar nav + content area with code blocks |
| 3 | CTA | `cta-dark` | Sign up to access full docs |
| 4 | Footer | `footer-dark` | |

### Pricing
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Pill Navbar | `navbar-pill` | |
| 2 | Pricing Hero | `hero-editorial` | Dark |
| 3 | Plan Cards | `pricing-dark` | Hobby / Team / Enterprise |
| 4 | Usage Explainer | `content-feature-list` | How usage-based billing works |
| 5 | FAQ | `content-faq` | |
| 6 | CTA | `cta-dark` | |
| 7 | Footer | `footer-dark` | |

### Integrations
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Pill Navbar | `navbar-pill` | |
| 2 | Integrations Hero | `hero-editorial` | |
| 3 | Integration Grid | `saas-integrations` | Filterable by category |
| 4 | Integration CTA | `cta-split` | "Don't see yours? Request it" |
| 5 | Footer | `footer-dark` | |

### Blog
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Pill Navbar | `navbar-pill` | |
| 2 | Blog Hero | `blog-featured` | Dark featured article |
| 3 | Article Grid | `blog-grid` | Dark card grid |
| 4 | Newsletter | `cta-newsletter` | Dark inline newsletter |
| 5 | Footer | `footer-dark` | |

### Sign In
| Order | Section | Notes |
|-------|---------|-------|
| 1 | Auth Page | `auth-signin` | Dark themed |

---

## 4. Flux — `saas-flux` · FREE

**Design direction:** Pure light mode, slate/gray palette, professional minimalism. No distractions — copy and hierarchy do the work. Designed for B2B SaaS selling to business buyers who want clarity over flair.

**Pages:** Home · Features · Pricing · About · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | Logo + links only, no decorative elements |
| 2 | Hero | `hero-classic` | Left-aligned headline, subtext, email/CTA form, clean |
| 3 | Logo Cloud | `logos-trust` | Minimal single-row |
| 4 | Feature List | `features-checklist` | Simple 2-column checklist of capabilities |
| 5 | Testimonials | `testimonials-cards` | 3 professional quotes |
| 6 | Pricing Preview | `pricing-minimal` | Clean 3-card preview |
| 7 | CTA | `cta-simple` | Single-column CTA, no gradients |
| 8 | Footer | `footer-minimal` | Simple 3-column |

### Features
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Page Hero | `hero-editorial` | Simple headline + paragraph |
| 3 | Alternating Features | `features-alternating` | 4 rows with screenshot + text |
| 4 | CTA | `cta-simple` | |
| 5 | Footer | `footer-minimal` | |

### Pricing
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Pricing Cards | `pricing-cards` | Clean 3-tier cards |
| 3 | FAQ | `content-faq` | |
| 4 | Footer | `footer-minimal` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | About Hero | `hero-editorial` | Company mission |
| 3 | Team Grid | `team-grid` | |
| 4 | Values | `features-cards` | 3-4 core values |
| 5 | Footer | `footer-minimal` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Contact Form | `contact-form-split` | Left form, right info panel |
| 3 | Footer | `footer-minimal` | |

---

---

# Agency

---

## 5. Prism — `agency-prism` · FREE

**Design direction:** White base, bold orange accent, large expressive typography, high contrast. Energetic and confident. Designed for creative/digital agencies showcasing work and attracting clients.

**Pages:** Home · Services · Work · About · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | Orange CTA, hamburger on mobile |
| 2 | Hero | `hero-cinematic` | Full-bleed, large headline with accent words, CTA |
| 3 | Services Preview | `features-cards` | 3 service area cards |
| 4 | Featured Work | `portfolio-featured` | 2-col grid: 2 highlighted case studies |
| 5 | Client Logos | `logos-trust` | |
| 6 | About Teaser | `cta-split` | Brief agency intro + team photo, link to About |
| 7 | Testimonial | `testimonials-cards` | 1 large featured quote |
| 8 | CTA | `cta-gradient` | "Start a project" CTA |
| 9 | Footer | `footer-corporate` | |

### Services
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Services Hero | `hero-editorial` | |
| 3 | Service Cards | `features-cards` | 6 service areas with descriptions |
| 4 | Process Steps | `features-steps` | How we work (4–5 steps) |
| 5 | Team Teaser | `team-horizontal` | Photo strip of core team |
| 6 | CTA | `cta-gradient` | |
| 7 | Footer | `footer-corporate` | |

### Work
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Work Hero | `hero-editorial` | |
| 3 | Portfolio Grid | `portfolio-grid` | Masonry grid, filterable by service type |
| 4 | CTA | `cta-gradient` | |
| 5 | Footer | `footer-corporate` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | About Hero | `hero-editorial` | Mission as headline |
| 3 | Mission Statement | `content-feature-list` | Detailed values/mission |
| 4 | Team Grid | `team-grid` | |
| 5 | Culture | `features-alternating` | 2 culture sections with photos |
| 6 | CTA | `cta-gradient` | |
| 7 | Footer | `footer-corporate` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Contact Hero | `hero-editorial` | Welcoming headline |
| 3 | Contact Form | `contact-form-map` | Form + email/social |
| 4 | Footer | `footer-corporate` | |

---

## 6. Atlas — `agency-atlas` · PRO

**Design direction:** Sophisticated dark/light split, zinc/black palette, premium corporate feel. Designed for full-service agencies or consultancies working with enterprise clients. Comprehensive and trust-building.

**Pages:** Home · Services · Work · Blog · Team · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Corporate Navbar | `navbar-corporate` | Logo, mega-menu style nav |
| 2 | Hero | `hero-split-panel` | Dark left (headline + CTA), white right (visual) |
| 3 | Client Logos | `logos-trust` | |
| 4 | Services Grid | `features-dark-bento` | Dark bento cards of service areas |
| 5 | Featured Case Study | `portfolio-case-study` | Single large case study callout |
| 6 | Stats | `stats-dark` | Years, clients, projects, retention |
| 7 | Team Preview | `team-horizontal` | Strip of team headshots |
| 8 | Blog Preview | `blog-minimal-featured` | 3 latest articles |
| 9 | CTA | `cta-dark` | |
| 10 | Footer | `footer-dark` | |

### Services
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Corporate Navbar | `navbar-corporate` | |
| 2 | Services Hero | `hero-editorial` | |
| 3 | Service Categories | `features-cards` | Top-level service areas |
| 4 | Service Detail | `features-alternating` | Deep-dive on each service |
| 5 | Process Timeline | `content-timeline` | End-to-end engagement process |
| 6 | CTA | `cta-dark` | |
| 7 | Footer | `footer-dark` | |

### Work
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Corporate Navbar | `navbar-corporate` | |
| 2 | Work Hero | `hero-editorial` | |
| 3 | Case Study Grid | `portfolio-grid` | Filterable by industry |
| 4 | Featured Case Study | `portfolio-case-study` | Highlighted project |
| 5 | CTA | `cta-dark` | |
| 6 | Footer | `footer-dark` | |

### Blog
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Corporate Navbar | `navbar-corporate` | |
| 2 | Blog Hero | `blog-featured` | |
| 3 | Article Grid | `blog-grid` | |
| 4 | Newsletter | `cta-newsletter` | |
| 5 | Footer | `footer-dark` | |

### Team
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Corporate Navbar | `navbar-corporate` | |
| 2 | Team Hero | `hero-editorial` | |
| 3 | Leadership | `team-grid` | Senior team with bios |
| 4 | Department Tabs | `features-tabs` | Browse team by dept |
| 5 | Culture | `features-alternating` | Office life / culture photos |
| 6 | Open Roles | `content-resource-grid` | Current openings |
| 7 | Footer | `footer-dark` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Corporate Navbar | `navbar-corporate` | |
| 2 | Contact Form | `contact-form-map` | Large form + office locations |
| 3 | Footer | `footer-dark` | |

---

## 7. Cipher — `agency-cipher` · PRO

**Design direction:** Dark mode throughout, violet/electric neon accents, immersive and cinematic. Designed for boutique creative studios or high-end production companies with a limited, selective client roster.

**Pages:** Home · Work · Studio · Services · Journal · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Minimal Navbar | `navbar-dark` | Transparent, neon accent hover |
| 2 | Hero | `hero-cinematic` | Full-screen dark, large dramatic type, subtle animation |
| 3 | Marquee | `content-marquee` | Scrolling text loop of capabilities |
| 4 | Featured Projects | `portfolio-dark-grid` | Dark bento-style case study grid |
| 5 | Studio Teaser | `cta-split` | Dark, brief studio description + link |
| 6 | Testimonials | `testimonials-wall` | Dark masonry testimonial grid |
| 7 | CTA | `cta-dark` | "Begin a project" |
| 8 | Footer | `footer-dark` | |

### Work
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Minimal Navbar | `navbar-dark` | |
| 2 | Work Hero | `hero-editorial` | Dark, single line headline |
| 3 | Portfolio Grid | `portfolio-grid` | Filterable, dark cards |
| 4 | CTA | `cta-dark` | |
| 5 | Footer | `footer-dark` | |

### Studio
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Minimal Navbar | `navbar-dark` | |
| 2 | Studio Hero | `hero-editorial` | Dark |
| 3 | Team Grid | `team-grid` | Dark cards, no excess info |
| 4 | Awards | `logos-press` | Award logos (Awwwards, CSS Design Awards, etc.) |
| 5 | Process | `features-steps` | Numbered collaboration steps |
| 6 | Footer | `footer-dark` | |

### Services
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Minimal Navbar | `navbar-dark` | |
| 2 | Services Hero | `hero-editorial` | Dark |
| 3 | Service Cards | `features-dark-bento` | Dark bento-style service offerings |
| 4 | Process | `features-steps` | How engagements work |
| 5 | CTA | `cta-dark` | |
| 6 | Footer | `footer-dark` | |

### Journal
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Minimal Navbar | `navbar-dark` | |
| 2 | Journal Hero | `blog-featured` | Dark featured article |
| 3 | Articles | `blog-minimal-list` | Dark minimal list |
| 4 | Footer | `footer-dark` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Minimal Navbar | `navbar-dark` | |
| 2 | Contact Form | `contact-form-split` | Dark form, neon accents |
| 3 | Footer | `footer-dark` | |

---

## 8. Signal — `agency-signal` · FREE

**Design direction:** White base, red/orange accent, results and metrics-forward. Designed for performance marketing or growth agencies where ROI is the main message. Data-driven aesthetic.

**Pages:** Home · Services · Results · About · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | Red CTA button |
| 2 | Hero | `hero-classic` | Headline with stat overlay (e.g., "3.2x avg ROAS"), CTA |
| 3 | Logo Cloud | `logos-trust` | Client logos |
| 4 | Services Cards | `features-cards` | PPC / SEO / CRO / Social |
| 5 | Stats / Metrics | `stats-section` | Bold 4-stat section with results |
| 6 | Case Study Preview | `portfolio-featured` | 2-col dark cards |
| 7 | Testimonials | `testimonials-cards` | CMO-level quotes |
| 8 | CTA | `cta-gradient` | Red/orange gradient |
| 9 | Footer | `footer-corporate` | |

### Services
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Services Hero | `hero-editorial` | |
| 3 | Service Cards | `features-cards` | Detailed service breakdown |
| 4 | Process Steps | `features-steps` | Onboarding and delivery process |
| 5 | Toolset | `saas-integrations` | Tools/platforms used |
| 6 | CTA | `cta-gradient` | |
| 7 | Footer | `footer-corporate` | |

### Results
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Results Hero | `hero-editorial` | Bold stat as hero |
| 3 | Stats Dashboard | `stats-section` | |
| 4 | Case Studies | `portfolio-grid` | |
| 5 | Testimonial Wall | `testimonials-wall` | |
| 6 | CTA | `cta-gradient` | |
| 7 | Footer | `footer-corporate` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | About Hero | `hero-editorial` | |
| 3 | Team Grid | `team-grid` | |
| 4 | Values | `features-cards` | |
| 5 | Certifications | `logos-trust` | Google, Meta, HubSpot badges |
| 6 | Footer | `footer-corporate` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Contact Form | `contact-form-split` | |
| 3 | Footer | `footer-corporate` | |

---

---

# Portfolio

---

## 9. Canvas — `portfolio-canvas` · FREE

**Design direction:** Light, clean, typography-forward, warm gray tones. Designed for designers, illustrators, and creative professionals who want the work to speak loudest. Editorial, refined.

**Pages:** Home · Work · About · Services · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | Name as logo |
| 2 | Hero | `hero-editorial` | Name, title, short bio, 2 CTAs |
| 3 | Featured Projects | `portfolio-featured` | 2–3 large cards of best work |
| 4 | About Teaser | `cta-side-by-side` | Photo + brief intro + link to About |
| 5 | Services Overview | `features-checklist` | Short list of service areas |
| 6 | Testimonials | `testimonials-cards` | 2–3 client quotes |
| 7 | CTA | `cta-simple` | "Let's work together" |
| 8 | Footer | `footer-minimal` | |

### Work
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Work Hero | `hero-editorial` | Short intro |
| 3 | Project Grid | `portfolio-grid` | Filterable by type (Brand, Web, Motion) |
| 4 | Footer | `footer-minimal` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Photo + Bio | `hero-split-panel` | Large photo left, bio right |
| 3 | Skills | `features-checklist` | Skill tags grouped by discipline |
| 4 | Experience Timeline | `content-timeline` | Education + work history |
| 5 | Testimonials | `testimonials-cards` | |
| 6 | Footer | `footer-minimal` | |

### Services
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Services Hero | `hero-editorial` | |
| 3 | Service List | `features-alternating` | What's included per service |
| 4 | Pricing | `pricing-minimal` | Optional transparent pricing |
| 5 | CTA | `cta-simple` | |
| 6 | Footer | `footer-minimal` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Contact Form | `contact-form-split` | |
| 3 | Social Links | `content-feature-list` | Instagram, Dribbble, LinkedIn, etc. |
| 4 | Footer | `footer-minimal` | |

---

## 10. Folio — `portfolio-folio` · PRO

**Design direction:** Dark mode, cyan/electric blue accent, monospace typographic details, code-aesthetic. Designed for software engineers, architects, or full-stack developers who want a technical and impressive portfolio.

**Pages:** Home · Projects · Experience · Writing · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Pill Navbar | `navbar-pill` | Dark, links to sections |
| 2 | Hero | `hero-feature-stack` | Terminal-style typed intro, headline, CTA buttons |
| 3 | Featured Projects | `portfolio-dark-grid` | Dark cards with tech stack badge pills |
| 4 | Skills Grid | `features-dark-bento` | Languages, tools, frameworks as bento |
| 5 | Experience Preview | `content-timeline` | Latest 2–3 roles |
| 6 | Writing Preview | `blog-minimal-list` | Latest 3 articles |
| 7 | CTA | `cta-dark` | "Download CV" + "Get in touch" |
| 8 | Footer | `footer-dark` | |

### Projects
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Pill Navbar | `navbar-pill` | |
| 2 | Projects Hero | `hero-editorial` | Dark |
| 3 | Project Grid | `portfolio-grid` | Filterable by stack/type |
| 4 | Footer | `footer-dark` | |

### Experience
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Pill Navbar | `navbar-pill` | |
| 2 | Experience Timeline | `content-timeline` | Full work + education history |
| 3 | Skills Matrix | `features-dark-bento` | |
| 4 | Certifications | `logos-trust` | Certs and badges |
| 5 | Footer | `footer-dark` | |

### Writing
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Pill Navbar | `navbar-pill` | |
| 2 | Blog Grid | `blog-grid` | Dark card grid |
| 3 | Footer | `footer-dark` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Pill Navbar | `navbar-pill` | |
| 2 | Contact Form | `contact-form-split` | Dark themed |
| 3 | Social Links | `content-feature-list` | GitHub, LinkedIn, Twitter |
| 4 | Footer | `footer-dark` | |

---

---

# Blog / Editorial

---

## 11. Ink — `blog-ink` · FREE

**Design direction:** White, serif typography headings, amber accent, editorial publication feel. Designed for writers, journalists, and content creators running an independent publication or personal blog.

**Pages:** Home · Blog · Article · About · Newsletter

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Blog Navbar | `navbar-blog` | Publication name, category links, subscribe button |
| 2 | Featured Story | `blog-featured` | Large featured article above the fold |
| 3 | Category Nav | `content-feature-list` | Horizontal category tabs |
| 4 | Article Grid | `blog-grid` | 3-col grid of recent posts |
| 5 | Newsletter CTA | `cta-newsletter` | Inline newsletter sign-up block |
| 6 | Footer | `footer-minimal` | |

### Blog
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Blog Navbar | `navbar-blog` | |
| 2 | Blog Hero | `hero-editorial` | Category or archive description |
| 3 | Article Grid | `blog-grid` | With pagination |
| 4 | Sidebar | `blog-sidebar` | Popular posts, tags, newsletter |
| 5 | Footer | `footer-minimal` | |

### Article
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Blog Navbar | `navbar-blog` | |
| 2 | Article Header | `blog-article-header` | Title, author, date, read time, category |
| 3 | Article Body | `blog-article-body` | Rich text with pull quotes, images, code blocks |
| 4 | Author Bio | `blog-author-bio` | Author card at end |
| 5 | Related Articles | `blog-grid` | 3 related posts |
| 6 | Newsletter CTA | `cta-newsletter` | End-of-article subscribe prompt |
| 7 | Footer | `footer-minimal` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Blog Navbar | `navbar-blog` | |
| 2 | Publication Mission | `hero-editorial` | What the publication is about |
| 3 | Author / Team | `team-grid` | Writers and contributors |
| 4 | Footer | `footer-minimal` | |

### Newsletter
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Blog Navbar | `navbar-blog` | |
| 2 | Newsletter Hero | `hero-classic` | Strong subscribe CTA |
| 3 | Benefits | `features-checklist` | What subscribers get |
| 4 | Sign Up Form | `cta-newsletter` | Large form |
| 5 | Footer | `footer-minimal` | |

---

## 12. Dispatch — `blog-dispatch` · PRO

**Design direction:** Dark hero header transitions to white content area, slate accent, magazine aesthetic. Designed for newsletter publications, media companies, or curated content brands with subscriber gating.

**Pages:** Home · Issues · Article · Authors · Topics · Subscribe

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Magazine Navbar | `navbar-corporate` | Dark header, publication branding |
| 2 | Hero | `blog-featured` | Latest issue featured full-width, dark header |
| 3 | Issue Cards | `blog-cards` | Grid of past issues |
| 4 | Author Spotlights | `team-horizontal` | Featured contributors |
| 5 | Topic Categories | `features-cards` | Browse by topic |
| 6 | Newsletter Sign Up | `cta-newsletter` | |
| 7 | Footer | `footer-dark` | |

### Issues
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Magazine Navbar | `navbar-corporate` | |
| 2 | Issues Archive | `blog-grid` | Chronological issue grid |
| 3 | Footer | `footer-dark` | |

### Article
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Magazine Navbar | `navbar-corporate` | |
| 2 | Article Header | `blog-article-header` | |
| 3 | Article Body | `blog-article-body` | With paywall teaser at paragraph 5 |
| 4 | Author Info | `blog-author-bio` | |
| 5 | Related Stories | `blog-minimal-list` | |
| 6 | Subscribe CTA | `cta-gradient` | "Unlock full access" |
| 7 | Footer | `footer-dark` | |

### Authors
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Magazine Navbar | `navbar-corporate` | |
| 2 | Authors Grid | `team-grid` | All contributors with article count |
| 3 | Footer | `footer-dark` | |

### Topics
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Magazine Navbar | `navbar-corporate` | |
| 2 | Topic Browser | `features-cards` | Topic cards with article count |
| 3 | Article Grid | `blog-grid` | Filtered by selected topic |
| 4 | Footer | `footer-dark` | |

### Subscribe
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Magazine Navbar | `navbar-corporate` | |
| 2 | Subscribe Hero | `hero-classic` | |
| 3 | Plan Cards | `pricing-cards` | Free (limited) / Paid (full access) |
| 4 | FAQ | `content-faq` | |
| 5 | Footer | `footer-dark` | |

---

---

# E-Commerce

---

## 13. Crate — `ecommerce-crate` · FREE

**Design direction:** Clean white, simple grid, emerald accent, fast and friction-free. Designed for small product stores that need a professional storefront without complexity. Function-first.

**Pages:** Home · Shop · Product · Cart · About

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Shop Navbar | `navbar-ecommerce` | Search, cart icon, account |
| 2 | Hero Banner | `hero-product` | Featured product or seasonal sale |
| 3 | Category Grid | `features-cards` | 3–4 product categories |
| 4 | Featured Products | `ecommerce-product-grid` | 4-col grid of bestsellers |
| 5 | Value Props | `features-checklist` | Free shipping, easy returns, support |
| 6 | Testimonials | `testimonials-cards` | 3 customer reviews |
| 7 | Newsletter | `cta-newsletter` | "10% off your first order" |
| 8 | Footer | `footer-corporate` | |

### Shop
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Shop Navbar | `navbar-ecommerce` | |
| 2 | Filter Sidebar + Grid | `ecommerce-product-grid` | Side filter (category, price, size) + grid |
| 3 | Pagination | — | Standard pagination |
| 4 | Footer | `footer-corporate` | |

### Product
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Shop Navbar | `navbar-ecommerce` | |
| 2 | Product Detail | `ecommerce-product-detail` | Images left, info right (title, price, variants, add to cart) |
| 3 | Description Tab | `content-tabs` | Description / Details / Care |
| 4 | Reviews | `ecommerce-reviews` | Star rating + review cards |
| 5 | Related Products | `ecommerce-product-grid` | "You might also like" |
| 6 | Footer | `footer-corporate` | |

### Cart
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Shop Navbar | `navbar-ecommerce` | |
| 2 | Cart + Summary | `ecommerce-cart` | Line items left, order summary right |
| 3 | Checkout CTA | — | Proceed to checkout button |
| 4 | Footer | `footer-minimal` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Shop Navbar | `navbar-ecommerce` | |
| 2 | Brand Story | `hero-editorial` | Founder story / brand origin |
| 3 | Values | `features-cards` | |
| 4 | Team | `team-grid` | Optional small team |
| 5 | Footer | `footer-corporate` | |

---

## 14. Luxe — `ecommerce-luxe` · PRO

**Design direction:** Black and cream, editorial serif typography, cinematic photography, high-end. Designed for premium lifestyle brands, fashion, or artisan goods where the brand experience is as important as the product.

**Pages:** Home · Collection · Product · Lookbook · About · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Dark Navbar | `navbar-dark` | Logo centered, minimal links |
| 2 | Cinematic Hero | `hero-cinematic` | Full-screen large image or video, minimal overlay |
| 3 | Collection Teaser | `portfolio-featured` | Featured collection cards |
| 4 | Product Spotlight | `features-alternating` | 2 editorial product showcases |
| 5 | Brand Values | `features-checklist` | Craft, materials, sustainability |
| 6 | Newsletter | `cta-newsletter` | "Join our world" |
| 7 | Footer | `footer-dark` | |

### Collection
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Dark Navbar | `navbar-dark` | |
| 2 | Collection Hero | `hero-cinematic` | |
| 3 | Product Grid | `ecommerce-product-grid` | Editorial layout, larger images |
| 4 | Footer | `footer-dark` | |

### Product
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Dark Navbar | `navbar-dark` | |
| 2 | Full-Screen Images | `ecommerce-product-detail` | Large images, minimal chrome |
| 3 | Product Info Panel | — | Name, price, description, add to cart |
| 4 | Styling Notes | `content-feature-list` | How to style / care instructions |
| 5 | Related Items | `ecommerce-product-grid` | |
| 6 | Footer | `footer-dark` | |

### Lookbook
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Dark Navbar | `navbar-dark` | |
| 2 | Editorial Grid | `portfolio-grid` | Full-bleed images with product tag overlays |
| 3 | Footer | `footer-dark` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Dark Navbar | `navbar-dark` | |
| 2 | Brand Story | `hero-editorial` | Rich editorial text |
| 3 | Founder Bio | `features-alternating` | Photo + story |
| 4 | Craftsmanship | `features-alternating` | Materials / process |
| 5 | Footer | `footer-dark` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Dark Navbar | `navbar-dark` | |
| 2 | Contact Form | `contact-form-split` | Dark, minimal |
| 3 | Stockist Locator | `contact-map` | |
| 4 | Footer | `footer-dark` | |

---

## 15. Market — `ecommerce-market` · BIZ

**Design direction:** White, bright blue accent, highly functional, search and discovery-focused. Designed for multi-category marketplaces or large product catalogs with seller profiles and advanced filtering.

**Pages:** Home · Category · Product · Cart · Seller · About

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce` | Search bar prominent, dept menu, cart, account |
| 2 | Hero Banner | `hero-product` | Carousel of featured deals/categories |
| 3 | Category Grid | `features-cards` | Department category tiles |
| 4 | Featured Products | `ecommerce-product-grid` | Curated bestsellers |
| 5 | Deals Section | `ecommerce-product-grid` | "Today's deals" |
| 6 | Brand Spotlight | `logos-trust` | Featured brand partners |
| 7 | Newsletter | `cta-newsletter` | |
| 8 | Footer | `footer-corporate` | |

### Category
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce` | |
| 2 | Category Hero | `hero-editorial` | Category name + breadcrumb |
| 3 | Filters + Grid | `ecommerce-product-grid` | Advanced filters panel + results |
| 4 | Pagination | — | |
| 5 | Footer | `footer-corporate` | |

### Product
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce` | |
| 2 | Product Detail | `ecommerce-product-detail` | Multi-image + info panel |
| 3 | Reviews | `ecommerce-reviews` | Aggregate rating + paginated reviews |
| 4 | Q&A | `content-faq` | Questions from buyers |
| 5 | Seller Info | — | Seller card with rating |
| 6 | Related Products | `ecommerce-product-grid` | |
| 7 | Footer | `footer-corporate` | |

### Cart
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce` | |
| 2 | Cart + Cross-sell | `ecommerce-cart` | Line items + recommended add-ons |
| 3 | Checkout Form | `ecommerce-checkout` | Address + payment |
| 4 | Footer | `footer-minimal` | |

### Seller
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce` | |
| 2 | Seller Profile | `hero-editorial` | Seller name, rating, stats |
| 3 | Seller Products | `ecommerce-product-grid` | All seller products |
| 4 | Seller Reviews | `ecommerce-reviews` | |
| 5 | Footer | `footer-corporate` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce` | |
| 2 | Marketplace Mission | `hero-editorial` | |
| 3 | Stats | `stats-section` | Sellers, products, customers, countries |
| 4 | Seller CTA | `cta-split` | Sell on Market / Shop on Market |
| 5 | Footer | `footer-corporate` | |

---

---

# Startup

---

## 16. Launch — `startup-launch` · FREE

**Design direction:** Dark gradient background, fuchsia/pink accent, urgency-forward. Every element exists to drive sign-ups. Countdown timers, waitlist forms, social proof, roadmap. Designed for pre-launch products.

**Pages:** Home · Features · Roadmap

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Announcement Bar | `cta-announcement` | "Limited early access — join the waitlist" |
| 2 | Dark Navbar | `navbar-dark` | Minimal: logo + sign in |
| 3 | Hero | `hero-waitlist` | Large headline, waitlist email form, countdown timer |
| 4 | Social Proof | `logos-trust` | "Backed by" or "Featured in" |
| 5 | How It Works | `features-steps` | 3-step explainer |
| 6 | Feature Preview | `features-cards` | 6 cards teasing product capabilities |
| 7 | Testimonials | `testimonials-cards` | Beta user quotes |
| 8 | Early Bird Pricing | `pricing-minimal-dark` | Lifetime deal or founding member price |
| 9 | Roadmap Preview | `content-timeline` | Q-by-Q roadmap |
| 10 | CTA | `cta-dark` | Final waitlist CTA |
| 11 | Footer | `footer-dark` | |

### Features
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark` | |
| 2 | Features Hero | `hero-editorial` | Dark |
| 3 | Feature Grid | `features-dark-bento` | 6 bento cards |
| 4 | Product Screenshots | `features-alternating` | Dark alternating rows |
| 5 | CTA | `cta-dark` | |
| 6 | Footer | `footer-dark` | |

### Roadmap
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark` | |
| 2 | Roadmap Hero | `hero-editorial` | Dark |
| 3 | Timeline | `content-timeline` | Shipped / In Progress / Planned |
| 4 | Feature Requests | `content-resource-grid` | Community-upvoted features |
| 5 | CTA | `cta-dark` | |
| 6 | Footer | `footer-dark` | |

---

## 17. Ignite — `startup-ignite` · FREE

**Design direction:** Purple/blue gradient, large phone mockup hero, mobile-first visuals, app store download focused. Designed for mobile apps, consumer products, and B2C tools.

**Pages:** Home · Features · Pricing · FAQ

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Pill Navbar | `navbar-pill` | Gradient, app name |
| 2 | Mobile Hero | `hero-mobile-showcase` | Large phone mockup, headline left, app store badges |
| 3 | Feature Cards | `features-cards` | 3 core value props |
| 4 | App Screenshots | `features-alternating` | Phone mockups alternating with benefit copy |
| 5 | Stats Section | `stats-section` | Downloads, ratings, daily active users |
| 6 | Testimonials | `testimonials-cards` | App store review style |
| 7 | Pricing Preview | `pricing-minimal` | Free / Pro plans |
| 8 | Download CTA | `cta-gradient` | Large CTA with app store badges |
| 9 | Footer | `footer-corporate` | |

### Features
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Pill Navbar | `navbar-pill` | |
| 2 | Features Hero | `hero-mobile-showcase` | |
| 3 | Feature Walkthrough | `features-alternating` | Each major feature with phone mockup |
| 4 | CTA | `cta-gradient` | |
| 5 | Footer | `footer-corporate` | |

### Pricing
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Pill Navbar | `navbar-pill` | |
| 2 | Pricing Cards | `pricing-cards` | Monthly/annual toggle |
| 3 | Feature Comparison | `pricing-comparison` | |
| 4 | FAQ | `content-faq` | |
| 5 | Footer | `footer-corporate` | |

### FAQ
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Pill Navbar | `navbar-pill` | |
| 2 | FAQ Hero | `hero-editorial` | Search bar optional |
| 3 | FAQ Accordion | `content-faq` | Categorized FAQ |
| 4 | Contact CTA | `cta-simple` | Can't find answer? Contact support |
| 5 | Footer | `footer-corporate` | |

---

## 18. Boost — `startup-boost` · PRO

**Design direction:** White + bold violet accent, metrics-forward, investor-grade. Designed for funded startups or scale-ups that need to impress enterprise buyers and demonstrate traction.

**Pages:** Home · Product · Pricing · Blog · Team · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | Violet CTA |
| 2 | Hero | `hero-product` | Bold stat claims + CTA, product UI screenshot |
| 3 | Logo Cloud | `logos-trust` | Enterprise customer logos |
| 4 | Product Overview | `saas-dashboard` | Dashboard screenshot with callouts |
| 5 | Metrics | `stats-section` | Animated counter stats |
| 6 | Testimonials | `testimonials-wall` | Masonry |
| 7 | Blog Preview | `blog-minimal-featured` | |
| 8 | Team Preview | `team-horizontal` | |
| 9 | Pricing Preview | `pricing-minimal` | |
| 10 | CTA | `cta-gradient` | |
| 11 | Footer | `footer-corporate` | |

### Product
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | |
| 2 | Product Hero | `hero-product` | |
| 3 | Feature Tour | `features-tabs` | |
| 4 | Integration Grid | `saas-integrations` | |
| 5 | Security Section | `features-checklist` | SOC2, GDPR, SSO |
| 6 | CTA | `cta-gradient` | |
| 7 | Footer | `footer-corporate` | |

### Pricing
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | |
| 2 | Pricing Cards | `pricing-cards` | Toggle monthly/annual |
| 3 | Comparison | `pricing-comparison` | |
| 4 | Volume Pricing | `content-feature-list` | |
| 5 | FAQ | `content-faq` | |
| 6 | CTA | `cta-split` | Self-serve + Talk to Sales |
| 7 | Footer | `footer-corporate` | |

### Blog
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | |
| 2 | Blog Hero | `blog-featured` | |
| 3 | Article Grid | `blog-grid` | |
| 4 | Newsletter | `cta-newsletter` | |
| 5 | Footer | `footer-corporate` | |

### Team
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | |
| 2 | Team Hero | `hero-editorial` | |
| 3 | Leadership | `team-grid` | |
| 4 | Company Values | `features-cards` | |
| 5 | Open Roles | `content-resource-grid` | |
| 6 | Footer | `footer-corporate` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | |
| 2 | Sales Contact Form | `contact-form-map` | |
| 3 | Office Locations | `content-timeline` | |
| 4 | Footer | `footer-corporate` | |

---

---

# Restaurant / Food

---

## 19. Savor — `restaurant-savor` · FREE

**Design direction:** Dark warm tones, amber/gold accent, photography-forward. Designed for upscale restaurants, bistros, and fine dining venues. The photography should do the selling — sections frame it beautifully.

**Pages:** Home · Menu · About · Reservations

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | Amber CTA for reservations |
| 2 | Cinematic Hero | `hero-cinematic` | Full-screen food photography, minimal overlay |
| 3 | About Teaser | `cta-side-by-side` | Brief restaurant description |
| 4 | Menu Highlights | `features-cards` | 3–4 signature dish cards with photo |
| 5 | Press Logos | `logos-press` | "As featured in" |
| 6 | Testimonials | `testimonials-cards` | Diner reviews |
| 7 | Reservation CTA | `cta-gradient` | Amber gradient, "Book a Table" |
| 8 | Footer | `footer-restaurant` | Hours, address, social links |

### Menu
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | |
| 2 | Menu Hero | `hero-editorial` | Menu title, meal period selector |
| 3 | Category Tabs | `features-tabs` | Starters / Mains / Desserts / Drinks |
| 4 | Dish Grid | `features-cards` | Dishes with photo, name, description, price |
| 5 | Allergen Note | `content-feature-list` | Dietary icons legend |
| 6 | Reservation CTA | `cta-gradient` | |
| 7 | Footer | `footer-restaurant` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | |
| 2 | Chef Story | `features-alternating` | Chef photo + bio narrative |
| 3 | Kitchen Philosophy | `features-alternating` | Sourcing / cooking philosophy |
| 4 | Team | `team-grid` | FOH and BOH key staff |
| 5 | Awards | `logos-press` | Michelin stars, accolades |
| 6 | Footer | `footer-restaurant` | |

### Reservations
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | |
| 2 | Reservation Form | `contact-form-split` | Date, time, covers, special requests |
| 3 | Location + Hours | `contact-map` | Map embed + trading hours |
| 4 | Private Dining CTA | `cta-simple` | Link to private events |
| 5 | Footer | `footer-restaurant` | |

---

## 20. Brew — `restaurant-brew` · FREE

**Design direction:** Warm cream and brown palette, organic texture, cozy and approachable. Designed for cafés, coffee shops, tea houses, and neighborhood food spots with a strong community identity.

**Pages:** Home · Menu · Our Story · Find Us

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | Warm text logo |
| 2 | Hero | `hero-organic` | Lifestyle photography + warm tagline, CTA |
| 3 | Seasonal Menu Preview | `features-cards` | 3 seasonal specials |
| 4 | Our Values | `features-cards` | Local sourcing, community, sustainability |
| 5 | About Teaser | `cta-side-by-side` | Founder photo + brief story |
| 6 | Customer Reviews | `testimonials-cards` | |
| 7 | Location CTA | `cta-simple` | "Come visit us" |
| 8 | Footer | `footer-restaurant` | |

### Menu
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Menu Sections | `features-tabs` | Coffee / Food / Seasonal / Retail |
| 3 | Item Cards | `features-cards` | Items with allergen icons |
| 4 | Footer | `footer-restaurant` | |

### Our Story
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Founder Story | `features-alternating` | Origin story with photos |
| 3 | Sourcing Philosophy | `features-alternating` | Where the beans/ingredients come from |
| 4 | Community Section | `features-cards` | Events, partnerships, local initiatives |
| 5 | Footer | `footer-restaurant` | |

### Find Us
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Location Map | `contact-map` | Embedded map |
| 3 | Hours | `content-feature-list` | Day-by-day trading hours |
| 4 | Contact Form | `contact-form-split` | For events/catering enquiries |
| 5 | Footer | `footer-restaurant` | |

---

---

# Health & Wellness

---

## 21. Thrive — `health-thrive` · FREE

**Design direction:** Soft teal/green, warm white background, rounded shapes, calming and trustworthy. Designed for wellness coaches, therapists, nutritionists, and holistic practitioners. Approachable and personal.

**Pages:** Home · Services · About · Blog · Book

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | Teal CTA for booking |
| 2 | Hero | `hero-classic` | Practitioner photo, warm headline, book CTA |
| 3 | Services Overview | `features-cards` | 3–4 service areas |
| 4 | Process Steps | `features-steps` | How working together works (3 steps) |
| 5 | Testimonials | `testimonials-cards` | Client transformation quotes |
| 6 | Stats | `stats-section` | Clients helped, years experience, etc. |
| 7 | Blog Preview | `blog-minimal-list` | 3 wellness articles |
| 8 | Booking CTA | `cta-gradient` | Teal gradient, "Book a Free Call" |
| 9 | Footer | `footer-minimal` | |

### Services
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Services Hero | `hero-editorial` | |
| 3 | Service Cards | `features-cards` | Each service with duration, format, price |
| 4 | Package Comparison | `pricing-cards` | Session packages |
| 5 | FAQ | `content-faq` | |
| 6 | Booking CTA | `cta-gradient` | |
| 7 | Footer | `footer-minimal` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Coach Bio | `hero-split-panel` | Large photo + rich bio |
| 3 | Credentials | `features-checklist` | Qualifications and certifications |
| 4 | Philosophy | `features-alternating` | Approach to wellness |
| 5 | Client Wins | `testimonials-cards` | |
| 6 | Footer | `footer-minimal` | |

### Blog
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Blog Grid | `blog-grid` | |
| 3 | Newsletter | `cta-newsletter` | |
| 4 | Footer | `footer-minimal` | |

### Book
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | |
| 2 | Booking Hero | `hero-editorial` | |
| 3 | Calendar / Booking | `contact-form-split` | Session type + date/time picker |
| 4 | FAQ | `content-faq` | Cancellation, what to expect |
| 5 | Footer | `footer-minimal` | |

---

## 22. Revive — `health-revive` · PRO

**Design direction:** Dark high-energy, red/orange accent, bold photography of fitness action shots. Designed for gyms, CrossFit boxes, yoga studios, and personal training businesses.

**Pages:** Home · Classes · Trainers · Membership · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | Red CTA, dark |
| 2 | Hero | `hero-cinematic` | Full-bleed action photo, bold headline, CTA |
| 3 | Class Types | `features-cards` | HIIT / Yoga / Strength / Cycling |
| 4 | Stats | `stats-section` | Members, classes/week, coaches, years |
| 5 | Featured Trainer | `features-alternating` | Lead trainer spotlight |
| 6 | Membership Preview | `pricing-minimal` | 3 membership tiers preview |
| 7 | Testimonials | `testimonials-cards` | Member transformation stories |
| 8 | CTA | `cta-dark` | "Claim your free class" |
| 9 | Footer | `footer-corporate` | |

### Classes
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Classes Hero | `hero-editorial` | Dark |
| 3 | Class Schedule | `content-timeline` | Weekly schedule table |
| 4 | Class Detail Cards | `features-cards` | What each class involves |
| 5 | CTA | `cta-dark` | |
| 6 | Footer | `footer-corporate` | |

### Trainers
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Trainers Hero | `hero-editorial` | |
| 3 | Trainer Grid | `team-grid` | Photo, name, specialties, certifications |
| 4 | Footer | `footer-corporate` | |

### Membership
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Membership Plans | `pricing-cards` | Day Pass / Monthly / Annual |
| 3 | Comparison | `pricing-comparison` | |
| 4 | FAQ | `content-faq` | |
| 5 | CTA | `cta-dark` | |
| 6 | Footer | `footer-corporate` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Location Map | `contact-map` | |
| 3 | Contact Form | `contact-form-split` | |
| 4 | Hours | `content-feature-list` | Gym opening hours |
| 5 | Footer | `footer-corporate` | |

---

---

# Corporate / Enterprise

---

## 23. Summit — `corp-summit` · PRO

**Design direction:** Navy and white, professional blue accent, clean and authoritative. Designed for enterprise software companies, B2B platforms, and corporate service providers targeting Fortune 500 buyers. Trust is the primary message.

**Pages:** Home · Solutions · Platform · Company · Customers · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Enterprise Navbar | `navbar-corporate` | Mega-menu for Solutions + Platform |
| 2 | Hero | `hero-enterprise` | Clean headline, enterprise sub-copy, primary + demo CTA |
| 3 | Logo Cloud | `logos-trust` | Fortune 500 customer logos |
| 4 | Solutions Grid | `features-dark-bento` | 4–6 solution area cards |
| 5 | Platform Preview | `saas-dashboard` | Product screenshot with callouts |
| 6 | Stats | `stats-section` | Enterprise-grade numbers |
| 7 | Case Studies | `portfolio-featured` | 2 prominent customer case studies |
| 8 | Trust Badges | `logos-trust` | SOC 2, ISO 27001, GDPR, HIPAA |
| 9 | CTA | `cta-split` | "Talk to Sales" + "Request Demo" |
| 10 | Footer | `footer-corporate` | |

### Solutions
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Enterprise Navbar | `navbar-corporate` | |
| 2 | Solutions Hero | `hero-editorial` | |
| 3 | Solutions Grid | `features-cards` | By use case or industry |
| 4 | Solution Detail | `features-alternating` | Deep-dive per solution |
| 5 | CTA | `cta-split` | |
| 6 | Footer | `footer-corporate` | |

### Platform
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Enterprise Navbar | `navbar-corporate` | |
| 2 | Platform Hero | `hero-product` | |
| 3 | Architecture Overview | `features-alternating` | Platform components |
| 4 | Feature Tabs | `features-tabs` | Core platform capabilities |
| 5 | Security Section | `features-checklist` | Compliance and security features |
| 6 | Integration Grid | `saas-integrations` | Enterprise integrations (Salesforce, SAP, etc.) |
| 7 | CTA | `cta-split` | |
| 8 | Footer | `footer-corporate` | |

### Company
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Enterprise Navbar | `navbar-corporate` | |
| 2 | About Hero | `hero-editorial` | Mission and vision |
| 3 | Leadership Team | `team-grid` | C-suite and VPs |
| 4 | Press Section | `logos-press` | Media mentions |
| 5 | Careers CTA | `cta-split` | "Join our team" |
| 6 | Footer | `footer-corporate` | |

### Customers
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Enterprise Navbar | `navbar-corporate` | |
| 2 | Customers Hero | `hero-editorial` | |
| 3 | Case Study Grid | `portfolio-grid` | |
| 4 | Testimonial Wall | `testimonials-wall` | |
| 5 | Logo Wall | `logos-trust` | Full customer logo grid |
| 6 | Footer | `footer-corporate` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Enterprise Navbar | `navbar-corporate` | |
| 2 | Sales Contact Form | `contact-form-map` | Detailed form (company size, use case) |
| 3 | Office Map | `contact-map` | Global offices |
| 4 | Footer | `footer-corporate` | |

---

## 24. Meridian — `corp-meridian` · BIZ

**Design direction:** Dark navy gradient, electric blue accent, enterprise-tech aesthetic. Designed for infrastructure platforms, fintech, or cybersecurity companies where the buyer is technical and risk-sensitive. Credibility over creativity.

**Pages:** Home · Platform · Solutions · Partners · Company · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Enterprise Navbar | `navbar-dark-gradient` | Dark, links to Platform, Solutions, Partners |
| 2 | Dark Hero | `hero-ambient` | Infrastructure visual (globe/network), bold headline, demo + docs CTA |
| 3 | Logo Wall | `logos-trust` | Enterprise customer logos, dark |
| 4 | Product Grid | `features-dark-bento` | 4 core product pillars as bento cards |
| 5 | Architecture Preview | `saas-dashboard` | Technical architecture diagram or dashboard |
| 6 | Stats | `stats-dark` | Uptime, transactions/sec, data volume, global regions |
| 7 | Partner Logos | `logos-trust` | Technology and channel partners |
| 8 | Testimonials | `testimonials-wall` | Dark, CTO/engineering-level quotes |
| 9 | CTA | `cta-dark` | "Talk to an engineer" |
| 10 | Footer | `footer-dark` | |

### Platform
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Enterprise Navbar | `navbar-dark-gradient` | |
| 2 | Platform Hero | `hero-product` | Dark, architecture diagram |
| 3 | Platform Overview | `features-alternating` | Dark, each product component |
| 4 | API Preview | `saas-code-block` | API examples |
| 5 | SLA Section | `features-checklist` | Uptime, SLA, support tiers |
| 6 | CTA | `cta-dark` | |
| 7 | Footer | `footer-dark` | |

### Solutions
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Enterprise Navbar | `navbar-dark-gradient` | |
| 2 | Solutions Hero | `hero-editorial` | Dark, by industry |
| 3 | Industry Cards | `features-dark-bento` | Fintech / Healthcare / Retail / Gov |
| 4 | Case Study Links | `portfolio-featured` | |
| 5 | Footer | `footer-dark` | |

### Partners
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Enterprise Navbar | `navbar-dark-gradient` | |
| 2 | Partner Program Hero | `hero-editorial` | Dark |
| 3 | Partner Grid | `logos-trust` | Technology + reseller partners |
| 4 | Partner Tiers | `pricing-cards` | Dark: Silver / Gold / Platinum |
| 5 | Partner Application | `contact-form-split` | Apply to become a partner |
| 6 | Footer | `footer-dark` | |

### Company
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Enterprise Navbar | `navbar-dark-gradient` | |
| 2 | About Hero | `hero-editorial` | Dark, mission and founding story |
| 3 | Leadership Grid | `team-grid` | Dark cards |
| 4 | Compliance Badges | `logos-trust` | SOC 2, ISO 27001, FedRAMP, etc. |
| 5 | Press | `logos-press` | Media and analyst coverage |
| 6 | Footer | `footer-dark` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Enterprise Navbar | `navbar-dark-gradient` | |
| 2 | Enterprise Contact Form | `contact-form-map` | Dark, detailed qualification form |
| 3 | Sales Team Info | `team-horizontal` | Regional sales contacts |
| 4 | Footer | `footer-dark` | |

---

---

# Implementation Notes

## Replacing Existing Templates

| New Template ID | Replaces | Changes |
|----------------|---------|---------|
| `saas-pulse` | `saas-launchify` | Cleaner structure, better section order |
| `saas-orion` | `saas-appforge` | More complete dark mode, enterprise angle |
| `saas-vertex` | `saas-launchpad` | Developer-tool specific, code-forward |
| `saas-flux` | `saas-cascade` | Sharper B2B focus, minimal aesthetic |
| `agency-prism` | `agency-apex` | Refined bold style, cleaner work pages |
| `agency-atlas` | `agency-orbit` | More logical corp structure, better blog |
| `agency-cipher` | `agency-phantom` | Cleaner dark aesthetic, better flow |
| `agency-signal` | — | New: performance marketing niche |
| `portfolio-canvas` | `portfolio-studio` | More complete, better about/services pages |
| `portfolio-folio` | — | New: developer portfolio niche |
| `blog-ink` | `blog-editorial` | Article page fully built out |
| `blog-dispatch` | `blog-chronicle` | Newsletter/paywall model added |
| `ecommerce-crate` | `ecommerce-bloom` | Full cart flow, better structure |
| `ecommerce-luxe` | — | New: luxury/fashion niche |
| `ecommerce-market` | `ecommerce-storefront` | Multi-vendor/seller pages added |
| `startup-launch` | `startup-launchkit` | Tighter, more logical launch page |
| `startup-ignite` | `startup-momentum` | Cleaner mobile app focus |
| `startup-boost` | `startup-nexus` | Scale-up vs. early-stage, investor-grade |
| `restaurant-savor` | `restaurant-ember` | Full menu + reservations flow |
| `restaurant-brew` | — | New: café/casual dining niche |
| `health-thrive` | `health-serenity` | More pages, booking flow improved |
| `health-revive` | — | New: fitness studio niche |
| `corp-summit` | `corp-meridian` (old) | Full enterprise pages, trust-building |
| `corp-meridian` | — | New: infrastructure/fintech dark enterprise |

## Section Block Coverage

All templates reference section blocks from `section-blocks.ts`. New blocks required that don't currently exist:

| Block ID | Type | Used In |
|---------|------|---------|
| `hero-waitlist` | hero | startup-launch |
| `hero-organic` | hero | restaurant-brew |
| `hero-mobile-showcase` | hero | startup-ignite |
| `hero-enterprise` | hero | corp-summit |
| `hero-split-panel` | hero | portfolio-canvas, agency-atlas |
| `content-marquee` | content | agency-cipher |
| `portfolio-dark-grid` | portfolio | agency-cipher, portfolio-folio |
| `blog-article-header` | blog | blog-ink, blog-dispatch |
| `blog-article-body` | blog | blog-ink, blog-dispatch |
| `blog-author-bio` | blog | blog-ink, blog-dispatch |
| `blog-sidebar` | blog | blog-ink |
| `pricing-minimal-dark` | pricing | saas-orion, startup-launch |
| `stats-dark` | stats | saas-orion, saas-vertex |
| `footer-restaurant` | footer | restaurant-savor, restaurant-brew |
| `ecommerce-checkout` | ecommerce | ecommerce-market |
| `contact-form-map` | contact | multiple |
| `contact-map` | contact | multiple |
| `logos-press` | logos | agency-cipher, restaurant-savor |

## Tier Distribution

| Tier | Count | Templates |
|------|-------|-----------|
| FREE | 12 | pulse, flux, prism, signal, canvas, ink, crate, launch, ignite, savor, brew, thrive |
| PRO | 9 | orion, vertex, atlas, cipher, folio, dispatch, luxe, boost, revive, summit |
| BIZ | 3 | market, meridian |

## Category Distribution

| Category | Count |
|----------|-------|
| SaaS | 4 |
| Agency | 4 |
| Portfolio | 2 |
| Blog | 2 |
| E-Commerce | 3 |
| Startup | 3 |
| Restaurant | 2 |
| Health & Wellness | 2 |
| Corporate | 2 |
| **Total** | **24** |
