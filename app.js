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
    tiktok: 'https://www.tiktok.com/@lb_ras.laptops'
  },

  /* ===========================================================================
     YOUR LOGO

     Two ways to change it, both doable from github.com without a code editor:

     A. Swap the picture files. Go to the images/ folder on GitHub,
        "Add file" -> "Upload files", and upload a file with the SAME NAME as
        the one you are replacing. No code change at all:
          images/favicon.svg   the little icon in the browser tab
          images/logo.png      the icon when someone saves the site to a phone
          images/og-cover.png  the picture shown when a link is pasted into
                               WhatsApp, Facebook or Instagram (1200 x 630)

     B. Put your own logo in the header. Upload it to images/, then write just
        the filename on the "image" line below. Leave "image" empty and the
        header shows the lettermark instead.
     =========================================================================== */
  logo: {
    /* Filename only, from the images/ folder. e.g. 'ras-logo.png'
       Empty means: use the lettermark below. */
    image: 'logo.png',

    /* How tall that picture is in the header, in pixels. */
    imageHeight: 42,

    /* The lettermark, shown when no image is set. Two to four letters. */
    mark: 'RAS',

    /* The shop name printed next to the logo. */
    name: 'RAS',

    /* Set to false if your logo picture already has the name written in it. */
    showName: true,

    /* The small line under the name. */
    tagline: { en: 'Laptops · Lebanon', ar: 'لابتوبات · لبنان' }
  },

  /* The phone number as you want it printed on the page. */
  whatsappDisplay: '+961 76 792 834',

  /* >>> PASTE YOUR PUBLISHED GOOGLE SHEET CSV LINK BETWEEN THESE QUOTES <<< */
  sheetCsvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQD16eiUn9kopdnMEbwTZf9DnR8oBj3YewMiGtdh1JrOMl6RGFM-XEG4rqHGhLubJtQBf9bUE8Qhrrz/pub?gid=0&single=true&output=csv',

  /* ===========================================================================
     DEALS - the carousels at the top of the shop.

     These are the same pictures you post as an Instagram carousel. Upload them
     into images/, then list them on a second tab of the Google Sheet and
     publish that tab the same way you published the inventory one.

     The link below is the published CSV of THAT tab. It is the same address as
     sheetCsvUrl with a different gid= number on the end - the gid is in the
     browser bar when you have the tab open in Google Sheets.

     Leave it empty and the deals section does not appear at all.

     Columns on that tab, first row being the header:
       active | title_en | title_ar | text_en | text_ar | images | link
     'images' is one cell holding the filenames separated by commas, in the
     order you want them swiped. 'link' is optional - the Instagram post.
     =========================================================================== */
  dealsCsvUrl: '',

  /* Folder that holds the product photos. Keep the trailing slash. */
  imagesPath: 'images/',

  /* Your real domain, no trailing slash. It is what the structured data points
     at, and that structured data is what AI assistants and search engines read.
     If you change this, also change it in sitemap.xml and robots.txt. */
  siteUrl: 'https://raslaptops.com',

  /* How every price on the site is written. {n} is the number.
     '${n}' gives $330.   '{n}$' gives 330$.
     Change it here once and it changes everywhere, in both languages, so the
     site always matches the way prices are written in your ads. */
  priceFormat: '${n}',

  /* Rows that share the same model become ONE card with a set of buttons to
     switch between them, instead of several near-identical cards side by side.
     Set to false to go back to one card per row. */
  groupVariantsByModel: true,

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
    navEstimate: 'Price estimator',
    navChoose: 'Help me choose',
    waShort: 'WhatsApp',
    aboutTitle: 'About RAS Solutions',

    /* hero */
    heroEyebrow: 'RAS Solutions · Lebanon',
    heroTitle: 'Open box, ex-corporate business laptops in Lebanon',
    heroText: 'Dell Latitude, HP ProBook and Lenovo ThinkPad. Every unit is tested before shipping and carries a 3-month warranty minimum. Delivery is free all over Lebanon.',
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

    /* help me choose */
    chooseTitle: 'Help me choose a laptop',
    chooseIntro: 'Five questions about what you will actually do with it. No technical words, and nothing you need to look up. We will point you at what we have in stock that fits.',
    chooseStep: function (a, b) { return 'Question ' + a + ' of ' + b; },
    chooseBack: 'Back',
    chooseRestart: 'Start again',
    chooseResultTitle: 'What we would suggest',
    chooseResultNone: 'Nothing in stock matches that closely right now. Message us on WhatsApp and we will tell you what is coming in.',
    chooseAnswersTitle: 'You said',
    chooseOverBudget: 'A little above the budget you picked',
    chooseWhyRam: function (n) { return n + 'GB of memory, so a lot of tabs and programs stay smooth'; },
    chooseWhyCpu: function (n) { return 'An i' + n + ' processor, which is the faster end of what we carry'; },
    chooseWhyGen: function (n) { return n + 'th generation, which means better battery life'; },
    chooseWhySmall: function (n) { return n + ' inch, easy to carry every day'; },
    chooseWhyBig: function (n) { return n + ' inch, a bigger screen to work on'; },
    chooseWhyTouch: 'Touchscreen, and it folds back into a tablet',
    chooseWhyBudget: 'Sits inside the budget you picked',
    chooseAsk: 'Send my answers on WhatsApp',
    waChoose: function (summary, pick) {
      return "Hi, I answered the questions on your site.\n" + summary +
             (pick ? "\nIt suggested: " + pick : '');
    },

    /* deals */
    dealsHeading: 'This week',
    dealPrev: 'Previous picture',
    dealNext: 'Next picture',
    dealOnInstagram: 'See it on Instagram',
    dealAsk: 'Ask about this',
    waDeal: function (title) { return "Hi, I saw " + title + " on your site"; },

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
    variantsAria: 'Choose a configuration',
    inStock: 'In stock',
    lastOne: 'Last one',
    unitsLeft: function (n) { return n + ' left'; },

    /* price estimator */
    estTitle: 'What is your laptop worth in Lebanon?',
    estIntro: 'Pick what your laptop has and the estimate updates as you go. It is based on what comparable laptops sell for in Lebanon.',
    estDisclaimer: 'This is a guide, not an offer. Condition and the exact model move the real number. For a firm price on a specific machine, send us the details on WhatsApp.',
    estBrand: 'Brand and range',
    estCpu: 'Processor',
    estGeneration: 'Processor generation',
    estRam: 'Memory (RAM)',
    estStorage: 'Storage',
    estGraphics: 'Graphics',
    estScreen: 'Screen',
    estBattery: 'Battery',
    estCondition: 'Condition',
    estExtras: 'Extras',
    estResultLabel: 'Estimated value in Lebanon',
    estBreakdown: 'How this number was worked out',
    estColItem: 'Item',
    estColChoice: 'Choice',
    estColEffect: 'Effect',
    estBaseRow: 'Processor base',
    estSubtotalRow: 'Subtotal before multipliers',
    estMarketRow: 'Lebanon market factor',
    estSendWhatsapp: 'Send these details on WhatsApp',
    estDownloadCsv: 'Download as CSV',
    estCsvHint: 'The CSV opens straight in Excel, one row per item, so you can keep a record of every laptop you price.',

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
    navEstimate: 'قدّر سعر جهازك',
    navChoose: 'ساعدني اختار',
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

    /* help me choose */
    chooseTitle: 'ساعدني اختار لابتوب',
    chooseIntro: 'خمس أسئلة عن شو رح تعمل فيه. بلا كلمات تقنية، وبلا شي لازم تدوّر عليه. ومنقلك شو عنا متوفّر بيناسبك.',
    chooseStep: function (a, b) { return 'سؤال ' + a + ' من ' + b; },
    chooseBack: 'رجوع',
    chooseRestart: 'من الأول',
    chooseResultTitle: 'هيدا اللي منقترحه',
    chooseResultNone: 'ما في شي متوفّر هلق بيناسب تماماً. راسلنا عالواتساب ومنقلك شو جايي.',
    chooseAnswersTitle: 'إنت قلت',
    chooseOverBudget: 'أعلى شوي من الميزانية يلي اخترتها',
    chooseWhyRam: function (n) { return n + 'GB رام، فبيضل سريع مع كتير تابات وبرامج'; },
    chooseWhyCpu: function (n) { return 'معالج i' + n + '، وهو من الأقوى يلي عنا'; },
    chooseWhyGen: function (n) { return 'الجيل ' + n + '، يعني بطارية أطول'; },
    chooseWhySmall: function (n) { return n + ' إنش، سهل تشيله كل يوم'; },
    chooseWhyBig: function (n) { return n + ' إنش، شاشة أكبر تشتغل عليها'; },
    chooseWhyTouch: 'شاشة تاتش وبتنفتل تابلت',
    chooseWhyBudget: 'ضمن الميزانية يلي اخترتها',
    chooseAsk: 'ابعت جوابي عالواتساب',
    waChoose: function (summary, pick) {
      return 'مرحبا، استعملت مساعد الاختيار عالموقع.\n' + summary +
             (pick ? '\nاقترح عليي: ' + pick : '');
    },

    /* deals */
    dealsHeading: 'عروض هالأسبوع',
    dealPrev: 'الصورة السابقة',
    dealNext: 'الصورة التالية',
    dealOnInstagram: 'شوفه عإنستغرام',
    dealAsk: 'اسأل عن هيدا',
    waDeal: function (title) { return 'مرحبا، شفت ' + title + ' عالموقع'; },

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
    variantsAria: 'اختار المواصفات',
    inStock: 'متوفّر',
    lastOne: 'آخر قطعة',
    unitsLeft: function (n) { return 'باقي ' + n; },

    /* price estimator */
    estTitle: 'قديش بيسوى لابتوبك بلبنان؟',
    estIntro: 'اختار شو في بلابتوبك والتقدير بيتحدّث لحظة بلحظة. الحساب مبني على أسعار أجهزة شبيهة بلبنان.',
    estDisclaimer: 'هيدا تقدير تقريبي، مش عرض شراء. الحالة والموديل بالزبط بيغيّروا الرقم الحقيقي. لسعر نهائي لجهاز معيّن، ابعتلنا التفاصيل عالواتساب.',
    estBrand: 'الماركة والفئة',
    estCpu: 'المعالج',
    estGeneration: 'جيل المعالج',
    estRam: 'الرام',
    estStorage: 'الستوريج',
    estGraphics: 'كرت الشاشة',
    estScreen: 'الشاشة',
    estBattery: 'البطارية',
    estCondition: 'الحالة',
    estExtras: 'إضافات',
    estResultLabel: 'القيمة التقديرية بلبنان',
    estBreakdown: 'كيف طلع هالرقم',
    estColItem: 'البند',
    estColChoice: 'الاختيار',
    estColEffect: 'التأثير',
    estBaseRow: 'أساس المعالج',
    estSubtotalRow: 'المجموع قبل المعاملات',
    estMarketRow: 'معامل السوق اللبناني',
    estSendWhatsapp: 'ابعت هالتفاصيل عالواتساب',
    estDownloadCsv: 'نزّلها CSV',
    estCsvHint: 'ملف الـ CSV بيفتح دغري بالإكسل، كل بند بسطر، لتقدر تحتفظ بسجل لكل جهاز بتسعّره.',

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

