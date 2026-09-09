# RAS Solutions — website

Plain HTML, CSS and JavaScript. No framework, no npm, no build step. Drag the whole
folder onto any host (Netlify, Cloudflare Pages, GitHub Pages, cPanel, anything) and
it works.

```
index.html         the product list
estimate.html     the laptop price estimator
about.html        company page, the one AI assistants read
style.css
app.js            CONFIG and all wording live at the top of this file
pricing-model.js  every number the price estimator uses
choose.html       the guided "help me choose" questions
chooser.js        the questions and the scoring behind them
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

## 2. Change the logo

There are really two logos, and they are changed in different ways.

### The picture files — no code, just upload

These three files control the icons. **Replace a file with one of your own that
has the exact same name and nothing else needs changing.**

| file                  | where it shows up                                          |
| --------------------- | ---------------------------------------------------------- |
| `images/favicon.svg`  | the small icon in the browser tab                          |
| `images/logo.png`     | the icon when someone saves the site to their phone screen, and the logo search engines and AI assistants read |
| `images/og-cover.png` | the picture that appears when your link is pasted into WhatsApp, Instagram or Facebook. Make it 1200 × 630 |

**Doing it on github.com, no software needed:**

1. Open the repo and click into the **`images`** folder.
2. Click **Add file → Upload files**.
3. Drag your file in. It must have the same name as the one it replaces —
   `logo.png` replaces `logo.png`.
4. Scroll down, write a short note like "new logo", click **Commit changes**.
5. Wait about a minute. GitHub Pages rebuilds the site on its own.

If your file has a different name, GitHub will add it as a *second* file instead
of replacing the first, and nothing will change on the site. Same name is the
whole trick.

> Browsers hold on to a favicon hard. If the tab icon looks unchanged, open the
> site in a private window before assuming it did not work.

### The logo in the header — one config block

The header logo is set in `CONFIG.logo`, at the top of `app.js`:

```js
logo: {
  image: '',                    // filename from images/, e.g. 'ras-logo.png'
  imageHeight: 34,              // how tall it is in the header, in pixels
  mark: 'RAS',                  // the lettermark, used when image is empty
  name: 'RAS Solutions',        // the name printed beside it
  showName: true,               // false if your picture already has the name in it
  tagline: { en: 'Laptops · Lebanon', ar: 'لابتوبات · لبنان' }
}
```

**Leave `image` empty** and the header shows the navy **RAS** lettermark. Change
`mark` to change the letters.

**To use a picture instead**, upload it into `images/` and put just the filename
between the quotes:

```js
image: 'ras-logo.png',
```

A PNG with a transparent background works best. Around 200px tall is plenty —
`imageHeight` scales it down for the header. If your logo already has "RAS
Solutions" written inside it, set `showName: false` so the name is not printed
twice.

**Editing `app.js` on github.com:** open the file, click the pencil icon at the
top right, change the line, then **Commit changes** at the bottom. Same one
minute wait for the site to rebuild.

One thing to know: `index.html`, `about.html` and `estimate.html` each hold a
plain copy of the default logo and name. That copy is what a search engine or AI
crawler that does not run JavaScript sees. It does not affect what visitors see —
`CONFIG.logo` always wins in the browser — but if you rename the business, it is
worth updating those three files too so the crawlers agree with the page.

---

## 3. The deals carousel

The strip at the top of the shop, above the laptops. Each deal is a swipeable
set of pictures — the same ones you post as an Instagram carousel.

**It is switched off until you set it up.** With `dealsCsvUrl` empty the whole
section is hidden and nothing changes.

### Setting it up, once

1. In the same Google Sheet, add a **second tab** and call it `deals`.
2. Give it this header row:

   ```
   active | title_en | title_ar | text_en | text_ar | images | link
   ```

3. **File → Share → Publish to web**, pick the **deals** tab, choose
   **Comma-separated values (.csv)**, Publish, copy the link.
4. Paste it into `dealsCsvUrl` in `CONFIG`.

It is the same address as `sheetCsvUrl` with a different `gid=` number — the
gid is in your browser bar when that tab is open.

### Adding a deal

| column | what goes in it |
| ------ | --------------- |
| `active` | `no` or `false` hides the row. Anything else, including blank, shows it |
| `title_en` / `title_ar` | the heading under the pictures |
| `text_en` / `text_ar` | one line of description |
| `images` | the filenames, **separated by commas**, in swipe order |
| `link` | optional — the Instagram post, adds a "See it on Instagram" button |

Upload the pictures to `images/` first, exactly as you do for products, then
list them:

```
active | title_en      | images
yes    | Back to school | latitude-7400.jpg, latitude-7490.jpg, probook-440-g7.jpg
```

That becomes one card you can swipe through, with dots underneath and arrows on
desktop. Each deal also gets a WhatsApp button whose message names the deal, so
you know which post the customer is asking about.

**Why not embed the Instagram post directly?** Instagram's embed loads several
hundred kilobytes of their JavaScript, renders in their styling rather than
yours, and sometimes shows a login wall instead of the post. Since nearly all
your visitors arrive on phone data from an ad, uploading the same pictures is
faster, always works, and looks like the rest of the shop. The `link` column
still sends people to the real post.

**Sizing.** Instagram carousels are square, and the carousel here keeps whatever
shape you give it, so square works well. Keep each file under about 300 KB.

---

## 4. Connect the Google Sheet

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
| `variant_en` | optional, see "Two versions of the same laptop" below |
| `variant_ar` | optional, the Arabic version of that label          |

Notes:

- Commas inside a cell are fine. So are quotes, so `14"` works.
- `touch = yes` adds the tag **Touch, flips into tablet** / **تاتش وبينفتل**.
- Cheapest first inside each section.
- If `spec_ar` or `note_ar` is empty, the Arabic page falls back to the English one.

