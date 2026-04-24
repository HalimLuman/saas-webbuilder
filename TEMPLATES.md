# Webperia — Template Library v2

This document defines **24 production-ready templates** for website builders. Each template is designed to be immediately publishable with a strong visual direction, correct page hierarchy, and conversion-optimised section order. Templates span 9 categories covering the most common real-world use cases.

---

## Conventions

- **Section order** is listed top → bottom for every page
- **Tier** `FREE` = all users · `PRO` = paid plan · `BIZ` = business plan
- **Accent** = primary brand color (hex)
- **Design quality bar:** every template must feel publish-ready out of the box — correct spacing rhythm, typographic hierarchy, and mobile-first layout

---

## Summary Table

| # | ID | Name | Category | Tier | Pages | Accent |
|---|----|------|----------|------|-------|--------|
| 1 | `restaurant-ember` | Ember | Restaurant | FREE | 6 | `#C2410C` |
| 2 | `restaurant-grove` | Grove | Restaurant / Café | FREE | 5 | `#78716C` |
| 3 | `restaurant-lumiere` | Lumière | Fine Dining | PRO | 6 | `#1C1917` |
| 4 | `hotel-haven` | Haven | Hotel / Resort | FREE | 6 | `#0F766E` |
| 5 | `hotel-grand` | Grand | Luxury Hotel | PRO | 7 | `#1E1B4B` |
| 6 | `hotel-villa` | Villa | Boutique / B&B | FREE | 5 | `#854D0E` |
| 7 | `ecommerce-shop` | Shop | General Store | FREE | 6 | `#16A34A` |
| 8 | `ecommerce-luxe` | Luxe | Fashion / Luxury | PRO | 6 | `#1C1917` |
| 9 | `ecommerce-market` | Market | Marketplace | BIZ | 7 | `#2563EB` |
| 10 | `saas-pulse` | Pulse | SaaS | FREE | 5 | `#6366F1` |
| 11 | `saas-orion` | Orion | SaaS / Dev Tools | PRO | 7 | `#3B82F6` |
| 12 | `agency-prism` | Prism | Creative Agency | FREE | 5 | `#F97316` |
| 13 | `agency-atlas` | Atlas | Full-Service Agency | PRO | 6 | `#18181B` |
| 14 | `portfolio-canvas` | Canvas | Portfolio | FREE | 5 | `#374151` |
| 15 | `portfolio-folio` | Folio | Developer Portfolio | PRO | 5 | `#06B6D4` |
| 16 | `blog-ink` | Ink | Blog / Magazine | FREE | 5 | `#F59E0B` |
| 17 | `blog-dispatch` | Dispatch | Newsletter / Blog | PRO | 6 | `#475569` |
| 18 | `startup-launch` | Launch | Pre-launch / Waitlist | FREE | 3 | `#D946EF` |
| 19 | `startup-boost` | Boost | Scale-up / Startup | PRO | 6 | `#7C3AED` |
| 20 | `health-thrive` | Thrive | Wellness / Coaching | FREE | 5 | `#14B8A6` |
| 21 | `health-revive` | Revive | Gym / Studio | PRO | 5 | `#EF4444` |
| 22 | `events-gather` | Gather | Events / Venue | FREE | 5 | `#D97706` |
| 23 | `corp-summit` | Summit | Corporate | PRO | 6 | `#1D4ED8` |
| 24 | `local-pro` | LocalPro | Local Business | FREE | 4 | `#0369A1` |

---

---

# Restaurant & Food

---

## 1. Ember — `restaurant-ember` · FREE

**Design direction:** Warm dark background (`#1A0F0A`), orange-red accent, cinematic food photography, generous white space. Designed for casual-upscale restaurants, gastropubs, and bistros. The template leads with atmosphere — photography does the selling, copy is sparse and confident.

**Typography:** Display serif for headlines (e.g. Playfair Display), clean sans-serif body (e.g. Inter). Large type, loose line-height.

**Layout logic:** Hero fills 100vh. Sections breathe — 120px vertical padding minimum. Cards never feel crowded.

**Pages:** Home · Menu · About · Gallery · Reservations · Private Dining

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-transparent` | Logo centred, links left + right, "Book a Table" CTA right — white text on transparent, switches to dark bg on scroll |
| 2 | Cinematic Hero | `hero-fullscreen-video` | Full-viewport food/ambiance photo or looped video, large serif headline overlay, single CTA button + scroll indicator |
| 3 | Story Teaser | `content-split-text-image` | 2-column: warm narrative paragraph left, atmospheric interior photo right |
| 4 | Signature Dishes | `cards-image-top` | 4-card grid — each card: full-bleed dish photo, dish name, brief description, price (optional) |
| 5 | Press Bar | `logos-editorial` | "As featured in" — minimal logo strip (Michelin, local press, food guides) |
| 6 | Ambiance Gallery | `gallery-masonry` | 6–8 photo masonry grid — dishes, interior, kitchen, team |
| 7 | Testimonials | `testimonials-pull-quote` | 3 large pull-quote reviews with diner name, source (Google / TripAdvisor / personal) |
| 8 | Reservation CTA | `cta-fullwidth-warm` | Full-width warm gradient section, headline "Reserve Your Evening", inline date/time/covers form or OpenTable embed |
| 9 | Footer | `footer-restaurant` | Logo, nav links, address, phone, opening hours grid, social icons, map link |

### Menu
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-transparent` | |
| 2 | Menu Header | `hero-editorial-short` | Section headline + meal-period selector tabs (Lunch / Dinner / Drinks) |
| 3 | Menu Category Tabs | `tabs-full-width` | Starters · Mains · Sides · Desserts · Wine · Cocktails — tabs remain sticky |
| 4 | Menu Item List | `menu-list-with-photos` | Each item: name, description, allergen icons, price — optional thumbnail photo per row |
| 5 | Seasonal Note | `content-banner-warm` | Slim warm banner: "Our menu changes with the seasons. Ask your server about today's specials." |
| 6 | Allergen Info | `content-icon-list` | Allergen icons legend + dietary key (V, VE, GF, DF, N) |
| 7 | Reservation CTA | `cta-simple-warm` | "Enjoyed the menu? Book your table." |
| 8 | Footer | `footer-restaurant` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-transparent` | |
| 2 | Chef Hero | `hero-split-panel` | Left: full-height chef portrait. Right: rich founder/chef narrative with pull quote |
| 3 | Kitchen Philosophy | `features-alternating` | 2 rows: (1) sourcing & local suppliers with farm photo, (2) cooking technique/philosophy with kitchen photo |
| 4 | Awards & Recognition | `logos-press` | Michelin Bib, award badges, local accolades |
| 5 | Team | `team-grid-warm` | FOH and kitchen staff — relaxed photography, names and roles only |
| 6 | Reservation CTA | `cta-simple-warm` | |
| 7 | Footer | `footer-restaurant` | |

### Gallery
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-transparent` | |
| 2 | Gallery Header | `hero-editorial-short` | "A Taste of Ember" — short intro |
| 3 | Gallery Filter | `gallery-filterable` | Filter tabs: Food · Interior · Events · Team |
| 4 | Photo Grid | `gallery-masonry` | Generous masonry grid — full-bleed, hover reveals caption |
| 5 | Instagram Strip | `social-feed-strip` | Latest 6 Instagram posts |
| 6 | Footer | `footer-restaurant` | |

### Reservations
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-transparent` | |
| 2 | Booking Section | `booking-form-split` | Left: reservation form (date, time, party size, special requests, contact). Right: location map, address, parking info, hours |
| 3 | What to Expect | `features-checklist` | Dress code, arrival policy, cancellation, accessibility |
| 4 | Gift Vouchers CTA | `cta-simple-warm` | "Give the gift of Ember — purchase a gift voucher" |
| 5 | Footer | `footer-restaurant` | |

### Private Dining
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-transparent` | |
| 2 | Private Dining Hero | `hero-editorial-short` | Hero image of private room, tagline |
| 3 | Event Types | `features-cards` | Corporate dinners · Celebrations · Wine evenings · Tasting menus |
| 4 | Room Details | `features-alternating` | Capacity, AV setup, layout options with room photos |
| 5 | Menus Available | `content-feature-list` | Set menu options and pricing tiers |
| 6 | Enquiry Form | `contact-form-split` | Event type, date, guest count, notes |
| 7 | Footer | `footer-restaurant` | |

---

## 2. Grove — `restaurant-grove` · FREE

**Design direction:** Cream/off-white background (`#FAFAF7`), warm brown and sage green accents, organic textures. Designed for cafés, coffee shops, brunch spots, and neighbourhood eateries with a strong community and sustainability identity.

**Typography:** Rounded sans-serif or humanist (e.g. DM Sans, Nunito). Relaxed, friendly, approachable.

**Layout logic:** Lighter, airier than Ember. Sections use soft card backgrounds and rounded corners. Photography is lifestyle-forward — people enjoying food, not just food alone.

