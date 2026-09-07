/* =============================================================================
   RAS Solutions / RAS Laptops - app.js
   Plain vanilla JavaScript. No framework, no build step, no dependencies.
   ============================================================================= */

/* -----------------------------------------------------------------------------
   1) CONFIG  -  everything you might ever need to change lives right here.
   -----------------------------------------------------------------------------

   HOW TO GET sheetCsvUrl:
     In your Google Sheet:  File -> Share -> Publish to web
     Pick the tab that holds the inventory, choose "Comma-separated values (.csv)",
     press Publish, then copy the link it gives you and paste it below.
     It looks like:
       https://docs.google.com/spreadsheets/d/e/2PACX-xxxxxxxx/pub?gid=0&single=true&output=csv

   The sheet's first row must be the header row, with these columns in this order:
     category | model | spec_en | spec_ar | price | image | stock | touch | note_en | note_ar
----------------------------------------------------------------------------- */

const CONFIG = {

  /* ===========================================================================
     YOUR LINKS - this is the only block you need to touch to change where the
     buttons point. Paste the full URL between the quotes.
     Leave a line as '' (empty) and that icon simply does not appear on the site.
     =========================================================================== */
  links: {
    /* WhatsApp: digits only, international format, no + and no spaces. */
    whatsapp: '96176792834',

    instagram: 'https://www.instagram.com/lb_ras/',

    /* <-- PASTE YOUR FACEBOOK PAGE URL HERE, e.g. https://www.facebook.com/YourPage */
    facebook: '',

    /* <-- PASTE YOUR TIKTOK PROFILE URL HERE, e.g. https://www.tiktok.com/@yourname */
    tiktok: ''
  },

  /* The phone number as you want it printed on the page. */
  whatsappDisplay: '+961 76 792 834',

  /* >>> PASTE YOUR PUBLISHED GOOGLE SHEET CSV LINK BETWEEN THESE QUOTES <<< */
  sheetCsvUrl: 'https://docs.google.com/spreadsheets/d/e/PASTE_YOUR_PUBLISHED_SHEET_ID_HERE/pub?gid=0&single=true&output=csv',

  /* Folder that holds the product photos. Keep the trailing slash. */
  imagesPath: 'images/',

  /* Your real domain, no trailing slash. It is what the structured data points
     at, and that structured data is what AI assistants and search engines read.
     If you change this, also change it in sitemap.xml and robots.txt. */
  siteUrl: 'https://fryangotit.github.io/ras-laptops',

  /* How every price on the site is written. {n} is the number.
     '${n}' gives $330.   '{n}$' gives 330$.
     Change it here once and it changes everywhere, in both languages, so the
     site always matches the way prices are written in your ads. */
  priceFormat: '${n}',

  /* At this many units or fewer, the stock badge turns red. */
  lowStockAt: 2,

  /* ===========================================================================
     CATEGORIES - the sections of the shop, in the order they appear.
     'key' is what you type in the sheet's category column.
     'match' lists other spellings that should land in the same section.
     To add a section, copy a line and change it. Nothing else needs editing.
     A section with nothing in stock does not appear on the page at all.
     =========================================================================== */
  categories: [
    { key: 'laptop',    match: ['laptops', 'notebook', 'لابتوب'],        en: 'Laptops',             ar: 'لابتوبات' },
    { key: '2-in-1',    match: ['2in1', 'convertible', 'touch'],         en: '2-in-1 & Touch',      ar: 'تاتش و 2-in-1' },
    { key: 'desktop',   match: ['desktops', 'mini pc', 'minipc', 'pc'],  en: 'Desktops & Mini PCs', ar: 'كمبيوتر مكتبي وميني' },
    { key: 'monitor',   match: ['monitors', 'screen', 'شاشة'],           en: 'Monitors',            ar: 'شاشات' },
    { key: 'dock',      match: ['docks', 'docking', 'adapter', 'charger'], en: 'Docks & Chargers',  ar: 'دوكات وشواحن' },
    { key: 'accessory', match: ['accessories', 'اكسسوار'],               en: 'Accessories',         ar: 'إكسسوارات' }
  ],

  /* Adds a timestamp to the sheet request so phones do not show a stale list. */
  bustCache: true
};