### Two versions of the same laptop

If you stock the same model in more than one configuration — a Latitude 7490
with an i5 and another with an i7 — **give each one its own row, with the same
`model`**. They will appear as a single card with a button for each, instead of
two cards sitting side by side that look almost identical.

```
category | model              | spec_en                        | price | stock
laptop   | Dell Latitude 7490 | i5 8th gen / 8GB / 256GB / 14" | 230   | 3
laptop   | Dell Latitude 7490 | i7 8th gen / 8GB / 256GB / 14" | 250   | 2
```

The card opens on the cheapest one. Clicking a button switches the spec, the
price, the stock badge, the photo, and the WhatsApp message — which names the
exact configuration, so a customer asking about the i7 does not have to be asked
which one they meant.

**The button labels write themselves.** The two specs above differ only in the
first part, so the buttons read **i5 8th gen** and **i7 8th gen**. Two rows
differing only in memory give you **16GB** and **32GB**. You do not have to do
anything for this.

If you want to name them yourself, fill in `variant_en` and `variant_ar` — for
example `Standard` and `Pro`. Fill them in for **every** row of that model or
they are ignored and the automatic labels are used instead.

**Each row keeps its own photo.** If your ad image has the price printed on it,
give each variant row its own image filename so the picture always matches the
price on the card.

**Stock is per row.** One variant can be sold out while the other is still
listed: set that row's `stock` to 0 and only the remaining one shows, with the
buttons disappearing since there is nothing left to choose between.

To switch all of this off and go back to one card per row, set
`groupVariantsByModel: false` in `CONFIG`.

---

## 5. Categories

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

## 6. Prices

Every price on the site is written by one setting:

```js
priceFormat: '${n}',   // $330      change to '{n}$' for 330$
```

`{n}` is the number from the sheet. Change it once and every price changes — cards,
both languages, everywhere — so the site always matches how prices are written in
your ads.

---

## 7. Stock badges

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

## 8. The price estimator

`estimate.html` lets a visitor price their own laptop. Every number it uses lives
in **`pricing-model.js`** — that is the only file to edit, and it is commented
line by line.

**The formula**, which is also written at the top of that file:

```
base     = processor value x generation factor
subtotal = base + RAM + storage + graphics + screen + extras
value    = subtotal x brand grade x condition x battery x marketFactor
```

The result is shown as a range, not a single number, because a single number
would claim more precision than the model has.

**The four dials to reach for first**, at the top of the file:

| setting         | what it does                                              |
| --------------- | --------------------------------------------------------- |
| `marketFactor`  | multiplies every estimate. Reads high everywhere? Drop it to 0.95. |
| `spreadPct`     | how wide the range is. `0.12` = −12% to +12%.               |
| `minimumValue`  | nothing is ever estimated below this                       |
| `roundTo`       | rounds to the nearest 5 by default                         |

**Everything else is a list you can edit.** Each entry is one line with a `key`,
a `value` and its `en` / `ar` labels:

```js
{ key: 'i5', value: 165, en: 'Intel Core i5', ar: 'Intel Core i5' },
```

Add a line and a new dropdown option appears on the page, in both languages. The
groups are `cpu`, `generation`, `brand`, `ram`, `storage`, `graphics`, `screen`,
`battery`, `condition` and `extras` (the checkboxes).

Two things worth knowing before you start tuning:

- **Age is carried by the processor generation**, not by a separate year field.
  A 2017 laptop and a 7th-gen CPU are the same statement; counting both would
  push older machines down to nothing.
- **`brand`, `condition` and `battery` are multipliers**, everything else is an
  amount in USD. So changing `condition` moves the whole estimate by a
  percentage, while changing `ram` moves it by a fixed number of dollars.

**Filling it with real Lebanon prices.** The numbers shipped today are plausible
starting points, not measured facts. As you gather real listings:

1. Price a laptop you already know the market value of.
2. If the estimate is off in the same direction for everything, change
   `marketFactor` only, and stop there.
3. If it is off for one kind of machine — say gaming laptops read low — change
   that one line instead.

**The CSV button** on the result panel downloads the full breakdown, one row per
item, and opens straight in Excel with the Arabic labels intact. That is the
quickest way to build the spreadsheet: price a batch of laptops, download each
one, and paste the rows together.

