export default class whatsApp extends HTMLElement {
  async connectedCallback() {
    // Cargar el HTML
    const resp = await fetch("/src/components/WhatsApp/WhatsApp.html?v=2.0.0");
    const html = await resp.text();
    this.innerHTML = html;
  }
}

customElements.define("whatsapp-container",whatsApp);