/* -----------------------------------------------------------------------------
   2) STRINGS  -  every piece of interface wording, in one place.
       en = English (the default), ar = Lebanese Arabic.

   Note: model names, spec strings and prices are never translated. They stay in
   Latin script and Western digits in both languages, exactly as typed in the
   sheet.

   The English wording also appears inside index.html and about.html so that AI
   crawlers and search engines that do not run JavaScript can still read it.
   If you change a line here, change the matching line in the HTML too.
----------------------------------------------------------------------------- */

const STRINGS = {

  en: {
    dir: 'ltr',
    code: 'en',

    /* header + nav */
    toggleLabel: 'العربية',
    toggleAria: 'Switch the site to Arabic',
    navProducts: 'Laptops',
    navAbout: 'About us',
    waShort: 'WhatsApp',
    aboutTitle: 'About RAS Solutions',

    /* hero */
    heroEyebrow: 'RAS Solutions · Lebanon',
    heroTitle: 'Open box, ex-corporate business laptops in Lebanon',
    heroText: 'Dell Latitude, HP ProBook and Lenovo ThinkPad. Every unit is tested before shipping and carries a 3-month warranty. Delivery is free all over Lebanon, and you inspect the laptop with the driver before you pay.',
    heroCta: 'Ask on WhatsApp',
    trust: [
      '3-month warranty',
      'Free delivery all over Lebanon',
      'Open box, ex-corporate',
      'Tested before shipping',
      'Cash on delivery, Whish or OMT',
      'You inspect it with the driver before you pay',
      'Arabic / English keyboards on most units'
    ],

    /* filters */
    filterAll: 'Everything',
    filterAria: 'Filter by category',

    /* sections */
    sectionOther: 'Other',

    /* cards */
    touchBadge: 'Touch, flips into tablet',
    altSuffix: 'open box, ex-corporate business laptop from RAS Solutions in Lebanon',
    askOnWhatsapp: 'Ask on WhatsApp',
    askAria: 'Ask about this on WhatsApp',
    inStock: 'In stock',
    lastOne: 'Last one',
    unitsLeft: function (n) { return n + ' left'; },

    /* states */
    loading: 'Loading the current list…',
    errorTitle: 'The list did not load',
    errorText: 'Message us on WhatsApp and we will send you what is available today.',
    emptyTitle: 'The list is being updated',
    emptyText: 'Message us on WhatsApp and we will send you what is available today.',

    /* footer */
    contactHeading: 'Contact',
    followHeading: 'Follow us',
    instagramLabel: 'Instagram',
    facebookLabel: 'Facebook',
    tiktokLabel: 'TikTok',
    whatsappLabel: 'WhatsApp',
    footerNote: 'Online only. Free delivery all over Lebanon. 3-month warranty on every unit.',

    /* prefilled WhatsApp messages */
    waProduct: function (model) { return "Hi, I'm interested in the " + model; },
    waGeneral: "Hi, I'd like to see the laptops you have available"
  },

  ar: {
    dir: 'rtl',
    code: 'ar',

    /* header + nav */
    toggleLabel: 'English',
    toggleAria: 'حوّل الموقع عالإنكليزي',
    navProducts: 'اللابتوبات',
    navAbout: 'مين نحنا',
    waShort: 'واتساب',
    aboutTitle: 'مين نحنا — RAS Solutions',

    /* hero */
    heroEyebrow: 'RAS Solutions · لبنان',
    heroTitle: 'لابتوبات أوبن بوكس، جايي من شركات، بلبنان',
    heroText: 'Dell Latitude و HP ProBook و Lenovo ThinkPad. كل جهاز منجرّبه قبل ما نشحنه وعليه كفالة 3 شهور. التوصيل مجاني لكل لبنان، وبتفتّش عاللابتوب مع الدرايفر قبل ما تدفع.',
    heroCta: 'اسألنا عالواتساب',
    trust: [
      'كفالة 3 شهور',
      'توصيل مجاني لكل لبنان',
      'أوبن بوكس، جايي من شركات',
      'منجرّبه قبل ما نشحنه',
      'الدفع كاش عند الاستلام، أو Whish أو OMT',
      'بتفتّش عاللابتوب مع الدرايفر قبل ما تدفع',
      'أغلب الأجهزة كيبورد عربي / إنكليزي'
    ],

    /* filters */
    filterAll: 'الكل',
    filterAria: 'فلترة حسب النوع',

    /* sections */
    sectionOther: 'غير هيك',

    /* cards */
    touchBadge: 'تاتش وبينفتل',
    altSuffix: 'لابتوب أوبن بوكس جايي من شركات، من RAS Solutions بلبنان',
    askOnWhatsapp: 'اسألنا عالواتساب',
    askAria: 'اسأل عن هيدا عالواتساب',
    inStock: 'متوفّر',
    lastOne: 'آخر قطعة',
    unitsLeft: function (n) { return 'باقي ' + n; },

    /* states */
    loading: 'عم نجيب اللائحة…',
    errorTitle: 'اللائحة ما فتحت',
    errorText: 'راسلنا عالواتساب ومنبعتلك شو في متوفّر اليوم.',
    emptyTitle: 'عم نحدّث اللائحة',
    emptyText: 'راسلنا عالواتساب ومنبعتلك شو في متوفّر اليوم.',

    /* footer */
    contactHeading: 'للتواصل',
    followHeading: 'تابعنا',
    instagramLabel: 'إنستغرام',
    facebookLabel: 'فيسبوك',
    tiktokLabel: 'تيك توك',
    whatsappLabel: 'واتساب',
    footerNote: 'أونلاين بس. التوصيل مجاني لكل لبنان. كفالة 3 شهور على كل جهاز.',

    /* prefilled WhatsApp messages */
    waProduct: function (model) { return 'مرحبا، بدي اسأل عن ' + model; },
    waGeneral: 'مرحبا، بدي شوف شو لابتوبات في عندكن'
  }
};

