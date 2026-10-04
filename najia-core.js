// Zi Wu Liu Zhu, metoda Na Jia (Xu Feng, Zhenjiu Daquan) oraz wariant AcuRhythm "Adopt. Stems"
// (punkt główny + punkt dnia partnera, 合日互用). Bez zależności; działa w przeglądarce i w Node.
(function (root) {
  const STEMS = "甲乙丙丁戊己庚辛壬癸";
  const STEMS_PL = ["Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"];
  const BRANCHES = "子丑寅卯辰巳午未申酉戌亥";
  const BRANCHES_PL = ["Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"];
  const ELEMENTS = ["Drewno", "Drewno", "Ogień", "Ogień", "Ziemia", "Ziemia", "Metal", "Metal", "Woda", "Woda"];
  const MERIDIANS = {
    GB: "Pęcherzyk żółciowy", LR: "Wątroba", SI: "Jelito cienkie", HT: "Serce", ST: "Żołądek",
    SP: "Śledziona", LI: "Jelito grube", LU: "Płuca", BL: "Pęcherz moczowy", KI: "Nerki",
    SJ: "Potrójny Ogrzewacz", PC: "Osierdzie",
  };

  // Sekwencja dla każdego Pnia dnia: [gałąź godziny, punkty [kod, nazwa, typ]].
  // Pierwsza pozycja to otwarcie dnia; kolejne co dwie godziny chińskie, także w dniu następnym.
  const P = (code, name, type) => ({ code, name, type });
  const SEQ = [
    [["戌", [P("GB44", "Zuqiaoyin 足窍阴", "Jing-studnia")]], ["子", [P("SI2", "Qiangu 前谷", "Ying")]], ["寅", [P("ST43", "Xiangu 陷谷", "Shu"), P("GB40", "Qiuxu 丘墟", "Yuan")]], ["辰", [P("LI5", "Yangxi 阳溪", "Jing-rzeka")]], ["午", [P("BL40", "Weizhong 委中", "He")]], ["申", [P("SJ2", "Yemen 液门", "Ying (Qi do SJ)")]]],
    [["酉", [P("LR1", "Dadun 大敦", "Jing-studnia")]], ["亥", [P("HT8", "Shaofu 少府", "Ying")]], ["丑", [P("SP3", "Taibai 太白", "Shu"), P("LR3", "Taichong 太冲", "Yuan")]], ["卯", [P("LU8", "Jingqu 经渠", "Jing-rzeka")]], ["巳", [P("KI10", "Yingu 阴谷", "He")]], ["未", [P("PC8", "Laogong 劳宫", "Ying (Xue do PC)")]]],
    [["申", [P("SI1", "Shaoze 少泽", "Jing-studnia")]], ["戌", [P("ST44", "Neiting 内庭", "Ying")]], ["子", [P("LI3", "Sanjian 三间", "Shu"), P("SI4", "Wangu 腕骨", "Yuan")]], ["寅", [P("BL60", "Kunlun 昆仑", "Jing-rzeka")]], ["辰", [P("GB34", "Yanglingquan 阳陵泉", "He")]], ["午", [P("SJ3", "Zhongzhu 中渚", "Shu (Qi do SJ)")]]],
    [["未", [P("HT9", "Shaochong 少冲", "Jing-studnia")]], ["酉", [P("SP2", "Dadu 大都", "Ying")]], ["亥", [P("LU9", "Taiyuan 太渊", "Shu"), P("HT7", "Shenmen 神门", "Yuan")]], ["丑", [P("KI7", "Fuliu 复溜", "Jing-rzeka")]], ["卯", [P("LR8", "Ququan 曲泉", "He")]], ["巳", [P("PC7", "Daling 大陵", "Shu (Xue do PC)")]]],
    [["午", [P("ST45", "Lidui 厉兑", "Jing-studnia")]], ["申", [P("LI2", "Erjian 二间", "Ying")]], ["戌", [P("BL65", "Shugu 束骨", "Shu"), P("ST42", "Chongyang 冲阳", "Yuan")]], ["子", [P("GB38", "Yangfu 阳辅", "Jing-rzeka")]], ["寅", [P("SI8", "Xiaohai 小海", "He")]], ["辰", [P("SJ6", "Zhigou 支沟", "Jing-rzeka (Qi do SJ)")]]],
    [["巳", [P("SP1", "Yinbai 隐白", "Jing-studnia")]], ["未", [P("LU10", "Yuji 鱼际", "Ying")]], ["酉", [P("KI3", "Taixi 太溪", "Shu"), P("SP3", "Taibai 太白", "Yuan")]], ["亥", [P("LR4", "Zhongfeng 中封", "Jing-rzeka")]], ["丑", [P("HT3", "Shaohai 少海", "He")]], ["卯", [P("PC5", "Jianshi 间使", "Jing-rzeka (Xue do PC)")]]],
    [["辰", [P("LI1", "Shangyang 商阳", "Jing-studnia")]], ["午", [P("BL66", "Zutonggu 足通谷", "Ying")]], ["申", [P("GB41", "Zulinqi 足临泣", "Shu"), P("LI4", "Hegu 合谷", "Yuan")]], ["戌", [P("SI5", "Yanggu 阳谷", "Jing-rzeka")]], ["子", [P("ST36", "Zusanli 足三里", "He")]], ["寅", [P("SJ10", "Tianjing 天井", "He (Qi do SJ)")]]],
    [["卯", [P("LU11", "Shaoshang 少商", "Jing-studnia")]], ["巳", [P("KI2", "Rangu 然谷", "Ying")]], ["未", [P("LR3", "Taichong 太冲", "Shu"), P("LU9", "Taiyuan 太渊", "Yuan")]], ["酉", [P("HT4", "Lingdao 灵道", "Jing-rzeka")]], ["亥", [P("SP9", "Yinlingquan 阴陵泉", "He")]], ["丑", [P("PC3", "Quze 曲泽", "He (Xue do PC)")]]],
    [["寅", [P("BL67", "Zhiyin 至阴", "Jing-studnia")]], ["辰", [P("GB43", "Xiaxi 侠溪", "Ying")]], ["午", [P("SI3", "Houxi 后溪", "Shu"), P("BL64", "Jinggu 京骨", "Yuan"), P("SJ4", "Yangchi 阳池", "Yuan SJ")]], ["申", [P("ST41", "Jiexi 解溪", "Jing-rzeka")]], ["戌", [P("LI11", "Quchi 曲池", "He")]], ["子", [P("SJ1", "Guanchong 关冲", "Jing-studnia (Qi do SJ)")]]],
    [["亥", [P("KI1", "Yongquan 涌泉", "Jing-studnia")]], ["丑", [P("LR2", "Xingjian 行间", "Ying")]], ["卯", [P("HT7", "Shenmen 神门", "Shu"), P("KI3", "Taixi 太溪", "Yuan"), P("PC7", "Daling 大陵", "Yuan PC")]], ["巳", [P("SP5", "Shangqiu 商丘", "Jing-rzeka")]], ["未", [P("LU5", "Chize 尺泽", "He")]], ["酉", [P("PC9", "Zhongchong 中冲", "Jing-studnia (Xue do PC)")]]],
  ];

  const DAY = 86400000;
  const meridianOf = (code) => MERIDIANS[code.replace(/\d+$/, "")];

  // Dzień kalendarzowy jako liczba dni od 1970-01-01 (bez strefy czasowej).
  const dayNumber = (y, m, d) => Math.round(Date.UTC(y, m - 1, d) / DAY);
  const fromDayNumber = (n) => { const t = new Date(n * DAY); return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() }; };

  // Cykl 60 dni: 1970-01-01 = 辛巳 (indeks 17). Zgodne z JDN: (JDN + 49) mod 60.
  const ganzhi = (n) => (((n + 17) % 60) + 60) % 60;
  const stemOf = (n) => ganzhi(n) % 10;

  // Punkty otwarte w dniu n o gałęzi b (0 = 子): z sekwencji tego dnia lub dnia poprzedniego.
  function openPoints(n, b) {
    for (const [dn, extra] of [[n, 0], [n - 1, 12]]) {
      const seq = SEQ[stemOf(dn)];
      const b0 = BRANCHES.indexOf(seq[0][0]);
      for (const [br, pts] of seq) {
        const abs = b0 + ((BRANCHES.indexOf(br) - b0 + 12) % 12);
        if (abs === b + extra) return pts;
      }
    }
    return [];
  }
  const hourStem = (n, b) => (stemOf(n) * 2 + b) % 10;

  // Równanie czasu (Spencer / NOAA), minuty; t = chwila UTC w ms.
  function equationOfTime(t) {
    const d = new Date(t);
    const doy = (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 1)) / DAY + 1;
    const g = (2 * Math.PI / 365) * (doy - 1 + (d.getUTCHours() - 12) / 24);
    return 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  }

  // Przesunięcie strefy (ms) w chwili t.
  function tzOffset(tz, t) {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(new Date(t));
    const v = Object.fromEntries(parts.map((p) => [p.type, +p.value]));
    return Date.UTC(v.year, v.month - 1, v.day, v.hour % 24, v.minute, v.second) - Math.floor(t / 1000) * 1000;
  }

  // Chwila UTC (ms) dla lokalnego czasu "dzień n, godzina h" (h może być ujemne lub ≥ 24).
  // mode "solar": prawdziwy czas słoneczny dla długości lon; mode "clock": czas zegarowy strefy tz.
  function instant(n, hours, opt) {
    const naive = n * DAY + hours * 3600000;
    if (opt.mode === "clock") {
      let t = naive - tzOffset(opt.tz, naive);
      t = naive - tzOffset(opt.tz, t);
      return t;
    }
    let t = naive - opt.lon * 240000; // średni czas słoneczny
    return t - equationOfTime(t) * 60000;
  }

  // Przedział godziny chińskiej b dnia n; 子 zaczyna się o 23:00 dnia poprzedniego.
  const toMinute = (t) => Math.floor(t / 60000) * 60000;
  function slot(n, b, opt) {
    return { start: toMinute(instant(n, 2 * b - 1, opt)), end: toMinute(instant(n, 2 * b + 1, opt)) };
  }

  // Otwarcie dnia n wg wybranego algorytmu ("najia" albo "acurhythm").
  function dayOpening(n, algorithm, opt) {
    const s = stemOf(n);
    const [br, pts] = SEQ[s][0];
    const b = BRANCHES.indexOf(br);
    const partner = algorithm === "acurhythm" ? openPoints(n + 5, b) : [];
    const hs = hourStem(n, b);
    return {
      day: n, date: fromDayNumber(n), ganzhi: ganzhi(n), stem: s,
      element: ELEMENTS[s] + (s % 2 ? " Yin" : " Yang"),
      meridian: meridianOf(pts[0].code), points: pts, partner,
      hour: { stem: hs, branch: b, label: STEMS[hs] + BRANCHES[b] + " " + STEMS_PL[hs] + " " + BRANCHES_PL[b] },
      ...slot(n, b, opt),
    };
  }

  // Numeracja jak w AcuRhythm: S = Pień (甲 = 1 … 癸 = 10), B = Gałąź (子 = 1 … 亥 = 12).
  const sbLabel = (g) => `S${(g % 10) + 1}B${(g % 12) + 1}`;
  const gzLabel = (g) => STEMS[g % 10] + BRANCHES[g % 12] + " " + STEMS_PL[g % 10] + " " + BRANCHES_PL[g % 12];

  // --- iCalendar ---
  const esc = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  const stamp = (t) => new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  function fold(line) {
    const out = []; let cur = ""; let bytes = 0;
    for (const ch of line) {
      const b = new TextEncoder().encode(ch).length;
      if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ""; bytes = 0; }
      cur += ch; bytes += b;
    }
    out.push(cur);
    return out.join("\r\n ");
  }
  const pointLine = (p) => `${p.code} ${p.name} (${p.type}, ${meridianOf(p.code)})`;

  function buildICS(openings, o) {
    const algName = o.algorithm === "acurhythm" ? "AcuRhythm Adopt. Stems" : "Na Jia (Xu Feng)";
    const now = stamp(Date.now());
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//meridian//Zi Wu Liu Zhu Na Jia//PL", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:" + esc(o.calendarName || "Otwarcia meridianów")];
    for (const e of openings) {
      const main = e.points.map((p) => p.code).join(", ");
      const summary = `${sbLabel(e.ganzhi)} ${STEMS[e.ganzhi % 10]}${BRANCHES[e.ganzhi % 12]} · ${main} ${e.points[0].name.split(" ")[0]}, ${e.meridian}` + (e.partner.length ? ` (${e.partner.map((p) => p.code).join(", ")})` : "");
      const desc = [
        `Pień ${e.stem + 1}: ${STEMS[e.stem]} ${STEMS_PL[e.stem]} (${e.element}) · Gałąź ${(e.ganzhi % 12) + 1}: ${BRANCHES[e.ganzhi % 12]} ${BRANCHES_PL[e.ganzhi % 12]} · dzień ${sbLabel(e.ganzhi)} ${gzLabel(e.ganzhi)}`,
        `Meridian dnia: ${e.meridian}`,
        `Godzina chińska: ${e.hour.label}`,
        ...e.points.map(pointLine),
        ...e.partner.map((p) => "Partner: " + pointLine(p)),
        `Metoda: ${algName}. ${o.timeLabel}`,
      ].join("\n");
      const { y, m, d } = e.date;
      lines.push("BEGIN:VEVENT",
        `UID:${y}${String(m).padStart(2, "0")}${String(d).padStart(2, "0")}-${o.algorithm}@meridian-najia`,
        "DTSTAMP:" + now, "DTSTART:" + stamp(e.start), "DTEND:" + stamp(e.end),
        "SUMMARY:" + esc(summary), "DESCRIPTION:" + esc(desc), "TRANSP:TRANSPARENT", "CATEGORIES:Zi Wu Liu Zhu");
      if (o.alarmMinutes != null) {
        lines.push("BEGIN:VALARM", "ACTION:DISPLAY", "DESCRIPTION:" + esc(summary), `TRIGGER:-PT${o.alarmMinutes}M`, "END:VALARM");
      }
      lines.push("END:VEVENT");
    }
    lines.push("END:VCALENDAR");
    return lines.map(fold).join("\r\n") + "\r\n";
  }

  root.NaJia = { STEMS, STEMS_PL, BRANCHES, BRANCHES_PL, MERIDIANS, SEQ, dayNumber, fromDayNumber, ganzhi, stemOf, openPoints, hourStem, slot, dayOpening, gzLabel, sbLabel, meridianOf, buildICS, tzOffset };
})(typeof window !== "undefined" ? window : globalThis);
