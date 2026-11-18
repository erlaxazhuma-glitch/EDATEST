/**
 * Приём результатов теста водителей в Google Таблицу.
 * Установка — см. ИНСТРУКЦИЯ.md. Пароль администратора задаётся в
 * «Настройки проекта → Свойства скрипта»: ключ ADMIN_KEY.
 */
var R_SHEET = "Результаты", P_SHEET = "Практика", S_SHEET = "Начатые";

var R_COLS = [
  ["id", "ID"], ["ts", "Дата"], ["stage", "Этап"], ["fio", "ФИО"], ["phone", "Телефон"], ["city", "Город"],
  ["exp_total", "Стаж общий"], ["exp_ce", "Стаж CE"], ["exp_intl", "Стаж междунар."], ["categories", "Категории"],
  ["has_card", "Карта водителя"], ["has_adr", "ДОПОГ"], ["has_passport", "Загранпаспорт"], ["has_c95", "Код 95"],
  ["score", "Верных"], ["total", "Всего"], ["percent", "%"], ["passed", "Сдал"], ["minutes", "Время, мин"],
  ["timeout", "Время вышло"], ["answers", "Ответы (JSON)"], ["lang", "Язык"],
  ["leaves", "Уходы со страницы"], ["away_sec", "Вне страницы, сек"]
];
// Начатые попытки: одна попытка на телефон и этап.
var S_COLS = [["ts", "Дата"], ["phone", "Телефон"], ["stage", "Этап"], ["fio", "ФИО"], ["lang", "Язык"], ["sid", "ID попытки"]];
var P_COLS = [
  ["ts", "Дата"], ["phone", "Телефон"], ["fio", "ФИО"], ["park", "Парковка"], ["couple", "Сцепка"],
  ["inspect", "Осмотр/устройство"], ["tacho", "Тахограф"], ["lashing", "Крепление"], ["comment", "Комментарий"], ["decision", "Решение"]
];
var TEXT_KEYS = { phone: 1, id: 1, answers: 1, categories: 1, sid: 1 };

function doGet() { return out({ ok: true, service: "driver-test" }); }

function doPost(e) {
  var d;
  try { d = JSON.parse(e.postData.contents); } catch (x) { return out({ ok: false, error: "bad_json" }); }
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    if (d.action === "start") {
      var s = d.record || {}, ph = normPhone(s.phone);
      if (!s.fio || ph.length < 11 || [1, 2].indexOf(+s.stage) < 0 || !s.sid) return out({ ok: false, error: "bad_record" });
      if (find(R_SHEET, R_COLS, ph, s.stage).length) return out({ ok: true, allowed: false, reason: "taken" });
      var st = find(S_SHEET, S_COLS, ph, s.stage);
      if (st.length) return out({ ok: true, allowed: st.some(function (x) { return String(x.sid) === String(s.sid); }), reason: "started" });
      s.phone = ph; append(S_SHEET, S_COLS, s);
      return out({ ok: true, allowed: true });
    }
    if (d.action === "submit") {
      var r = d.record || {};
      if (!r.fio || !r.phone || [1, 2].indexOf(+r.stage) < 0) return out({ ok: false, error: "bad_record" });
      var prev = find(R_SHEET, R_COLS, normPhone(r.phone), r.stage);
      if (prev.length) return out({ ok: true, duplicate: true }); // этап уже сдан — второй результат не записываем
      append(R_SHEET, R_COLS, r);
      return out({ ok: true });
    }
    if (!auth(d.key)) { Utilities.sleep(800); return out({ ok: false, error: "auth" }); }
    if (d.action === "list") return out({ ok: true, results: read(R_SHEET, R_COLS), practical: read(P_SHEET, P_COLS), started: read(S_SHEET, S_COLS) });
    if (d.action === "reset") {
      var rp = normPhone(d.phone);
      if (find(R_SHEET, R_COLS, rp, d.stage).length) return out({ ok: false, error: "taken" }); // сданный этап не сбрасывается
      var n = removeStarted(rp, d.stage);
      return out({ ok: true, removed: n });
    }
    if (d.action === "practical") { append(P_SHEET, P_COLS, d.record || {}); return out({ ok: true }); }
    return out({ ok: false, error: "unknown_action" });
  } finally { lock.releaseLock(); }
}

function auth(key) {
  var k = PropertiesService.getScriptProperties().getProperty("ADMIN_KEY");
  return !!k && typeof key === "string" && key === k;
}

function sheet(name, cols) {
  var ss = SpreadsheetApp.getActiveSpreadsheet(), sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.setFrozenRows(1);
  }
  // заголовки (в т.ч. новые столбцы, если таблица создана старой версией)
  var head = sh.getRange(1, 1, 1, cols.length);
  if (head.getValues()[0].join("") !== cols.map(function (c) { return c[1]; }).join("")) {
    head.setValues([cols.map(function (c) { return c[1]; })]).setFontWeight("bold");
  }
  return sh;
}

function normPhone(p) {
  var d = String(p || "").replace(/\D/g, "");
  if (d.length === 11 && d[0] === "8") d = "7" + d.slice(1);
  if (d.length === 10) d = "7" + d;
  return d;
}

function find(name, cols, phone, stage) {
  return read(name, cols).filter(function (r) { return normPhone(r.phone) === phone && +r.stage === +stage; });
}

function removeStarted(phone, stage) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(S_SHEET);
  if (!sh || sh.getLastRow() < 2) return 0;
  var vals = sh.getRange(2, 1, sh.getLastRow() - 1, S_COLS.length).getValues(), n = 0;
  for (var i = vals.length - 1; i >= 0; i--) {
    if (normPhone(vals[i][1]) === phone && +vals[i][2] === +stage) { sh.deleteRow(i + 2); n++; }
  }
  return n;
}

function append(name, cols, rec) {
  var row = cols.map(function (c) {
    var v = rec[c[0]];
    if (v === null || v === undefined) return "";
    if (typeof v === "number" && !TEXT_KEYS[c[0]]) return v;
    v = String(v).slice(0, c[0] === "answers" ? 20000 : 1000);
    if (TEXT_KEYS[c[0]] || /^[=+\-@]/.test(v)) v = "'" + v; // текст, а не формула/число
    return v;
  });
  sheet(name, cols).appendRow(row);
}

function read(name, cols) {
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  var vals = sh.getRange(2, 1, sh.getLastRow() - 1, cols.length).getValues();
  return vals.map(function (r) {
    var o = {};
    cols.forEach(function (c, i) { o[c[0]] = r[i] instanceof Date ? r[i].toISOString() : r[i]; });
    return o;
  });
}

function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