/* The chosen language lives here, in a plain variable. Nothing is stored on the
   visitor's phone, so every visit starts in English. */
var LANG = 'en';

/* Which category chip is selected. 'all' shows every section. */
var FILTER = 'all';

/* Products loaded from the sheet, and how that load went. */
var PRODUCTS = [];
var LOADING = true;
var LOAD_FAILED = false;

/* -----------------------------------------------------------------------------
   3) CSV parsing
   A small hand-written parser. It handles quoted fields that contain commas,
   doubled quotes ("" inside a quoted field) and line breaks inside quotes.
----------------------------------------------------------------------------- */

function parseCSV(text) {
  var rows = [];
  var row = [];
  var field = '';
  var inQuotes = false;
  var i;

  /* strip the byte-order mark some spreadsheets add, normalise line endings */
  text = text.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (i = 0; i < text.length; i++) {
    var c = text.charAt(i);

    if (inQuotes) {
      if (c === '"') {
        if (text.charAt(i + 1) === '"') { field += '"'; i++; }   /* escaped quote */
        else { inQuotes = false; }                               /* closing quote */
      } else {
        field += c;
      }
      continue;
    }

    if (c === '"') { inQuotes = true; }
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else { field += c; }
  }

  if (field !== '' || row.length) { row.push(field); rows.push(row); }

  /* drop completely blank lines */
  return rows.filter(function (r) {
    return r.some(function (v) { return String(v).trim() !== ''; });
  });
}

/* The column names we expect, in the documented order. */
var COLUMNS = ['category', 'model', 'spec_en', 'spec_ar', 'price', 'image',
               'stock', 'touch', 'note_en', 'note_ar'];

/* Turn the parsed rows into objects. Columns are matched by their header name
   when the header row is recognisable, and by position otherwise, so adding a
   column at the end of the sheet will not break anything. */
function rowsToProducts(rows) {
  if (!rows.length) return [];

  var header = rows[0].map(function (h) {
    return String(h).trim().toLowerCase().replace(/\s+/g, '_');
  });
  var usesHeader = header.indexOf('model') !== -1;
  var body = usesHeader ? rows.slice(1) : rows;

  function indexOfColumn(name) {
    if (usesHeader) {
      var found = header.indexOf(name);
      if (found !== -1) return found;
    }
    return COLUMNS.indexOf(name);
  }

  var idx = {};
  COLUMNS.forEach(function (name) { idx[name] = indexOfColumn(name); });

  return body.map(function (r) {
    function cell(name) {
      var at = idx[name];
      return (at > -1 && r[at] != null) ? String(r[at]).trim() : '';
    }
    return {
      category: cell('category'),
      model:    cell('model'),
      spec_en:  cell('spec_en'),
      spec_ar:  cell('spec_ar'),
      price:    toNumber(cell('price')),
      priceRaw: cell('price'),
      image:    cell('image'),
      stock:    toNumber(cell('stock')),
      touch:    isYes(cell('touch')),
      note_en:  cell('note_en'),
      note_ar:  cell('note_ar')
    };
  }).filter(function (p) { return p.model !== ''; });
}

