// Barra de navegación compartida: megamenús (hover en escritorio, clic en
// móvil y teclado), menú móvil, idioma y tema.
export default class NavigationBar extends HTMLElement {
  async connectedCallback() {
    const resp = await fetch("/src/components/NavigationBar/NavigationBar.html?v=2.0.4");
    this.innerHTML = await resp.text();

    const esPaginaLogin = this.hasAttribute("login");
    const esPaginaTienda = this.hasAttribute("buscar");
    const Contenedor = this.querySelector("#BotonesSesion");

    if (esPaginaLogin && Contenedor) {
      Contenedor.innerHTML = `
        <div class="nav-button">
          <button class="btn white-btn" id="loginbtn" onclick="login()">Ingresar</button>
          <button class="btn" id="registerbtn" onclick="register()">Registrarse</button>
        </div>
        <div class="nav-menu-btn">
          <i class="bx bx-menu" onclick="MyMenuFuction()"></i>
        </div>
      `;
    }

    if (esPaginaTienda) {
      const BuscarContenedor = this.querySelector("#Buscar");
      BuscarContenedor.innerHTML = `
          <div class="nav-search">
            <input type="text" class="form-control me-2" placeholder="Buscar productos">
            <button class="search-button">
              <i class="fas fa-search"></i>
            </button>
          </div>`;
    }

    // ── Menú y megamenús ──
    const navbar = this.querySelector(".navbar-smed");
    const botonHamburgesa = this.querySelector("#botonHamburgesa");
    const navMenu = this.querySelector("#navMenu");
    const submenus = [...this.querySelectorAll(".has-submenu")];

    const closeSubmenus = (except) => {
      submenus.forEach((item) => {
        if (item === except) return;
        item.classList.remove("submenu-open");
        const toggle = item.querySelector(".submenu-toggle");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
      });
    };

    const setMenuOpen = (open) => {
      navMenu.classList.toggle("show", open);
      botonHamburgesa.classList.toggle("active", open);
      botonHamburgesa.setAttribute("aria-expanded", String(open));
      document.documentElement.classList.toggle("nav-open", open);
      if (!open) closeSubmenus();
    };

    botonHamburgesa.addEventListener("click", () => {
      setMenuOpen(!navMenu.classList.contains("show"));
    });

    submenus.forEach((item) => {
      const toggle = item.querySelector(".submenu-toggle");
      toggle.addEventListener("click", (event) => {
        event.preventDefault();
        const open = !item.classList.contains("submenu-open");
        closeSubmenus(item);
        item.classList.toggle("submenu-open", open);
        toggle.setAttribute("aria-expanded", String(open));
      });
    });

    // Blur after navigating so :focus-within doesn't keep a panel open on same-page anchors
    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        setMenuOpen(false);
        if (document.activeElement) document.activeElement.blur();
      });
    });

    document.addEventListener("click", (event) => {
      if (!this.contains(event.target)) closeSubmenus();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    });

    const onScroll = () => navbar.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Idioma ──
    // The page's initLang runs before this HTML exists, so translate the nav here
    const langLabel = this.querySelector("#langLabel");
    const translateNav = (lang) => {
      const t = window.SMED_I18N && window.SMED_I18N.translations[lang];
      if (t) {
        this.querySelectorAll("[data-i18n]").forEach((el) => {
          const value = t[el.dataset.i18n];
          if (value !== undefined) el.textContent = value;
        });
      }
      if (langLabel) langLabel.textContent = lang === "es" ? "EN" : "ES";
    };

    translateNav(localStorage.getItem("smed-lang") || "es");
    document.addEventListener("smed:langchange", (e) => translateNav(e.detail.lang));

    const langToggle = this.querySelector("#langToggle");
    if (langToggle) {
      langToggle.addEventListener("click", () => {
        const current = localStorage.getItem("smed-lang") || "es";
        const next = current === "es" ? "en" : "es";
        if (window.SMED_I18N) {
          window.SMED_I18N.applyLang(next);
        } else {
          localStorage.setItem("smed-lang", next);
          translateNav(next);
        }
      });
    }

    // ── Tema ──
    const themeToggle = this.querySelector("#themeToggle");
    const themeIcon = this.querySelector("#themeIcon");

    const applyTheme = (theme) => {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("smed-theme", theme);
      if (themeIcon) {
        themeIcon.className = theme === "light" ? "bx bx-sun" : "bx bx-moon";
      }
    };

    // Pages with <html data-theme-lock="..."> (the home's white → blue journey)
    // keep a fixed theme: no toggle, and the saved preference is left untouched
    const lockedTheme = document.documentElement.dataset.themeLock;
    if (lockedTheme) {
      document.documentElement.setAttribute("data-theme", lockedTheme);
      if (themeToggle) themeToggle.remove();
      return;
    }

    applyTheme(localStorage.getItem("smed-theme") || "light");

    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme");
        applyTheme(current === "light" ? "dark" : "light");
      });
    }
  }
}

customElements.define("nav-bar", NavigationBar);
