/* =============================================================================
   RAS Solutions - pricing-model.js

   THIS IS THE FILE YOU EDIT to tune the price estimator.

   Every number below is a starting point, not a measured fact. They are set to
   plausible values for the Lebanese market so the tool works today. As you
   collect real prices, replace them. Nothing else in the site needs to change.

   HOW THE MATH WORKS, in one line:

     base = cpu value x generation factor
     subtotal = base + ram + storage + graphics + screen + extras
     value = subtotal x brand grade x condition x battery x marketFactor
     shown as a low-to-high range

   Two habits that will keep this useful:

   1. Change ONE group at a time and reload, so you can see what moved.
   2. Age is handled by the CPU generation, not by a separate "year" field.
      A 2017 laptop and a 7th-gen CPU are the same statement, and counting it
      twice would push old machines down to nothing.

   Each option carries its own en / ar label, so adding an option to a dropdown
   is a single line here and it appears on the site in both languages.
============================================================================= */

var PRICING = {

  /* ===========================================================================
     GLOBAL DIALS - the four numbers you will reach for most often
     =========================================================================== */

  /* Multiplies every estimate. This is your Lebanon market dial.
     If the tool reads high across the board, drop it to 0.95 or 0.90.
     If it reads low, push it to 1.05. Change this before touching anything else. */
  marketFactor: 1.00,

  /* How wide the shown range is. 0.12 means the estimate is shown as
     -12% to +12% around the calculated value. Widen it if you are not
     confident yet; narrow it as your price data gets better. */
  spreadPct: 0.12,

  /* Nothing is ever estimated below this, in USD. */
  minimumValue: 40,

  /* Estimates are rounded to the nearest multiple of this. */
  roundTo: 5,


  /* ===========================================================================
     PROCESSOR - the single biggest driver of value
     Value in USD before the generation factor is applied.
     =========================================================================== */

  cpu: [
    { key: 'celeron', value: 60,  en: 'Celeron / Pentium / Atom', ar: 'Celeron / Pentium / Atom' },
    { key: 'i3',      value: 110, en: 'Intel Core i3',            ar: 'Intel Core i3' },
    { key: 'ryzen3',  value: 115, en: 'AMD Ryzen 3',              ar: 'AMD Ryzen 3' },
    { key: 'i5',      value: 165, en: 'Intel Core i5',            ar: 'Intel Core i5' },
    { key: 'ryzen5',  value: 170, en: 'AMD Ryzen 5',              ar: 'AMD Ryzen 5' },
    { key: 'i7',      value: 235, en: 'Intel Core i7',            ar: 'Intel Core i7' },
    { key: 'ryzen7',  value: 240, en: 'AMD Ryzen 7',              ar: 'AMD Ryzen 7' },
    { key: 'xeon',    value: 220, en: 'Intel Xeon (workstation)', ar: 'Intel Xeon (workstation)' },
    { key: 'i9',      value: 330, en: 'Intel Core i9',            ar: 'Intel Core i9' },
    { key: 'ryzen9',  value: 340, en: 'AMD Ryzen 9',              ar: 'AMD Ryzen 9' },
    { key: 'm1',      value: 330, en: 'Apple M1',                 ar: 'Apple M1' },
    { key: 'm2',      value: 420, en: 'Apple M2',                 ar: 'Apple M2' },
    { key: 'm3',      value: 520, en: 'Apple M3 or newer',        ar: 'Apple M3 أو أحدث' }
  ],

  /* Generation multiplier. This is what carries age.
     Apple chips ignore this - pick "Recent" for them. */
  generation: [
    { key: 'g14', value: 1.34, en: '14th gen (2024+)',      ar: 'الجيل 14 (2024 وبعدها)' },
    { key: 'g13', value: 1.24, en: '13th gen (2023)',       ar: 'الجيل 13 (2023)' },
    { key: 'g12', value: 1.12, en: '12th gen (2022)',       ar: 'الجيل 12 (2022)' },
    { key: 'g11', value: 1.00, en: '11th gen (2021)',       ar: 'الجيل 11 (2021)' },
    { key: 'g10', value: 0.92, en: '10th gen (2020)',       ar: 'الجيل 10 (2020)' },
    { key: 'g9',  value: 0.84, en: '9th gen (2019)',        ar: 'الجيل 9 (2019)' },
    { key: 'g8',  value: 0.78, en: '8th gen (2018)',        ar: 'الجيل 8 (2018)' },
    { key: 'g7',  value: 0.68, en: '7th gen (2017)',        ar: 'الجيل 7 (2017)' },
    { key: 'g6',  value: 0.62, en: '6th gen (2016)',        ar: 'الجيل 6 (2016)' },
    { key: 'old', value: 0.50, en: 'Older than 6th gen',    ar: 'أقدم من الجيل 6' }
  ],


  /* ===========================================================================
     BRAND GRADE - multiplies the whole machine
     A business-grade chassis holds its value; a budget consumer one does not.
     The examples matter: they are how a normal visitor knows which to pick.
     =========================================================================== */

  brand: [
    { key: 'premium',  value: 1.15,
      en: 'Premium business — ThinkPad X1, EliteBook, Latitude 7000, MacBook',
      ar: 'شركات فئة عالية — ThinkPad X1، EliteBook، Latitude 7000، MacBook' },
    { key: 'business', value: 1.00,
      en: 'Business — ThinkPad T/L, Latitude 5000, ProBook',
      ar: 'شركات — ThinkPad T/L، Latitude 5000، ProBook' },
    { key: 'gaming',   value: 1.10,
      en: 'Gaming — Legion, ROG, TUF, Nitro, Predator',
      ar: 'غايمينغ — Legion، ROG، TUF، Nitro، Predator' },
    { key: 'consumer', value: 0.85,
      en: 'Consumer — Inspiron, IdeaPad, Vivobook, Aspire, Pavilion',
      ar: 'استهلاكي — Inspiron، IdeaPad، Vivobook، Aspire، Pavilion' },
    { key: 'budget',   value: 0.70,
      en: 'Budget or unbranded',
      ar: 'اقتصادي أو ماركة غير معروفة' }
  ],


  /* ===========================================================================
     MEMORY AND STORAGE - added in USD on top of the base
     =========================================================================== */

  ram: [
    { key: '4',  value: 0,   en: '4 GB',  ar: '4 GB' },
    { key: '8',  value: 25,  en: '8 GB',  ar: '8 GB' },
    { key: '16', value: 60,  en: '16 GB', ar: '16 GB' },
    { key: '32', value: 130, en: '32 GB', ar: '32 GB' },
    { key: '64', value: 240, en: '64 GB', ar: '64 GB' }
  ],

  storage: [
    { key: 'hdd500',  value: 0,   en: '500 GB HDD',  ar: '500 GB HDD' },
    { key: 'hdd1tb',  value: 10,  en: '1 TB HDD',    ar: '1 TB HDD' },
    { key: 'ssd128',  value: 20,  en: '128 GB SSD',  ar: '128 GB SSD' },
    { key: 'ssd256',  value: 35,  en: '256 GB SSD',  ar: '256 GB SSD' },
    { key: 'ssd512',  value: 60,  en: '512 GB SSD',  ar: '512 GB SSD' },
    { key: 'ssd1tb',  value: 100, en: '1 TB SSD',    ar: '1 TB SSD' },
    { key: 'ssd2tb',  value: 175, en: '2 TB SSD',    ar: '2 TB SSD' }
  ],


  /* ===========================================================================
     GRAPHICS - added in USD
     =========================================================================== */

  graphics: [
    { key: 'integrated', value: 0,   en: 'Integrated (Intel UHD / Iris / Radeon)', ar: 'مدمج (Intel UHD / Iris / Radeon)' },
    { key: 'entry',      value: 25,  en: 'Entry dedicated (MX150 – MX550)',        ar: 'كرت مستقل بسيط (MX150 – MX550)' },
    { key: 'quadro',     value: 150, en: 'Workstation (Quadro / RTX A)',           ar: 'ورك ستيشن (Quadro / RTX A)' },
    { key: 'gtx1650',    value: 110, en: 'GTX 1650 / RTX 3050',                    ar: 'GTX 1650 / RTX 3050' },
    { key: 'rtx3060',    value: 190, en: 'RTX 3060 / RTX 4050',                    ar: 'RTX 3060 / RTX 4050' },
    { key: 'rtx4060',    value: 280, en: 'RTX 3070 / RTX 4060',                    ar: 'RTX 3070 / RTX 4060' },
    { key: 'rtx4070',    value: 400, en: 'RTX 4070 or better',                     ar: 'RTX 4070 أو أقوى' }
  ],


  /* ===========================================================================
     SCREEN - added in USD
     =========================================================================== */

  screen: [
    { key: 'hd',    value: -20, en: '1366 x 768 (HD)',            ar: '1366 x 768 (HD)' },
    { key: 'fhd13', value: 0,   en: '13" – 14" Full HD',          ar: '13 – 14 إنش Full HD' },
    { key: 'fhd15', value: 5,   en: '15.6" Full HD',              ar: '15.6 إنش Full HD' },
    { key: 'fhd17', value: 15,  en: '17" Full HD',                ar: '17 إنش Full HD' },
    { key: 'qhd',   value: 40,  en: '1440p / 2K',                 ar: '1440p / 2K' },
    { key: 'uhd',   value: 85,  en: '4K or OLED',                 ar: '4K أو OLED' }
  ],


  /* ===========================================================================
     BATTERY - multiplies the whole machine
     =========================================================================== */

  battery: [
    { key: 'strong', value: 1.00, en: 'Holds 5 hours or more',    ar: 'بتضل شغالة 5 ساعات أو أكتر' },
    { key: 'ok',     value: 0.95, en: 'Holds 3 to 5 hours',       ar: 'بتضل شغالة من 3 لـ 5 ساعات' },
    { key: 'weak',   value: 0.88, en: 'Holds 1 to 3 hours',       ar: 'بتضل شغالة من ساعة لـ 3 ساعات' },
    { key: 'dead',   value: 0.80, en: 'Needs replacing',          ar: 'بدها تبديل' }
  ],


  /* ===========================================================================
     CONDITION - multiplies the whole machine
     =========================================================================== */

  condition: [
    { key: 'excellent', value: 1.00, en: 'Excellent — barely a mark on it',  ar: 'ممتازة — تقريباً ما فيها خربوشة' },
    { key: 'good',      value: 0.92, en: 'Good — light signs of wear',        ar: 'منيحة — أثر خفيف' },
    { key: 'fair',      value: 0.82, en: 'Fair — visible scratches or dents', ar: 'مقبولة — خرابيش أو دعسات باينة' },
    { key: 'repair',    value: 0.65, en: 'Something needs repair',            ar: 'في شي بدو تصليح' }
  ],


  /* ===========================================================================
     EXTRAS - checkboxes, each adds its value in USD
     Add a line here and a new checkbox appears on the page.
     =========================================================================== */

  extras: [
    { key: 'touch',      value: 25, en: 'Touchscreen',                    ar: 'شاشة تاتش' },
    { key: 'convert',    value: 35, en: 'Folds into a tablet (2-in-1)',   ar: 'بينفتل تابلت (2-in-1)' },
    { key: 'backlit',    value: 10, en: 'Backlit keyboard',               ar: 'كيبورد بإضاءة' },
    { key: 'arabic',     value: 5,  en: 'Arabic keyboard',                ar: 'كيبورد عربي' },
    { key: 'thunder',    value: 15, en: 'USB-C charging / Thunderbolt',   ar: 'شحن USB-C / Thunderbolt' },
    { key: 'fingerprint',value: 8,  en: 'Fingerprint or IR camera',       ar: 'بصمة أو كاميرا IR' },
    { key: 'charger',    value: 10, en: 'Original charger included',      ar: 'مع الشاحن الأصلي' },
    { key: 'warranty',   value: 20, en: 'Still under warranty',           ar: 'لسا عليها كفالة' }
  ]
};