/* "330", "330$", "$330", "1,250" -> 1250 ;  anything unreadable -> 0 */
function toNumber(value) {
  var cleaned = String(value).replace(/[^0-9.\-]/g, '');
  var n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}

function isYes(value) {
  var v = String(value).trim().toLowerCase();
  return v === 'yes' || v === 'y' || v === 'true' || v === '1' || v === 'نعم';
}

/* A blank or zero stock hides the row. The row stays in the sheet. */
function isInStock(p) { return p.stock > 0; }

/* -----------------------------------------------------------------------------
   4) Categories
----------------------------------------------------------------------------- */

/* Which CONFIG.categories entry a sheet row belongs to. Anything unrecognised
   falls into 'other' rather than disappearing, so a typo in the sheet can never
   make a product invisible. */
function categoryOf(p) {
  var raw = String(p.category).trim().toLowerCase();
  if (!raw) return 'other';

  for (var i = 0; i < CONFIG.categories.length; i++) {
    var c = CONFIG.categories[i];
    var names = [c.key].concat(c.match || []);
    for (var j = 0; j < names.length; j++) {
      var n = String(names[j]).toLowerCase();
      if (raw === n || raw.indexOf(n) === 0 || n.indexOf(raw) === 0) return c.key;
    }
  }
  return 'other';
}

function categoryLabel(key) {
  if (key === 'other') return t().sectionOther;
  for (var i = 0; i < CONFIG.categories.length; i++) {
    if (CONFIG.categories[i].key === key) return CONFIG.categories[i][LANG] || CONFIG.categories[i].en;
  }
  return key;
}

/* Category keys that actually have something in stock, in CONFIG order. */
function activeCategories(list) {
  var present = {};
  list.forEach(function (p) { present[categoryOf(p)] = true; });

  var keys = CONFIG.categories
    .map(function (c) { return c.key; })
    .filter(function (k) { return present[k]; });

  if (present.other) keys.push('other');
  return keys;
}

/* -----------------------------------------------------------------------------
   5) Small helpers
----------------------------------------------------------------------------- */

/* Every price on the site goes through here, so they are all written the
   same way. See CONFIG.priceFormat. */
function priceText(p) {
  var n = p.price;
  var shown = (n % 1 === 0) ? String(n) : n.toFixed(2);
  return CONFIG.priceFormat.replace('{n}', shown);
}

function specFor(p) {
  /* Arabic spec falls back to the English one if the sheet cell is empty. */
  return (LANG === 'ar' && p.spec_ar) ? p.spec_ar : p.spec_en;
}

function noteFor(p) {
  return (LANG === 'ar' && p.note_ar) ? p.note_ar : (LANG === 'ar' ? '' : p.note_en);
}

/* Which way a string out of the sheet should read.

   A Latin spec such as  i5 12th gen / 16GB / 512GB / 14"  has to stay left to
   right even while the rest of the page is right to left, otherwise the browser
   shuffles the slashes and the numbers around. An Arabic spec is the opposite:
   it has to read right to left, or the Arabic words come out reversed. */
function dirFor(text) {
  return /[؀-ۿݐ-ݿﭐ-﷿ﹰ-﻿]/.test(String(text)) ? 'rtl' : 'ltr';
}

