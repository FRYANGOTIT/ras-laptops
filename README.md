# RAS Solutions — website

Plain HTML, CSS and JavaScript. No framework, no npm, no build step. Drag the whole
folder onto any host (Netlify, Cloudflare Pages, GitHub Pages, cPanel, anything) and
it works.

```
index.html      the product list
about.html      company page, the one AI assistants read
style.css
app.js          CONFIG and all wording live at the top of this file
llms.txt        plain-text summary for AI crawlers
robots.txt
sitemap.xml
images/         product photos
```

Everything you are likely to change is in the `CONFIG` block at the very top of
`app.js`. You should not need to touch the HTML or the CSS for day-to-day work.

---

## 1. Change your links (Instagram, Facebook, TikTok, WhatsApp)

Open `app.js`. The first thing in `CONFIG` is the links block:

```js
links: {
  whatsapp:  '96176792834',                         // digits only, no + and no spaces
  instagram: 'https://www.instagram.com/lb_ras/',
  facebook:  '',    // <-- paste your Facebook page URL here
  tiktok:    ''     // <-- paste your TikTok profile URL here
}
```

Paste the full URL between the quotes and save. That one change updates:

- the icons in the footer,
- the links shown when the product list cannot load,
- the `sameAs` list in the structured data, which is how Google and AI assistants
  learn that the site, the Instagram page and the TikTok page are the same business.

**A line left empty simply does not appear.** Facebook and TikTok are empty right
now, so those two icons are hidden until you paste the URLs in. Nothing breaks in
the meantime — there is no dead link anywhere.

The WhatsApp number is digits only, international format: `961` + the number without
its leading zero. It is used for every WhatsApp button on the site. The number as
printed on the page is separate, in `whatsappDisplay`, so you can format it however
you like.

---

## 2. Connect the Google Sheet

**Publish the sheet as CSV**

1. Open your inventory sheet in Google Sheets.
2. **File → Share → Publish to web.**
3. In the first dropdown pick the **tab** that holds the inventory (not "Entire document").
4. In the second dropdown pick **Comma-separated values (.csv)**.
5. Press **Publish** and confirm. Copy the link it gives you.

It looks like this:

```
https://docs.google.com/spreadsheets/d/e/2PACX-1vQxxxxxxxxxxxx/pub?gid=0&single=true&output=csv
```

**Paste it into `CONFIG.sheetCsvUrl` in `app.js`.** That is the only change needed.

> Google can take a couple of minutes to refresh a published CSV after you edit the
> sheet. If a change does not show up straight away, wait and reload.

**Sheet columns** — first row must be the header row, spelled exactly like this:

| column     | meaning                                              |
| ---------- | ---------------------------------------------------- |
| `category` | `laptop`, `2-in-1`, `desktop`, `monitor`, `dock`, `accessory` |
| `model`    | `Dell Latitude 7430`                                 |
| `spec_en`  | `i5 12th gen / 16GB / 512GB / 14"`                   |
| `spec_ar`  | the Arabic version of the same line                  |
| `price`    | number in USD, no `$` sign                           |
| `image`    | filename only, e.g. `latitude-7430.jpg`              |
| `stock`    | number                                               |
| `touch`    | `yes`, or leave blank                                |
| `note_en`  | optional, e.g. `two colors`                          |
| `note_ar`  | optional, the Arabic version of the note             |

Notes:

- Commas inside a cell are fine. So are quotes, so `14"` works.
- `touch = yes` adds the tag **Touch, flips into tablet** / **تاتش وبينفتل**.
- Cheapest first inside each section.
- If `spec_ar` or `note_ar` is empty, the Arabic page falls back to the English one.

---

## 3. Categories

The sections of the shop are a list in `CONFIG.categories`:

```js
categories: [
  { key: 'laptop',    match: ['laptops', 'notebook'],  en: 'Laptops',  ar: 'لابتوبات' },
  ...
]
```

- `key` is what you type in the sheet's `category` column.
- `match` is a list of other spellings that should land in the same section, so
  `Laptops`, `laptop` and `notebook` all work.
- `en` and `ar` are the section heading and the filter chip label.

**To add a section**, copy a line and change it. **To reorder the shop**, move the
lines around — sections appear in this order. **To rename one**, edit `en` and `ar`.

Two things are automatic and worth knowing:

- A section with nothing in stock does not appear at all, and neither does its chip.
- A category in the sheet that matches nothing here goes into an **Other** section
  rather than disappearing, so a typo can never hide a product you are trying to sell.

The filter chips above the list only show up when there are at least two sections
with stock. With one section they would just be noise.

---

## 4. Prices

Every price on the site is written by one setting:

```js
priceFormat: '${n}',   // $330      change to '{n}$' for 330$
```

`{n}` is the number from the sheet. Change it once and every price changes — cards,
both languages, everywhere — so the site always matches how prices are written in
your ads.

---

## 5. Stock badges

Driven by the `stock` column, with no extra work:

| stock in the sheet | badge on the card                        |
| ------------------ | ---------------------------------------- |
| `0` or blank       | product is hidden entirely               |
| `1`                | **Last one** / **آخر قطعة** — red        |
| `2`                | **2 left** / **باقي 2** — red            |
| `3` or more        | **In stock** / **متوفّر** — green, no fill |

