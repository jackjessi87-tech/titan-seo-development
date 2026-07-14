# Titan Express Furniture Pickup & Delivery — Technical SEO Audit
**Site:** https://www.titanexpress.com.au | **Platform:** Shopify | **Date:** July 15, 2026

## Methodology & Verification Note

This audit is based on **live crawling** of the following URLs, plus Google index inspection via `site:` search operators:
- `https://www.titanexpress.com.au/` (homepage)
- `https://www.titanexpress.com.au/pages/man-with-a-van-sydney`
- `https://www.titanexpress.com.au/policies/privacy-policy`
- ~15 legacy suburb URLs discovered via Google index (e.g. `titanexpress.com.au/furniture-delivery-lane-cove/`, `/furniture-delivery-rockdale/`)

**What I could NOT verify directly** (and am explicitly flagging rather than guessing): `robots.txt` contents, `sitemap.xml` contents, raw HTTP response headers (security headers, redirect codes beyond 404s I could reproduce), Core Web Vitals / PageSpeed scores, JS-rendering behavior in a real browser, and raw HTML source (my fetch tool renders extracted content, not view-source — so JSON-LD/schema presence could not be confirmed either way). Each of these is called out individually below with what's needed to close the gap (mainly: a Screaming Frog export, PageSpeed Insights run, or Search Console access).

---

## 🚨 Headline Finding (affects 8+ categories below)

**The site appears to have migrated to Shopify without redirecting its old location pages.** Google's index still contains at least 15 suburb-specific URLs on the bare domain (no `www`, no `/pages/` prefix) — e.g. `/furniture-delivery-lane-cove/`, `/furniture-delivery-rockdale/`, plus indexed references to Parramatta, Eastern Suburbs, Inner West, Burwood, Hurstville, The Hills District, Chatswood, Strathfield, Bankstown, Penrith, Auburn, Sutherland, Blacktown, Macarthur, Hornsby, Ryde, and Liverpool pages. **Every one of these returns a live 404** when fetched today, and none of their content exists anywhere on the current `www.titanexpress.com.au/pages/` structure. This single issue is the root cause of the Crawlability, Indexability, Redirects, Orphan Pages, and Site Architecture problems below — fix this first.

---

## Detailed Findings

### 1. Crawlability
| | |
|---|---|
| **Issue** | ~15+ previously-indexed suburb URLs return HTTP 404 (confirmed by direct fetch) |
| **Why it matters** | Google spends crawl budget hitting dead ends instead of your real pages, and any topical/local relevance those pages had built up is being wasted |
| **SEO Impact** | **Critical** |
| **Recommended fix** | Rebuild each suburb as a real page on the current Shopify site (or at minimum 301 redirect the old URL to the closest live equivalent — e.g. the homepage or a new location page) |
| **Expected ranking impact** | High — recovers lost local-intent visibility for every suburb query these pages used to target |

### 2. Indexability
| | |
|---|---|
| **Issue** | Dead suburb URLs are still showing in Google's index (confirmed via `site:titanexpress.com.au` search) despite 404ing live |
| **Why it matters** | Users clicking these results in search hit a dead page — pure lost traffic, and it signals site instability to Google during recrawl |
| **SEO Impact** | **Critical** |
| **Recommended fix** | Once redirects/rebuilt pages are live, request re-indexing via Search Console URL Inspection for each affected URL |
| **Expected ranking impact** | High — stops active traffic and trust bleed |

### 3. Robots.txt
| | |
|---|---|
| **Issue** | Could not be fetched directly — not verifiable in this session |
| **Why it matters** | An overly broad `Disallow` rule could be silently blocking Shopify collection/product paths or, worse, real content |
| **SEO Impact** | Unknown — flagged for verification |
| **Recommended fix** | Paste the contents of `https://www.titanexpress.com.au/robots.txt` here, or run a Screaming Frog crawl and export — I'll review it directly |
| **Expected ranking impact** | N/A until verified |