function slug(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function esc(text) {
  return String(text)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/* WhatsApp deep link with the message already typed, in the current language. */
function whatsappLink(message) {
  return 'https://wa.me/' + CONFIG.links.whatsapp + '?text=' + encodeURIComponent(message);
}

/* Shown in place of a photo when the file is missing from /images/ */
var IMAGE_PLACEHOLDER =
  'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300">' +
    '<rect width="400" height="300" fill="#EDF2F9"/>' +
    '<path d="M120 190h160M140 110h120v70H140z" fill="none" stroke="#B9C8DD" stroke-width="6" ' +
    'stroke-linecap="round" stroke-linejoin="round"/></svg>'
  );

/* -----------------------------------------------------------------------------
   6) Icons  (inline SVG, so nothing is fetched from anywhere)
----------------------------------------------------------------------------- */

var ICONS = {
  whatsapp: 'M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.34-1.4a9.8 9.8 0 0 0 4.7 1.2h.01c5.43 0 9.84-4.4 9.84-9.84S17.47 2 12.04 2Zm0 17.96h-.01a8.2 8.2 0 0 1-4.16-1.14l-.3-.18-3.17.83.85-3.09-.2-.32a8.13 8.13 0 0 1-1.25-4.34c0-4.5 3.67-8.16 8.18-8.16 2.18 0 4.23.85 5.78 2.4a8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.67 8.23-8.11 8.23Zm4.49-6.16c-.25-.13-1.45-.72-1.68-.8-.22-.08-.39-.12-.55.13-.16.24-.63.79-.77.95-.14.16-.28.19-.53.06-.24-.12-1.03-.38-1.97-1.21-.73-.65-1.22-1.45-1.36-1.7-.14-.24-.02-.37.11-.5.11-.11.25-.28.37-.43.12-.14.16-.24.25-.4.08-.17.04-.31-.02-.44-.06-.12-.55-1.33-.76-1.81-.2-.48-.4-.42-.55-.42l-.47-.01c-.16 0-.43.06-.65.31-.22.24-.85.83-.85 2.03s.87 2.35.99 2.51c.12.16 1.71 2.6 4.14 3.65.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.45-.59 1.65-1.17.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.29Z',

  instagram: 'M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.85 5.85 0 0 0-2.13 1.38A5.85 5.85 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.85 5.85 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.85 5.85 0 0 0 2.13-1.38 5.85 5.85 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.85 5.85 0 0 0-1.38-2.13A5.85 5.85 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z',

  facebook: 'M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z',

  tiktok: 'M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z'
};

function icon(name, cls) {
  return '<svg class="icon' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" ' +
         'aria-hidden="true" focusable="false"><path fill="currentColor" d="' +
         ICONS[name] + '"/></svg>';
}

/* The social links that actually have a URL filled in, in a fixed order. */
function socialLinks() {
  var s = t();
  var out = [];
  if (CONFIG.links.instagram) out.push({ key: 'instagram', url: CONFIG.links.instagram, label: s.instagramLabel });
  if (CONFIG.links.facebook)  out.push({ key: 'facebook',  url: CONFIG.links.facebook,  label: s.facebookLabel });
  if (CONFIG.links.tiktok)    out.push({ key: 'tiktok',    url: CONFIG.links.tiktok,    label: s.tiktokLabel });
  return out;
}

/* -----------------------------------------------------------------------------
   7) Rendering
----------------------------------------------------------------------------- */

function t() { return STRINGS[LANG]; }

/* The badge in the top-right corner of a card.
   Red fill when only one or two are left, plain green text otherwise. */
function stockBadgeHTML(p) {
  var s = t();
  if (p.stock <= CONFIG.lowStockAt) {
    var text = (p.stock === 1) ? s.lastOne : s.unitsLeft(p.stock);
    return '<span class="stock stock-low">' + esc(text) + '</span>';
  }
  return '<span class="stock stock-in">' + esc(s.inStock) + '</span>';
}

/* One product card. */
function cardHTML(p) {
  var s = t();
  var spec = specFor(p);
  var note = noteFor(p);
  var src = CONFIG.imagesPath + p.image;

  /* The alt text is read out by screen readers and by AI crawlers, so it
     carries the model and the spec, not just "laptop photo". */
  var alt = p.model + (spec ? ', ' + spec : '') + ' — ' + s.altSuffix;

  var html = '';
  html += '<article class="card" id="p-' + esc(slug(p.model)) + '">';

  html += '<div class="card-photo">';
  html += '<img src="' + esc(p.image ? src : IMAGE_PLACEHOLDER) + '" alt="' + esc(alt) + '" ' +
          'loading="lazy" decoding="async" width="400" height="300">';
  html += stockBadgeHTML(p);
  html += '</div>';

  html += '<div class="card-body">';
  html += '<h3 class="card-model" dir="' + dirFor(p.model) + '">' + esc(p.model) + '</h3>';
  if (spec) {
    html += '<p class="card-spec" dir="' + dirFor(spec) + '">' + esc(spec) + '</p>';
  }

  if (p.touch || note) {
    html += '<p class="card-tags">';
    if (p.touch) html += '<span class="tag tag-touch">' + esc(s.touchBadge) + '</span>';
    if (note)    html += '<span class="tag" dir="' + dirFor(note) + '">' + esc(note) + '</span>';
    html += '</p>';
  }

  html += '<p class="price" dir="ltr">' + esc(priceText(p)) + '</p>';
  html += '<a class="btn btn-wa" href="' + esc(whatsappLink(s.waProduct(p.model))) + '" ' +
          'target="_blank" rel="noopener" aria-label="' + esc(s.askAria + ': ' + p.model) + '">' +
          icon('whatsapp') + '<span>' + esc(s.askOnWhatsapp) + '</span></a>';
  html += '</div></article>';

  return html;
}

/* One titled section of cards. Returns '' when the section has nothing in it,
   so an empty section never appears at all. */
function sectionHTML(key, list) {
  if (!list.length) return '';
  return '<section class="group" id="cat-' + esc(key) + '">' +
         '<h2 class="group-title">' + esc(categoryLabel(key)) + '</h2>' +
         '<div class="grid">' + list.map(cardHTML).join('') + '</div>' +
         '</section>';
}

/* A calm message that still shows the ways to reach the shop. It appears when
   the sheet will not load and when it loads with nothing in stock. */
function noticeHTML(title, text) {
  var s = t();
  var socials = socialLinks().map(function (l) {
    return '<a class="btn btn-ghost" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
           icon(l.key) + '<span>' + esc(l.label) + '</span></a>';
  }).join('');

  return '<section class="notice">' +
    '<h2>' + esc(title) + '</h2>' +
    '<p>' + esc(text) + '</p>' +
    '<p class="notice-actions">' +
      '<a class="btn btn-wa" href="' + esc(whatsappLink(s.waGeneral)) + '" target="_blank" rel="noopener">' +
        icon('whatsapp') + '<span>' + esc(s.askOnWhatsapp) + '</span></a>' +
      socials +
    '</p></section>';
}

/* The category chips above the list. */
function renderFilters(inStock) {
  var host = document.getElementById('filters');
  if (!host) return;

  var keys = activeCategories(inStock);

  /* One category or none: chips would just be noise. */
  if (keys.length < 2) { host.innerHTML = ''; host.hidden = true; return; }
  host.hidden = false;

  if (keys.indexOf(FILTER) === -1) FILTER = 'all';

  var chips = [{ key: 'all', label: t().filterAll }].concat(
    keys.map(function (k) { return { key: k, label: categoryLabel(k) }; })
  );

  host.innerHTML = chips.map(function (c) {
    var on = (c.key === FILTER);
    return '<button type="button" class="chip' + (on ? ' is-on' : '') + '" ' +
           'data-filter="' + esc(c.key) + '" aria-pressed="' + on + '">' +
           esc(c.label) + '</button>';
  }).join('');

  host.querySelectorAll('[data-filter]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      FILTER = btn.getAttribute('data-filter');
      renderCatalog();
    });
  });
}

