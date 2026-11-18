/* Общие функции: логотип и обмен данными (Google Таблица или демо-хранилище в браузере). */
(function () {
  var C = window.APP_CONFIG;
  var LS_RESULTS = "eda_results", LS_PRACT = "eda_practical", LS_PENDING = "eda_pending", LS_STARTED = "eda_started";

  function lsGet(k) { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } }
  function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } }

  function post(body) {
    return fetch(C.SCRIPT_URL, { method: "POST", body: JSON.stringify(body) }) // text/plain — без CORS-preflight
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!j.ok) throw new Error(j.error || "server"); return j; });
  }

  window.API = {
    demo: !C.SCRIPT_URL,
    submit: function (rec) {
      if (!C.SCRIPT_URL) { var a = lsGet(LS_RESULTS); a.push(rec); lsSet(LS_RESULTS, a); return Promise.resolve({ ok: true }); }
      return post({ action: "submit", record: rec }).catch(function (e) {
        var p = lsGet(LS_PENDING); p.push(rec); lsSet(LS_PENDING, p); throw e;
      });
    },
    retryPending: function () {
      var p = lsGet(LS_PENDING); if (!p.length || !C.SCRIPT_URL) return Promise.resolve(0);
      return p.reduce(function (pr, rec) { return pr.then(function () { return post({ action: "submit", record: rec }); }); }, Promise.resolve())
        .then(function () { lsSet(LS_PENDING, []); return p.length; });
    },
    // Одна попытка на телефон и этап: сервер проверяет, не сдавал ли и не начинал ли водитель этот этап.
    // Ответ: { allowed: true } или { allowed: false, reason: "taken" | "started" }.
    start: function (rec) {
      if (!C.SCRIPT_URL) {
        var same = function (r) { return normPhone(r.phone) === rec.phone && +r.stage === +rec.stage; };
        if (lsGet(LS_RESULTS).some(same)) return Promise.resolve({ allowed: false, reason: "taken" });
        var st = lsGet(LS_STARTED), prev = st.filter(same)[0];
        if (prev) return Promise.resolve(prev.sid === rec.sid ? { allowed: true } : { allowed: false, reason: "started" });
        st.push(rec); lsSet(LS_STARTED, st); return Promise.resolve({ allowed: true });
      }
      return post({ action: "start", record: rec });
    },
    list: function (key) {
      if (!C.SCRIPT_URL) {
        if (key !== C.DEMO_ADMIN_PASSWORD) return Promise.reject(new Error("auth"));
        return Promise.resolve({ results: lsGet(LS_RESULTS), practical: lsGet(LS_PRACT), started: lsGet(LS_STARTED) });
      }
      return post({ action: "list", key: key });
    },
    // Сброс незавершённой попытки (сбой связи, разрядился телефон). Сданный этап не сбрасывается.
    reset: function (key, phone, stage) {
      if (!C.SCRIPT_URL) {
        if (key !== C.DEMO_ADMIN_PASSWORD) return Promise.reject(new Error("auth"));
        var done = lsGet(LS_RESULTS).some(function (r) { return normPhone(r.phone) === phone && +r.stage === +stage; });
        if (done) return Promise.reject(new Error("taken"));
        lsSet(LS_STARTED, lsGet(LS_STARTED).filter(function (r) { return !(normPhone(r.phone) === phone && +r.stage === +stage); }));
        return Promise.resolve({ ok: true });
      }
      return post({ action: "reset", key: key, phone: phone, stage: stage });
    },
    savePractical: function (key, rec) {
      if (!C.SCRIPT_URL) { var a = lsGet(LS_PRACT); a.push(rec); lsSet(LS_PRACT, a); return Promise.resolve({ ok: true }); }
      return post({ action: "practical", key: key, record: rec });
    }
  };

  window.renderLogo = function (el) {
    var img = new Image(); img.className = "logo-img"; img.alt = C.COMPANY;
    var tried = 0, srcs = [C.LOGO_FILE, C.LOGO_URL].filter(Boolean);
    img.onerror = function () { tried++; if (tried < srcs.length) img.src = srcs[tried]; else fallback(); };
    img.onload = function () { el.textContent = ""; el.appendChild(img); };
    function fallback() { el.innerHTML = '<div class="wordmark">EUROPEAN DRIVERS<b>ACADEMY</b></div>'; }
    fallback();
    if (srcs.length) img.src = srcs[0];
  };

  window.normPhone = function (p) { var d = String(p || "").replace(/\D/g, ""); if (d.length === 11 && d[0] === "8") d = "7" + d.slice(1); if (d.length === 10) d = "7" + d; return d; };
  window.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
})();
