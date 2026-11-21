# The Craft Brewery: website

A premium, editorial website for The Craft Brewery in Bend, Oregon. It has six public pages, a product detail page and an admin panel. All content is managed in the database; nothing dynamic is hardcoded.

| Part | Stack | Folder |
|---|---|---|
| Website + admin | Next.js 14 (App Router, TypeScript) | `frontend/` |
| API | NestJS 10 + TypeORM | `backend/` |
| Database | SQLite (created and seeded on first start) | `database/app.sqlite` |

## Quick start

Requires Node.js 18.18+.

```bash
npm run install:all      # installs root, backend and frontend
npm run dev              # API on :4000, website on :3000
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin
  - Email: `admin@thecraftbrewery.local`
  - Password: `CraftBrewery!2026`
  - Change the password in **Settings** after first sign-in, and set a long random `JWT_SECRET` in `backend/.env` before deploying.

Other commands:

```bash
npm run build && npm start   # production build
npm run typecheck            # both apps
npm test                     # logic tests + front/back validation parity
npm run db:reset             # delete the database; it is re-seeded on next API start
```

Environment files: `backend/.env` (port, database path, CORS, JWT, admin seed, timezone, rate limit) and `frontend/.env.local` (`NEXT_PUBLIC_API_URL`, `API_URL`, `NEXT_PUBLIC_SITE_URL`). Templates are in the matching `.env.example` files.

## Pages

| Route | What's there |
|---|---|
| `/` | Hero cross-fade, brand introduction, featured lineup, brewery experience, brewing philosophy, gallery preview, visit band |
| `/products` | Style filter chips (mirrored in `?style=`), asymmetric product grid, empty state |
| `/products/[slug]` | Product detail: specs only when supplied, previous/next, related beers |
| `/our-story` | Story chapters, optional quote, brand values, photo strip |
| `/brewing-process` | General brewing intro, scroll-linked 7-stage timeline with expandable detail, ingredients |
| `/visit-us` | Address, copy and directions, hours, map, contact, visitor information, enquiry form |
| `/gallery` | Category filters, masonry grid, keyboard-accessible lightbox (← → Esc) |

Admin sections: Dashboard (with launch checklist), Enquiries, Products, Beer styles, Gallery, Page content and Settings. Every list supports create, edit, delete, search, filters, image upload, and loading, empty and error states.

## Honest placeholders: launch checklist

The brief supplied no beers, specs, hours, history or photos, so nothing has been invented. The admin **Dashboard** tracks each of these items:

1. **Phone number.** `+1 (182) 843-8647` uses area code 182, which is not a valid North American area code (Bend uses 541/458). Until it is marked verified in Settings, it shows as plain text with an "awaiting confirmation" note, it isn't tap-to-call, and it is left out of structured data.
2. **Opening hours.** Every day shows "[Hours to be confirmed]". There is no open/closed status until hours are entered and marked confirmed.
3. **Beers.** The 8 seeded beers are labelled **Sample** ("Sample Lager No. 1"…), with no ABV, IBU, ingredients or tasting notes. Empty specs are hidden and shown as "to be supplied". Replace each beer and untick *Sample product*.
4. **Photos.** Illustrated stand-ins are used for every photo slot, product and gallery item, and each is labelled "Photo to be supplied". Upload genuine photos only.
5. **Our Story.** The four chapters show dashed "to be supplied" notes. The quote section stays hidden until a real, approved quote is entered.
6. **Brand values.** These are proposed (Craftsmanship, Quality, Creativity, Community) and marked as awaiting confirmation.
7. **Visitor information** (parking, accessibility, groups, age rules, facilities): each item is marked "To be confirmed".
8. **Age gate.** It is on by default, asks for 21+, and is remembered for 30 days on the device. It is a courtesy check, not age verification. **The brewery must confirm it meets Oregon (OLCC) and any advertising-platform rules.**
9. **Privacy policy and terms.** The enquiry form collects personal data, so add a privacy policy URL in Settings. Footer links appear only once the URLs are set.
10. **Domain.** Set `NEXT_PUBLIC_SITE_URL` to the live domain for canonical URLs, Open Graph, the sitemap and structured data.
11. **Brewing process.** The process copy describes brewing in general, not this brewery's equipment or recipes, and says so on the page.

## Enquiries (Visit Us)

- Fields: name, email, optional phone, enquiry type, message, and a required consent checkbox.
- Validation runs in the browser and again on the API with identical messages. `npm run test:rules` proves the two match.
- Spam protection: a hidden honeypot field, a per-IP rate limit (`INQUIRY_RATE_LIMIT`), and duplicate-submission detection.
- The success card appears **only after the API confirms the save (201)**. It shows a reference (`TCB-yymmdd-XXXX`) and next actions (Get Directions / Explore Our Beers), and it never implies a booked visit.
- If the save fails, the form keeps what the visitor typed and offers an "Email Us Instead" fallback.
- In the admin panel you can filter, search, set status (new, responded or archived), add internal notes, reply by email, and export to CSV.

## No e-commerce

This site is informational only. It has no cart, checkout, pricing, delivery or online ordering, and no alcohol is sold through it.

## SEO and accessibility

- **Metadata:** every page has its own title, meta description and canonical URL. Product pages use `generateMetadata`. Open Graph and Twitter cards are set site-wide.
- **Crawling:** `/sitemap.xml` (static pages plus product pages) and `/robots.txt` (with `/admin` disallowed).
- **Structured data:** `Brewery` JSON-LD uses **verified data only**. It always includes the name, address and email. Phone and opening hours are added only once marked verified. It has no ratings or reviews.
- **Structure:** a skip link, landmarks, one `h1` per page, labelled controls, visible focus styles, an error summary linking to fields, and `aria-live` result counts.
- **Lightbox and age gate:** the lightbox traps focus and returns it when closed. The age gate is a modal with a focus trap.
- **Motion:** the hero cross-fade and photo strip have pause controls. They pause on hover, on focus and when the tab is hidden. With `prefers-reduced-motion` they are always still, and the *Living imagery* setting can turn them off entirely.

## Project layout

```
backend/src/       products, gallery, inquiries, content, settings, admin-auth, seed, common
frontend/app/      (site)/ public pages · admin/ panel · sitemap.ts · robots.ts
frontend/components/site   Header, Footer, HeroCarousel, ProductBrowser, Timeline, GalleryBrowser, EnquiryForm, AgeGate…
frontend/public/art        13 illustrated stand-ins (SVG)
design-source/             the approved design canvas files
scripts/                   logic tests and the validation parity check
```
