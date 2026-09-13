// Aviso de cookies y preferencias de privacidad (Ley 1581 de 2012, Habeas Data).
// BaseComponents.js lo importa en todas las páginas y se monta solo. La decisión
// se guarda en la cookie smed_consent y se expone en window.SMED_CONSENT: todo
// script opcional (analítica, comunicaciones) debe consultarla antes de cargarse.
const COOKIE = "smed_consent";
const VERSION = 1;
const MAX_AGE = 60 * 60 * 24 * 180; // 180 días
const OPTIONAL = ["analytics", "comms"];

const readConsent = () => {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]*)`));
  if (!match) return null;
  try {
    const data = JSON.parse(decodeURIComponent(match[1]));
    // A new VERSION asks again, e.g. when a new category is added
    return data && data.v === VERSION ? data : null;
  } catch (e) {
    return null;
  }
};

const writeConsent = (choices) => {
  const data = {
    v: VERSION,
    necessary: true,
    analytics: !!choices.analytics,
    comms: !!choices.comms,
    ts: new Date().toISOString(),
  };
  const secure = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE}=${encodeURIComponent(JSON.stringify(data))}; Max-Age=${MAX_AGE}; Path=/; SameSite=Lax${secure}`;
  return data;
};

const currentLang = () => {
  try {
    return localStorage.getItem("smed-lang") || "es";
  } catch (e) {
    return "es";
  }
};

// Removing [hidden] and adding the class on the next frames lets the entrance transition run
const reveal = (el) => {
  clearTimeout(el.ccTimer);
  el.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add("is-open")));
};

const conceal = (el) => {
  el.classList.remove("is-open");
  el.ccTimer = setTimeout(() => {
    el.hidden = true;
  }, 400);
};

const TEMPLATE = `
  <section class="cc-banner" aria-labelledby="cc-title" hidden>
    <div class="cc-head">
      <span class="cc-icon" aria-hidden="true"><i class="bx bx-cookie"></i></span>
      <div>
        <p class="cc-kicker" data-i18n="cookie.kicker">Privacidad</p>
        <h2 class="cc-title" id="cc-title" data-i18n="cookie.title">Usamos cookies</h2>
      </div>
    </div>
    <p class="cc-text" data-i18n="cookie.text">Guardamos lo necesario para que el sitio funcione, como tu idioma y tu tema. Si lo aceptas, también podremos medir las visitas de forma anónima y mostrarte información sobre nuestros servicios.</p>
    <a class="cc-link" href="/habeas-data#cookies" data-i18n="cookie.policy">Política de tratamiento de datos (Habeas Data)</a>
    <div class="cc-actions">
      <button type="button" class="cc-btn cc-btn--primary" data-cc="accept" data-i18n="cookie.acceptAll">Aceptar todo</button>
      <button type="button" class="cc-btn cc-btn--ghost" data-cc="necessary" data-i18n="cookie.necessaryOnly">Solo necesarias</button>
      <button type="button" class="cc-btn cc-btn--text" data-cc="prefs" data-i18n="cookie.configure">Configurar</button>
    </div>
  </section>

  <div class="cc-modal" hidden>
    <div class="cc-backdrop" data-cc="close"></div>
    <div class="cc-dialog" role="dialog" aria-modal="true" aria-labelledby="cc-prefs-title" tabindex="-1">
      <div class="cc-dialog-head">
        <div>
          <p class="cc-kicker" data-i18n="cookie.kicker">Privacidad</p>
          <h2 class="cc-title" id="cc-prefs-title" data-i18n="cookie.prefsTitle">Preferencias de cookies</h2>
        </div>
        <button type="button" class="cc-close" data-cc="close" aria-label="Cerrar"><i class="bx bx-x"></i></button>
      </div>
      <p class="cc-text" data-i18n="cookie.prefsText">Elige qué permites. Puedes cambiarlo cuando quieras desde el pie de página.</p>
      <ul class="cc-list">
        <li class="cc-row">
          <div class="cc-row-text">
            <strong data-i18n="cookie.necessary.title">Necesarias</strong>
            <span data-i18n="cookie.necessary.text">Recuerdan tu idioma, tu tema y esta decisión. Sin ellas el sitio no funciona bien.</span>
          </div>
          <span class="cc-always" data-i18n="cookie.always">Siempre activas</span>
        </li>
        <li class="cc-row">
          <label class="cc-row-text" for="cc-analytics">
            <strong data-i18n="cookie.analytics.title">Analítica</strong>
            <span data-i18n="cookie.analytics.text">Nos permiten contar visitas y ver qué páginas se usan, de forma anónima, para mejorar el sitio.</span>
          </label>
          <span class="cc-switch"><input type="checkbox" id="cc-analytics" name="analytics" /><span aria-hidden="true"></span></span>
        </li>
        <li class="cc-row">
          <label class="cc-row-text" for="cc-comms">
            <strong data-i18n="cookie.comms.title">Información de SMED</strong>
            <span data-i18n="cookie.comms.text">Aceptas recibir información sobre nuestros servicios, proyectos y novedades mientras navegas el sitio.</span>
          </label>
          <span class="cc-switch"><input type="checkbox" id="cc-comms" name="comms" /><span aria-hidden="true"></span></span>
        </li>
      </ul>
      <div class="cc-actions">
        <button type="button" class="cc-btn cc-btn--ghost" data-cc="save" data-i18n="cookie.save">Guardar preferencias</button>
        <button type="button" class="cc-btn cc-btn--primary" data-cc="accept" data-i18n="cookie.acceptAll">Aceptar todo</button>
      </div>
    </div>
  </div>
`;