**Pages:** Home · Menu · Our Story · Events · Find Us

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | Logo with wordmark, relaxed nav, "Order Online" CTA if delivery enabled |
| 2 | Lifestyle Hero | `hero-split-warm` | Left: warm lifestyle photo (coffee, brunch table, guests laughing). Right: headline, tagline, two CTAs (View Menu / Find Us) |
| 3 | Seasonal Specials | `cards-image-top-rounded` | 3 seasonal specials with dish photo, name, brief note |
| 4 | Values Strip | `features-icon-row` | 4 inline values: Locally Sourced · Organic Where Possible · Community First · Zero Waste Kitchen |
| 5 | Story Teaser | `content-split-text-image` | Short paragraph about the founders/origin + photo |
| 6 | Reviews | `testimonials-cards-warm` | 4 Google/Yelp review cards with stars, reviewer name, excerpt |
| 7 | Opening Hours | `content-hours-block` | Clear, styled hours panel + holiday notes |
| 8 | Instagram / Feed | `social-feed-strip` | "Follow @grove_coffee" — latest 6 photos |
| 9 | Footer | `footer-restaurant` | |

### Menu
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | |
| 2 | Menu Hero | `hero-editorial-short` | "What's Good Today" — current specials board style |
| 3 | Menu Tabs | `tabs-pill-warm` | Coffee · Breakfast · Lunch · Baked Goods · Drinks |
| 4 | Item Cards | `menu-cards-warm` | Photo card per item, name, description, price, allergen tags |
| 5 | Allergen Key | `content-icon-list` | Dietary key |
| 6 | Order Online CTA | `cta-warm-banner` | Link to third-party ordering (Uber Eats, own ordering system) |
| 7 | Footer | `footer-restaurant` | |

### Our Story
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | |
| 2 | Founder Story | `hero-editorial-long` | Rich long-form text + hero lifestyle photo |
| 3 | Sourcing | `features-alternating` | Where ingredients come from — supplier relationships with farm/producer photos |
| 4 | Community | `features-cards` | Events hosted, local causes supported, community initiatives |
| 5 | Team | `team-grid-casual` | Casual team photos, first names, roles |
| 6 | Footer | `footer-restaurant` | |

### Events
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | |
| 2 | Events Header | `hero-editorial-short` | "What's On at Grove" |
| 3 | Upcoming Events | `events-list-cards` | Event cards with date, time, description, booking button |
| 4 | Private Hire | `content-split-text-image` | Photo of space set up for events + info panel |
| 5 | Event Enquiry | `contact-form-simple` | Basic event enquiry form |
| 6 | Footer | `footer-restaurant` | |

### Find Us
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | |
| 2 | Map Embed | `contact-map-fullwidth` | Full-width Google Maps embed |
| 3 | Location Details | `content-info-columns` | 3 columns: Address + transit · Opening Hours · Parking & Accessibility |
| 4 | Multiple Locations | `locations-card-grid` | If multi-location: card per location with address, hours, map link |
| 5 | Contact Form | `contact-form-simple` | Catering, events, press, wholesale enquiries |
| 6 | Footer | `footer-restaurant` | |

---

## 3. Lumière — `restaurant-lumiere` · PRO

**Design direction:** Pure black background, champagne/gold accent (`#C9A84C`), elegant serif typography, editorial luxury. Designed for fine dining, tasting menu restaurants, private members clubs, or flagship hotel restaurants. Every pixel communicates exclusivity.

**Typography:** Light-weight serif headlines (e.g. Cormorant Garamond at 72–96px), small caps for labels, wide letter-spacing.

**Layout logic:** Content is sparse and intentional. Long vertical rhythm. Full-bleed photography. Generous negative space is a design feature. No clutter.

**Pages:** Home · Menu · Chef & Team · Wine · Reservations · Private Events

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-minimal` | Logo centred (wordmark only), 4 nav links, gold hover |
| 2 | Cinematic Hero | `hero-fullscreen-dark` | Full-viewport editorial food photography, minimal headline overlay in gold type, reservation CTA |
| 3 | Statement Intro | `content-centered-editorial` | 3–4 sentence restaurant manifesto, centred, large serif type |
| 4 | Signature Experience | `features-alternating-dark` | 2 rows: dining philosophy (plating image) + seasonal sourcing (produce image) |
| 5 | Recognition | `logos-press-dark` | Michelin stars, Forbes, Condé Nast, national press |
| 6 | Testimonials | `testimonials-editorial-dark` | 2 large single-sentence critic/diner quotes, full bleed |
| 7 | Reservation CTA | `cta-dark-gold` | Dark full-width strip, gold accent, "Reserve Your Table" — minimal and confident |
| 8 | Footer | `footer-dark-restaurant` | Minimal dark footer: logo, hours, address, social |

### Menu
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-minimal` | |
| 2 | Menu Header | `hero-editorial-dark` | Current season name, chef's note, menu format (tasting / à la carte) |
| 3 | Tasting Menu | `menu-editorial-dark` | Elegant numbered courses — dish name, single-line description, no prices on tasting menu |
| 4 | À la Carte | `menu-list-dark` | Sections: Amuse · Starters · Mains · Cheese · Desserts — with prices |
| 5 | Dietary Accommodations | `content-text-centered` | Brief note on dietary needs, no icons — just elegant prose |
| 6 | Footer | `footer-dark-restaurant` | |

### Chef & Team
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-minimal` | |
| 2 | Chef Portrait | `hero-portrait-dark` | Full-height editorial chef photo, name + title overlay |
| 3 | Chef Story | `content-editorial-long-dark` | Long-form biographical narrative, 2-column layout |
| 4 | Kitchen Team | `team-editorial-dark` | Sous chefs, pastry, sommelier — editorial portraits, minimal text |
| 5 | Front of House | `features-alternating-dark` | FOH philosophy + maître d' profile |
| 6 | Footer | `footer-dark-restaurant` | |

### Wine
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-minimal` | |
| 2 | Wine Programme Intro | `hero-editorial-dark` | Sommelier name + opening statement |
| 3 | Wine List Sections | `content-accordions-dark` | By-the-glass · Champagne · White · Red · Dessert Wine — each expandable |
| 4 | Sommelier Note | `features-alternating-dark` | Photo of cellar or sommelier + philosophy |
| 5 | Wine Pairing CTA | `cta-dark-gold` | "Ask about our sommelier pairing menus" |
| 6 | Footer | `footer-dark-restaurant` | |

### Reservations
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-minimal` | |
| 2 | Booking Form | `booking-form-dark-split` | Left: reservation form (date, time, covers, dietary notes, occasion, contact). Right: what to expect, dress code, cancellation policy |
| 3 | Gift Experiences | `content-split-text-image-dark` | Gift voucher + dining experience packages |
| 4 | Footer | `footer-dark-restaurant` | |

### Private Events
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-minimal` | |
| 2 | Private Room Hero | `hero-editorial-dark` | Private dining room photography |
| 3 | Event Packages | `features-cards-dark` | Celebratory dinner · Corporate dinner · Wine dinner · Full buyout |
| 4 | Menu Options | `content-feature-list-dark` | Set menus available for private events |
| 5 | Enquiry Form | `contact-form-dark` | Detailed event enquiry: type, date, guest count, budget, requirements |
| 6 | Footer | `footer-dark-restaurant` | |

---

---

# Hotel & Hospitality

---

## 4. Haven — `hotel-haven` · FREE

**Design direction:** Calm teal and white, clean modern layout, lifestyle-focused photography. Designed for independent hotels, guesthouses, eco-resorts, and travel lodges. Warm and welcoming with a direct booking emphasis.

**Typography:** Modern sans-serif (e.g. Outfit or Plus Jakarta Sans). Medium weight headings, comfortable body text. Clear CTAs.

**Layout logic:** Direct booking widget always accessible. Rooms presented with full details. Location and experience lead the storytelling.

**Pages:** Home · Rooms · Facilities · Dining · Location · Book

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Hotel Navbar | `navbar-hotel` | Logo left, nav centre, "Book Now" CTA right — high contrast |
| 2 | Hero with Booking Bar | `hero-hotel-fullscreen` | Full-screen property photography, overlaid inline booking bar (check-in, check-out, guests, "Check Availability" button) |
| 3 | Property Intro | `content-split-text-image` | 2-column: headline + paragraph about the property. Right: lifestyle photo |
| 4 | Room Previews | `cards-room-preview` | 3 room/suite type cards — photo, name, brief highlight, "From £X/night", view details link |
| 5 | Facilities Strip | `features-icon-row` | 6 key facilities: Free WiFi · Pool · Spa · Parking · Restaurant · Concierge |
| 6 | Location Teaser | `content-split-text-image` | Left: map/location image. Right: "Set in the heart of…" — nearby attractions list |
| 7 | Guest Reviews | `testimonials-cards` | 3–4 TripAdvisor / Google review cards with rating stars |
| 8 | Awards & Recognition | `logos-trust` | Green Key, TripAdvisor Travellers Choice, AA, etc. |
| 9 | Newsletter / Offers | `cta-newsletter` | "Sign up for exclusive rates and seasonal packages" |
| 10 | Footer | `footer-hotel` | Logo, nav links, address, phone, email, social icons, privacy/legal links |

### Rooms
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Hotel Navbar | `navbar-hotel` | |
| 2 | Rooms Header | `hero-editorial-short` | "Find Your Perfect Room" — brief intro |
| 3 | Room Type Cards | `cards-room-detailed` | Full-width alternating card per room type: photo gallery strip, room name, size (m²), bed type, max occupancy, key amenities as icon list, from price, "Book This Room" button |
| 4 | Room Amenities | `features-icon-grid` | Full amenities grid (in-room: TV, safe, minibar, etc.) |
| 5 | Accessibility | `content-feature-list` | Accessible rooms, elevator, roll-in shower details |
| 6 | Booking CTA | `cta-hotel` | "Ready to book? Check availability" |
| 7 | Footer | `footer-hotel` | |

