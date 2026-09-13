// Pie de página compartido. La página traduce antes de que este HTML exista,
// así que se traduce aquí al cargarse y en cada cambio de idioma.
export default class Footer extends HTMLElement {
  async connectedCallback() {
    const resp = await fetch("/src/components/Footer/Footer.html?v=2.0.0");
    this.innerHTML = await resp.text();

    const translate = (lang) => {
      const t = window.SMED_I18N && window.SMED_I18N.translations[lang];
      if (!t) return;
      this.querySelectorAll("[data-i18n]").forEach((el) => {
        const value = t[el.dataset.i18n];
        if (value !== undefined) el.textContent = value;
      });
    };

    translate(localStorage.getItem("smed-lang") || "es");
    document.addEventListener("smed:langchange", (e) => translate(e.detail.lang));
  }
}

customElements.define("footer-page", Footer);
