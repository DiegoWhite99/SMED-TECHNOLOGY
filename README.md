# SMED TECHNOLOGY 

## Introducción

SMED Technology es una empresa especializada en soluciones tecnológicas integrales, incluyendo:
- Desarrollo de sitios web
- Soporte técnico
- Redes
- Gestión en la nube
- Infraestructura de CTV

Este proyecto tiene como objetivo construir una plataforma web que conecte los servicios ofrecidos por la empresa con sus clientes de manera eficiente.

---

## Tecnologías utilizadas

- **Backend:** Node.js + Express
- **Base de datos:** MySQL
- **Librerías:**
  - body-parser
  - cors
  - dotenv
  - nodemon

---

## Estructura del proyecto

### 1. Diseño de Interfaz
- Creación de wireframes para definir la estructura.
- Creación de mockups para representar el diseño visual.

### 2. Desarrollo Backend
- Implementación de endpoints para:
  - Consultas técnicas
  - Registro de clientes
  - Gestión de proyectos

### 3. Integración con Base de Datos
- Almacenamiento seguro de:
  - Datos de usuarios
  - Servicios solicitados
  - Registros de soporte técnico

---

## Diseño visual

### Logo
- Diseño circular con borde blanco sobre fondo negro.
- Ícono central de obrero y herramientas, rodeado de circuitos blancos.
- Tipografía:
  - "SMED" (Hiperwave 80px)
  - "TECHNOLOGY" (Sans-serif)

### Paleta de colores
- **Negro:** #000000 (fondo)
- **Blanco:** #ffffff (elementos del logo y texto SMED)
- **Azul tecnológico:** #2A5C99 (elementos interactivos)
- **Gris oscuro:** #333333 (texto)

### Tipografías
- **Títulos:** Montserrat
- **Texto cuerpo:** Open Sans
- **Especial (SMED):** Hiperwave

---

## Wireframes principales

- **Inicio de Sesión:** Formulario de usuario y contraseña con recordatorio de sesión y recuperación de contraseña.
- **Página de Inicio:** Secciones de servicios, proyectos destacados, fundadores y formulario de contacto.
- **Servicios:** Tarjetas de servicios, futuros proyectos, cualidades diferenciales.
- **Experiencias:** Sección de testimonios de clientes.
- **¿Quiénes somos?:** Perfiles de los fundadores.

---

## Requerimientos de desarrollo

- **Estructura HTML/CSS:**
  - Flexbox y/o Grid para layouts responsivos.
  - Formularios centrados verticalmente.
  - Sombreado sutil en campos de entrada.

- **Interacciones:**
  - Cambios de color y sombra al pasar el cursor (hover) sobre botones.
  - Validaciones en tiempo real en formularios.

- **Animaciones sugeridas:**
  - Fondo animado en la sección principal (Hero).
  - Efecto de escala en testimonios al pasar el cursor.

---

## Autores

- Juan Sebastián Ospina Chávez ([Email](mailto:ospinajuan0409@gmail.com))
- Diego Fernando Castelblanco Jiménez ([Email](mailto:diegofer.cas.99@gmail.com))
- Cristian Rocancio Villamil ([Email](mailto:crisstive2001@gmail.com))

## Colaboradores

- Sergio Alejandro Garzón Franco ([Email](mailto:sergiofranco2102@gmail.com))
- Lainer Gonzalez Pacheco ([Email](mailto:lainergonzalez97@gmail.com))

---

## Ubicación

Bogotá D.C - 2025

---

## Redes Sociales

- [Instagram - SMED Technology](https://www.instagram.com/smed_technology/)

---

## Registro de cambios

### v2.0.0 — 2026-09-13

**Rediseño de Servicios, intro en parallax, modo oscuro y aviso de cookies.**

- **Servicios (`/servicios`):** nuevo diseño con infografía de nodos (Desarrollo, Cloud, Redes, Soporte, Asesorías y Guard), cifras verificables (se retiró "50+ clientes satisfechos"), divisiones, proyectos en producción y futuros, misión, espacio, protocolo, formulario (mismo backend) y cierre.
- **Intro en parallax (`parallaxIntro.js`):** capas que se mueven a distinta velocidad al hacer scroll, con el humo azul de SMED y el logo como luna. El título pasa detrás del humo (`smed-smoke-front.webp`).
- **Modo oscuro:** el botón de tema ahora funciona en Servicios y en el nav, y el tema se aplica antes del primer pintado. El home queda fijo en claro (`data-theme-lock`) y no muestra el botón.
- **Cookies:** aviso con "Aceptar todo", "Solo necesarias" y "Configurar" (Necesarias, Analítica, Información de SMED). La decisión se guarda en la cookie `smed_consent` (180 días) y se consulta con `window.SMED_CONSENT`; todo script opcional debe revisarla antes de cargarse. Enlace "Preferencias de cookies" en el footer.
- **Habeas Data:** nueva sección "10. Cookies y tecnologías similares"; versión vigente desde septiembre de 2026.
- **Loader:** se eliminó la pantalla de carga del home (`loader.js`).
- **Cache-busting:** `?v=2.0.0` en todos los assets, en los fetch de componentes, en los imports de `BaseComponents.js` y en el footer.

### v1.6.0 — 2026-09-13

**Rediseño del home (`/nosotros`) y del nav/footer compartidos por todas las páginas.**

- **Home:** nueva estructura inspirada en Netguru, Monterail y thoughtbot. Hero editorial con titular en mayúsculas, fotos de los fundadores dentro del texto y cinta 3D animada en canvas (`heroRibbon.js`); capacidades, trabajo real (SMED Bakery y SMED Sports con enlace a su sitio), proceso, datos con contadores, equipo fundador en tarjetas flotantes, misión/visión y cierre con el reel de SMED como video de fondo (`bgVideo.js`, carga diferida y filtro).
- **Fondo ligado al scroll:** blanco en el hero y azules cada vez más oscuros hacia el final (`scrollScenes.js`). El home ya no depende del tema claro/oscuro guardado.
- **Animaciones:** el contenido entra flotando y se asienta, y las cifras cuentan hasta su valor (`homeMotion.js`). Todo respeta "reducir movimiento".
- **Nav:** barra blanca con megamenús (Servicios, Empresa), botón "Hablemos" y menú móvil con acordeones; se traduce al cargarse.
- **Footer:** oscuro, con columnas, tecnologías y barra legal; se traduce al cargarse.
- **Tipografía:** Inter para el texto e IBM Plex Mono para etiquetas y cifras.
- **Chatbot:** desactivado temporalmente (mismo cambio que en `main`: el servidor n8n está caído).
- **Cache-busting:** `?v=1.6.0` en todos los assets, en los fetch de componentes, en los imports de `BaseComponents.js` y en el footer.