**A word on what this page claims.** It is labelled a guide, not an offer, in
both languages, and it never shows what you would pay for a machine — only what
one is worth on the market. Keep it that way: an estimator that doubles as a
buy-price calculator publishes your margin.

---

## 9. Help me choose

`choose.html` asks five questions and then recommends laptops **from what is
actually in stock**. The questions and the scoring live in **`chooser.js`**.

**The one rule this page is built on: a customer should never need to know what
RAM is.** Every question asks what they will *do* with the laptop. The
translation into specifications happens quietly in the file:

```js
{ key: 'study',
  en: 'University work, with a lot of tabs open at once',
  needs: { ram: 8, cpu: 5, gen: 10 } },
```

The customer reads "a lot of tabs open at once". The site reads "8GB or more,
i5 or better, 10th generation or newer". If you ever catch yourself writing
"i5 or better" in the question text, move it into `needs` instead.

**To change a question**, edit its `en` and `ar`. **To add one**, copy a whole
block. **To change what an answer asks for**, edit its `needs`:

| in `needs` | meaning |
| --------- | ------- |
| `ram` | minimum gigabytes of memory |
| `cpu` | minimum processor level — 3, 5 or 7, as in i3 / i5 / i7 |
| `gen` | minimum processor generation — newer also means better battery |
| `maxScreen` / `minScreen` | inches |
| `price` | `[lowest, highest]` in USD |
| `touch` | `true` when they asked for a folding touchscreen |

**How much each thing counts** is in `CHOOSER.weights`. Raise `touch` and asking
for a convertible almost guarantees you get one; raise `priceInside` and budget
starts to outweigh specification.

**It never shows an empty result.** Someone who picks "video editing" and "under
$250" still gets the three closest laptops, with the honest note that they are
above the budget they chose. A dead end would just send them back to Instagram.

**Where the numbers come from.** The sheet stores specs as one line of text —
`i5 12th gen / 16GB / 512GB / 14"` — which is right for a human but useless for
comparing. `parseSpec` pulls the numbers back out of it. So **keep writing specs
the way you already do**, with the parts separated by ` / `. If you invent a new
format, the chooser will still work but will match less well.

**The WhatsApp button sends their answers**, in sentences, along with the laptop
it suggested. That means a customer arrives in your chat having already told you
their budget, what they need it for, and whether they carry it daily — which is
most of the conversation you would otherwise have to have.

---

## 10. Add a photo

1. Name the file after the product, lowercase, with dashes: `latitude-7430.jpg`.
2. Drop it into the `images/` folder.
3. Put that same filename in the sheet's `image` column — **filename only**, not a
   full path and not a Google Drive link.

Photos are shown whole, not cropped, so nothing gets cut off. Around 800–1200px wide
is plenty; smaller files load faster on phone data.

If the filename does not match a file in `images/`, the card still looks correct and
shows a neutral placeholder instead of a broken image.

---

## 11. Hide a product

Set its `stock` to **0**, or clear the cell.

The row stays in your sheet — nothing is deleted — and the product disappears from
the site on the next page load. Put a number back in and it returns.

---

## 12. Change the wording

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

## 13. Hosting and the domain

The site is live at **https://raslaptops.com**, served by **Cloudflare Pages**,
which redeploys automatically on every push to `main`. There is no build step:
Cloudflare just copies the files.

If you ever set it up again from scratch, the Cloudflare Pages build settings are:

| field | value |
| ----- | ----- |
| Production branch | `main` |
| Framework preset | None |
| Build command | *leave empty* |
| Build output directory | `/` |

**Changing the domain later.** Do a find-and-replace for `raslaptops.com` across
the whole folder, swapping in the new one. It appears in:

- `app.js` — `CONFIG.siteUrl`
- `index.html`, `about.html`, `estimate.html` — the canonical link and the Open Graph tags
- `sitemap.xml`
- `robots.txt`
- `llms.txt`

These are what search engines and AI assistants use to link back to you, so it is
worth doing properly once.

**A note on `.html` in links.** Cloudflare Pages serves `/about.html` as a
redirect to `/about`. The links inside the pages deliberately keep the `.html`
form, because that also works when you open the files straight off your hard
drive. The canonical tags, the sitemap and `llms.txt` use the short `/about`
form instead, since that is the address that actually answers, and it is what
search engines should be told to index. Both are correct; they are just aimed at
different readers.

**`robots.txt` works properly now.** On the old GitHub Pages address it sat at
`/ras-laptops/robots.txt`, which crawlers ignore — they only read the file at a
domain root. On `raslaptops.com` it is read as intended, so the explicit welcome
to GPTBot, ClaudeBot, PerplexityBot, Google-Extended and Bingbot is now actually
doing something.

**Turn off the old GitHub Pages site** if you have not already: repo Settings →
Pages → Source → None. Otherwise the same content answers on two addresses. The
canonical tags point at raslaptops.com so it will not really hurt you, but there
is no reason to serve a second copy.

---

## 14. Previewing on your own machine

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
