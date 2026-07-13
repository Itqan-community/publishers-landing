# New Tenant — Requirements Intake Form (FILLED)

> **Tenant:** `qiraat` — موقع قراءات القرآن  
> **Reciter:** الشيخ الدكتور مفتاح السلطني  
> **Reference UI:** Tahbeer (`tahbeer`) — same layout; green branding + Saltani content  
> **Status:** Filled from research + Figma CSS (`.temp/figma exported css.css`). Placeholders marked.

---

## 0. High-level decisions

| # | Question | Answer |
|---|----------|--------|
| 0.1 | Project / tenant name (Arabic) | موقع قراءات القرآن |
| 0.2 | Project / tenant name (English) | Quran Qiraat |
| 0.3 | Tenant ID (slug) | `qiraat` |
| 0.4 | Reuse Tahbeer template UX? | Yes — `template: "qiraat"` mirrors Tahbeer sections |
| 0.5 | Figma design? | Partial — home + mushafs frames exported to CSS |
| 0.6 | Figma file link | N/A (CSS export only) |
| 0.7 | RTL Arabic only? | Yes |
| 0.8 | Same Quranic project type? | Yes, identical structure (10 qiraahs, recitations, riwayahs) |
| 0.9 | Target launch date | TBD |
| 0.10 | Primary contact | TBD |

---

## 1. Domains & routing

| # | Field | Answer |
|---|-------|--------|
| 1.1 | Primary production domain | `https://qiraat.example.com` (PLACEHOLDER) |
| 1.2 | Additional domains | `https://qiraat.itqan.dev` (PLACEHOLDER) |
| 1.3 | Staging pattern | `staging--qiraat.example.com` (auto) |
| 1.4 | Default tenant on generic host? | No — path `/qiraat` |
| 1.5 | X-Tenant header domain | TBD — use `domain` from config until overridden |

---

## 2. Backend API (CMS)

| # | Field | Answer |
|---|-------|--------|
| 2.1–2.3 | API URLs | Same as Tahbeer staging/production CMS endpoints |
| 2.4 | CMS tenant provisioned? | No / In progress |
| 2.5 | CMS notes | Wire real X-Tenant when ready |
| 2.6 | Mock fallback? | No (use API; empty/coming-soon when unavailable) |

---

## 3. Branding & colors (from Figma CSS)

| Token | Hex |
|-------|-----|
| primaryColor | `#9DCF68` |
| secondaryColor | `#2A5B39` |
| accentColor | `#193624` |
| Supporting | `#004022`, `#EEF9F2`, `#25E47B` |

| Field | Answer |
|-------|--------|
| Font | Fustat (same as Tahbeer) |
| Header / Hero / Footer | Same as Tahbeer (`legacy`) |
| Hero background | Reuse `/images/hero-bg.svg` |
| Mushaf cards | Green appearance (`#EEF9F2` band + green mushaf icon + `#193624` CTA) |

---

## 4. Assets

| Asset | Path |
|-------|------|
| Logo | `/logos/qiraat-logo.svg` (placeholder) |
| Favicon | `/favicons/qiraat.ico` (SVG placeholder; browsers accept SVG via `.ico` path or use SVG) |
| Hero | `/images/qiraat/hero-img.svg` (placeholder) |
| OG / Twitter | `/images/qiraat/og-image.svg`, `/images/qiraat/twitter-image.svg` |
| Sponsors | None — section hidden |

---

## 5. SEO

| Field | Answer |
|-------|--------|
| Title | موقع قراءات القرآن - الشيخ مفتاح السلطني |
| Description | منصة للاستماع إلى تسجيلات القرآن الكريم بالقراءات العشر الكبرى والصغرى بصوت الشيخ الدكتور مفتاح السلطني. |
| Keywords | قراءات القرآن، مفتاح السلطني، القراءات العشر، القرآن الكريم، مصاحف مرتلة، روايات، تلاوات قرآنية |
| Twitter card | summary_large_image |

---

## 6. Analytics

| Field | Answer |
|-------|--------|
| GA4 | None (omit until provided) |

---

## 7. Features

speakers ✅ · statistics ✅ · readings ✅ · media ✅ · newsletter ❌ · governmentBanner ❌

---

## 8. Navigation (same as Tahbeer)

الرئيسية · القراءات العشر · فكرة المشروع · لجنة المراجعة

---

## 9. Hero

| Field | Answer |
|-------|--------|
| Title | موقع قراءات القرآن |
| Description | مشروع تسجيل القرآن الكريم بالقراءات العشر الكبرى والصغرى بصوت الشيخ الدكتور مفتاح السلطني |
| CTA | استمع الآن → `/recitations` |
| Stats card | كافة / القراءات / بالروايات المتواترة |

---

## 10. About

1. ١٠ قراءات — القراءات العشر المتواترة عن الأئمة العشرة  
2. جودة عالية — تسجيلات بجودة صوتية استثنائية لأفضل تجربة استماع  
3. الروايات المتواترة — روايات متواترة عن كل إمام من الأئمة العشرة  
4. القراءات الكبرى والصغرى — أول من سجّل القراءات العشر الكبرى والصغرى في العالم الإسلامي  

---

## 11. Ten Readings

Same canonical 10 qiraahs as Tahbeer (`lib/ten-qiraahs.ts`).

---

## 12. Project Idea

| Field | Answer |
|-------|--------|
| Section title | فكرة المشروع والمشاركون |
| Subtitle | تسجيل صوتي للقراءات العشر الكبرى والصغرى بكل طرق الأداء المنقولة عن الأئمة |
| Idea | انطلق موقع قراءات القرآن من رؤية لإتاحة مرجع صوتي موثوق للقراءات العشر، وذلك بتسجيلات الشيخ الدكتور مفتاح السلطني الذي يُعدّ من أوائل من سجّلوا القراءات العشر الكبرى والصغرى في العالم الإسلامي. يهدف الموقع إلى خدمة طلاب العلم والمهتمين بعلم القراءات، ونشر هذا العلم الشريف بطريقة ميسرة ومتاحة للجميع. |
| Participants | القارئ — الشيخ الدكتور مفتاح السلطني — مقرئ بالقراءات العشر الكبرى والصغرى |

---

## 13. Review Committee

Task-based only (no invented member names). Same four review tasks as Tahbeer pattern, adapted subtitle about Saltani recordings.

---

## 14. Sponsors

None — hide section.

---

## 15–16. Statistics / Footer

Statistics placeholders in config (not rendered on Tahbeer-like home).  
Footer description about the platform; YouTube `https://www.youtube.com/c/moftahelsaltani` (confirm later); copyright ١٤٤٧.

---

## Research notes (مفتاح السلطني)

- Born 21 May 1973, Benghazi, Libya  
- Reciter + physician (internal medicine / nephrology)  
- Memorized Quran 1999; ijazahs in ten qiraahs (major & minor)  
- Honored Libya Ramadan 1444 / 17 Apr 2023 as first to record major & minor ten qiraahs  
- Sources: ar.wikipedia.org, Assabile, NourElQuran, Midad  

---

*Filled for implementation — 2026-07-13*