/* Deals loaded from the second sheet tab. An empty list simply hides the
   section - a deal failing to load must never take the shop down with it. */
var DEALS = [];

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
               'stock', 'touch', 'note_en', 'note_ar',
               /* optional: only needed to name a variant button yourself */
               'variant_en', 'variant_ar'];

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
      note_ar:  cell('note_ar'),
      variant_en: cell('variant_en'),
      variant_ar: cell('variant_ar')
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
   6b) Variants

   Two rows in the sheet with the same model - say a Latitude 7490 with an i5
   and another with an i7 - are the same laptop in two configurations. They are
   collected into one card with a button for each, rather than two cards sitting
   side by side that look almost identical.
----------------------------------------------------------------------------- */

/* Which variant is showing on each card, keyed by the model slug. Nothing is
   stored on the visitor's phone; a reload starts from the cheapest again. */
var VARIANT = {};

/* -> [{ model, key, variants: [rows, cheapest first] }], cheapest group first */
function groupVariants(list) {
  var byModel = {};
  var order = [];

  list.forEach(function (p) {
    var key = CONFIG.groupVariantsByModel
      ? p.model.trim().toLowerCase()
      : p.model.trim().toLowerCase() + '||' + p.price + '||' + p.spec_en;
    if (!byModel[key]) { byModel[key] = []; order.push(key); }
    byModel[key].push(p);
  });

  var byPrice = function (a, b) { return a.price - b.price; };

  return order.map(function (key) {
    var variants = byModel[key].slice().sort(byPrice);
    return { model: variants[0].model, key: slug(variants[0].model), variants: variants };
  }).sort(function (a, b) { return a.variants[0].price - b.variants[0].price; });
}