function renderCatalog() {
  var host = document.getElementById('catalog');
  if (!host) return;                       /* about.html has no catalog */
  var s = t();
  var filters = document.getElementById('filters');

  if (LOADING) {
    if (filters) filters.hidden = true;
    host.innerHTML = '<p class="state">' + esc(s.loading) + '</p>';
    return;
  }

  if (LOAD_FAILED) {
    if (filters) filters.hidden = true;
    host.innerHTML = noticeHTML(s.errorTitle, s.errorText);
    return;
  }

  var inStock = PRODUCTS.filter(isInStock);
  if (!inStock.length) {
    if (filters) filters.hidden = true;
    host.innerHTML = noticeHTML(s.emptyTitle, s.emptyText);
    return;
  }

  renderFilters(inStock);

  var byPrice = function (a, b) { return a.price - b.price; };
  var keys = activeCategories(inStock);
  var shown = (FILTER === 'all') ? keys : keys.filter(function (k) { return k === FILTER; });

  host.innerHTML = shown.map(function (key) {
    var list = inStock.filter(function (p) { return categoryOf(p) === key; }).sort(byPrice);
    return sectionHTML(key, list);
  }).join('');

  attachImageFallbacks(host);
}

/* If a photo is missing from /images/, the card keeps its shape and shows a
   neutral outline instead of a broken-image icon. */
function attachImageFallbacks(host) {
  host.querySelectorAll('.card-photo img').forEach(function (img) {
    img.addEventListener('error', function handle() {
      img.removeEventListener('error', handle);
      img.src = IMAGE_PLACEHOLDER;
    });
  });
}