### Facilities
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Hotel Navbar | `navbar-hotel` | |
| 2 | Facilities Header | `hero-editorial-short` | |
| 3 | Facility Showcase | `features-alternating` | Pool · Spa · Gym · Business Centre · Parking — each with photo, description, hours, booking note |
| 4 | Family Facilities | `features-cards` | Kids club, family rooms, cots, babysitting |
| 5 | Business Facilities | `features-cards` | Meeting rooms, AV equipment, high-speed WiFi |
| 6 | Footer | `footer-hotel` | |

### Dining
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Hotel Navbar | `navbar-hotel` | |
| 2 | Dining Hero | `hero-editorial-short` | Restaurant/bar photography |
| 3 | Restaurant Overview | `features-alternating` | Breakfast service · À la carte restaurant · Bar — each with photo, hours, description |
| 4 | Sample Menu | `menu-list-with-photos` | Condensed highlight menu with photos |
| 5 | Reservation CTA | `cta-simple` | "Reserve a table in our restaurant" |
| 6 | Footer | `footer-hotel` | |

### Location
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Hotel Navbar | `navbar-hotel` | |
| 2 | Map Hero | `contact-map-fullwidth` | Full-width embedded map, address overlay |
| 3 | Getting Here | `content-info-columns` | 3 columns: By Car · By Train · By Air — with distances and directions |
| 4 | Things to Do | `features-cards` | 6 local attractions/experiences with photo, name, distance |
| 5 | Local Guide | `content-resource-grid` | Curated local recommendations: restaurants, shops, walks |
| 6 | Footer | `footer-hotel` | |

### Book
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Hotel Navbar | `navbar-hotel` | |
| 2 | Booking Engine | `booking-engine-full` | Full booking widget: date range picker, room type selector, guest count, available room results, rate comparison, add-ons (breakfast, parking, spa) |
| 3 | Booking Guarantee | `features-checklist` | Best rate guarantee · Free cancellation on flexible rates · Secure payment |
| 4 | Special Packages | `cards-package` | Romantic getaway · Weekend break · Spa package — each with inclusions, price, book button |
| 5 | Contact | `content-info-columns` | Phone, email, live chat option |
| 6 | Footer | `footer-hotel` | |

---

## 5. Grand — `hotel-grand` · PRO

**Design direction:** Deep navy and white, gold accent (`#B8963E`), formal and luxurious without being cold. Designed for 4–5 star hotels, historic grande dame properties, and luxury urban hotels. Conveys heritage, craft, and exceptional service.

**Typography:** Serif + elegant sans-serif pairing (e.g. Libre Baskerville headings, Lato body). Gold used for accent type and dividers.

**Layout logic:** Rich detail on all pages. Photography is cinematic and curated. Every room type, package, and facility has its own full treatment. Direct booking is primary conversion.

**Pages:** Home · Rooms & Suites · Dining · Wellness · Experiences · Meetings · Book

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Grand Navbar | `navbar-hotel-luxury` | Logo centred, full navigation menu, gold CTA "Reserve" |
| 2 | Cinematic Hero | `hero-fullscreen-video` | Full-viewport video or photography carousel, elegant gold headline, booking bar below fold |
| 3 | Welcome Statement | `content-centered-editorial` | Hotel GM welcome statement, centred serif type |
| 4 | Room Previews | `cards-room-preview-luxury` | 3 room categories (Deluxe · Junior Suite · Grand Suite) — editorial photography |
| 5 | Awards Bar | `logos-press-dark` | Forbes 5-star, Leading Hotels, Condé Nast Traveller, national accolades |
| 6 | Dining Preview | `content-split-text-image` | Flagship restaurant preview with reservation link |
| 7 | Wellness Preview | `content-split-text-image` | Spa and wellness preview |
| 8 | Testimonials | `testimonials-editorial` | 3 guest quotes, full names, home countries |
| 9 | Signature Experiences | `features-cards-luxury` | 4 curated experience cards (afternoon tea, private tours, seasonal packages) |
| 10 | Booking CTA | `cta-luxury-full` | "Begin your stay" — with inline availability check |
| 11 | Footer | `footer-hotel-luxury` | Full footer: logo, property address, multiple contact methods, social, legal |

### Rooms & Suites
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Grand Navbar | `navbar-hotel-luxury` | |
| 2 | Rooms Hero | `hero-editorial-short` | |
| 3 | Room Categories | `cards-room-detailed-luxury` | Each category: full gallery, room size, view type, bed type, amenities list (25+ items), from rate, Book button |
| 4 | Suite Highlight | `portfolio-case-study` | Featured Presidential / Penthouse Suite — full editorial treatment |
| 5 | Room Amenities | `features-icon-grid` | Complete amenity list across all room types |
| 6 | Booking CTA | `cta-luxury-full` | |
| 7 | Footer | `footer-hotel-luxury` | |

### Dining
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Grand Navbar | `navbar-hotel-luxury` | |
| 2 | Dining Hero | `hero-editorial-short` | Flagship restaurant photography |
| 3 | Dining Venues | `features-alternating-luxury` | Flagship Restaurant · Bar & Lounge · Afternoon Tea · Room Service — each with photo, description, hours |
| 4 | Sample Menus | `content-accordions` | Expandable: Breakfast · Lunch · Dinner · Bar snacks |
| 5 | Chef Profile | `content-split-text-image` | Executive Chef portrait + biography |
| 6 | Reservation CTA | `cta-luxury-full` | Restaurant reservation link |
| 7 | Footer | `footer-hotel-luxury` | |

### Wellness
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Grand Navbar | `navbar-hotel-luxury` | |
| 2 | Spa Hero | `hero-editorial-short` | Spa photography |
| 3 | Spa Overview | `content-split-text-image` | Area size, treatment rooms, thermal facilities overview |
| 4 | Treatments | `features-alternating` | Signature treatments with descriptions, durations, prices |
| 5 | Thermal Circuit | `features-cards-luxury` | Pool · Sauna · Steam · Ice Fountain · Relaxation Lounge |
| 6 | Day Spa Packages | `pricing-cards` | Half-day · Full day · Couples retreat |
| 7 | Booking CTA | `cta-luxury-full` | |
| 8 | Footer | `footer-hotel-luxury` | |

### Experiences
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Grand Navbar | `navbar-hotel-luxury` | |
| 2 | Experiences Header | `hero-editorial-short` | |
| 3 | Experience Cards | `cards-experience-luxury` | 6 signature experiences: private tours, helicopter, chef's table, afternoon tea, seasonal activities, concierge services |
| 4 | Seasonal Packages | `features-alternating` | 2–3 seasonal packages: what's included, price, booking |
| 5 | CTA | `cta-luxury-full` | "Our concierge team can tailor any experience" |
| 6 | Footer | `footer-hotel-luxury` | |

### Meetings & Events
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Grand Navbar | `navbar-hotel-luxury` | |
| 2 | Events Hero | `hero-editorial-short` | Ballroom / event space photography |
| 3 | Venue Overview | `features-cards` | Grand Ballroom · Boardroom · Private Dining · Garden |
| 4 | Venue Details | `features-alternating` | Each space: photo, capacity (theatre/dinner/reception), AV specs, natural light, catering |
| 5 | Event Services | `features-icon-grid` | AV tech · In-house catering · Floral · Guest accommodation · Concierge |
| 6 | Enquiry Form | `contact-form-split` | Event type, date, guest numbers, requirements |
| 7 | Footer | `footer-hotel-luxury` | |

### Book
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Grand Navbar | `navbar-hotel-luxury` | |
| 2 | Booking Engine | `booking-engine-full` | Date range, room type, guest count, available room results with photos and rates |
| 3 | Special Offers | `cards-package` | Current promotions and packages |
| 4 | Loyalty Programme | `content-split-text-image` | Join loyalty scheme CTA |
| 5 | Booking Assurance | `features-checklist` | Best rate guarantee · Flexible cancellation · Secure payment |
| 6 | Footer | `footer-hotel-luxury` | |

---

## 6. Villa — `hotel-villa` · FREE

**Design direction:** Warm honey and stone tones, textured backgrounds, intimate photography. Designed for B&Bs, boutique guesthouses, country villas, vacation rentals, and small inns with strong personality. Personal, story-driven.

**Typography:** Approachable serif or slab-serif (e.g. Lora, Zilla Slab). Warm and personal tone.

**Layout logic:** Personal narrative drives the site. Fewer pages, each one rich. Owners/hosts are featured prominently — the relationship IS the product.