/* =============================================================================
   THE CALCULATION
   You should not need to change anything below this line to tune prices.
============================================================================= */

/* Find one option by its key, so a missing or misspelled key cannot crash the
   page - it just falls back to the first option in the list. */
function pricingOption(group, key) {
  var list = PRICING[group] || [];
  for (var i = 0; i < list.length; i++) {
    if (list[i].key === key) return list[i];
  }
  return list[0] || { key: '', value: 0, en: '', ar: '' };
}

function roundToStep(n, step) {
  if (!step || step < 1) return Math.round(n);
  return Math.round(n / step) * step;
}

/* input looks like:
     { cpu:'i5', generation:'g11', brand:'business', ram:'16', storage:'ssd512',
       graphics:'integrated', screen:'fhd13', battery:'ok', condition:'good',
       extras:['touch','backlit'] }

   Returns the low and high figures plus a line-by-line breakdown, which is what
   the page shows and what the CSV export writes out. */
function estimateLaptopPrice(input) {
  var lines = [];

  var cpu = pricingOption('cpu', input.cpu);
  var gen = pricingOption('generation', input.generation);
  var base = cpu.value * gen.value;

  lines.push({ group: 'cpu',        option: cpu, kind: 'base',       amount: cpu.value });
  lines.push({ group: 'generation', option: gen, kind: 'multiplier', amount: gen.value });

  var additions = 0;
  ['ram', 'storage', 'graphics', 'screen'].forEach(function (group) {
    var opt = pricingOption(group, input[group]);
    additions += opt.value;
    lines.push({ group: group, option: opt, kind: 'add', amount: opt.value });
  });

  var chosenExtras = input.extras || [];
  PRICING.extras.forEach(function (extra) {
    if (chosenExtras.indexOf(extra.key) === -1) return;
    additions += extra.value;
    lines.push({ group: 'extras', option: extra, kind: 'add', amount: extra.value });
  });

  var subtotal = base + additions;

  var brand = pricingOption('brand', input.brand);
  var condition = pricingOption('condition', input.condition);
  var battery = pricingOption('battery', input.battery);

  lines.push({ group: 'brand',     option: brand,     kind: 'multiplier', amount: brand.value });
  lines.push({ group: 'condition', option: condition, kind: 'multiplier', amount: condition.value });
  lines.push({ group: 'battery',   option: battery,   kind: 'multiplier', amount: battery.value });

  var value = subtotal * brand.value * condition.value * battery.value * PRICING.marketFactor;
  if (value < PRICING.minimumValue) value = PRICING.minimumValue;

  var low = roundToStep(value * (1 - PRICING.spreadPct), PRICING.roundTo);
  var high = roundToStep(value * (1 + PRICING.spreadPct), PRICING.roundTo);
  if (low < PRICING.minimumValue) low = PRICING.minimumValue;
  if (high <= low) high = low + PRICING.roundTo;

  return {
    low: low,
    high: high,
    mid: roundToStep(value, PRICING.roundTo),
    base: Math.round(base),
    additions: Math.round(additions),
    subtotal: Math.round(subtotal),
    lines: lines
  };
}