class CookieConsent extends HTMLElement {
  connectedCallback() {
    if (this.banner) return;
    this.innerHTML = TEMPLATE;
    this.banner = this.querySelector(".cc-banner");
    this.modal = this.querySelector(".cc-modal");

    this.translate(currentLang());
    document.addEventListener("smed:langchange", (e) => this.translate(e.detail.lang));

    this.addEventListener("click", (e) => {
      const action = e.target.closest("[data-cc]")?.dataset.cc;
      if (action === "accept") this.save({ analytics: true, comms: true });
      else if (action === "necessary") this.save({ analytics: false, comms: false });
      else if (action === "prefs") this.openPrefs();
      else if (action === "close") this.closePrefs();
      else if (action === "save") {
        const choices = {};
        OPTIONAL.forEach((key) => {
          choices[key] = this.querySelector(`input[name="${key}"]`).checked;
        });
        this.save(choices);
      }
    });

    // Any [data-cookie-open] on the page (the footer link) reopens the preferences
    document.addEventListener("click", (e) => {
      if (!e.target.closest("[data-cookie-open]")) return;
      e.preventDefault();
      this.openPrefs();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !this.modal.hidden) this.closePrefs();
    });

    // Waits a moment so it doesn't compete with the page's entrance
    if (!readConsent()) setTimeout(() => reveal(this.banner), 900);
  }

  translate(lang) {
    const t = window.SMED_I18N && window.SMED_I18N.translations[lang];
    if (!t) return;
    this.querySelectorAll("[data-i18n]").forEach((el) => {
      const value = t[el.dataset.i18n];
      if (value !== undefined) el.textContent = value;
    });
  }

  openPrefs() {
    const saved = readConsent() || {};
    OPTIONAL.forEach((key) => {
      this.querySelector(`input[name="${key}"]`).checked = !!saved[key];
    });
    this.lastFocus = document.activeElement;
    document.documentElement.classList.add("cc-lock");
    reveal(this.modal);
    this.querySelector(".cc-dialog").focus();
  }

  closePrefs() {
    if (this.modal.hidden) return;
    document.documentElement.classList.remove("cc-lock");
    conceal(this.modal);
    if (this.lastFocus && this.lastFocus.focus) this.lastFocus.focus();
  }

  save(choices) {
    const data = writeConsent(choices);
    if (!this.banner.hidden) conceal(this.banner);
    this.closePrefs();
    document.dispatchEvent(new CustomEvent("smed:consent", { detail: data }));
  }
}

customElements.define("cookie-consent", CookieConsent);

window.SMED_CONSENT = {
  get: readConsent,
  has: (category) => !!(readConsent() || {})[category],
  open: () => document.querySelector("cookie-consent")?.openPrefs(),
};

// Self-mounting: pages don't need their own tag or stylesheet link
if (!document.querySelector('link[href*="CookieConsent.css"]')) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/src/components/CookieConsent/CookieConsent.css?v=2.0.0";
  document.head.appendChild(link);
}

if (!document.querySelector("cookie-consent")) {
  document.body.appendChild(document.createElement("cookie-consent"));
}
