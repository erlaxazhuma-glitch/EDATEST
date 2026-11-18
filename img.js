/* Библиотека рисунков для вопросов. Каждая функция возвращает SVG-строку или функцию (lang) => SVG. */
(function () {
  var RED = "#C8102E", INK = "#1A1F2B", ORANGE = "#F28C00", BLUE = "#0159BB", YEL = "#FEC337", GREY = "#9AA3AE", ROAD = "#7D8794", BG = "#E9EDF2", CARGO = "#C9822B";
  var F = 'font-family="Arial,Helvetica,sans-serif"';
  function svg(inner, w, h) { return '<svg viewBox="0 0 ' + (w || 320) + ' ' + (h || 200) + '" xmlns="http://www.w3.org/2000/svg" role="img">' + inner + '</svg>'; }
  function txt(x, y, s, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (o.size || 14) + '"' + (o.bold ? ' font-weight="700"' : '') +
      ' fill="' + (o.fill || INK) + '" text-anchor="' + (o.anchor || "middle") + '">' + s + '</text>';
  }
  function L(lang, ru, kk) { return lang === "kk" ? kk : ru; }
  function truck(x, y, s, col) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" fill="' + (col || INK) + '">' +
      '<rect x="0" y="0" width="58" height="34" rx="2"/><path d="M60 10h18l12 14v10H60z"/>' +
      '<circle cx="14" cy="40" r="7"/><circle cx="34" cy="40" r="7"/><circle cx="78" cy="40" r="7"/></g>';
  }
  function car(x, y, s, col) {
    return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" fill="' + (col || INK) + '">' +
      '<path d="M4 24h70v-10l-12-2-10-10H22L12 12H4z"/><circle cx="18" cy="26" r="7"/><circle cx="60" cy="26" r="7"/></g>';
  }

  /* ---------- Знаки ---------- */
  function ring(content) { return svg('<circle cx="160" cy="100" r="72" fill="#fff" stroke="' + RED + '" stroke-width="14"/>' + content); }
  var sign = {
    limit: function (t, size) { return ring(txt(160, 116, t, { size: size || 48, bold: true })); },
    speed: function (n) { return ring(txt(160, 120, n, { size: 60, bold: true })); },
    height: function (t) { return ring('<path d="M160 42l-14 18h28zM160 158l-14-18h28z" fill="' + INK + '"/>' + txt(160, 115, t, { size: 40, bold: true })); },
    width: function (t) { return ring('<path d="M96 100l18-14v28zM224 100l-18-14v28z" fill="' + INK + '"/>' + txt(160, 114, t, { size: 36, bold: true })); },
    axle: function (t) { return ring(txt(160, 102, t, { size: 44, bold: true }) + '<g fill="' + INK + '"><rect x="126" y="120" width="68" height="6"/><rect x="116" y="110" width="14" height="26" rx="3"/><rect x="190" y="110" width="14" height="26" rx="3"/></g>'); },
    trucks: function (t) { return ring(truck(116, 76, 0.95) + (t ? txt(160, 150, t, { size: 18, bold: true }) : "")); },
    trailer: ring('<g fill="' + INK + '"><rect x="96" y="82" width="40" height="26" rx="2"/><path d="M138 90h14l10 10v8h-24z"/><rect x="170" y="80" width="54" height="28"/><rect x="160" y="100" width="12" height="3"/>' +
      '<circle cx="108" cy="114" r="6"/><circle cx="150" cy="114" r="6"/><circle cx="186" cy="114" r="6"/><circle cx="210" cy="114" r="6"/></g>'),
    noOvertakeTrucks: ring('<g transform="translate(96,76) scale(.68)">' + '<rect x="0" y="0" width="58" height="34" rx="2" fill="' + RED + '"/><path d="M60 10h18l12 14v10H60z" fill="' + RED + '"/><circle cx="14" cy="40" r="7" fill="' + RED + '"/><circle cx="78" cy="40" r="7" fill="' + RED + '"/></g>' + car(166, 86, 0.72)),
    noDanger: ring('<rect x="118" y="80" width="84" height="40" fill="' + ORANGE + '" stroke="#111" stroke-width="4"/>'),
    stop: svg('<path d="M130 28h60l42 42v60l-42 42h-60l-42-42V70z" fill="' + RED + '" stroke="#fff" stroke-width="6"/>' + txt(160, 116, "STOP", { size: 40, bold: true, fill: "#fff" })),
    warn: function (inner) { return svg('<path d="M160 22l84 148H76z" fill="#fff" stroke="' + RED + '" stroke-width="12" stroke-linejoin="round"/>' + inner); },
    dangerDir: svg('<circle cx="160" cy="100" r="78" fill="' + BLUE + '"/><path d="M120 120h70v-26h-14l30-34 30 34h-14v40h-102z" fill="#fff"/><rect x="124" y="70" width="40" height="22" fill="' + ORANGE + '" stroke="#111" stroke-width="3"/>'),
    endAll: svg('<circle cx="160" cy="100" r="76" fill="#fff" stroke="#999" stroke-width="3"/><path d="M110 160L210 40" stroke="#333" stroke-width="10"/><path d="M98 148L198 28M122 172L222 52" stroke="#333" stroke-width="5"/>')
  };
  sign.descent = function (p) { return sign.warn('<path d="M150 154L210 118v36z" fill="' + INK + '"/>' + txt(132, 122, p, { size: 22, bold: true })); };
  sign.wind = sign.warn('<path d="M130 150V78" stroke="' + INK + '" stroke-width="6"/><path d="M133 80l58 12-58 14z" fill="' + RED + '"/>');
  sign.rail = sign.warn('<g fill="' + INK + '"><rect x="122" y="110" width="76" height="26" rx="3"/><rect x="176" y="92" width="22" height="20"/><rect x="130" y="98" width="12" height="12"/><circle cx="136" cy="142" r="7"/><circle cx="160" cy="142" r="7"/><circle cx="186" cy="142" r="7"/></g>');
  sign.narrow = sign.warn('<path d="M138 152c0-30 8-42 8-70M182 152c0-30-8-42-8-70" stroke="' + INK + '" stroke-width="8" fill="none"/>');
  sign.rocks = sign.warn('<path d="M126 152l18-60 10 60z" fill="' + INK + '"/><circle cx="176" cy="108" r="9" fill="' + INK + '"/><circle cx="188" cy="132" r="7" fill="' + INK + '"/><circle cx="172" cy="140" r="6" fill="' + INK + '"/>');

  /* ---------- Таблички на ТС ---------- */
  var plates = {
    adr: function (top, bottom) {
      return svg('<rect x="70" y="30" width="180" height="140" rx="6" fill="' + ORANGE + '" stroke="#111" stroke-width="8"/>' +
        (top ? '<line x1="74" y1="100" x2="246" y2="100" stroke="#111" stroke-width="6"/>' + txt(160, 84, top, { size: 46, bold: true, fill: "#111" }) + txt(160, 152, bottom, { size: 46, bold: true, fill: "#111" }) : ""));
    },
    roadTrain: svg('<rect x="70" y="40" width="180" height="150" rx="10" fill="#0B2447"/><rect x="88" y="62" width="144" height="58" rx="4" fill="#9CC3EA"/>' +
      '<rect x="84" y="140" width="40" height="16" rx="3" fill="#FFF3C4"/><rect x="196" y="140" width="40" height="16" rx="3" fill="#FFF3C4"/><rect x="128" y="150" width="64" height="22" fill="#1E3A5F"/>' +
      '<g fill="' + ORANGE + '" stroke="#7A4700" stroke-width="2"><rect x="112" y="18" width="20" height="18" rx="3"/><rect x="150" y="18" width="20" height="18" rx="3"/><rect x="188" y="18" width="20" height="18" rx="3"/></g>'),
    longVehicle: svg('<rect x="40" y="70" width="240" height="60" fill="' + YEL + '" stroke="' + RED + '" stroke-width="10"/>' + txt(160, 110, "LONG VEHICLE", { size: 24, bold: true })),
    oversize: svg('<rect x="40" y="70" width="240" height="60" fill="' + YEL + '" stroke="#111" stroke-width="4"/>' + txt(160, 112, "OVERSIZE", { size: 30, bold: true })),
    slowVehicle: svg('<path d="M160 30l80 140H80z" fill="' + ORANGE + '" stroke="' + RED + '" stroke-width="14" stroke-linejoin="round"/>'),
    stripes: svg('<defs><clipPath id="stc"><rect x="70" y="40" width="180" height="120"/></clipPath></defs><rect x="70" y="40" width="180" height="120" fill="#fff" stroke="#333" stroke-width="2"/>' +
      '<g clip-path="url(#stc)">' + [0, 1, 2, 3, 4, 5, 6].map(function (i) { return '<path d="M' + (40 + i * 40) + ' 160l60-120h20l-60 120z" fill="' + RED + '"/>'; }).join("") + '</g>')
  };

  /* ---------- Время работы и отдыха ---------- */
  var KIND = { d: BLUE, b: YEL, r: "#2E9E5B", w: "#8E5BD0", a: "#C9D2DE", q: "#EEF1F5" };
  function timeline(segs, opts) {
    opts = opts || {};
    return function (lang) {
      var total = segs.reduce(function (s, x) { return s + x[1]; }, 0), W = 300, x = 10, out = "";
      segs.forEach(function (sg) {
        var w = Math.max(18, sg[1] / total * W), col = KIND[sg[0]];
        out += '<rect x="' + x + '" y="56" width="' + w + '" height="40" fill="' + col + '" stroke="#fff" stroke-width="1"/>';
        var lab = typeof sg[2] === "object" ? sg[2][lang] : sg[2];
        var dark = sg[0] === "b" || sg[0] === "a" || sg[0] === "q";
        if (lab) out += w >= 52 ? txt(x + w / 2, 81, lab, { size: 12, fill: dark ? INK : "#fff" }) : txt(x + w / 2, 116, lab, { size: 11 }) + '<path d="M' + (x + w / 2) + ' 98v6" stroke="' + INK + '"/>';
        x += w;
      });
      var leg = [["d", L(lang, "вождение", "жүргізу")], ["b", L(lang, "перерыв", "үзіліс")], ["r", L(lang, "отдых", "демалыс")], ["w", L(lang, "работа", "жұмыс")]];
      var lx = 10; out += leg.map(function (l) { var s = '<rect x="' + lx + '" y="140" width="12" height="12" fill="' + KIND[l[0]] + '"/>' + txt(lx + 16, 151, l[1], { size: 11, anchor: "start" }); lx += 78; return s; }).join("");
      if (opts.top) out += txt(160, 34, typeof opts.top === "object" ? opts.top[lang] : opts.top, { size: 13, bold: true });
      return svg('<rect width="320" height="170" fill="#fff"/>' + out, 320, 170);
    };
  }

  /* ---------- Тахограф ---------- */
  var tachoIcon = {
    d: function (x, y) { return '<g transform="translate(' + x + ',' + y + ')" fill="none" stroke="currentColor" stroke-width="2.4"><circle r="9"/><path d="M-9 0h18M0 0v9"/></g>'; },
    w: function (x, y) { return '<g transform="translate(' + x + ',' + y + ')" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M-8 8L8-8M8 8L-8-8"/></g>'; },
    a: function (x, y) { return '<g transform="translate(' + x + ',' + y + ')" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="-8" y="-8" width="16" height="16"/><path d="M-8 8L8-8"/></g>'; },
    r: function (x, y) { return '<g transform="translate(' + x + ',' + y + ')" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M-10 8v-12M-10 4h20v4M10 4v-4h-12"/><circle cx="-6" cy="-1" r="2" fill="currentColor"/></g>'; }
  };
  function tachoScreen(line1, line2) {
    function render(line, y) {
      var x = 30, out = "";
      line.forEach(function (p) {
        if (p.length === 1 && tachoIcon[p]) { out += tachoIcon[p](x + 6, y - 6); x += 26; }
        else { out += '<text x="' + x + '" y="' + y + '" font-family="Courier New,monospace" font-size="20" font-weight="700" fill="currentColor">' + p + '</text>'; x += p.length * 12.5 + 8; }
      });
      return out;
    }
    return svg('<rect x="10" y="30" width="300" height="140" rx="12" fill="#2B2F36"/><rect x="24" y="52" width="272" height="96" rx="4" fill="#B9D88A"/>' +
      '<g color="#1D2A12" style="color:#1D2A12">' + render(line1, 90) + render(line2 || [], 130) + '</g>', 320, 200);
  }
  function tachoSymbols(order) {
    order = order || ["d", "w", "a", "r"];
    return svg('<g color="' + INK + '" style="color:' + INK + '">' + order.map(function (k, i) {
      return '<g transform="translate(' + (40 + i * 80) + ',80) scale(2.4)">' + tachoIcon[k](0, 0) + '</g>' + txt(40 + i * 80, 150, String(i + 1), { size: 18, bold: true });
    }).join("") + '</g>', 320, 170);
  }

  /* ---------- Приборная панель ---------- */
  function lamp(kind, color) {
    var c = color === "red" ? "#E0322F" : color === "amber" ? "#F2A100" : color === "green" ? "#2EAA5C" : "#3D8BFF";
    var icons = {
      abs: txt(0, 9, "ABS", { size: 26, bold: true, fill: c }),
      brake: '<circle r="22" fill="none" stroke="' + c + '" stroke-width="5"/>' + txt(0, 10, "!", { size: 30, bold: true, fill: c }) + '<path d="M-32-18a36 36 0 0 0 0 36M32-18a36 36 0 0 1 0 36" stroke="' + c + '" stroke-width="5" fill="none"/>',
      park: '<circle r="22" fill="none" stroke="' + c + '" stroke-width="5"/>' + txt(0, 10, "P", { size: 28, bold: true, fill: c }) + '<path d="M-32-18a36 36 0 0 0 0 36M32-18a36 36 0 0 1 0 36" stroke="' + c + '" stroke-width="5" fill="none"/>',
      stop: txt(0, 10, "STOP", { size: 30, bold: true, fill: c }),
      trailerAbs: '<g fill="' + c + '"><rect x="-40" y="-14" width="56" height="22"/><rect x="18" y="-6" width="18" height="14"/><circle cx="-28" cy="14" r="5"/><circle cx="-12" cy="14" r="5"/></g>' + txt(-12, 3, "ABS", { size: 13, bold: true, fill: "#222" }),
      oil: '<path d="M-30 6h40l18-14-4-4-14 8h-40z" fill="' + c + '"/><path d="M28-6l6 10" stroke="' + c + '" stroke-width="4"/><path d="M-22-6v-8h12v8" fill="' + c + '"/>',
      temp: '<path d="M-3-26h6v30a10 10 0 1 1-6 0z" fill="' + c + '"/><path d="M-26 18c6-4 12 4 18 0s12 4 18 0 12 4 18 0" stroke="' + c + '" stroke-width="4" fill="none"/>',
      battery: '<rect x="-28" y="-14" width="56" height="34" fill="none" stroke="' + c + '" stroke-width="5"/><path d="M-20-20h10M10-20h10M-18 3h10M12 3h10M17-2v10" stroke="' + c + '" stroke-width="4"/>',
      adblue: '<path d="M0-26c10 14 18 22 18 32a18 18 0 0 1-36 0c0-10 8-18 18-32z" fill="none" stroke="' + c + '" stroke-width="5"/>' + txt(0, 14, "DEF", { size: 13, bold: true, fill: c }),
      diff: '<g stroke="' + c + '" stroke-width="5" fill="none"><rect x="-34" y="-20" width="12" height="40"/><rect x="22" y="-20" width="12" height="40"/><path d="M-22 0h44"/><circle r="10"/><path d="M-8-8l16 16M8-8l-16 16"/></g>',
      engine: '<path d="M-30-10h10v-8h24v8h10l8 8h6v-6h6v24h-6v-6h-6v14h-46v-12h-6v-12h6z" fill="none" stroke="' + c + '" stroke-width="4"/>',
      water: '<path d="M-24 18h48M-16-20h32v26a16 10 0 0 1-32 0z" fill="none" stroke="' + c + '" stroke-width="4"/>' + txt(0, -2, "H₂O", { size: 12, bold: true, fill: c })
    };
    return svg('<rect x="80" y="20" width="160" height="160" rx="22" fill="#14181F"/><g transform="translate(160,100) scale(1.3)">' + icons[kind] + '</g>');
  }
  function gauge(v1, v2, labels) {
    function needle(v, col) { var a = (-120 + v / 12 * 240) * Math.PI / 180; return '<path d="M160 110L' + (160 + 70 * Math.sin(a)).toFixed(1) + ' ' + (110 - 70 * Math.cos(a)).toFixed(1) + '" stroke="' + col + '" stroke-width="5" stroke-linecap="round"/>'; }
    var ticks = ""; for (var i = 0; i <= 12; i += 2) { var a = (-120 + i / 12 * 240) * Math.PI / 180; ticks += txt((160 + 66 * Math.sin(a)).toFixed(1), (115 - 66 * Math.cos(a)).toFixed(1), i, { size: 12, fill: "#fff" }); }
    return function (lang) {
      return svg('<circle cx="160" cy="110" r="88" fill="#14181F"/><path d="M' + (160 + 84 * Math.sin(-120 * Math.PI / 180)).toFixed(1) + ' ' + (110 - 84 * Math.cos(-120 * Math.PI / 180)).toFixed(1) + 'A84 84 0 0 1 ' + (160 + 84 * Math.sin(-70 * Math.PI / 180)).toFixed(1) + ' ' + (110 - 84 * Math.cos(-70 * Math.PI / 180)).toFixed(1) + '" stroke="#E0322F" stroke-width="8" fill="none"/>' +
        ticks + needle(v1, "#F2A100") + (v2 != null ? needle(v2, "#3D8BFF") : "") + '<circle cx="160" cy="110" r="7" fill="#ccc"/>' + txt(160, 160, "bar", { size: 13, fill: "#fff" }) +
        (labels ? txt(60, 214, L(lang, "контур 1", "1-контур"), { size: 12, fill: "#F2A100" }) + txt(260, 214, L(lang, "контур 2", "2-контур"), { size: 12, fill: "#3D8BFF" }) : ""), 320, 220);
    };
  }

  /* ---------- Крепление груза ---------- */
  function strapLabel(lc, stf, extra) {
    return svg('<rect x="40" y="16" width="240" height="168" rx="6" fill="#2F6FD6"/><g ' + F + ' fill="#fff">' +
      '<text x="160" y="44" text-anchor="middle" font-size="16" font-weight="700">EN 12195-2 · PES</text>' +
      '<text x="62" y="78" font-size="18" font-weight="700">LC ' + lc + ' daN</text>' +
      '<text x="62" y="104" font-size="16">S<tspan font-size="11">HF</tspan> 50 daN</text>' +
      '<text x="62" y="130" font-size="16">S<tspan font-size="11">TF</tspan> ' + stf + ' daN</text>' +
      '<text x="62" y="156" font-size="14">L<tspan font-size="10">GF</tspan> 0,5 m · L<tspan font-size="10">GL</tspan> 8 m</text>' +
      '<text x="62" y="176" font-size="12">' + (extra || "Not for lifting!") + '</text></g>');
  }
  function topOver(angleDeg, label) {
    var a = angleDeg * Math.PI / 180, dx = 80 / Math.tan(a);
    return svg('<rect x="0" y="160" width="320" height="40" fill="' + GREY + '"/><rect x="110" y="80" width="100" height="80" fill="' + CARGO + '" stroke="#7A4A12" stroke-width="2"/>' +
      '<path d="M' + (110 - dx).toFixed(0) + ' 160L110 80h100l' + dx.toFixed(0) + ' 80" fill="none" stroke="#2F6FD6" stroke-width="6"/>' +
      txt(Math.max(40, 110 - dx + 26), 150, label || ("α ≈ " + angleDeg + "°"), { size: 16, anchor: "start" }));
  }
  function gapScene(lang) {
    return svg('<rect x="0" y="150" width="320" height="16" fill="' + GREY + '"/><rect x="20" y="50" width="10" height="100" fill="#3A4A63"/>' +
      '<rect x="110" y="80" width="60" height="70" fill="' + CARGO + '" stroke="#7A4A12"/><rect x="172" y="80" width="60" height="70" fill="' + CARGO + '" stroke="#7A4A12"/><rect x="234" y="80" width="60" height="70" fill="' + CARGO + '" stroke="#7A4A12"/>' +
      '<path d="M30 70h80" stroke="' + RED + '" stroke-width="2"/><path d="M30 70l8-5v10zM110 70l-8-5v10z" fill="' + RED + '"/>' + txt(70, 62, "1 м", { size: 14, bold: true, fill: RED }) +
      txt(26, 40, L(lang, "борт", "борт"), { size: 12 }) + '<path d="M60 182h-40" stroke="' + INK + '" stroke-width="2"/><path d="M20 182l8-5v10z" fill="' + INK + '"/>' + txt(80, 186, L(lang, "направление движения", "жүру бағыты"), { size: 12, anchor: "start" }), 320, 200);
  }
  function diagonal() {
    return svg('<rect x="0" y="150" width="320" height="20" fill="#5B6573"/><g fill="#E0A100"><rect x="90" y="96" width="140" height="44" rx="6"/><rect x="120" y="60" width="70" height="38" rx="4"/></g>' +
      '<rect x="80" y="134" width="160" height="16" rx="8" fill="#333"/>' +
      '<path d="M86 140L36 150M234 140L284 150M100 112L60 150M220 112L260 150" stroke="' + INK + '" stroke-width="4" stroke-dasharray="6 3"/>', 320, 180);
  }
  function edge(prot) {
    return svg('<rect x="80" y="70" width="160" height="100" fill="#7B8796"/><path d="M60 170L80 70h160l20 100" fill="none" stroke="#2F6FD6" stroke-width="7"/>' +
      (prot ? '<path d="M70 82h18v-18M250 82h-18v-18" fill="none" stroke="' + ORANGE + '" stroke-width="10"/>' : '<circle cx="80" cy="70" r="14" fill="none" stroke="' + RED + '" stroke-width="3"/><circle cx="240" cy="70" r="14" fill="none" stroke="' + RED + '" stroke-width="3"/>'), 320, 190);
  }
  function cg(lang, pos) {
    var x = pos === "rear" ? 230 : pos === "front" ? 80 : 155;
    return svg('<rect x="0" y="176" width="320" height="24" fill="' + GREY + '"/><rect x="40" y="70" width="250" height="92" fill="none" stroke="#3A4A63" stroke-width="3"/>' +
      '<rect x="' + (x - 30) + '" y="96" width="60" height="64" fill="' + CARGO + '" stroke="#7A4A12" stroke-width="2"/>' +
      '<rect x="8" y="96" width="44" height="64" rx="4" fill="' + BLUE + '"/><g fill="' + INK + '"><circle cx="24" cy="170" r="10"/><circle cx="60" cy="170" r="10"/><circle cx="232" cy="170" r="10"/><circle cx="256" cy="170" r="10"/><circle cx="280" cy="170" r="10"/></g>' +
      txt(20, 52, L(lang, "перёд", "алды"), { size: 13, anchor: "start" }), 320, 200);
  }

  /* ---------- Сцепка ---------- */
  var airLines = svg(txt(90, 186, "1", { size: 16, bold: true }) + txt(230, 186, "2", { size: 16, bold: true }) +
    '<circle cx="90" cy="90" r="52" fill="#D3202A"/><circle cx="90" cy="90" r="22" fill="#5B0E12"/><circle cx="230" cy="90" r="52" fill="#F2C200"/><circle cx="230" cy="90" r="22" fill="#6B5500"/>' +
    '<path d="M90 142v24M230 142v24" stroke="#333" stroke-width="10"/>');
  function fifthWheel(closed) {
    return svg('<path d="M60 40h200l30 60-30 60H60l-30-60z" fill="#3A4A63"/><path d="M146 40l14 40 14-40" fill="' + BG + '"/>' +
      '<circle cx="160" cy="' + (closed ? 100 : 66) + '" r="13" fill="#C9D2DE" stroke="#111" stroke-width="3"/>' +
      '<rect x="' + (closed ? 136 : 118) + '" y="106" width="' + (closed ? 48 : 30) + '" height="14" fill="' + (closed ? "#2EAA5C" : RED) + '"/>' +
      '<rect x="250" y="120" width="60" height="10" fill="' + (closed ? "#2EAA5C" : RED) + '"/>', 320, 200);
  }
  function plateHeight(diff) { // diff: "high" | "low" | "ok"
    var y = diff === "high" ? 104 : diff === "low" ? 136 : 124;
    return svg('<rect x="0" y="182" width="320" height="18" fill="' + GREY + '"/><rect x="150" y="' + (y - 50) + '" width="170" height="44" fill="#3A4A63"/><rect x="150" y="' + (y - 6) + '" width="170" height="6" fill="#6B7A90"/>' +
      '<rect x="10" y="96" width="60" height="62" rx="6" fill="' + BLUE + '"/><rect x="60" y="148" width="150" height="12" fill="' + INK + '"/><path d="M150 146h80l-6-12h-68z" fill="' + RED + '"/>' +
      '<g fill="' + INK + '"><circle cx="40" cy="170" r="12"/><circle cx="170" cy="170" r="12"/><circle cx="200" cy="170" r="12"/></g>');
  }

  /* ---------- Шины ---------- */
  function tread(kind) {
    var y = { center: [60, 88, 60], shoulders: [88, 60, 88], side: [58, 74, 92], ok: [62, 60, 62] }[kind];
    return svg('<path d="M50 150V' + y[0] + 'Q160 ' + (2 * y[1] - (y[0] + y[2]) / 2) + ' 270 ' + y[2] + 'V150z" fill="#2B2F36"/>' +
      '<path d="M50 60H270" stroke="#9AA3AE" stroke-width="2" stroke-dasharray="6 4"/>' +
      [80, 120, 160, 200, 240].map(function (x) { return '<rect x="' + (x - 4) + '" y="96" width="8" height="40" fill="#454B55"/>'; }).join(""), 320, 170);
  }

  /* ---------- Манёвры (вид сверху) ---------- */
  var scenes = {
    rightTurn: function (lang) {
      return svg('<rect width="320" height="240" fill="#B9C2CC"/><rect x="120" y="0" width="80" height="240" fill="' + ROAD + '"/><rect x="0" y="120" width="320" height="80" fill="' + ROAD + '"/>' +
        '<rect x="200" y="200" width="120" height="40" fill="#B9C2CC"/><circle cx="200" cy="200" r="0"/>' +
        '<rect x="168" y="150" width="20" height="70" fill="#3A4A63"/><rect x="170" y="128" width="16" height="20" fill="' + BLUE + '"/>' +
        '<path d="M178 128C180 70 220 150 300 150" stroke="' + YEL + '" stroke-width="4" stroke-dasharray="8 6" fill="none"/>' +
        '<path d="M200 210c10-30 40-50 100-52" stroke="' + RED + '" stroke-width="3" stroke-dasharray="4 4" fill="none"/>' +
        '<circle cx="214" cy="186" r="9" fill="' + RED + '"/>' + txt(250, 228, L(lang, "велосипедист", "велосипедші"), { size: 12 }), 320, 240);
    },
    blindspot: function () {
      return svg('<rect width="320" height="220" fill="' + ROAD + '"/><path d="M0 110h320" stroke="#fff" stroke-width="3" stroke-dasharray="20 14"/>' +
        '<rect x="30" y="122" width="190" height="40" fill="#3A4A63"/><rect x="224" y="124" width="40" height="36" rx="4" fill="' + BLUE + '"/>' +
        '<path d="M266 160L320 220H170z" fill="#E77C7C" opacity=".6"/>' + car(186, 176, 0.6, "#F5F5F5"), 320, 220);
    },
    reverseRight: function (lang) {
      return svg('<rect width="320" height="224" fill="' + BG + '"/><rect x="138" y="18" width="44" height="40" rx="4" fill="' + BLUE + '"/><rect x="130" y="62" width="60" height="140" fill="#3A4A63"/>' +
        '<path d="M190 200c30 0 60-6 84-22" fill="none" stroke="' + RED + '" stroke-width="4" stroke-dasharray="8 6"/><path d="M274 178l-16 2 8 12z" fill="' + RED + '"/>' +
        txt(160, 12, L(lang, "кабина (вид сверху)", "кабина (үстінен көрініс)"), { size: 12 }) + txt(250, 216, L(lang, "нужно увести", "бұру керек"), { size: 12 }), 320, 224);
    },
    jackknife: svg('<rect width="320" height="220" fill="' + BG + '"/><g transform="rotate(-38 170 120)"><rect x="150" y="100" width="44" height="40" rx="4" fill="' + BLUE + '"/></g>' +
      '<rect x="40" y="96" width="140" height="50" fill="#3A4A63"/><circle cx="178" cy="121" r="5" fill="' + YEL + '"/>', 320, 220),
    ramp: function (lang) {
      return svg('<rect width="320" height="240" fill="' + BG + '"/><rect x="0" y="0" width="320" height="40" fill="#8A6D4B"/>' +
        '<g fill="#fff"><rect x="40" y="40" width="60" height="6"/><rect x="130" y="40" width="60" height="6"/><rect x="220" y="40" width="60" height="6"/></g>' +
        '<rect x="134" y="60" width="52" height="120" fill="#3A4A63" transform="rotate(25 160 150)"/><rect x="200" y="176" width="40" height="40" rx="4" fill="' + BLUE + '" transform="rotate(60 220 196)"/>' +
        txt(160, 26, L(lang, "рампа", "рампа"), { size: 14, bold: true, fill: "#fff" }), 320, 240);
    },
    roundabout: svg('<rect width="320" height="240" fill="#B9C2CC"/><circle cx="160" cy="120" r="100" fill="' + ROAD + '"/><circle cx="160" cy="120" r="44" fill="#7FB069"/><circle cx="160" cy="120" r="58" fill="none" stroke="#D9C68A" stroke-width="14"/>' +
      '<rect x="140" y="160" width="40" height="80" fill="' + ROAD + '"/>', 320, 240),
    overtakeHill: function (lang) {
      return svg('<rect width="320" height="200" fill="#CFE3F5"/><path d="M0 200L160 90 320 200z" fill="' + ROAD + '"/><path d="M80 150L160 95" stroke="#fff" stroke-width="3"/>' +
        truck(60, 130, 0.6) + txt(160, 80, "?", { size: 26, bold: true }), 320, 200);
    },
    powerLine: function (lang) {
      return svg('<rect width="320" height="220" fill="#CFE3F5"/><rect x="0" y="190" width="320" height="30" fill="' + ROAD + '"/>' +
        '<path d="M20 40L300 50" stroke="#333" stroke-width="2"/><rect x="12" y="30" width="10" height="160" fill="#666"/><rect x="296" y="40" width="10" height="150" fill="#666"/>' +
        '<rect x="60" y="150" width="200" height="16" fill="#333"/><g fill="#E0A100"><rect x="100" y="104" width="120" height="46" rx="4"/><path d="M150 104l40-48h10l-30 48z"/></g>' +
        '<path d="M240 52v136" stroke="' + RED + '" stroke-width="2" stroke-dasharray="5 4"/>' + txt(250, 120, "?", { size: 22, bold: true, fill: RED, anchor: "start" }), 320, 220);
    },
    escort: function (lang) {
      return svg('<rect width="320" height="200" fill="' + ROAD + '"/><path d="M0 100h320" stroke="#fff" stroke-width="3" stroke-dasharray="18 12"/>' +
        car(20, 110, 0.7, ORANGE) + '<rect x="90" y="106" width="150" height="40" fill="#E0A100"/><rect x="240" y="108" width="40" height="36" rx="4" fill="' + BLUE + '"/>' + car(290, 110, 0.7, ORANGE) +
        '<rect x="32" y="102" width="20" height="6" fill="#F2A100"/><rect x="302" y="102" width="20" height="6" fill="#F2A100"/>', 320, 200);
    }
  };

  /* ---------- Коробка передач (китайские тягачи: Fast 12JS) ---------- */
  function gearLever(lang) {
    return svg('<rect width="320" height="220" fill="#2B2F36"/><rect x="130" y="40" width="60" height="150" rx="28" fill="#4A515C"/>' +
      '<rect x="190" y="70" width="34" height="18" rx="4" fill="' + YEL + '"/>' + txt(207, 84, "H/L", { size: 11, bold: true }) +
      '<rect x="96" y="100" width="34" height="18" rx="4" fill="#3D8BFF"/>' + txt(113, 114, "⇅", { size: 13, bold: true, fill: "#fff" }) +
      txt(250, 84, L(lang, "кнопка 1", "1-батырма"), { size: 12, fill: "#fff", anchor: "start" }) + txt(10, 114, L(lang, "кнопка 2", "2-батырма"), { size: 12, fill: "#fff", anchor: "start" }), 320, 220);
  }

  window.IMG = {
    sign: sign, plates: plates, timeline: timeline, tachoScreen: tachoScreen, tachoSymbols: tachoSymbols, lamp: lamp, gauge: gauge,
    strapLabel: strapLabel, topOver: topOver, gapScene: gapScene, diagonal: diagonal, edge: edge, cg: cg,
    airLines: airLines, fifthWheel: fifthWheel, plateHeight: plateHeight, tread: tread, scenes: scenes, gearLever: gearLever, truck: truck, svg: svg, txt: txt
  };
})();