**Pages:** Home · Rooms · Dining & Breakfasts · Location · Book

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | Wordmark logo, minimal links, "Book Direct" CTA |
| 2 | Property Hero | `hero-fullscreen-warm` | Full-viewport photography, handwritten-style tagline overlay, inline check availability button |
| 3 | Host Welcome | `content-host-welcome` | Warm column: host photo, short personal introduction — humanises the stay |
| 4 | Room Previews | `cards-room-preview` | 2–4 room cards with photo, name, capacity, highlights, "From £X", view link |
| 5 | Property Highlights | `features-icon-row` | Homemade breakfast · Private garden · Free parking · Pet friendly · WiFi |
| 6 | Experience Teaser | `content-split-text-image` | Location lifestyle photography + "Wake up to…" copy |
| 7 | Reviews | `testimonials-cards-warm` | 4 recent guest reviews |
| 8 | Seasonal Packages | `cards-package-warm` | 2–3 packages (Romantic, Walking Holiday, Family) |
| 9 | Footer | `footer-villa` | Host name, address, phone, email, hours, map link |

### Rooms
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | |
| 2 | Rooms Intro | `hero-editorial-short` | Brief intro to the rooms |
| 3 | Room Detail Cards | `cards-room-detailed` | One card per room: photo gallery, room name, bed type, amenities list, price |
| 4 | What's Included | `features-checklist` | Included in all rooms: homemade breakfast, linen, toiletries, WiFi, parking |
| 5 | Booking CTA | `cta-warm-banner` | |
| 6 | Footer | `footer-villa` | |

### Dining & Breakfast
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | |
| 2 | Breakfast Hero | `hero-editorial-short` | Breakfast table photography |
| 3 | Breakfast Menu | `menu-list-warm` | Full breakfast offering — cooked, continental, vegetarian, vegan, gluten-free |
| 4 | Dinner & Supper | `content-split-text-image` | Evening meal option if offered — or local restaurant guide |
| 5 | Dietary Needs | `content-text-warm` | Note on catering for dietary requirements |
| 6 | Footer | `footer-villa` | |

### Location
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | |
| 2 | Map Hero | `contact-map-fullwidth` | |
| 3 | Getting Here | `content-info-columns` | By car, by train, nearest airport |
| 4 | Things to Do | `features-cards-warm` | 6 nearby attractions, walks, villages — with photo and distance |
| 5 | What the Hosts Recommend | `content-resource-grid` | Curated local tips: favourite restaurants, pubs, markets |
| 6 | Footer | `footer-villa` | |

### Book
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Warm Navbar | `navbar-warm` | |
| 2 | Availability Check | `booking-form-split` | Check-in, check-out, guests. Right: room options with direct booking form |
| 3 | Booking Benefits | `features-checklist` | Book direct and save · Flexible cancellation · Personal welcome from your hosts |
| 4 | Gift Vouchers | `cta-simple-warm` | Gift a stay |
| 5 | Contact | `contact-form-simple` | For questions before booking |
| 6 | Footer | `footer-villa` | |

---

---

# E-Commerce

---

## 7. Shop — `ecommerce-shop` · FREE

**Design direction:** Clean white, emerald green accent, product-forward layout. Designed for independent retail stores, direct-to-consumer brands, and small-to-medium e-commerce businesses selling 50–500 products. Balances discovery, detail, and checkout conversion.

**Typography:** Clean sans-serif (e.g. Inter). Clear product names, legible descriptions, obvious prices.

**Layout logic:** Standard e-commerce conventions respected (nav with cart icon, breadcrumbs, sticky filters, size/colour selectors, trust badges at checkout). Mobile-first product grids.

**Pages:** Home · Shop / Category · Product Detail · Cart & Checkout · About · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | E-com Navbar | `navbar-ecommerce` | Logo left, main nav, search icon, wishlist, cart icon with count |
| 2 | Hero Banner | `hero-ecommerce-banner` | Full-width promotional banner: headline, subtext, CTA — supports image or video. Swap out per season/promotion |
| 3 | Category Tiles | `categories-grid` | 4–6 main product category tiles with photo and label |
| 4 | Featured Products | `ecommerce-product-grid` | 4-column grid of bestsellers or new arrivals — photo, name, price, quick-add button |
| 5 | Brand USPs | `features-icon-row` | 4 trust points: Free delivery over £50 · 30-day returns · UK Made · Secure checkout |
| 6 | Featured Collection | `content-split-text-image` | Highlight a new collection or seasonal range with editorial photo and CTA |
| 7 | Customer Reviews | `testimonials-cards` | 4 product review cards with stars, product name, reviewer |
| 8 | Instagram / UGC | `social-feed-strip` | User-generated content feed from #yourbrand |
| 9 | Newsletter | `cta-newsletter` | 10% off first order incentive |
| 10 | Footer | `footer-ecommerce` | Full nav, customer service links, payment icons, certifications, legal |

### Shop / Category
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | E-com Navbar | `navbar-ecommerce` | |
| 2 | Category Header | `category-hero` | Category name, breadcrumb, product count |
| 3 | Filter + Sort Bar | `ecommerce-filter-bar` | Sticky filter sidebar (desktop) / filter drawer (mobile): price range, size, colour, material, rating — plus sort dropdown |
| 4 | Product Grid | `ecommerce-product-grid` | 4-col desktop / 2-col mobile — product card: photo (hover shows second photo), name, short variant preview, price (+ sale price if applicable), quick add to cart, wishlist |
| 5 | Pagination | `pagination-numbered` | Page numbers + "Load more" option |
| 6 | Footer | `footer-ecommerce` | |

### Product Detail
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | E-com Navbar | `navbar-ecommerce` | |
| 2 | Product Detail | `ecommerce-product-detail` | Left: image gallery (main + thumbnails, zoom on hover, image count). Right: product name, breadcrumb, price (inc sale price), rating summary, variant selectors (colour, size with size guide link), quantity, "Add to Bag" CTA, "Add to Wishlist", delivery & returns summary |
| 3 | Product Description | `ecommerce-product-info` | Tabs: Description · Details & Care · Size Guide · Delivery & Returns |
| 4 | You May Also Like | `ecommerce-product-grid` | 4 related products |
| 5 | Customer Reviews | `ecommerce-reviews` | Star breakdown, verified purchase filter, paginated reviews, review photos |
| 6 | Recently Viewed | `ecommerce-product-grid` | Last 4 viewed products |
| 7 | Footer | `footer-ecommerce` | |

### Cart & Checkout
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-checkout` | Logo only, no navigation — reduces abandonment |
| 2 | Cart | `ecommerce-cart` | Line items (photo, name, variant, qty, price, remove). Order summary (subtotal, estimated delivery, discount code field, total). Upsell: "You might also like" — 2 product suggestions |
| 3 | Checkout Form | `ecommerce-checkout` | Step 1: Contact + delivery. Step 2: Shipping method. Step 3: Payment. Progress bar indicator |
| 4 | Trust Bar | `features-icon-row` | SSL secure · Free returns · Tracked delivery |
| 5 | Footer | `footer-minimal` | Minimal legal footer only |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | E-com Navbar | `navbar-ecommerce` | |
| 2 | Brand Story | `hero-editorial-short` | Founding story hero image + headline |
| 3 | Story Narrative | `features-alternating` | 2–3 alternating rows: origin story · how products are made · values |
| 4 | Certifications | `logos-trust` | B Corp, organic cert, sustainability labels |
| 5 | Team | `team-grid-casual` | Small team photos |
| 6 | CTA | `cta-simple` | "Shop the collection" |
| 7 | Footer | `footer-ecommerce` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | E-com Navbar | `navbar-ecommerce` | |
| 2 | Help Centre Header | `hero-editorial-short` | |
| 3 | FAQ Topics | `features-cards` | Orders & Delivery · Returns · Products · Wholesale — each with brief description and link |
| 4 | FAQ Accordion | `content-faq` | Most common questions |
| 5 | Contact Form | `contact-form-split` | Left: form. Right: response times, live chat link, phone for urgent queries |
| 6 | Footer | `footer-ecommerce` | |

---

## 8. Luxe — `ecommerce-luxe` · PRO

**Design direction:** Black and off-white, sparse editorial layout, fashion-forward. Designed for luxury fashion, jewellery, beauty, homeware, and premium D2C brands. Products are presented as objects of desire — not items in a grid.

**Typography:** Light-weight serif or high-fashion sans (e.g. Cormorant, Josefin Sans). Wide letter-spacing on uppercase labels.

**Layout logic:** Full-bleed editorial photography. Minimal chrome. Products shown in context (lifestyle photography alongside clean packshots). No visual clutter. The remove-everything-unnecessary rule applies.

**Pages:** Home · Collections · Product · Lookbook · About · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-luxury` | Transparent, logo centred, minimal nav, cart icon |
| 2 | Editorial Hero | `hero-fullscreen-dark` | Full-viewport editorial fashion/product photography, minimal type overlay, CTA |
| 3 | Collections | `ecommerce-collections-editorial` | 3–4 collection tiles — full-bleed photography, collection name in overlay |
| 4 | Product Spotlight | `features-alternating-dark` | 2 hero product moments — large image, single product name, price, shop link |
| 5 | Brand Values | `features-checklist-dark` | Handcrafted · Sustainably made · Lifetime guarantee · Free returns |
| 6 | Editorial Feature | `content-centered-editorial-dark` | A single brand statement or article excerpt from press, centred type |
| 7 | Newsletter | `cta-newsletter-dark` | "Join the world of Luxe" |
| 8 | Footer | `footer-dark` | Minimal, dark |

