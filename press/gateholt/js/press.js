/* Gateholt 프레스킷 — 언어 전환 · 라이트박스 · 스크롤 리빌 (외부 의존성 없음) */
(function () {
  'use strict';

  /* ---- 언어 전환: html[data-lang]만 바꾸면 CSS가 표시를 전환한다 ---- */
  var KEY = 'gateholt-press-lang';
  var root = document.documentElement;
  var select = document.getElementById('lang-select');
  /* data-lang 코드 → BCP 47 lang 속성값 */
  var LANGS = { en: 'en', ko: 'ko', ja: 'ja', fr: 'fr', de: 'de', es: 'es', ru: 'ru', zh: 'zh-Hans', zht: 'zh-Hant', pt: 'pt-BR' };

  function setLang(lang) {
    if (!LANGS[lang]) { lang = 'en'; }
    root.dataset.lang = lang;
    root.lang = LANGS[lang];
    select.value = lang;
    try { localStorage.setItem(KEY, lang); } catch (e) { /* 프라이빗 모드 등 */ }
  }

  /* 초기 언어: ?lang= 쿼리 > localStorage > 기본 en */
  var initial = new URLSearchParams(location.search).get('lang');
  if (!LANGS[initial]) {
    try { initial = localStorage.getItem(KEY); } catch (e) { initial = null; }
  }
  setLang(LANGS[initial] ? initial : 'en');

  select.addEventListener('change', function () { setLang(select.value); });

  /* ---- 라이트박스 ---- */
  var shots = Array.prototype.slice.call(document.querySelectorAll('.shot'));
  var box = document.getElementById('lightbox');
  var boxImg = box.querySelector('.lightbox-img');
  var boxOrig = box.querySelector('.lightbox-original');
  var idx = 0;

  function show(i) {
    idx = (i + shots.length) % shots.length;
    var thumb = shots[idx].querySelector('img');
    boxImg.src = thumb.src;
    boxImg.alt = thumb.alt;
    boxOrig.href = shots[idx].dataset.full;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function close() {
    box.hidden = true;
    document.body.style.overflow = '';
  }

  shots.forEach(function (s, i) {
    s.addEventListener('click', function () { show(i); });
  });
  box.querySelector('.lightbox-close').addEventListener('click', close);
  box.querySelector('.lightbox-prev').addEventListener('click', function () { show(idx - 1); });
  box.querySelector('.lightbox-next').addEventListener('click', function () { show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) { return; }
    if (e.key === 'Escape') { close(); }
    else if (e.key === 'ArrowLeft') { show(idx - 1); }
    else if (e.key === 'ArrowRight') { show(idx + 1); }
  });

  /* ---- 스크롤 리빌 ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('vis');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('vis'); });
  }
})();