/* The social row in the footer, and anywhere else it is asked for. */
function renderSocial() {
  var s = t();
  document.querySelectorAll('[data-social]').forEach(function (host) {
    host.innerHTML = socialLinks().map(function (l) {
      return '<a class="social-link" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
             icon(l.key) + '<span>' + esc(l.label) + '</span></a>';
    }).join('') +
    '<a class="social-link" href="' + esc(whatsappLink(s.waGeneral)) + '" target="_blank" rel="noopener">' +
      icon('whatsapp') + '<span>' + esc(s.whatsappLabel) + '</span></a>';
  });

  document.querySelectorAll('[data-phone]').forEach(function (el) {
    el.textContent = CONFIG.whatsappDisplay;
    /* A phone number is Latin digits and a leading +. Without this, an Arabic
       page renders "+961 76 792 834" as "834 792 76 961+". */
    el.setAttribute('dir', 'ltr');
  });
}

/* Swap every piece of chrome to the current language. */
function renderChrome() {
  var s = t();

  document.documentElement.setAttribute('lang', s.code);
  document.documentElement.setAttribute('dir', s.dir);

  /* plain text nodes */
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    if (typeof s[key] === 'string') el.textContent = s[key];
  });

  /* aria labels */
  document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
    var key = el.getAttribute('data-i18n-aria');
    if (typeof s[key] === 'string') el.setAttribute('aria-label', s[key]);
  });

  /* the list of always-true selling points */
  document.querySelectorAll('[data-trust-list]').forEach(function (el) {
    el.innerHTML = s.trust.map(function (line) {
      return '<li>' + esc(line) + '</li>';
    }).join('');
  });

  /* every general "talk to us" WhatsApp link */
  document.querySelectorAll('[data-wa-general]').forEach(function (el) {
    el.setAttribute('href', whatsappLink(s.waGeneral));
  });

  /* the long-form text on about.html: show one language, hide the other */
  document.querySelectorAll('[data-lang-block]').forEach(function (el) {
    el.hidden = (el.getAttribute('data-lang-block') !== LANG);
  });

  renderSocial();
}

function render() {
  renderChrome();
  renderCatalog();
}

function setLanguage(next) {
  LANG = (next === 'ar') ? 'ar' : 'en';
  render();
}

/* -----------------------------------------------------------------------------
   8) Structured data (JSON-LD)

   This is what ChatGPT, Claude, Perplexity, Google and Bing read when they are
   asked "who sells refurbished laptops in Lebanon". It is generated here, from
   the same sheet rows the visitor sees, so the two can never disagree.

   It is always written in English, because that is the canonical version, and
   it is written once on load rather than on every language switch.
----------------------------------------------------------------------------- */

var ORG_ID = CONFIG.siteUrl + '/#organization';

function organizationNode() {
  var sameAs = [];
  if (CONFIG.links.instagram) sameAs.push(CONFIG.links.instagram);
  if (CONFIG.links.facebook)  sameAs.push(CONFIG.links.facebook);
  if (CONFIG.links.tiktok)    sameAs.push(CONFIG.links.tiktok);

  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'RAS Solutions',
    alternateName: 'RAS Laptops',
    description: 'Online seller of open box, ex-corporate business laptops in Lebanon. ' +
                 '3-month warranty, free delivery all over Lebanon, cash on delivery or Whish / OMT.',
    url: CONFIG.siteUrl + '/',
    logo: CONFIG.siteUrl + '/images/logo.png',
    image: CONFIG.siteUrl + '/images/og-cover.png',
    sameAs: sameAs,
    areaServed: { '@type': 'Country', name: 'Lebanon' },
    contactPoint: [{
      '@type': 'ContactPoint',
      contactType: 'sales',
      telephone: '+' + CONFIG.links.whatsapp,
      url: 'https://wa.me/' + CONFIG.links.whatsapp,
      availableLanguage: ['ar', 'en'],
      areaServed: 'LB'
    }]
  };
}

/* The first word of the model is nearly always the manufacturer. */
var KNOWN_BRANDS = {
  dell: 'Dell', hp: 'HP', lenovo: 'Lenovo', apple: 'Apple', microsoft: 'Microsoft',
  asus: 'ASUS', acer: 'Acer', toshiba: 'Toshiba', fujitsu: 'Fujitsu', msi: 'MSI',
  samsung: 'Samsung', lg: 'LG', huawei: 'Huawei', razer: 'Razer', logitech: 'Logitech'
};