### Collections
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-luxury` | |
| 2 | Collection Hero | `hero-fullscreen-dark` | Full-bleed collection imagery |
| 3 | Filter Bar | `ecommerce-filter-bar-minimal` | Minimal horizontal filter: category, colour, price, material — no sidebar |
| 4 | Editorial Product Grid | `ecommerce-product-grid-editorial` | Asymmetric editorial grid — products shown in larger images, elegant typography |
| 5 | Footer | `footer-dark` | |

### Product
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-luxury` | |
| 2 | Full-Screen Images | `ecommerce-product-gallery-full` | Left half: full-height image gallery with scroll. Right half: sticky product info panel |
| 3 | Product Info | `ecommerce-product-detail-luxury` | Product name, collection, price, material notes, variant selector, size guide, add to bag, add to wishlist |
| 4 | Product Story | `content-feature-list-dark` | Materials used, how it's made, care instructions — editorial treatment |
| 5 | You May Also Love | `ecommerce-product-grid-editorial` | 4 related pieces |
| 6 | Footer | `footer-dark` | |

### Lookbook
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-luxury` | |
| 2 | Lookbook Hero | `hero-fullscreen-dark` | Season name, art director's note |
| 3 | Editorial Spread | `gallery-editorial-full` | Full-bleed editorial images, alternating full-width + 2-col grid. Hover overlay shows tagged products with link |
| 4 | Shop the Look | `ecommerce-product-grid` | Products from the lookbook |
| 5 | Footer | `footer-dark` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-luxury` | |
| 2 | Brand Heritage | `hero-editorial-dark` | Founding story and brand ethos |
| 3 | Craftsmanship | `features-alternating-dark` | Materials · Atelier / workshop · Artisans |
| 4 | Sustainability | `features-alternating-dark` | Supply chain, certifications, environmental commitments |
| 5 | Press | `logos-press-dark` | Vogue, Wallpaper*, Dezeen, etc. |
| 6 | Footer | `footer-dark` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-luxury` | |
| 2 | Client Services | `hero-editorial-short-dark` | "Our team is here for you" |
| 3 | Contact Options | `features-cards-dark` | Order help · Styling advice · Bespoke enquiries · Press |
| 4 | Contact Form | `contact-form-dark` | Dark, minimal |
| 5 | Flagship Store | `contact-map` | Map + store address and hours |
| 6 | Footer | `footer-dark` | |

---

## 9. Market — `ecommerce-market` · BIZ

**Design direction:** White, sky blue accent, highly functional, discovery-focused. Designed for multi-category marketplaces, multi-brand platforms, or large product catalogs. Search and filtering drive the experience.

**Typography:** Clean, utilitarian sans-serif (e.g. Inter). Clarity over personality. Consistent type scale.

**Layout logic:** Breadcrumbs always visible. Search bar always accessible. Filters are prominent and functional. Product cards are information-dense. Reviews and seller ratings are visible upfront.

**Pages:** Home · Category · Product · Cart & Checkout · Seller Profile · Sell on Market · About

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce-full` | Full bar: logo, large search bar, category mega-menu, cart, account |
| 2 | Hero Carousel | `hero-carousel` | Rotating promotional banners — current deals, featured categories, seasonal campaigns |
| 3 | Category Grid | `categories-grid-large` | 8–12 main department tiles |
| 4 | Featured Deals | `ecommerce-product-grid` | "Today's Picks" — 8 products |
| 5 | Featured Brands | `logos-trust` | Partner brand logos |
| 6 | New Arrivals | `ecommerce-product-grid` | 8 newest products |
| 7 | Trending | `ecommerce-product-grid` | 8 trending products |
| 8 | Newsletter | `cta-newsletter` | "Get the best deals in your inbox" |
| 9 | Footer | `footer-ecommerce-full` | Full sitemap-style footer |

### Category
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce-full` | |
| 2 | Category Header | `category-hero` | Category name, breadcrumb, result count, sub-category pills |
| 3 | Filter Sidebar + Grid | `ecommerce-filter-sidebar` | Advanced filters: price, brand, rating, condition, seller location, delivery speed + 4-col product grid |
| 4 | Sort Bar | `ecommerce-sort-bar` | Sort: Relevance, Price low–high, Price high–low, Best reviewed, New |
| 5 | Pagination | `pagination-numbered` | |
| 6 | Footer | `footer-ecommerce-full` | |

### Product
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce-full` | |
| 2 | Product Detail | `ecommerce-product-detail` | Image gallery, name, brand, rating, price, variant selection, stock status, add to cart, add to wishlist |
| 3 | Delivery & Returns | `ecommerce-delivery-info` | Seller name + rating, dispatch time, delivery options, return policy |
| 4 | Product Description | `ecommerce-product-info` | Full description, technical specs, care / compatibility |
| 5 | Questions & Answers | `content-faq` | Buyer Q&A |
| 6 | Reviews | `ecommerce-reviews` | Star rating breakdown, verified purchase badge, photos, pagination |
| 7 | Seller Info | `ecommerce-seller-card` | Seller name, rating, response rate, shop link |
| 8 | Related Products | `ecommerce-product-grid` | |
| 9 | Footer | `footer-ecommerce-full` | |

### Cart & Checkout
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-checkout` | |
| 2 | Cart | `ecommerce-cart-multi-seller` | Line items grouped by seller, quantity edit, remove, save for later, promo code, order summary, recommended add-ons |
| 3 | Checkout | `ecommerce-checkout` | Guest or account checkout, address, delivery method per seller, payment |
| 4 | Trust Bar | `features-icon-row` | Buyer protection · Secure payment · Easy returns |
| 5 | Footer | `footer-minimal` | |

### Seller Profile
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce-full` | |
| 2 | Seller Header | `ecommerce-seller-hero` | Seller logo, name, overall rating, # reviews, location, member since, contact seller button |
| 3 | Seller Products | `ecommerce-product-grid` | All products with filter/sort |
| 4 | Seller Reviews | `ecommerce-reviews` | Buyer reviews of seller |
| 5 | About Seller | `content-text-centered` | Seller's story / business description |
| 6 | Footer | `footer-ecommerce-full` | |

### Sell on Market
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce-full` | |
| 2 | Seller Programme Hero | `hero-editorial-short` | "Reach millions of buyers" |
| 3 | Benefits | `features-cards` | Easy setup · Low commission · Fast payouts · Seller dashboard · Dedicated support |
| 4 | How It Works | `features-steps` | 4-step: Register · List · Sell · Get paid |
| 5 | Seller Plans | `pricing-cards` | Individual · Professional · Enterprise |
| 6 | FAQ | `content-faq` | |
| 7 | Sign Up CTA | `cta-simple` | |
| 8 | Footer | `footer-ecommerce-full` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Full E-com Navbar | `navbar-ecommerce-full` | |
| 2 | Marketplace Mission | `hero-editorial-short` | Mission statement |
| 3 | Stats | `stats-section` | Active sellers, products listed, customers, countries served |
| 4 | Values | `features-cards` | Trust · Choice · Fair pricing · Sustainability |
| 5 | Seller + Buyer CTA | `cta-split` | "Start selling" / "Start shopping" |
| 6 | Footer | `footer-ecommerce-full` | |

---

---

# SaaS

---

## 10. Pulse — `saas-pulse` · FREE

**Design direction:** Light mode, indigo accent, clean product-screenshot-forward grid. Designed for early-stage SaaS products needing a strong, fast landing page. Approachable and conversion-focused.

**Pages:** Home · Features · Pricing · Blog · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | Logo left, nav centre, CTA right |
| 2 | Announcement Bar | `cta-announcement` | Optional dismissible bar |
| 3 | Hero | `hero-product` | Bold headline, subtext, primary + secondary CTA, product screenshot |
| 4 | Logo Cloud | `logos-trust` | "Trusted by teams at" + 6 logos |
| 5 | Feature Cards | `features-cards` | 3-column grid of 6 feature icon cards |
| 6 | Feature Deep-Dive | `features-alternating` | 2–3 alternating text + image rows |
| 7 | Testimonials | `testimonials-cards` | 3 quotes with avatar, name, company |
| 8 | Pricing Preview | `pricing-minimal` | 2-card Free / Pro preview |
| 9 | CTA | `cta-gradient` | Full-width gradient banner |
| 10 | Footer | `footer-corporate` | 4-column links, social, copyright |

### Features
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Page Hero | `hero-editorial` | Headline + subtext only |
| 3 | Feature Grid | `features-bold-grid` | 6-card grid with icon, title, description |
| 4 | Feature Deep-Dive | `features-alternating` | 3 alternating rows with screenshots |
| 5 | Comparison Table | `content-comparison-table` | Pulse vs. competitors |
| 6 | CTA | `cta-dark` | |
| 7 | Footer | `footer-corporate` | |

### Pricing
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Page Hero | `hero-editorial` | Monthly/annual toggle |
| 3 | Pricing Cards | `pricing-cards` | Free / Pro / Business |
| 4 | Comparison Table | `pricing-comparison` | Full feature matrix |
| 5 | FAQ | `content-faq` | Billing/plan questions |
| 6 | CTA | `cta-side-by-side` | Talk to sales + Start free trial |
| 7 | Footer | `footer-corporate` | |

### Blog
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Blog Hero | `blog-featured` | Featured post full-width |
| 3 | Article Grid | `blog-grid` | 3-column grid of recent posts |
| 4 | Newsletter | `cta-newsletter` | |
| 5 | Footer | `footer-corporate` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-glass` | |
| 2 | Contact Hero | `hero-editorial` | Headline + short intro |
| 3 | Contact Form + Info | `contact-form-map` | Form left, address/email/phone right |
| 4 | Footer | `footer-corporate` | |