### 4. XML Sitemap
| | |
|---|---|
| **Issue** | Could not be fetched directly — not verifiable in this session. Shopify auto-generates `/sitemap.xml` by default, but I can't confirm it's intact, submitted, or free of the dead suburb URLs |
| **Why it matters** | If the sitemap still lists the dead suburb URLs, it's actively telling Google to keep crawling 404s |
| **SEO Impact** | High (pending verification) |
| **Recommended fix** | Share the sitemap URL/export, or check Search Console → Sitemaps for submission status and error count |
| **Expected ranking impact** | N/A until verified |

### 5. Canonical Tags
| | |
|---|---|
| **Issue** | None found — all 3 crawled pages have correct, self-referencing canonicals (e.g. `https://www.titanexpress.com.au/pages/man-with-a-van-sydney`) |
| **Why it matters** | This is working correctly and prevents `www`/non-`www` duplicate-content confusion on live pages |
| **SEO Impact** | Low (currently healthy) |
| **Recommended fix** | None needed on pages checked — re-verify once new location pages are built |
| **Expected ranking impact** | N/A — maintain current practice |

### 6. Meta Titles
| | |
|---|---|
| **Issue** | Homepage title is "Titan Express \| Furniture Removalists Sydneywide" — leads with "Removalists," but your primary listed services (Furniture Delivery, Marketplace Pickup, Man and Van) are delivery-first, not full removalist-first |
| **Why it matters** | Title tag relevance is one of the strongest on-page ranking signals; if "furniture delivery Sydney" is a priority keyword, it should appear in the homepage title |
| **SEO Impact** | Medium |
| **Recommended fix** | Test a title like "Furniture Delivery & Removalist Sydney \| Titan Express" to cover both intents. The Man With a Van page title is actually well-optimized ("Man With a Van Sydney \| Same-Day Removalists from $89 \| Titan Express") — use it as the template |
| **Expected ranking impact** | Medium — better keyword-intent match on the homepage |

### 7. Meta Descriptions
| | |
|---|---|
| **Issue** | Homepage and Privacy Policy page share the **same** meta/OG description ("Professional furniture removalists serving Sydneywide...") — strong signal this is a theme-wide fallback rather than page-specific copy |
| **Why it matters** | Duplicate descriptions waste a CTR opportunity on every page that isn't the homepage, and can contribute to Google rewriting your snippet |
| **SEO Impact** | Medium |
| **Recommended fix** | Write unique meta descriptions per page (utility pages like Privacy Policy can stay generic, but every service/location page needs its own) |
| **Expected ranking impact** | Low-Medium — mainly a CTR gain, not a rankings gain |

### 8. H1–H6 Heading Structure
| | |
|---|---|
| **Issue** | The Man With a Van page has **three separate H1-level headings** on one page: "Man With a Van Sydney," "Man With a Van Sydney \| Same-Day Furniture Removalists," and "Man With a Van Sydney – Fast, Reliable & Affordable" |
| **Why it matters** | Multiple H1s dilute topical signal and make it ambiguous to Google (and screen readers) what the page's single primary heading is |
| **SEO Impact** | Medium |
| **Recommended fix** | Keep one true H1 near the top of the page; demote the other two to H2s. This is a common Shopify issue where each theme "section" (hero, content block) outputs its own H1 |
| **Expected ranking impact** | Medium — cleaner topical signal for on-page relevance |

