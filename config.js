/* ===== НАСТРОЙКИ САЙТА =====
   Меняйте только значения справа от двоеточия. */
window.APP_CONFIG = {
  // Адрес веб-приложения Google Apps Script (см. ИНСТРУКЦИЯ.md).
  // Пока пусто — сайт работает в демо-режиме: результаты хранятся только в этом браузере.
  SCRIPT_URL: "https://script.google.com/macros/s/AKfycbxxbClVr2bfDSYpwB2g-W6nIPXyh1ycwdI86FyGzbYkZmHXt_fbXr5uhWiTv0K90ImHxw/exec",

  COMPANY: "European Drivers Academy",
  LOGO_FILE: "logo.png", // положите файл логотипа рядом с index.html
  LOGO_URL: "https://europeandriversacademy.com/_astro/logo_11H53h.png", // запасной вариант

  STAGE1_PASS: 70,     // проходной балл этапа 1, % (14 из 20)
  STAGE2_PASS: 80,     // проходной балл этапа 2, %
  STAGE1_QUESTIONS: 20,     // сколько вопросов из банка (150) получает водитель на этапе 1
  STAGE2_QUESTIONS: 30,     // и на этапе 2
  STAGE2_IMG_QUESTIONS: 15, // из них на этапе 2 — вопросов с рисунком/схемой
  STAGE1_MINUTES: 30,  // время на этап 1
  STAGE2_MINUTES: 50,  // время на этап 2
  STAGE2_CODE: "EDA-2", // код допуска ко 2 этапу — сообщает рекрутер на собеседовании
  MIN_CE_YEARS: 3,     // минимальный стаж на категории CE для отбора, лет

  DEMO_ADMIN_PASSWORD: "admin" // пароль админки ТОЛЬКО для демо-режима
};