The red threshold is `CONFIG.lowStockAt` (currently `2`). Red is used nowhere else
on the site, so a red badge always means the same thing.

---

## 6. Add a photo

1. Name the file after the product, lowercase, with dashes: `latitude-7430.jpg`.
2. Drop it into the `images/` folder.
3. Put that same filename in the sheet's `image` column — **filename only**, not a
   full path and not a Google Drive link.

Photos are shown whole, not cropped, so nothing gets cut off. Around 800–1200px wide
is plenty; smaller files load faster on phone data.

If the filename does not match a file in `images/`, the card still looks correct and
shows a neutral placeholder instead of a broken image.

---

## 7. Hide a product

Set its `stock` to **0**, or clear the cell.

The row stays in your sheet — nothing is deleted — and the product disappears from
the site on the next page load. Put a number back in and it returns.

---

## 8. Change the wording

All interface text is in the `STRINGS` object near the top of `app.js`, with an `en`
block and an `ar` block side by side. Edit the line you want, in both languages.

The long text on `about.html` is not in `app.js` — it lives directly in `about.html`
as two blocks, one marked `data-lang-block="en"` and one `data-lang-block="ar"`. Edit
it there. Keeping it in the HTML is deliberate: AI crawlers that do not run
JavaScript can still read every fact on that page.

**One thing to watch:** the English wording from `STRINGS` is also written into
`index.html` and `about.html` as plain HTML, for the same crawler reason. If you
change an English line in `STRINGS`, change the matching line in the HTML too, so the
two do not drift apart.

---

## 9. Change the domain

The site currently points at `https://raslaptops.com`. When you have the real domain,
do a find-and-replace for `raslaptops.com` across the whole folder. It appears in:

- `app.js` — `CONFIG.siteUrl`
- `index.html` and `about.html` — the canonical link and the Open Graph tags
- `sitemap.xml`
- `robots.txt`
- `llms.txt`

These are what search engines and AI assistants use to link back to you, so it is
worth doing properly once.

---

## 10. Previewing on your own machine

Opening `index.html` by double-clicking mostly works, **except** the product list:
browsers block a page opened from your hard drive from fetching the Google Sheet. You
will see the header and the "message us on WhatsApp" fallback instead of the cards.
That is the fallback doing its job, not a bug — it works as soon as the site is on a
real host.

To see the full list locally, run a small server from inside the folder:

```
python -m http.server 8000
```

then open `http://localhost:8000`.

---

## Design notes

If you or anyone else edits the CSS later, these are the rules the stylesheet
follows. They are what keep it looking like a shop rather than a template.

**Colours** — all defined as variables at the top of `style.css`.

- Navy `#0B1F3A` and royal blue `#1B4F9C` carry the brand. The hero is the only
  gradient on the site; the footer is flat navy.
- Cyan `#38BDF8` is for accents, icons, underlines and focus rings **only**. It is
  never used for body text, where it fails contrast. Blue text links use `#0284C7`.
- Red `#E23B2E` is **only** ever a low stock count. Nothing else on the site is red,
  which is what makes "Last one" register instantly.
- Green: WhatsApp `#25D366` for the WhatsApp buttons, `#15803D` for "In stock".

**Type** — Archivo for headings (700–800, tight letter-spacing), Manrope for body
text, Noto Sans Arabic for Arabic at matched weights. These load from Google Fonts;
each has a system fallback, so the page still reads correctly if the fonts are slow
or blocked. Prices use tabular numerals so the column of prices lines up.

**Layout** — mobile first, since almost everyone arrives from an Instagram ad on a
phone. One column on phones, two from 600px, three from 980px. The WhatsApp button is
the main call to action on every card, plus a sticky bar at the bottom of the screen
on phones.

**Arabic** — the toggle sets `dir="rtl"` on the page and the whole layout mirrors.
Model names, specs and prices stay in Latin script and Western digits and are marked
`dir="ltr"` individually so the browser does not shuffle the numbers and slashes
around. Arabic specs coming from the sheet are marked `dir="rtl"` for the same reason.

---

## What is already set up

- **Language** — English by default, with a toggle in the header. The choice is not
  remembered between visits, so every visitor starts in English.
- **WhatsApp** — every card has a button that opens a chat with the message already
  typed, naming that exact product, in whichever language the visitor is reading.
- **If the sheet fails to load** — the page still shows the header, the hero, the
  selling points, the WhatsApp button and the social links, with a short line asking
  the visitor to message for the current list. It never shows an empty page.
- **AI and search visibility** — `llms.txt`, a `robots.txt` that explicitly welcomes
  GPTBot, ClaudeBot, PerplexityBot, Google-Extended and Bingbot, a sitemap, real
  headings, and JSON-LD structured data (Organization, one Product per in-stock item,
  and an FAQ on the about page). The structured data is generated from the same sheet
  rows and the same FAQ text the visitor sees, so it can never contradict the page.
- **Link previews** — Open Graph and Twitter tags, so pasting a link into WhatsApp
  shows a proper card. That image is `images/og-cover.png`; replace it with a real
  photo any time, keeping the same filename and roughly 1200×630.