### 9. Duplicate Titles & Descriptions
| | |
|---|---|
| **Issue** | Meta descriptions confirmed duplicated (see #7); title duplication can't be ruled out site-wide without a full crawl export, but risk is high once suburb pages are rebuilt from a template |
| **Why it matters** | Google may suppress/merge near-duplicate pages in results, capping how many of your pages can rank simultaneously |
| **SEO Impact** | Medium-High |
| **Recommended fix** | When you rebuild suburb pages, build each with a **unique title formula** (e.g. "Furniture Delivery in [Suburb] \| Titan Express") and unique intro content — see #10 |
| **Expected ranking impact** | Medium-High once location pages return |

### 10. Thin Content
| | |
|---|---|
| **Issue** | Stark content imbalance: the homepage is mostly UI/quote-widget with little body copy, while the Man With a Van page is rich (FAQs, pricing table, comparison table, ~700+ words). No dedicated pages exist yet for Facebook Marketplace Pickup, Single Item Delivery, Appliance Delivery, or Same Day Delivery — despite these being core listed services |
| **Why it matters** | Thin or missing pages can't rank for their target terms — you're currently relying entirely on the homepage and one service page to cover 7 distinct services |
| **SEO Impact** | **Critical** |
| **Recommended fix** | Build one dedicated page per service, using the Man With a Van page as the content template (FAQ + pricing + comparison table format) |
| **Expected ranking impact** | High — this is likely your single biggest content-side opportunity |

### 11. URL Structure
| | |
|---|---|
| **Issue** | Current live structure (`/pages/man-with-a-van-sydney`) is reasonable but not used consistently yet since only one service page exists. Old dead URLs used flat root-level slugs (`/furniture-delivery-lane-cove/`) that weren't preserved |
| **Why it matters** | Consistent, descriptive URLs help both users and search engines understand site hierarchy |
| **SEO Impact** | Low-Medium |
| **Recommended fix** | Standardize on `/pages/[service]-sydney` for services and `/pages/furniture-delivery-[suburb]` for locations going forward |
| **Expected ranking impact** | Low direct impact, but supports the content build-out above |

### 12. Internal Linking
| | |
|---|---|
| **Issue** | The Man With a Van page — your best content asset — is linked from the footer only, not from homepage body content or a visible main navigation in the crawled HTML |
| **Why it matters** | Weak internal linking limits how much authority flows from the homepage to your most important service pages |
| **SEO Impact** | High |
| **Recommended fix** | Add a services grid/menu on the homepage linking to each service page (once built), plus contextual links between related service and location pages |
| **Expected ranking impact** | Medium-High — directly supports indexing and ranking of new pages |

### 13. Breadcrumbs
| | |
|---|---|
| **Issue** | Visible breadcrumb-style text exists on the Man With a Van page ("SydneyWide › Man With a Van Sydney") but I could not confirm whether this is backed by `BreadcrumbList` schema (requires view-source, not available to me) |
| **Why it matters** | Breadcrumb schema enables the breadcrumb trail rich result in search and reinforces site hierarchy to Google |
| **SEO Impact** | Low-Medium (pending verification) |
| **Recommended fix** | Confirm with Google's Rich Results Test; if missing, add `BreadcrumbList` JSON-LD |
| **Expected ranking impact** | Low-Medium — mostly a SERP appearance improvement |

### 14. Image Optimisation
| | |
|---|---|
| **Issue** | Inconsistent file naming (`Sofa_Removalist.png`, `Snag_6b799a5c.png` — the latter is a raw screenshot filename); can't verify compression/file size without dev tools |
| **Why it matters** | Descriptive, hyphenated filenames are a minor but free relevance signal; unoptimized images hurt page speed |
| **SEO Impact** | Low |
| **Recommended fix** | Rename source images before upload (`sofa-delivery-parramatta.jpg` not `Snag_6b799a5c.png`); run new uploads through Shopify's automatic WebP conversion (on by default in most current themes — verify it's active) |
| **Expected ranking impact** | Low direct, supports #16/#18 |

### 15. Image Alt Text
| | |
|---|---|
| **Issue** | Mixed — several images have good descriptive alt text (e.g. "Sofa Delivery delivery service from Parramatta → Strathfield"), but at least 2 images on the Man With a Van page have **empty alt attributes** |
| **Why it matters** | Alt text is an accessibility requirement and a minor image-search/relevance signal |
| **SEO Impact** | Low-Medium |
| **Recommended fix** | Audit all images in Shopify admin and fill blank alt fields with descriptive, non-keyword-stuffed text |
| **Expected ranking impact** | Low |

### 16. Core Web Vitals
| | |
|---|---|
| **Issue** | **Not verifiable in this session** — requires PageSpeed Insights, CrUX data, or Lighthouse, none of which I have live access to |
| **Recommended fix** | Run https://pagespeed.web.dev/ against the homepage and Man With a Van page and share the LCP/INP/CLS scores — I'll interpret and prioritize fixes from there |