---

## 11. Orion — `saas-orion` · PRO

**Design direction:** Dark mode, electric blue/purple gradient accents, dashboard-forward. Designed for AI, analytics, or data platform products targeting technical and enterprise buyers.

**Pages:** Home · Product · Pricing · Customers · Company · Sign In · Sign Up

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | Transparent on scroll |
| 2 | Hero | `hero-ambient` | Animated gradient BG, dashboard mockup |
| 3 | Logo Cloud | `logos-trust` | "Used by engineering teams at…" |
| 4 | Product Feature Tour | `features-tabs` | Tabbed interface of product areas |
| 5 | Stats | `stats-dark` | Users, uptime, data processed, integrations |
| 6 | Testimonial Wall | `testimonials-wall` | Masonry testimonial grid |
| 7 | Integration Grid | `saas-integrations` | Supported integration logos |
| 8 | Pricing Preview | `pricing-minimal-dark` | 2 cards, link to pricing |
| 9 | CTA | `cta-dark` | |
| 10 | Footer | `footer-dark` | |

### Product
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | |
| 2 | Product Hero | `hero-product` | Dark, large product screenshot |
| 3 | Dashboard Preview | `saas-dashboard` | Full-bleed dashboard screenshot |
| 4 | Feature Tour | `features-steps` | Numbered product walkthrough |
| 5 | Code Snippet | `saas-code-block` | API integration example |
| 6 | Integration Grid | `saas-integrations` | |
| 7 | CTA | `cta-dark` | |
| 8 | Footer | `footer-dark` | |

### Pricing
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | |
| 2 | Pricing Hero | `hero-editorial` | Dark, annual/monthly toggle |
| 3 | Pricing Cards | `pricing-dark` | Starter / Growth / Enterprise |
| 4 | Comparison Table | `pricing-comparison` | Dark themed feature matrix |
| 5 | Volume Pricing | `content-feature-list` | Usage-based billing callout |
| 6 | FAQ | `content-faq` | |
| 7 | Sales CTA | `cta-split` | Talk to sales + self-serve |
| 8 | Footer | `footer-dark` | |

### Customers
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | |
| 2 | Customers Hero | `hero-editorial` | |
| 3 | Case Study Grid | `portfolio-grid` | Dark cards with industry + results |
| 4 | Testimonial Wall | `testimonials-wall` | |
| 5 | Logo Wall | `logos-trust` | Full logo wall |
| 6 | CTA | `cta-dark` | |
| 7 | Footer | `footer-dark` | |

### Company
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark-gradient` | |
| 2 | About Hero | `hero-editorial` | Mission statement |
| 3 | Team Grid | `team-grid` | |
| 4 | Values | `features-cards` | Company values as icon cards |
| 5 | Open Roles | `content-resource-grid` | Current openings |
| 6 | Press | `logos-press` | Press logos |
| 7 | Footer | `footer-dark` | |

### Sign In / Sign Up
| Order | Section | Notes |
|-------|---------|-------|
| 1 | Auth Page | Email/password + OAuth; link between sign in and sign up |

---

---

# Agency & Portfolio

---

## 12. Prism — `agency-prism` · FREE

**Design direction:** White base, bold orange accent, large expressive typography. Energetic and confident. For creative/digital agencies showcasing work and attracting clients.

**Pages:** Home · Services · Work · About · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | Orange CTA |
| 2 | Hero | `hero-cinematic` | Full-bleed, large headline with accent words |
| 3 | Services Preview | `features-cards` | 3 service area cards |
| 4 | Featured Work | `portfolio-featured` | 2-col grid of 2 highlighted case studies |
| 5 | Client Logos | `logos-trust` | |
| 6 | About Teaser | `cta-split` | Brief agency intro + team photo |
| 7 | Testimonial | `testimonials-cards` | 1 large featured quote |
| 8 | CTA | `cta-gradient` | "Start a project" |
| 9 | Footer | `footer-corporate` | |

### Services
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Services Hero | `hero-editorial` | |
| 3 | Service Cards | `features-cards` | 6 service areas |
| 4 | Process Steps | `features-steps` | How we work (4 steps) |
| 5 | Team Teaser | `team-horizontal` | Core team strip |
| 6 | CTA | `cta-gradient` | |
| 7 | Footer | `footer-corporate` | |

### Work
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Work Hero | `hero-editorial` | |
| 3 | Portfolio Grid | `portfolio-grid` | Masonry, filterable by service |
| 4 | CTA | `cta-gradient` | |
| 5 | Footer | `footer-corporate` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | About Hero | `hero-editorial` | Mission headline |
| 3 | Mission | `content-feature-list` | Values and approach |
| 4 | Team Grid | `team-grid` | |
| 5 | Culture | `features-alternating` | 2 culture sections |
| 6 | CTA | `cta-gradient` | |
| 7 | Footer | `footer-corporate` | |

### Contact
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | |
| 2 | Contact Hero | `hero-editorial` | |
| 3 | Contact Form | `contact-form-map` | Form + email/social |
| 4 | Footer | `footer-corporate` | |

---

## 13. Atlas — `agency-atlas` · PRO

**Design direction:** Sophisticated dark/light split, zinc/black palette. For full-service agencies and consultancies with enterprise clients.

**Pages:** Home · Services · Work · Blog · Team · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Corporate Navbar | `navbar-corporate` | Mega-menu style nav |
| 2 | Hero | `hero-split-panel` | Dark left (headline), white right (visual) |
| 3 | Client Logos | `logos-trust` | |
| 4 | Services Grid | `features-dark-bento` | Dark bento cards of service areas |
| 5 | Featured Case Study | `portfolio-case-study` | Large case study callout |
| 6 | Stats | `stats-dark` | Years, clients, projects, retention |
| 7 | Team Preview | `team-horizontal` | Headshot strip |
| 8 | Blog Preview | `blog-minimal-featured` | 3 latest articles |
| 9 | CTA | `cta-dark` | |
| 10 | Footer | `footer-dark` | |

### Services
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Corporate Navbar | `navbar-corporate` | |
| 2 | Services Hero | `hero-editorial` | |
| 3 | Service Categories | `features-cards` | Top-level service areas |
| 4 | Service Detail | `features-alternating` | Deep-dive per service |
| 5 | Process Timeline | `content-timeline` | End-to-end engagement process |
| 6 | CTA | `cta-dark` | |
| 7 | Footer | `footer-dark` | |

### Work · Blog · Team · Contact follow the same structure as `agency-prism` but with dark variants.

---

## 14. Canvas — `portfolio-canvas` · FREE

**Design direction:** Neutral grey, minimal, craft-forward. For designers, photographers, architects, and illustrators.

**Pages:** Home · Work · About · Services · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | Name/logo, 4 nav links |
| 2 | Hero | `hero-portfolio` | Large name, discipline, 1 featured work image |
| 3 | Selected Work | `portfolio-grid` | 6–9 project thumbnails, filterable |
| 4 | About Teaser | `cta-split` | Brief bio + headshot |
| 5 | Client Logos | `logos-trust` | Brands worked with |
| 6 | CTA | `cta-simple` | "Available for projects" |
| 7 | Footer | `footer-minimal` | |

### Work · About · Services · Contact follow standard portfolio convention.

---

## 15. Folio — `portfolio-folio` · PRO

**Design direction:** Dark, cyan accent, code-aesthetic. For developers, engineers, and technical creatives.

**Pages:** Home · Projects · Writing · Uses · Contact

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Dark Navbar | `navbar-dark` | |
| 2 | Terminal Hero | `hero-feature-stack` | Code block / terminal aesthetic hero, headline + CTA |
| 3 | Featured Projects | `portfolio-dark-grid` | 3 featured projects with tech stack tags |
| 4 | Skills | `features-checklist` | Languages, frameworks, tools |
| 5 | Latest Writing | `blog-minimal-list` | 3 recent articles |
| 6 | CTA | `cta-dark` | "Hire me / Get in touch" |
| 7 | Footer | `footer-dark` | |

---

---

# Blog & Content

---

## 16. Ink — `blog-ink` · FREE

**Design direction:** Warm amber, editorial magazine layout, serif body text. For personal blogs, food writers, travel writers, and content creators.

**Pages:** Home · Articles · Article (Single) · About · Newsletter

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Editorial Navbar | `navbar-minimal` | |
| 2 | Featured Article | `blog-featured` | Full-width hero article card |
| 3 | Recent Articles | `blog-grid` | 3-column card grid |
| 4 | Categories | `features-icon-row` | Category pill navigation |
| 5 | Newsletter | `cta-newsletter` | Inline sign-up |
| 6 | Footer | `footer-minimal` | |

### Article (Single)
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-minimal` | |
| 2 | Article Header | `blog-article-header` | Title, author, date, category, read time |
| 3 | Article Body | `blog-article-body` | Rich text with pull quotes, inline images, callouts |
| 4 | Author Bio | `blog-author-bio` | Photo, name, bio, social links |
| 5 | Related Articles | `blog-grid` | 3 related posts |
| 6 | Newsletter | `cta-newsletter` | |
| 7 | Footer | `footer-minimal` | |

