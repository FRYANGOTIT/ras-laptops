/* =============================================================================
   RAS Solutions - chooser.js

   THIS IS THE FILE YOU EDIT to change the "help me choose" questions.

   The rule the whole page is built on: a customer should never have to know
   what RAM is. Every question asks what they will DO with the laptop, and the
   translating into specifications happens down here, out of sight.

   So a question reads "lots of tabs open" and quietly means "16GB or more".
   If you ever find yourself writing "i5 or better" in a question, move it into
   the needs of an answer instead.

   To add a question, copy one block. To change wording, edit en / ar.
   Nothing else in the site needs to change.
============================================================================= */

var CHOOSER = {

  /* How many laptops to suggest. Three is enough to choose between without
     turning it back into a catalogue. */
  maxResults: 3,

  /* ===========================================================================
     WHAT EACH ANSWER QUIETLY ASKS FOR

       ram    minimum gigabytes of memory
       cpu    minimum processor level: 3, 5 or 7 (as in i3 / i5 / i7)
       gen    minimum processor generation - newer also means better battery
       maxScreen / minScreen   inches
       price  [lowest, highest] in USD
       touch  true when they asked for a folding touchscreen
     =========================================================================== */

  questions: [
    {
      key: 'use',
      en: 'What will you mostly do on it?',
      ar: 'شو رح تعمل فيه أكتر شي؟',
      answers: [
        { key: 'basic',
          en: 'Internet, email, Word and Excel, watching videos',
          ar: 'إنترنت، إيميل، Word و Excel، وفيديوهات',
          needs: { ram: 8, cpu: 3, gen: 8 } },
        { key: 'study',
          en: 'University work, with a lot of tabs open at once',
          ar: 'دراسة جامعية، ومعها كتير تابات مفتوحة',
          needs: { ram: 8, cpu: 5, gen: 10 } },
        { key: 'work',
          en: 'Accounting, big spreadsheets, running a small business',
          ar: 'محاسبة، جداول كبيرة، وشغل مؤسسة صغيرة',
          needs: { ram: 16, cpu: 5, gen: 10 } },
        { key: 'heavy',
          en: 'Design, video editing, programming, engineering programs',
          ar: 'تصميم، مونتاج، برمجة، وبرامج هندسة',
          needs: { ram: 16, cpu: 7, gen: 11 } }
      ]
    },

    {
      key: 'budget',
      en: 'What would you like to spend?',
      ar: 'قديش حابب تصرف؟',
      answers: [
        { key: 'low',    en: 'Up to $250',        ar: 'لحدود $250',      needs: { price: [0, 250] } },
        { key: 'mid',    en: '$250 to $350',      ar: 'بين $250 و $350', needs: { price: [250, 350] } },
        { key: 'high',   en: '$350 and above',    ar: '$350 وفوق',       needs: { price: [350, 99999] } },
        { key: 'any',    en: 'Show me what fits best, whatever it costs',
                         ar: 'فرجيني الأنسب، مهما كان السعر', needs: {} }
      ]
    },

    {
      key: 'carry',
      en: 'Where will it spend most of its time?',
      ar: 'وين رح يكون أكتر الوقت؟',
      answers: [
        { key: 'daily',
          en: 'In my bag every day — the lighter the better',
          ar: 'بشنطتي كل يوم — كل ما خف أحسن',
          needs: { maxScreen: 14 } },
        { key: 'between',
          en: 'Between home and one other place',
          ar: 'بين البيت ومحل تاني',
          needs: {} },
        { key: 'desk',
          en: 'On a desk — I would rather have a bigger screen',
          ar: 'عالطاولة — بفضّل شاشة أكبر',
          needs: { minScreen: 15 } }
      ]
    },

    {
      key: 'power',
      en: 'How often will you be away from a plug?',
      ar: 'قديش رح تكون بعيد عن الكهربا؟',
      answers: [
        { key: 'lots',
          en: 'A lot — I need it to last without electricity',
          ar: 'كتير — بدي ياه يضل شغال بلا كهربا',
          needs: { gen: 11 } },
        { key: 'some',
          en: 'A few hours at a time',
          ar: 'كم ساعة بالمرة',
          needs: { gen: 9 } },
        { key: 'rarely',
          en: 'Rarely, I am usually near one',
          ar: 'نادراً، عادةً بكون جنب مأخذ',
          needs: {} }
      ]
    },

    {
      key: 'touch',
      en: 'Would you like a screen that folds back into a tablet?',
      ar: 'بتحب شاشة تاتش بتنفتل تابلت؟',
      answers: [
        { key: 'yes',  en: 'Yes, that sounds useful', ar: 'إي، هيدا بيفيدني', needs: { touch: true } },
        { key: 'no',   en: 'No, a normal laptop is fine', ar: 'لأ، لابتوب عادي بيكفي', needs: {} }
      ]
    }
  ],

  /* ===========================================================================
     HOW MUCH EACH THING MATTERS
     Raise a number to make that answer count for more.
     =========================================================================== */
  weights: {
    ram: 30,        /* meeting the memory they need */
    cpu: 25,        /* meeting the processor level */
    gen: 15,        /* newer generation, mostly for battery */
    screen: 15,     /* the size they asked for */
    touch: 40,      /* they specifically asked for a folding touchscreen */
    priceInside: 35,/* sits inside the budget they picked */
    priceNear: 15,  /* just outside it, within priceNearBy dollars */
    stock: 5        /* a small nudge towards units we have more of */
  },

  /* How far outside the budget still counts as "close", in USD. */
  priceNearBy: 60
};