### 17. Mobile Usability
| | |
|---|---|
| **Issue** | Viewport meta tag is correctly configured (`width=device-width, initial-scale=1`) — a healthy baseline. Full mobile usability (tap target sizing, text scaling, layout shifts) not verifiable without Google's Mobile-Friendly Test or a real device |
| **SEO Impact** | Low risk based on what's verifiable; unknown beyond that |
| **Recommended fix** | Run the site through Search Console's Mobile Usability report and share results |

### 18. Page Speed
| | |
|---|---|
| **Issue** | **Not verifiable in this session** — same limitation as Core Web Vitals |
| **Recommended fix** | Same as #16 |

### 19. JavaScript Rendering Issues
| | |
|---|---|
| **Issue** | Several CTA "chip" links on the Man With a Van page ("Same-Day Moves," "Marketplace Pickup," "Single Item Moves," "All Sydney Suburbs," "Call Now") resolve to **empty `href` attributes** in the rendered markup |
| **Why it matters** | If these are meant to be real internal links (e.g. to service pages), they currently pass zero link equity and are invisible to crawlers as links — likely a theme/JS binding issue where the intended `href` never got set |
| **SEO Impact** | Medium |
| **Recommended fix** | Check the theme code for these CTA chips — either give them real destination URLs or convert them to non-link UI elements if they're just visual filters |
| **Expected ranking impact** | Low-Medium — mainly an internal-linking equity fix once service pages exist to link to |

### 20. CSS Issues Affecting SEO
| | |
|---|---|
| **Issue** | **Not verifiable in this session** — requires dev tools / render-blocking resource inspection |
| **Recommended fix** | Run a Lighthouse audit; I'll interpret render-blocking CSS findings if you share them |

### 21. Structured Data Currently Implemented
| | |
|---|---|
| **Issue** | **Could not be confirmed either way** — my fetch tool extracts rendered content, not raw HTML source, so JSON-LD blocks (which live in `<script>` tags) don't surface in what I can see |
| **Why it matters** | This is foundational for rich results and AI Overview eligibility |
| **Recommended fix** | Run the homepage and Man With a Van page through Google's Rich Results Test (https://search.google.com/test/rich-results) and paste the results here — I'll validate every field against best practice |

### 22. Missing Schema Opportunities
| | |
|---|---|
| **Issue** | Independent of what's currently implemented, clear content exists that isn't yet (confirmed) marked up: a 5-question FAQ block on the Man With a Van page, a visible "5.0 (58)" star rating, and structured pricing tiers (Single Item/Small Move/Medium Move/Marketplace Pickup) |
| **Why it matters** | `FAQPage`, `AggregateRating`/`Review`, and `Service`/`Offer` schema are direct, low-effort levers for rich results and AI Overview extraction |
| **SEO Impact** | High |
| **Recommended fix** | Add `LocalBusiness` (or `MovingCompany`) schema site-wide, plus `FAQPage` and `Service` schema on every service page, and `BreadcrumbList` |
| **Expected ranking impact** | Medium-High for AI/rich-result visibility specifically |

### 23. Pagination
| | |
|---|---|
| **Issue** | Not directly applicable — no blog or multi-page collections found. However, the Shopify **product catalog is active but empty** ("No products found" / "View all" on search) |
| **Why it matters** | An active but empty commerce catalog can generate crawlable, zero-value `/collections/` and `/search` pages for a business that sells services, not products |
| **SEO Impact** | Low-Medium |
| **Recommended fix** | If the store isn't selling physical products, disable/hide the product catalog and on-site search results page, or noindex those paths |
| **Expected ranking impact** | Low — mainly a crawl-budget cleanup |

### 24. Redirects (301/302)
| | |
|---|---|
| **Issue** | There are effectively **no redirects** from the old suburb URLs — they return straight 404s instead of 301s to their new equivalents |
| **Why it matters** | This is the direct mechanism behind the Headline Finding — without redirects, all prior ranking signal for those URLs is lost rather than transferred |
| **SEO Impact** | **Critical** |
| **Recommended fix** | Set up 301 redirects (Shopify Admin → Online Store → Navigation → URL Redirects) from every dead suburb URL to its rebuilt equivalent, or to the homepage if no direct replacement exists yet |
| **Expected ranking impact** | High |