---

## 17. Dispatch — `blog-dispatch` · PRO

**Design direction:** Slate/dark, newsletter-focused, subscriber-first. For professional writers, paid newsletters, and niche media.

**Pages:** Home · Archive · Article · About · Subscribe

### Subscribe
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Navbar | `navbar-minimal` | |
| 2 | Subscription Hero | `hero-editorial` | Value proposition for subscribing |
| 3 | Plan Cards | `pricing-cards` | Free · Supporter · Founding Member |
| 4 | What You Get | `features-checklist` | |
| 5 | Testimonials | `testimonials-cards` | Reader quotes |
| 6 | FAQ | `content-faq` | |
| 7 | Footer | `footer-minimal` | |

---

---

# Startup

---

## 18. Launch — `startup-launch` · FREE

**Design direction:** Dark gradient, fuchsia accent, urgency-forward. Every element drives sign-ups. For pre-launch products.

**Pages:** Home · Features · Roadmap

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Announcement Bar | `cta-announcement` | "Limited early access — join the waitlist" |
| 2 | Dark Navbar | `navbar-dark` | Logo + sign in only |
| 3 | Hero | `hero-waitlist` | Large headline, waitlist email form, countdown timer |
| 4 | Social Proof | `logos-trust` | "Backed by" or "Featured in" |
| 5 | How It Works | `features-steps` | 3-step explainer |
| 6 | Feature Preview | `features-cards` | 6 cards teasing capabilities |
| 7 | Testimonials | `testimonials-cards` | Beta user quotes |
| 8 | Early Bird Pricing | `pricing-minimal-dark` | Founding member price |
| 9 | Roadmap | `content-timeline` | Q-by-Q roadmap |
| 10 | CTA | `cta-dark` | Final waitlist CTA |
| 11 | Footer | `footer-dark` | |

---

## 19. Boost — `startup-boost` · PRO

**Design direction:** White, bold violet, metrics-forward, investor-grade. For funded startups needing to impress enterprise buyers and demonstrate traction.

**Pages:** Home · Product · Pricing · Blog · Team · Contact

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Glass Navbar | `navbar-glass` | Violet CTA |
| 2 | Hero | `hero-product` | Bold stat claims, product UI screenshot |
| 3 | Logo Cloud | `logos-trust` | Enterprise customer logos |
| 4 | Dashboard Preview | `saas-dashboard` | Screenshot with callouts |
| 5 | Metrics | `stats-section` | Animated counter stats |
| 6 | Testimonials | `testimonials-wall` | Masonry |
| 7 | Blog Preview | `blog-minimal-featured` | |
| 8 | Team Preview | `team-horizontal` | |
| 9 | Pricing Preview | `pricing-minimal` | |
| 10 | CTA | `cta-gradient` | |
| 11 | Footer | `footer-corporate` | |

---

---

# Health & Wellness

---

## 20. Thrive — `health-thrive` · FREE

**Design direction:** Soft teal, warm white, rounded shapes, calming. For wellness coaches, therapists, and holistic practitioners.

**Pages:** Home · Services · About · Blog · Book

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Minimal Navbar | `navbar-minimal` | Teal booking CTA |
| 2 | Hero | `hero-classic` | Practitioner photo, warm headline, book CTA |
| 3 | Services | `features-cards` | 3–4 service areas |
| 4 | Process | `features-steps` | How working together works |
| 5 | Testimonials | `testimonials-cards` | Client transformation quotes |
| 6 | Stats | `stats-section` | Clients helped, experience, etc. |
| 7 | Blog Preview | `blog-minimal-list` | 3 wellness articles |
| 8 | Booking CTA | `cta-gradient` | "Book a Free Call" |
| 9 | Footer | `footer-minimal` | |

---

## 21. Revive — `health-revive` · PRO

**Design direction:** Dark high-energy, red/orange, bold fitness photography. For gyms, CrossFit boxes, yoga studios, and PT businesses.

**Pages:** Home · Classes · Trainers · Membership · Contact

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Bold Navbar | `navbar-bold` | Red CTA |
| 2 | Hero | `hero-cinematic` | Full-bleed action photo, bold headline |
| 3 | Class Types | `features-cards` | HIIT / Yoga / Strength / Cycling |
| 4 | Stats | `stats-section` | Members, classes/week, coaches |
| 5 | Featured Trainer | `features-alternating` | Lead trainer spotlight |
| 6 | Membership Preview | `pricing-minimal` | 3 tier preview |
| 7 | Testimonials | `testimonials-cards` | Member transformation stories |
| 8 | CTA | `cta-dark` | "Claim your free class" |
| 9 | Footer | `footer-corporate` | |

---

---

# Events & Venues

---

## 22. Gather — `events-gather` · FREE

**Design direction:** Warm gold and dark navy, elegant but accessible. Designed for event venues, wedding venues, conference centres, and party venues.

**Typography:** Serif for headlines, clean sans body. Elegant but not intimidating.

**Pages:** Home · Venue & Spaces · Weddings · Corporate Events · Contact & Enquiry

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Elegant Navbar | `navbar-hotel` | Gold accent CTA "Enquire Now" |
| 2 | Venue Hero | `hero-fullscreen-warm` | Full-screen venue photography (exterior or grand hall), minimal headline overlay |
| 3 | Venue Intro | `content-split-text-image` | Overview of the venue, capacity, unique features |
| 4 | Event Types | `features-cards` | Weddings · Corporate · Private Parties · Conferences · Celebrations |
| 5 | Gallery Strip | `gallery-masonry` | 6 photos across different event types |
| 6 | Testimonials | `testimonials-cards-warm` | 3 event client reviews |
| 7 | Awards & Features | `logos-press` | Wedding award badges, venue directories |
| 8 | Enquiry CTA | `cta-warm-banner` | "Planning an event? Let's talk." |
| 9 | Footer | `footer-hotel` | |

### Venue & Spaces
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Elegant Navbar | `navbar-hotel` | |
| 2 | Spaces Header | `hero-editorial-short` | |
| 3 | Space Cards | `cards-room-detailed` | One card per space: photo gallery, name, capacity (theatre/dinner/reception/standing), features list, AV spec, natural light note, enquire button |
| 4 | Outdoor Spaces | `features-alternating` | Gardens, terraces, outdoor areas |
| 5 | Facilities | `features-icon-grid` | Catering kitchen, AV, WiFi, parking, disabled access |
| 6 | Enquiry CTA | `cta-warm-banner` | |
| 7 | Footer | `footer-hotel` | |

### Weddings
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Elegant Navbar | `navbar-hotel` | |
| 2 | Wedding Hero | `hero-editorial-short` | Beautiful wedding photography |
| 3 | Wedding Packages | `pricing-cards` | 2–3 packages: Intimate · Classic · Grand — with guest numbers, inclusions, starting price |
| 4 | What's Included | `features-checklist` | Ceremony + reception · In-house catering · Dedicated coordinator · Accommodation |
| 5 | Real Weddings Gallery | `gallery-masonry` | |
| 6 | Testimonials | `testimonials-pull-quote` | 3 couple testimonials |
| 7 | FAQ | `content-faq` | Common wedding planning questions |
| 8 | Enquiry CTA | `cta-warm-banner` | "Book your date" |
| 9 | Footer | `footer-hotel` | |

### Corporate Events
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Elegant Navbar | `navbar-hotel` | |
| 2 | Corporate Hero | `hero-editorial-short` | Conference/meeting photography |
| 3 | Corporate Services | `features-cards` | Conferences · Meetings · Away Days · Product Launches · Awards Dinners |
| 4 | Spaces for Business | `cards-room-detailed` | Same as Venues page but filtered to corporate-appropriate spaces |
| 5 | Catering | `features-alternating` | In-house catering options, menus, dietary needs |
| 6 | Tech & AV | `features-icon-grid` | AV equipment, staging, lighting, WiFi, hybrid event support |
| 7 | Corporate Enquiry Form | `contact-form-split` | Company, event type, date, delegates, budget, notes |
| 8 | Footer | `footer-hotel` | |

### Contact & Enquiry
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Elegant Navbar | `navbar-hotel` | |
| 2 | Map | `contact-map-fullwidth` | |
| 3 | Enquiry Form | `booking-form-split` | Event type, preferred date, guest count, message — left. Right: contact details, team availability, response promise |
| 4 | Getting Here | `content-info-columns` | Directions by car, train, nearest airport |
| 5 | Footer | `footer-hotel` | |

---

---

# Corporate & Professional

---

## 23. Summit — `corp-summit` · PRO

**Design direction:** Corporate blue, clean white, authoritative and trustworthy. For mid-to-large businesses, consultancies, financial services, and professional service firms.