/* =============================================================================
   READING A SPECIFICATION

   The sheet stores specs as one line of text, like
     i5 12th gen / 16GB / 512GB / 14"
   which is right for a human reading a card but useless for comparing. This
   pulls the numbers back out. It reads the English spec even on the Arabic
   page, because that is where the numbers live.
============================================================================= */

function parseSpec(p) {
  var text = String(p.spec_en || '');
  var out = { ram: 0, storage: 0, cpu: 0, gen: 0, screen: 0, ssd: /ssd/i.test(text) };

  var cpu = text.match(/i\s*([3579])/i);
  if (cpu) out.cpu = parseInt(cpu[1], 10);
  else if (/ryzen\s*([3579])/i.test(text)) out.cpu = parseInt(text.match(/ryzen\s*([3579])/i)[1], 10);
  else if (/\bm[123]\b/i.test(text)) out.cpu = 7;          /* Apple silicon reads as high end */

  var gen = text.match(/(\d{1,2})\s*(?:th|st|nd|rd)\s*gen/i);
  if (gen) out.gen = parseInt(gen[1], 10);

  var screen = text.match(/([\d.]+)\s*(?:"|inch|in\b)/i);
  if (screen) out.screen = parseFloat(screen[1]);

  /* Memory and storage are both written in GB. Memory is the small number. */
  var gigs = [];
  text.replace(/(\d+)\s*GB/gi, function (whole, n) { gigs.push(parseInt(n, 10)); return whole; });
  gigs.forEach(function (n) {
    if (n <= 64) { if (!out.ram) out.ram = n; }
    else if (n > out.storage) out.storage = n;
  });
  var tb = text.match(/([\d.]+)\s*TB/i);
  if (tb) out.storage = Math.max(out.storage, parseFloat(tb[1]) * 1024);

  return out;
}


/* =============================================================================
   SCORING

   Every laptop in stock is scored against the answers. Nothing is ever ruled
   out completely: a customer who picks a budget nothing matches should still
   be shown the nearest thing, with the honest note that it is over.
============================================================================= */

/* Merge what every chosen answer asks for into one set of requirements. */
function chooserNeeds(answers) {
  var need = {};
  CHOOSER.questions.forEach(function (q) {
    var chosenKey = answers[q.key];
    if (!chosenKey) return;
    q.answers.forEach(function (a) {
      if (a.key !== chosenKey) return;
      Object.keys(a.needs || {}).forEach(function (k) {
        var v = a.needs[k];
        if (k === 'price') { need.price = v; }
        else if (k === 'touch') { need.touch = v; }
        else if (k === 'maxScreen') { need.maxScreen = Math.min(need.maxScreen || 99, v); }
        else if (k === 'minScreen') { need.minScreen = Math.max(need.minScreen || 0, v); }
        else { need[k] = Math.max(need[k] || 0, v); }
      });
    });
  });
  return need;
}

/* -> { score, reasons: [{key, value}] }  reasons are turned into sentences by
   the page, so that the wording lives with the rest of the wording. */
function scoreLaptop(p, answers) {
  var need = chooserNeeds(answers);
  var spec = parseSpec(p);
  var w = CHOOSER.weights;
  var score = 0;
  var reasons = [];

  if (need.ram) {
    if (spec.ram >= need.ram) { score += w.ram; if (spec.ram >= 16) reasons.push({ key: 'ram', value: spec.ram }); }
    else score -= w.ram * (1 - spec.ram / need.ram);
  }

  if (need.cpu) {
    if (spec.cpu >= need.cpu) { score += w.cpu; if (spec.cpu >= 7) reasons.push({ key: 'cpu', value: spec.cpu }); }
    else score -= w.cpu * ((need.cpu - spec.cpu) / need.cpu);
  }

  if (need.gen) {
    if (spec.gen >= need.gen) { score += w.gen; reasons.push({ key: 'gen', value: spec.gen }); }
    else score -= w.gen * Math.min(1, (need.gen - spec.gen) / 5);
  }

  if (need.maxScreen && spec.screen) {
    if (spec.screen <= need.maxScreen) { score += w.screen; reasons.push({ key: 'small', value: spec.screen }); }
    else score -= w.screen;
  }
  if (need.minScreen && spec.screen) {
    if (spec.screen >= need.minScreen) { score += w.screen; reasons.push({ key: 'big', value: spec.screen }); }
    else score -= w.screen;
  }

  if (need.touch) {
    if (p.touch) { score += w.touch; reasons.push({ key: 'touch' }); }
    else score -= w.touch;
  }

  var overBudget = false;
  if (need.price) {
    if (p.price >= need.price[0] && p.price <= need.price[1]) {
      score += w.priceInside;
      reasons.push({ key: 'budget' });
    } else {
      var distance = (p.price < need.price[0]) ? need.price[0] - p.price : p.price - need.price[1];
      if (distance <= CHOOSER.priceNearBy) score += w.priceNear;
      else score -= w.priceInside;
      if (p.price > need.price[1]) overBudget = true;
    }
  }

  score += Math.min(p.stock, 5) / 5 * w.stock;

  /* cheaper wins a tie, so the customer is never nudged upwards for nothing */
  score -= p.price / 10000;

  return { score: score, reasons: reasons, overBudget: overBudget, spec: spec };
}

/* The best few, best first. */
function chooseLaptops(list, answers) {
  return list.map(function (p) {
    var r = scoreLaptop(p, answers);
    r.product = p;
    return r;
  }).sort(function (a, b) {
    return b.score - a.score;
  }).slice(0, CHOOSER.maxResults);
}