### 25. Broken Internal Links
| | |
|---|---|
| **Issue** | The empty-href CTA chips from #19 |
| **SEO Impact** | Medium |
| **Recommended fix** | Same as #19 |

### 26. Broken External Links
| | |
|---|---|
| **Issue** | None found in pages checked — the Google Reviews footer link resolves correctly |
| **SEO Impact** | Low (currently healthy on what was checked) |

### 27. Orphan Pages
| | |
|---|---|
| **Issue** | The Man With a Van page — arguably the site's strongest content — is only reachable via a single footer link, not from homepage body content |
| **Why it matters** | Weakly-linked important pages get less crawl priority and pass/receive less internal authority |
| **SEO Impact** | Medium-High |
| **Recommended fix** | Same as #12 — surface it in primary navigation and homepage content |

### 28. Canonical Conflicts
| | |
|---|---|
| **Issue** | None found on currently live pages. Risk exists if the dead non-`www` suburb URLs ever get resurrected without pointing back to `www` |
| **SEO Impact** | Low currently |
| **Recommended fix** | When rebuilding, always build under `www.titanexpress.com.au` and never reintroduce the bare-domain structure |

### 29. Noindex Pages
| | |
|---|---|
| **Issue** | Not verifiable — meta robots directives don't surface in extracted content |
| **Recommended fix** | Check Search Console → Pages report for "Excluded by noindex tag" count |

### 30. HTTPS Configuration
| | |
|---|---|
| **Issue** | None found — all pages checked load correctly over HTTPS |
| **SEO Impact** | Low (healthy) |

### 31. Security Headers Affecting SEO
| | |
|---|---|
| **Issue** | Not verifiable — raw response headers aren't exposed by my fetch tool |
| **Recommended fix** | Run https://securityheaders.com/ against the domain and share the result |

### 32. Open Graph & Social Metadata
| | |
|---|---|
| **Issue** | Present and reasonably complete (og:title, og:description, og:image at 1536×1024, twitter:card) on every page checked. The og:image primary URL uses `http://` while a `secure_url` variant is also provided — functionally fine but worth normalizing to https-only |
| **SEO Impact** | Low |
| **Recommended fix** | Minor cleanup: standardize the primary `og:image` to the https URL |