**Pages:** Home · Services · Case Studies · Team · Blog · Contact

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Corporate Navbar | `navbar-corporate` | Full nav, blue CTA |
| 2 | Enterprise Hero | `hero-enterprise` | Confident B2B headline, sub-headline, dual CTA (Get in touch / Our work) |
| 3 | Client Logos | `logos-trust` | Enterprise / recognisable client logos |
| 4 | Services Overview | `features-cards` | Core service pillars |
| 5 | Featured Case Study | `portfolio-case-study` | 1 featured client success story |
| 6 | Stats | `stats-section` | Years, clients, projects, retention rate |
| 7 | Team Preview | `team-horizontal` | Senior leadership strip |
| 8 | Blog Preview | `blog-minimal-featured` | 3 thought leadership articles |
| 9 | Testimonials | `testimonials-cards` | Director-level quotes |
| 10 | CTA | `cta-gradient` | |
| 11 | Footer | `footer-corporate` | |

---

---

# Local Business

---

## 24. LocalPro — `local-pro` · FREE

**Design direction:** Clean and trustworthy, adaptable colour accent. The universal template for local service businesses: plumbers, electricians, landscapers, cleaners, mechanics, solicitors, dentists, and tradespeople.

**Typography:** Approachable and legible. No-nonsense. Clear headings, easy-to-read body text.

**Layout logic:** Phone number and "Get a Quote" CTA visible above the fold on every page. Local credibility signals prominent (reviews, credentials, service area). Contact and booking are the primary conversion goals.

**Pages:** Home · Services · About · Contact & Quote

---

### Home
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Local Navbar | `navbar-local` | Logo, phone number prominently displayed, "Get a Quote" CTA |
| 2 | Hero | `hero-classic` | Clear service description, location, headline, "Call Us" + "Get a Free Quote" CTAs |
| 3 | Trust Bar | `features-icon-row` | 4 trust signals: Licensed & Insured · 5-star Reviews · Same-day Service · Free Quotes |
| 4 | Services | `features-cards` | 4–8 service cards with icon, name, brief description, "Learn More" link |
| 5 | Why Choose Us | `features-alternating` | 2 rows: experience/track record + customer satisfaction |
| 6 | Reviews | `testimonials-cards-warm` | 4 Google review cards with name, stars, excerpt |
| 7 | Service Area | `contact-map-fullwidth` | Map showing coverage area + "We serve [Town], [Town], [Town] and surrounding areas" |
| 8 | Credentials | `logos-trust` | Trade body memberships, certifications, insurance badges |
| 9 | Quote CTA | `cta-gradient` | Large "Get Your Free Quote Today" with phone number |
| 10 | Footer | `footer-local` | Name, phone, email, address, hours, service area list, social |

### Services
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Local Navbar | `navbar-local` | |
| 2 | Services Header | `hero-editorial-short` | |
| 3 | Service Detail Cards | `features-alternating` | Each service: photo, what's included, process, pricing indication, "Book Now" button |
| 4 | FAQ | `content-faq` | Common service questions |
| 5 | Quote CTA | `cta-gradient` | |
| 6 | Footer | `footer-local` | |

### About
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Local Navbar | `navbar-local` | |
| 2 | Business Story | `hero-split-panel` | Team or owner photo, business story, years trading |
| 3 | Credentials & Certifications | `features-checklist` | All qualifications, licences, insurance |
| 4 | Team | `team-grid-casual` | Owner + team members |
| 5 | Reviews | `testimonials-cards-warm` | |
| 6 | Footer | `footer-local` | |

### Contact & Quote
| Order | Section | Block Type | Notes |
|-------|---------|-----------|-------|
| 1 | Local Navbar | `navbar-local` | |
| 2 | Contact + Quote Form | `booking-form-split` | Left: full quote request form (name, contact, service needed, address, date, description). Right: phone, email, hours, response time promise |
| 3 | Map | `contact-map-fullwidth` | Office/base location + service area |
| 4 | Emergency Contact | `content-info-columns` | If 24/7 or emergency service: clear emergency callout |
| 5 | Footer | `footer-local` | |

---

---

# Implementation Notes

## New Block Types Required

| Block ID | Type | Used In |
|---------|------|---------|
| `hero-fullscreen-video` | hero | restaurant-ember, hotel-grand |
| `hero-fullscreen-dark` | hero | restaurant-lumiere, ecommerce-luxe |
| `hero-fullscreen-warm` | hero | hotel-villa, events-gather |
| `hero-hotel-fullscreen` | hero | hotel-haven |
| `hero-portfolio` | hero | portfolio-canvas |
| `hero-waitlist` | hero | startup-launch |
| `hero-editorial-short` | hero | all templates |
| `hero-editorial-long` | hero | restaurant-grove |
| `menu-list-with-photos` | menu | restaurant-ember, hotel-haven |
| `menu-editorial-dark` | menu | restaurant-lumiere |
| `menu-list-dark` | menu | restaurant-lumiere |
| `menu-cards-warm` | menu | restaurant-grove |
| `menu-list-warm` | menu | hotel-villa |
| `booking-engine-full` | booking | hotel-haven, hotel-grand |
| `booking-form-split` | booking | hotel-haven, hotel-villa, events-gather |
| `booking-form-dark-split` | booking | restaurant-lumiere |
| `ecommerce-product-gallery-full` | ecommerce | ecommerce-luxe |
| `ecommerce-product-grid-editorial` | ecommerce | ecommerce-luxe |
| `ecommerce-collections-editorial` | ecommerce | ecommerce-luxe |
| `ecommerce-seller-hero` | ecommerce | ecommerce-market |
| `ecommerce-seller-card` | ecommerce | ecommerce-market |
| `ecommerce-filter-bar-minimal` | ecommerce | ecommerce-luxe |
| `ecommerce-cart-multi-seller` | ecommerce | ecommerce-market |
| `navbar-hotel` | navbar | hotel-haven, events-gather |
| `navbar-hotel-luxury` | navbar | hotel-grand |
| `navbar-dark-luxury` | navbar | ecommerce-luxe |
| `navbar-ecommerce-full` | navbar | ecommerce-market |
| `navbar-local` | navbar | local-pro |
| `navbar-warm` | navbar | restaurant-grove, hotel-villa |
| `navbar-checkout` | navbar | ecommerce-shop, ecommerce-market |
| `cards-room-preview` | cards | hotel-haven, hotel-villa |
| `cards-room-detailed` | cards | hotel-haven, events-gather |
| `cards-room-preview-luxury` | cards | hotel-grand |
| `cards-room-detailed-luxury` | cards | hotel-grand |
| `cards-experience-luxury` | cards | hotel-grand |
| `cards-package` | cards | hotel-haven, hotel-grand |
| `cards-package-warm` | cards | hotel-villa |
| `gallery-masonry` | gallery | restaurant-ember, events-gather |
| `gallery-filterable` | gallery | restaurant-ember |
| `gallery-editorial-full` | gallery | ecommerce-luxe |
| `footer-restaurant` | footer | restaurant-ember, restaurant-grove |
| `footer-dark-restaurant` | footer | restaurant-lumiere |
| `footer-hotel` | footer | hotel-haven, events-gather |
| `footer-hotel-luxury` | footer | hotel-grand |
| `footer-villa` | footer | hotel-villa |
| `footer-ecommerce` | footer | ecommerce-shop |
| `footer-ecommerce-full` | footer | ecommerce-market |
| `footer-local` | footer | local-pro |
| `content-hours-block` | content | restaurant-grove |
| `content-host-welcome` | content | hotel-villa |
| `locations-card-grid` | content | restaurant-grove |
| `events-list-cards` | content | restaurant-grove |
| `ecommerce-delivery-info` | content | ecommerce-shop, ecommerce-market |
| `category-hero` | content | ecommerce-shop, ecommerce-market |
| `ecommerce-sort-bar` | content | ecommerce-market |

## Tier Distribution

| Tier | Count | Templates |
|------|-------|-----------|
| FREE | 13 | ember, grove, haven, villa, shop, pulse, prism, canvas, ink, launch, thrive, gather, local-pro |
| PRO | 9 | lumiere, grand, luxe, orion, atlas, folio, dispatch, boost, revive, summit |
| BIZ | 2 | market |

## Category Distribution

| Category | Count |
|----------|-------|
| Restaurant & Food | 3 |
| Hotel & Hospitality | 3 |
| E-Commerce | 3 |
| SaaS | 2 |
| Agency | 2 |
| Portfolio | 2 |
| Blog & Content | 2 |
| Startup | 2 |
| Health & Wellness | 2 |
| Events & Venues | 1 |
| Corporate | 1 |
| Local Business | 1 |
| **Total** | **24** |

## Design System Notes

**Spacing rhythm:** All templates use an 8px base grid. Section vertical padding should default to `py-24` (96px) for primary sections and `py-16` (64px) for secondary sections.

**Image aspect ratios:**
- Hero images: `16:9` or `21:9` (cinematic)
- Room/product cards: `4:3` or `1:1`
- Team/portrait photos: `3:4`
- Gallery photos: Mixed for masonry, `4:3` for uniform grids

**Color usage:**
- Accent colors should be used for CTAs, active states, hover states, and key highlights only — never as large background fills unless specified
- All dark templates should maintain WCAG AA contrast ratios
- Restaurant and hotel templates should use warm neutrals (not pure `#000000` / `#FFFFFF`) for a more human feel

**Mobile-first requirements:**
- Navbars: hamburger menu on mobile for all templates
- Product/room grids: 2-col mobile, 3-col tablet, 4-col desktop
- Hero booking bars: collapse to stacked form on mobile
- Menu tab bars: horizontally scrollable on mobile