function brandOf(model) {
  var first = String(model).trim().split(/\s+/)[0] || '';
  return KNOWN_BRANDS[first.toLowerCase()] || null;
}

function productNode(p) {
  var description = p.model + (p.spec_en ? ' — ' + p.spec_en : '') + '. ' +
    'Open box, ex-corporate, tested before shipping. ' +
    '3-month warranty and free delivery all over Lebanon.' +
    (p.touch ? ' Touchscreen, folds into a tablet.' : '') +
    (p.note_en ? ' ' + p.note_en : '');

  var node = {
    '@type': 'Product',
    '@id': CONFIG.siteUrl + '/#p-' + slug(p.model),
    name: p.model,
    description: description,
    category: categoryLabelEnglish(categoryOf(p)),
    itemCondition: 'https://schema.org/RefurbishedCondition',
    offers: {
      '@type': 'Offer',
      url: CONFIG.siteUrl + '/#p-' + slug(p.model),
      priceCurrency: 'USD',
      price: String(p.price),
      itemCondition: 'https://schema.org/RefurbishedCondition',
      availability: 'https://schema.org/InStock',
      areaServed: { '@type': 'Country', name: 'Lebanon' },
      seller: { '@id': ORG_ID },
      acceptedPaymentMethod: [
        'http://purl.org/goodrelations/v1#Cash',
        'Whish Money',
        'OMT'
      ]
    }
  };

  if (p.image) node.image = CONFIG.siteUrl + '/' + CONFIG.imagesPath + p.image;
  var brand = brandOf(p.model);
  if (brand) node.brand = { '@type': 'Brand', name: brand };
  if (p.spec_en) node.additionalProperty = [{
    '@type': 'PropertyValue', name: 'Specification', value: p.spec_en
  }];

  return node;
}

/* Structured data is always English, whatever language the page is showing. */
function categoryLabelEnglish(key) {
  if (key === 'other') return 'Other';
  for (var i = 0; i < CONFIG.categories.length; i++) {
    if (CONFIG.categories[i].key === key) return CONFIG.categories[i].en;
  }
  return key;
}

/* about.html carries the questions and answers as ordinary visible text.
   The FAQPage block is read straight out of that text, so the structured data
   and the page always say exactly the same thing. */
function faqNode() {
  var host = document.getElementById('faq-en');
  if (!host) return null;

  var items = [].slice.call(host.querySelectorAll('.faq-item')).map(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return null;
    return {
      '@type': 'Question',
      name: q.textContent.trim(),
      acceptedAnswer: { '@type': 'Answer', text: a.textContent.replace(/\s+/g, ' ').trim() }
    };
  }).filter(Boolean);

  if (!items.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': CONFIG.siteUrl + '/about.html#faq',
    mainEntity: items
  };
}

function injectStructuredData() {
  var graph = [organizationNode()];

  PRODUCTS.filter(isInStock).forEach(function (p) { graph.push(productNode(p)); });

  var faq = faqNode();
  if (faq) graph.push(faq);

  var script = document.getElementById('ld-json');
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'ld-json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2);
}

/* -----------------------------------------------------------------------------
   9) Loading the sheet
----------------------------------------------------------------------------- */

function csvUrl() {
  var url = CONFIG.sheetCsvUrl;
  if (!CONFIG.bustCache) return url;
  return url + (url.indexOf('?') > -1 ? '&' : '?') + 'cb=' + Date.now();
}

function loadInventory() {
  var host = document.getElementById('catalog');
  if (!host) { injectStructuredData(); return; }   /* about.html */

  fetch(csvUrl(), { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('Sheet responded with ' + res.status);
      return res.text();
    })
    .then(function (text) {
      PRODUCTS = rowsToProducts(parseCSV(text));
      LOAD_FAILED = false;
    })
    .catch(function (err) {
      /* Nothing dramatic on screen: the header, the WhatsApp button and the
         social links stay, and the visitor is asked to message us. */
      console.warn('RAS Solutions: could not load the inventory sheet.', err);
      PRODUCTS = [];
      LOAD_FAILED = true;
    })
    .then(function () {
      LOADING = false;
      renderCatalog();
      injectStructuredData();
    });
}

/* -----------------------------------------------------------------------------
   10) Start
----------------------------------------------------------------------------- */

function init() {
  document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLanguage(LANG === 'en' ? 'ar' : 'en');
    });
  });

  render();
  loadInventory();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