function selectedIndex(group) {
  var i = VARIANT[group.key];
  return (typeof i === 'number' && group.variants[i]) ? i : 0;
}

/* A short label for each button.

   If the sheet has variant_en / variant_ar filled in, those win. Otherwise the
   label is worked out by comparing the spec strings and keeping only the parts
   that differ, so
     "i5 8th gen / 8GB / 256GB / 14""  and  "i7 8th gen / 8GB / 256GB / 14""
   become just  "i5 8th gen"  and  "i7 8th gen". */
function variantLabelsFor(group) {
  var vs = group.variants;

  var fromSheet = vs.map(function (p) {
    return (LANG === 'ar' && p.variant_ar) ? p.variant_ar : (p.variant_en || '');
  });
  if (fromSheet.every(function (l) { return l !== ''; })) return fromSheet;

  var parts = vs.map(function (p) {
    return String(specFor(p)).split('/').map(function (x) { return x.trim(); });
  });

  var sameLength = parts.every(function (a) { return a.length === parts[0].length; });
  if (sameLength && parts[0].length > 1) {
    var differing = [];
    for (var i = 0; i < parts[0].length; i++) {
      var first = parts[0][i];
      if (parts.some(function (a) { return a[i] !== first; })) differing.push(i);
    }
    if (differing.length) {
      var labels = parts.map(function (a) {
        return differing.map(function (i) { return a[i]; }).join(' / ');
      });
      var unique = {};
      labels.forEach(function (l) { unique[l] = 1; });
      /* only usable if it actually tells the variants apart */
      if (Object.keys(unique).length === labels.length) return labels;
    }
  }

  /* last resort: the price always distinguishes them */
  return vs.map(function (p) { return priceText(p); });
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

/* One product card. Takes a variant group, not a single row. */
function cardHTML(group) {
  var s = t();
  var idx = selectedIndex(group);
  var p = group.variants[idx];
  var many = group.variants.length > 1;
  var labels = many ? variantLabelsFor(group) : [];

  var spec = specFor(p);
  var note = noteFor(p);
  var alt = p.model + (spec ? ', ' + spec : '') + ' — ' + s.altSuffix;

  var html = '';
  html += '<article class="card" id="p-' + esc(group.key) + '" data-group="' + esc(group.key) + '">';

  html += '<div class="card-photo">';
  html += '<img src="' + esc(p.image ? CONFIG.imagesPath + p.image : IMAGE_PLACEHOLDER) + '" ' +
          'alt="' + esc(alt) + '" loading="lazy" decoding="async" width="400" height="300">';
  html += stockBadgeHTML(p);
  html += '</div>';

  html += '<div class="card-body">';
  html += '<h3 class="card-model" dir="' + dirFor(p.model) + '">' + esc(p.model) + '</h3>';
  if (spec) {
    html += '<p class="card-spec" dir="' + dirFor(spec) + '">' + esc(spec) + '</p>';
  }

  if (many) {
    html += '<div class="variants" role="group" aria-label="' + esc(s.variantsAria) + '">' +
      group.variants.map(function (v, i) {
        return '<button type="button" class="vpill' + (i === idx ? ' is-on' : '') + '" ' +
               'data-variant="' + i + '" aria-pressed="' + (i === idx) + '" ' +
               'dir="' + dirFor(labels[i]) + '">' + esc(labels[i]) + '</button>';
      }).join('') + '</div>';
  }

  if (p.touch || note) {
    html += '<p class="card-tags">';
    if (p.touch) html += '<span class="tag tag-touch">' + esc(s.touchBadge) + '</span>';
    if (note)    html += '<span class="tag" dir="' + dirFor(note) + '">' + esc(note) + '</span>';
    html += '</p>';
  }

  html += '<p class="price" dir="ltr">' + esc(priceText(p)) + '</p>';

  /* the message names the exact configuration, so a reply does not have to
     start by asking which one they meant */
  var asking = p.model + (many ? ' (' + labels[idx] + ')' : '');
  html += '<a class="btn btn-wa" href="' + esc(whatsappLink(s.waProduct(asking))) + '" ' +
          'target="_blank" rel="noopener" aria-label="' + esc(s.askAria + ': ' + asking) + '">' +
          icon('whatsapp') + '<span>' + esc(s.askOnWhatsapp) + '</span></a>';
  html += '</div></article>';

  return html;
}

/* One titled section of cards. Returns '' when the section has nothing in it,
   so an empty section never appears at all. */
function sectionHTML(key, groups) {
  if (!groups.length) return '';
  return '<section class="group" id="cat-' + esc(key) + '">' +
         '<h2 class="group-title">' + esc(categoryLabel(key)) + '</h2>' +
         '<div class="grid">' + groups.map(cardHTML).join('') + '</div>' +
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

  var keys = activeCategories(inStock);
  var shown = (FILTER === 'all') ? keys : keys.filter(function (k) { return k === FILTER; });

  host.innerHTML = shown.map(function (key) {
    var rows = inStock.filter(function (p) { return categoryOf(p) === key; });
    return sectionHTML(key, groupVariants(rows));
  }).join('');

  attachImageFallbacks(host);
  attachVariantButtons(host);
}

/* Clicking a variant button redraws only that one card, so the page does not
   jump and the rest of the list is left alone. */
function attachVariantButtons(host) {
  host.querySelectorAll('.card [data-variant]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.card');
      if (!card) return;
      VARIANT[card.getAttribute('data-group')] = parseInt(btn.getAttribute('data-variant'), 10);
      rerenderCard(card.getAttribute('data-group'));
    });
  });
}