### 33. Shopify-Specific SEO Issues
| | |
|---|---|
| **Issue** | (a) Empty `theme-color` meta tag — minor mobile browser-chrome polish item. (b) Active-but-empty product catalog (see #23). (c) No suburb/service page templates being used at scale despite Shopify supporting unlimited `/pages/` |
| **SEO Impact** | Low-Medium |
| **Recommended fix** | Set a brand-color `theme-color`; hide/disable unused commerce features; build out page templates for services and locations |

### 34. Local SEO Technical Factors
| | |
|---|---|
| **Issue** | **NAP inconsistency confirmed**: the website's Privacy Policy contact section lists "10 Plumpton Rd, Plumpton NSW 2761" — this does not match the address on file for the Google Business Profile (48 Dudley St, Punchbowl NSW 2195). No `LocalBusiness` schema confirmed anywhere on the site (see #21). No suburb landing pages currently live |
| **Why it matters** | NAP consistency across GBP, website, and citations is a core local ranking (prominence) signal — a mismatch actively works against you |
| **SEO Impact** | **Critical** |
| **Recommended fix** | Reconcile which address is correct/current, then make it identical everywhere: GBP, website footer, Privacy Policy contact line, and any citations |
| **Expected ranking impact** | High |

### 35. AI Search Readiness
| | |
|---|---|
| **Issue** | The Man With a Van page already has a genuinely strong asset for this: a clean, directly-answered FAQ block ("How much does a man with a van cost in Sydney?" etc.) and a clear comparison table. This format is exactly what AI Overviews/AI Mode like to extract — but it exists on only 1 of 7+ services, and schema backing is unverified |
| **SEO Impact** | High opportunity, currently under-leveraged |
| **Recommended fix** | Replicate the FAQ + direct-answer format across every service and location page; confirm/add `FAQPage` schema |
| **Expected ranking impact** | Medium-High for AI Overview/AI Mode visibility specifically |

### 36. Google AI Overview Readiness
| | |
|---|---|
| **Issue** | Same underlying asset as #35 — concise, factual, price-transparent answers are present but concentrated on one page |
| **SEO Impact** | High opportunity |
| **Recommended fix** | Same as #35, plus ensure pricing stays current since AI Overviews favor freshness on price-sensitive queries |

---

## Technical SEO Roadmap

### Phase 1 — Critical Fixes (Weeks 1–2)
1. Set up 301 redirects from all ~15+ dead suburb URLs to live equivalents (#24)
2. Reconcile and fix the NAP mismatch between website and GBP (#34)
3. Request re-indexing of fixed URLs via Search Console (#2)
4. Verify and share `robots.txt` and `sitemap.xml` contents (#3, #4)

### Phase 2 — High-Impact Improvements (Weeks 3–6)
5. Build dedicated service pages for the 6 services currently without one, using the Man With a Van page as the content template (#10)
6. Fix internal linking — add homepage navigation/content links to all service pages (#12, #27)
7. Add `LocalBusiness`, `Service`, and `FAQPage` schema site-wide (#21, #22)
8. Fix the multiple-H1 issue on templated pages (#8)

### Phase 3 — Optimisation (Weeks 7–10)
9. Rebuild priority suburb pages (start with the highest-population/highest-intent suburbs from the old list: Parramatta, Chatswood, Hurstville, Penrith, Bankstown)
10. Write unique meta titles/descriptions per page, eliminating the current duplication (#6, #7, #9)
11. Fill in missing image alt text and rename source image files (#14, #15)
12. Fix the empty-href CTA chip links (#19, #25)
13. Disable/hide the unused Shopify product catalog (#23)

### Phase 4 — Advanced Improvements (Ongoing)
14. Run and act on PageSpeed Insights / Core Web Vitals data once available (#16, #18)
15. Run and act on a security headers scan (#31)
16. Add `BreadcrumbList` schema and verify via Rich Results Test (#13)
17. Expand the FAQ/AI-Overview-friendly content format across every service and suburb page (#35, #36)
18. Ongoing: monitor Search Console for new crawl errors as pages are added

---

## Category Scores

| Category | Score /10 | Basis |
|---|---|---|
| Crawlability | **3/10** | Confirmed dead, indexed URLs actively harming crawl efficiency |
| Technical SEO | **4/10** | Canonicals and HTTPS are healthy; schema, redirects, and duplication are not |
| Site Architecture | **3/10** | Only 1 of 7+ services has a dedicated page; weak internal linking; no location pages |
| Performance | **N/A — insufficient data** | Core Web Vitals/PageSpeed not verifiable without additional tool access |
| Mobile SEO | **6/10 (partial)** | Viewport tag healthy; full mobile usability unverified |
| Local SEO (technical) | **3/10** | Critical NAP mismatch found; no location pages; schema unconfirmed |
| AI Search Readiness | **5/10** | Strong FAQ/answer format exists but is concentrated on a single page |
| **Overall SEO Score** | **4/10** | Foundational elements (HTTPS, canonicals, OG tags) are solid, but a botched migration has created critical indexability, redirect, and content-coverage gaps that need Phase 1 attention immediately |

*Performance is intentionally left ungraded rather than estimated — I don't guess at Core Web Vitals without a real Lighthouse/PSI run.*

---

## What I need from you to close the verification gaps

1. `robots.txt` contents (or a Screaming Frog crawl export)
2. `sitemap.xml` contents / Search Console Sitemaps report
3. A PageSpeed Insights run (homepage + Man With a Van page)
4. Google's Rich Results Test output for the homepage
5. Confirmation of which address is correct: 48 Dudley St, Punchbowl vs. 10 Plumpton Rd, Plumpton