function rerenderCard(key) {
  var card = document.getElementById('p-' + key);
  if (!card) return;

  var group = null;
  var inStock = PRODUCTS.filter(isInStock);
  groupVariants(inStock).forEach(function (g) { if (g.key === key) group = g; });
  if (!group) return;

  card.outerHTML = cardHTML(group);

  var fresh = document.getElementById('p-' + key);
  if (!fresh) return;
  attachImageFallbacks(fresh.parentNode);
  attachVariantButtons(fresh.parentNode);
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

/* Draws the logo and the shop name into every [data-brand] link, from
   CONFIG.logo. The HTML holds a copy of the default so the header still reads
   correctly for a crawler that does not run JavaScript. */
function renderBrand() {
  var l = CONFIG.logo || {};
  var badge;

  if (l.image) {
    var h = parseInt(l.imageHeight, 10) || 34;
    badge = '<img class="brand-logo" src="' + esc(CONFIG.imagesPath + l.image) + '" ' +
            'alt="' + esc(l.name || '') + '" style="height:' + h + 'px">';
  } else {
    badge = '<span class="brand-mark" aria-hidden="true">' + esc(l.mark || '') + '</span>';
  }

  var text = '';
  if (l.showName !== false) {
    var tagline = l.tagline ? (l.tagline[LANG] || l.tagline.en || '') : '';
    text = '<span class="brand-text"><strong>' + esc(l.name || '') + '</strong>' +
           (tagline ? '<small>' + esc(tagline) + '</small>' : '') + '</span>';
  }

  document.querySelectorAll('[data-brand]').forEach(function (el) {
    el.innerHTML = badge + text;
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

  renderBrand();
  renderSocial();
}

function render() {
  renderChrome();
  renderDeals();
  renderCatalog();
  renderEstimator();
  renderChooser();
}

function setLanguage(next) {
  LANG = (next === 'ar') ? 'ar' : 'en';
  render();
}

/* -----------------------------------------------------------------------------
   7b) Price estimator  (estimate.html)

   All the numbers live in pricing-model.js. This part only draws the form,
   keeps the current answers in a plain variable and shows the result.
----------------------------------------------------------------------------- */

/* What the visitor has picked so far. Sensible mid-range defaults, so the page
   shows a real number the moment it opens rather than an empty box. */
var ESTIMATE_INPUT = {
  brand: 'business', cpu: 'i5', generation: 'g11', ram: '8', storage: 'ssd256',
  graphics: 'integrated', screen: 'fhd15', battery: 'ok', condition: 'good',
  extras: []
};

/* The dropdowns, in the order they appear. Each maps a pricing-model.js group
   to the STRINGS key that labels it. */
var ESTIMATE_FIELDS = [
  { group: 'brand',      labelKey: 'estBrand' },
  { group: 'cpu',        labelKey: 'estCpu' },
  { group: 'generation', labelKey: 'estGeneration' },
  { group: 'ram',        labelKey: 'estRam' },
  { group: 'storage',    labelKey: 'estStorage' },
  { group: 'graphics',   labelKey: 'estGraphics' },
  { group: 'screen',     labelKey: 'estScreen' },
  { group: 'battery',    labelKey: 'estBattery' },
  { group: 'condition',  labelKey: 'estCondition' }
];

function optionLabel(opt) { return opt[LANG] || opt.en; }

/* "Premium business — ThinkPad X1, EliteBook" -> "Premium business".
   The long half of a label is there to help the visitor choose; it would only
   clutter a WhatsApp message or a CSV row. */
function shortLabel(opt) { return optionLabel(opt).split('—')[0].trim(); }

function estimateMoney(n) { return CONFIG.priceFormat.replace('{n}', String(n)); }

function renderEstimator() {
  var form = document.getElementById('estimator-form');
  if (!form || typeof PRICING === 'undefined') return;   /* not on this page */
  var s = t();

  var html = ESTIMATE_FIELDS.map(function (f) {
    var list = PRICING[f.group] || [];
    var options = list.map(function (o) {
      var on = (ESTIMATE_INPUT[f.group] === o.key) ? ' selected' : '';
      return '<option value="' + esc(o.key) + '"' + on + '>' + esc(optionLabel(o)) + '</option>';
    }).join('');
    return '<p class="field">' +
      '<label for="f-' + esc(f.group) + '">' + esc(s[f.labelKey]) + '</label>' +
      '<select id="f-' + esc(f.group) + '" data-group="' + esc(f.group) + '">' + options + '</select>' +
      '</p>';
  }).join('');

  html += '<fieldset class="field field-extras">' +
    '<legend>' + esc(s.estExtras) + '</legend><div class="checks">' +
    PRICING.extras.map(function (o) {
      var on = (ESTIMATE_INPUT.extras.indexOf(o.key) > -1) ? ' checked' : '';
      return '<label class="check"><input type="checkbox" data-extra value="' + esc(o.key) + '"' + on + '>' +
             '<span>' + esc(optionLabel(o)) + '</span></label>';
    }).join('') +
    '</div></fieldset>';

  form.innerHTML = html;

  form.querySelectorAll('select[data-group]').forEach(function (sel) {
    sel.addEventListener('change', function () {
      ESTIMATE_INPUT[sel.getAttribute('data-group')] = sel.value;
      renderEstimateResult();
    });
  });

  form.querySelectorAll('[data-extra]').forEach(function (box) {
    box.addEventListener('change', function () {
      var at = ESTIMATE_INPUT.extras.indexOf(box.value);
      if (box.checked && at === -1) ESTIMATE_INPUT.extras.push(box.value);
      if (!box.checked && at > -1) ESTIMATE_INPUT.extras.splice(at, 1);
      renderEstimateResult();
    });
  });

  renderEstimateResult();
}

/* A one-line summary of the picked laptop, for the WhatsApp message. */
function estimateSpecLine() {
  return ESTIMATE_FIELDS.map(function (f) {
    return shortLabel(pricingOption(f.group, ESTIMATE_INPUT[f.group]));
  }).join(' / ');
}

var ESTIMATE_CSV_URL = null;

function renderEstimateResult() {
  var host = document.getElementById('estimator-result');
  if (!host || typeof PRICING === 'undefined') return;
  var s = t();
  var r = estimateLaptopPrice(ESTIMATE_INPUT);

  var rows = r.lines.map(function (line) {
    var effect = (line.kind === 'multiplier')
      ? '× ' + line.option.value.toFixed(2)
      : (line.amount >= 0 ? '+ ' : '− ') + estimateMoney(Math.abs(line.amount));
    var groupLabel = s['est' + line.group.charAt(0).toUpperCase() + line.group.slice(1)] || line.group;
    return '<tr><td>' + esc(groupLabel) + '</td>' +
           '<td>' + esc(shortLabel(line.option)) + '</td>' +
           '<td class="num" dir="ltr">' + esc(effect) + '</td></tr>';
  }).join('');

  rows += '<tr class="row-sum"><td colspan="2">' + esc(s.estSubtotalRow) + '</td>' +
          '<td class="num" dir="ltr">' + esc(estimateMoney(r.subtotal)) + '</td></tr>';
  rows += '<tr class="row-sum"><td colspan="2">' + esc(s.estMarketRow) + '</td>' +
          '<td class="num" dir="ltr">× ' + esc(PRICING.marketFactor.toFixed(2)) + '</td></tr>';

  var waMessage = s.estWaMessage
    ? s.estWaMessage(estimateSpecLine(), r.low, r.high)
    : (LANG === 'ar'
        ? 'مرحبا، قدّرت سعر لابتوبي عالموقع: ' + estimateSpecLine() +
          ' — التقدير ' + estimateMoney(r.low) + ' - ' + estimateMoney(r.high)
        : 'Hi, I priced my laptop on your site: ' + estimateSpecLine() +
          ' — estimate ' + estimateMoney(r.low) + ' - ' + estimateMoney(r.high));

  host.innerHTML =
    '<div class="est-figure">' +
      '<p class="est-label">' + esc(s.estResultLabel) + '</p>' +
      '<p class="est-range" dir="ltr">' + esc(estimateMoney(r.low)) +
        ' <span>–</span> ' + esc(estimateMoney(r.high)) + '</p>' +
      '<p class="est-note">' + esc(s.estDisclaimer) + '</p>' +
      '<p class="est-actions">' +
        '<a class="btn btn-wa" target="_blank" rel="noopener" href="' + esc(whatsappLink(waMessage)) + '">' +
          icon('whatsapp') + '<span>' + esc(s.estSendWhatsapp) + '</span></a>' +
        '<a class="btn btn-ghost" id="est-csv" download="laptop-estimate.csv">' +
          esc(s.estDownloadCsv) + '</a>' +
      '</p>' +
    '</div>' +
    '<details class="est-breakdown" open>' +
      '<summary>' + esc(s.estBreakdown) + '</summary>' +
      '<div class="table-scroll"><table><thead><tr>' +
        '<th>' + esc(s.estColItem) + '</th>' +
        '<th>' + esc(s.estColChoice) + '</th>' +
        '<th class="num">' + esc(s.estColEffect) + '</th>' +
      '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="est-note">' + esc(s.estCsvHint) + '</p>' +
    '</details>';

  attachCsvDownload(r);
}

/* Builds the CSV in the browser and hands it to the download link.
   The leading \ufeff is a byte-order mark: without it Excel opens the Arabic
   labels as mojibake. */
function attachCsvDownload(r) {
  var link = document.getElementById('est-csv');
  if (!link) return;
  var s = t();

  function cell(v) {
    var text = String(v == null ? '' : v);
    return '"' + text.replace(/"/g, '""') + '"';
  }

  var out = [['Item', 'Choice', 'Type', 'Value'].map(cell).join(',')];
  r.lines.forEach(function (line) {
    var groupLabel = s['est' + line.group.charAt(0).toUpperCase() + line.group.slice(1)] || line.group;
    out.push([groupLabel, shortLabel(line.option), line.kind, line.amount].map(cell).join(','));
  });
  out.push(['Subtotal', '', 'sum', r.subtotal].map(cell).join(','));
  out.push(['Market factor', '', 'multiplier', PRICING.marketFactor].map(cell).join(','));
  out.push(['Estimate low', '', 'usd', r.low].map(cell).join(','));
  out.push(['Estimate high', '', 'usd', r.high].map(cell).join(','));

  var blob = new Blob(['\ufeff' + out.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  if (ESTIMATE_CSV_URL) URL.revokeObjectURL(ESTIMATE_CSV_URL);
  ESTIMATE_CSV_URL = URL.createObjectURL(blob);
  link.setAttribute('href', ESTIMATE_CSV_URL);
}

/* -----------------------------------------------------------------------------
   7c) Deals

   A row on the deals tab becomes one card with a swipeable strip of pictures -
   the same set you would post as an Instagram carousel.

   The swiping itself is done by the browser, with CSS scroll snapping. The
   JavaScript here only keeps the dots and the arrows in step, which is why it
   works the same with a finger, a trackpad, a mouse wheel or a keyboard.
----------------------------------------------------------------------------- */

var DEAL_COLUMNS = ['active', 'title_en', 'title_ar', 'text_en', 'text_ar', 'images', 'link'];

function rowsToDeals(rows) {
  if (!rows.length) return [];

  var header = rows[0].map(function (h) {
    return String(h).trim().toLowerCase().replace(/\s+/g, '_');
  });
  var usesHeader = header.indexOf('images') !== -1;
  var body = usesHeader ? rows.slice(1) : rows;

  var idx = {};
  DEAL_COLUMNS.forEach(function (name) {
    var at = usesHeader ? header.indexOf(name) : -1;
    idx[name] = (at !== -1) ? at : DEAL_COLUMNS.indexOf(name);
  });

  return body.map(function (r) {
    function cell(name) {
      var at = idx[name];
      return (at > -1 && r[at] != null) ? String(r[at]).trim() : '';
    }
    return {
      active: cell('active'),
      title_en: cell('title_en'),
      title_ar: cell('title_ar'),
      text_en: cell('text_en'),
      text_ar: cell('text_ar'),
      link: cell('link'),
      images: cell('images').split(',').map(function (x) { return x.trim(); })
                            .filter(function (x) { return x !== ''; })
    };
  }).filter(function (d) {
    /* a row is shown when it has pictures and is not switched off */
    var off = d.active.toLowerCase();
    return d.images.length > 0 && off !== 'no' && off !== 'false' && off !== '0';
  });
}

function dealTitle(d) { return (LANG === 'ar' && d.title_ar) ? d.title_ar : d.title_en; }
function dealText(d)  { return (LANG === 'ar' && d.text_ar)  ? d.text_ar  : d.text_en; }

function dealHTML(d, i) {
  var s = t();
  var title = dealTitle(d);
  var text = dealText(d);
  var many = d.images.length > 1;

  var html = '<article class="deal" data-deal="' + i + '">';

  html += '<div class="deal-frame">';
  html += '<div class="deal-slides" data-slides>';
  d.images.forEach(function (file, j) {
    var alt = (title ? title + ' — ' : '') + s.altSuffix +
              (many ? ' (' + (j + 1) + '/' + d.images.length + ')' : '');
    html += '<div class="deal-slide">' +
      '<img src="' + esc(CONFIG.imagesPath + file) + '" alt="' + esc(alt) + '" ' +
      'loading="' + (i === 0 && j === 0 ? 'eager' : 'lazy') + '" decoding="async">' +
      '</div>';
  });
  html += '</div>';

  if (many) {
    html += '<button type="button" class="deal-arrow prev" data-step="-1" ' +
            'aria-label="' + esc(s.dealPrev) + '">' + chevron('prev') + '</button>';
    html += '<button type="button" class="deal-arrow next" data-step="1" ' +
            'aria-label="' + esc(s.dealNext) + '">' + chevron('next') + '</button>';
    html += '<div class="deal-dots" data-dots>';
    d.images.forEach(function (_, j) {
      html += '<button type="button" class="deal-dot' + (j === 0 ? ' is-on' : '') + '" ' +
              'data-go="' + j + '" aria-label="' + (j + 1) + ' / ' + d.images.length + '"></button>';
    });
    html += '</div>';
  }
  html += '</div>';

  if (title || text || d.link) {
    html += '<div class="deal-body">';
    if (title) html += '<h3 class="deal-title" dir="' + dirFor(title) + '">' + esc(title) + '</h3>';
    if (text)  html += '<p class="deal-text" dir="' + dirFor(text) + '">' + esc(text) + '</p>';
    html += '<p class="deal-actions">' +
      '<a class="btn btn-wa" target="_blank" rel="noopener" href="' +
        esc(whatsappLink(s.waDeal(title || s.dealsHeading))) + '">' +
        icon('whatsapp') + '<span>' + esc(s.dealAsk) + '</span></a>';
    if (d.link) {
      html += '<a class="btn btn-ghost" target="_blank" rel="noopener" href="' + esc(d.link) + '">' +
              icon('instagram') + '<span>' + esc(s.dealOnInstagram) + '</span></a>';
    }
    html += '</p></div>';
  }

  html += '</article>';
  return html;
}

function chevron(dir) {
  var d = (dir === 'prev') ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7';
  return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
         '<path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
         'stroke-linejoin="round" d="' + d + '"/></svg>';
}

function renderDeals() {
  var section = document.getElementById('deals');
  var host = document.getElementById('deals-list');
  if (!section || !host) return;

  if (!DEALS.length) { section.hidden = true; host.innerHTML = ''; return; }

  section.hidden = false;
  host.innerHTML = DEALS.map(dealHTML).join('');

  host.querySelectorAll('.deal').forEach(wireCarousel);

  host.querySelectorAll('.deal-slide img').forEach(function (img) {
    img.addEventListener('error', function handle() {
      img.removeEventListener('error', handle);
      img.src = IMAGE_PLACEHOLDER;
    });
  });
}

/* Keeps the dots and arrows in step with whatever the browser scrolled to.
   Using scrollIntoView and an observer rather than scrollLeft arithmetic means
   this behaves the same on the Arabic, right-to-left page. */
function wireCarousel(deal) {
  var strip = deal.querySelector('[data-slides]');
  var slides = [].slice.call(deal.querySelectorAll('.deal-slide'));
  var dots = [].slice.call(deal.querySelectorAll('[data-go]'));
  if (!strip || slides.length < 2) return;

  var current = 0;

  /* scrollIntoView would scroll every scrollable ancestor, dragging the whole
     page along with it. Scrolling the strip by a measured delta keeps the
     movement inside the carousel, and because the delta is relative it is
     correct on the right-to-left page too, where scrollLeft arithmetic is not
     consistent between browsers. */
  function show(i) {
    var at = Math.max(0, Math.min(slides.length - 1, i));
    var target = slides[at].getBoundingClientRect();
    var box = strip.getBoundingClientRect();
    var delta = (target.left + target.width / 2) - (box.left + box.width / 2);
    var gentle = !(window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (strip.scrollBy) strip.scrollBy({ left: delta, behavior: gentle ? 'smooth' : 'auto' });
    else strip.scrollLeft += delta;

    /* An arrow or a dot says exactly where we are going, so light up the right
       dot now instead of waiting for the scroll to be noticed. Swiping with a
       finger has no such intention to read, and is picked up by sync() below. */
    mark(at);
  }

  function mark(i) {
    current = i;
    dots.forEach(function (d, j) { d.classList.toggle('is-on', j === i); });
  }

  dots.forEach(function (d) {
    d.addEventListener('click', function () { show(parseInt(d.getAttribute('data-go'), 10)); });
  });

  deal.querySelectorAll('[data-step]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      show(current + parseInt(btn.getAttribute('data-step'), 10));
    });
  });

  /* Which slide you are looking at is worked out by measuring, not by
     listening for intersection events: whichever slide's centre sits nearest
     the middle of the strip is the current one. That is true whichever way the
     page reads, and it does not depend on when an observer happens to fire. */
  function sync() {
    var box = strip.getBoundingClientRect();
    var middle = box.left + box.width / 2;
    var best = 0;
    var nearest = Infinity;
    slides.forEach(function (sl, i) {
      var r = sl.getBoundingClientRect();
      var distance = Math.abs((r.left + r.width / 2) - middle);
      if (distance < nearest) { nearest = distance; best = i; }
    });
    if (best !== current) mark(best);
  }

  /* Called straight from the scroll event. Browsers already coalesce scroll
     events to about one per frame, and sync() only measures a handful of
     elements, so there is nothing to gain from a requestAnimationFrame gate -
     and plenty to lose: if that frame never arrives, which is what happens in
     a throttled background tab, the gate latches shut and the dots stop
     following the pictures for good. */
  strip.addEventListener('scroll', sync, { passive: true });

  window.addEventListener('resize', sync);

  /* a picture arriving late changes the geometry */
  deal.querySelectorAll('img').forEach(function (img) {
    img.addEventListener('load', sync);
  });

  mark(0);
  sync();
}

/* -----------------------------------------------------------------------------
   7d) Help me choose  (choose.html)

   The questions and the scoring live in chooser.js. This part only draws one
   question at a time and then the answer.
----------------------------------------------------------------------------- */

var ANSWERS = {};
var CHOOSE_STEP = 0;

function chooserOption(qKey, aKey) {
  var found = null;
  CHOOSER.questions.forEach(function (q) {
    if (q.key !== qKey) return;
    q.answers.forEach(function (a) { if (a.key === aKey) found = a; });
  });
  return found;
}

function renderChooser() {
  var host = document.getElementById('chooser');
  if (!host || typeof CHOOSER === 'undefined') return;
  var s = t();
  var qs = CHOOSER.questions;

  if (CHOOSE_STEP >= qs.length) { renderChooserResult(host); return; }

  var q = qs[CHOOSE_STEP];
  var html = '';

  html += '<div class="ch-progress" aria-hidden="true"><span style="width:' +
          Math.round((CHOOSE_STEP / qs.length) * 100) + '%"></span></div>';
  html += '<p class="ch-step">' + esc(s.chooseStep(CHOOSE_STEP + 1, qs.length)) + '</p>';
  html += '<h2 class="ch-question">' + esc(q[LANG] || q.en) + '</h2>';

  html += '<div class="ch-answers">';
  q.answers.forEach(function (a) {
    var on = (ANSWERS[q.key] === a.key);
    html += '<button type="button" class="ch-answer' + (on ? ' is-on' : '') + '" ' +
            'data-q="' + esc(q.key) + '" data-a="' + esc(a.key) + '">' +
            esc(a[LANG] || a.en) + '</button>';
  });
  html += '</div>';

  if (CHOOSE_STEP > 0) {
    html += '<p class="ch-nav"><button type="button" class="btn btn-ghost" data-back>' +
            esc(s.chooseBack) + '</button></p>';
  }

  host.innerHTML = html;

  host.querySelectorAll('[data-a]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      ANSWERS[btn.getAttribute('data-q')] = btn.getAttribute('data-a');
      CHOOSE_STEP++;
      renderChooser();
    });
  });
  var back = host.querySelector('[data-back]');
  if (back) back.addEventListener('click', function () {
    CHOOSE_STEP = Math.max(0, CHOOSE_STEP - 1);
    renderChooser();
  });
}

/* A plain-language line for each reason the scorer gave. */
function chooserReason(r) {
  var s = t();
  if (r.key === 'ram')    return s.chooseWhyRam(r.value);
  if (r.key === 'cpu')    return s.chooseWhyCpu(r.value);
  if (r.key === 'gen')    return s.chooseWhyGen(r.value);
  if (r.key === 'small')  return s.chooseWhySmall(r.value);
  if (r.key === 'big')    return s.chooseWhyBig(r.value);
  if (r.key === 'touch')  return s.chooseWhyTouch;
  if (r.key === 'budget') return s.chooseWhyBudget;
  return '';
}

/* "What will you mostly do on it? Internet, email..." for the WhatsApp message */
function chooserSummary() {
  return CHOOSER.questions.map(function (q) {
    var a = chooserOption(q.key, ANSWERS[q.key]);
    if (!a) return '';
    return '- ' + (q[LANG] || q.en) + ' ' + (a[LANG] || a.en);
  }).filter(Boolean).join('\n');
}

function renderChooserResult(host) {
  var s = t();
  var inStock = PRODUCTS.filter(isInStock);
  var picks = inStock.length ? chooseLaptops(inStock, ANSWERS) : [];

  var html = '<div class="ch-progress done" aria-hidden="true"><span style="width:100%"></span></div>';
  html += '<h2 class="ch-question">' + esc(s.chooseResultTitle) + '</h2>';

  if (!picks.length) {
    html += '<p class="ch-none">' + esc(s.chooseResultNone) + '</p>';
  } else {
    html += '<div class="ch-picks">';
    picks.forEach(function (r) {
      var reasons = r.reasons.map(chooserReason).filter(Boolean).slice(0, 3);
      html += '<div class="ch-pick">';
      if (reasons.length || r.overBudget) {
        html += '<ul class="ch-why">';
        reasons.forEach(function (line) { html += '<li>' + esc(line) + '</li>'; });
        if (r.overBudget) html += '<li class="over">' + esc(s.chooseOverBudget) + '</li>';
        html += '</ul>';
      }
      html += cardHTML({ model: r.product.model, key: slug(r.product.model) + '-pick',
                         variants: [r.product] });
      html += '</div>';
    });
    html += '</div>';
  }

  var pickName = picks.length ? picks[0].product.model : '';
  html += '<p class="ch-actions">' +
    '<a class="btn btn-wa" target="_blank" rel="noopener" href="' +
      esc(whatsappLink(s.waChoose(chooserSummary(), pickName))) + '">' +
      icon('whatsapp') + '<span>' + esc(s.chooseAsk) + '</span></a>' +
    '<button type="button" class="btn btn-ghost" data-restart>' + esc(s.chooseRestart) + '</button>' +
    '</p>';

  host.innerHTML = html;

  var restart = host.querySelector('[data-restart]');
  if (restart) restart.addEventListener('click', function () {
    ANSWERS = {}; CHOOSE_STEP = 0; renderChooser();
  });
  attachImageFallbacks(host);
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
    logo: CONFIG.siteUrl + '/' + CONFIG.imagesPath + (CONFIG.logo.image || 'logo.png'),
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

/* Two rows can share a model, so the model alone is not a unique id. */
function productRef(p) {
  return '#p-' + slug(p.model) + '-' + String(p.price).replace('.', '-');
}

function productNode(p) {
  var description = p.model + (p.spec_en ? ' — ' + p.spec_en : '') + '. ' +
    'Open box, ex-corporate, tested before shipping. ' +
    '3-month warranty and free delivery all over Lebanon.' +
    (p.touch ? ' Touchscreen, folds into a tablet.' : '') +
    (p.note_en ? ' ' + p.note_en : '');

  var node = {
    '@type': 'Product',
    '@id': CONFIG.siteUrl + '/' + productRef(p),
    name: p.model,
    description: description,
    category: categoryLabelEnglish(categoryOf(p)),
    itemCondition: 'https://schema.org/RefurbishedCondition',
    offers: {
      '@type': 'Offer',
      url: CONFIG.siteUrl + '/' + productRef(p),
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
    '@id': CONFIG.siteUrl + '/about#faq',
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

/* Deals are a nice-to-have. If the tab is not set up, or the request fails,
   the section stays hidden and the shop carries on as normal. */
function loadDeals() {
  if (!CONFIG.dealsCsvUrl || !document.getElementById('deals')) return;

  var url = CONFIG.dealsCsvUrl;
  if (CONFIG.bustCache) url += (url.indexOf('?') > -1 ? '&' : '?') + 'cb=' + Date.now();

  fetch(url, { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('Deals tab responded with ' + res.status);
      return res.text();
    })
    .then(function (text) { DEALS = rowsToDeals(parseCSV(text)); })
    .catch(function (err) {
      console.warn('RAS Solutions: could not load the deals tab.', err);
      DEALS = [];
    })
    .then(renderDeals);
}

function loadInventory() {
  /* The shop needs the sheet, and so does the chooser, which recommends from
     what is actually in stock. Pages that need neither - about, the estimator -
     skip the request entirely. */
  var needed = document.getElementById('catalog') || document.getElementById('chooser');
  if (!needed) { injectStructuredData(); return; }

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
      renderChooser();
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
  loadDeals();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
