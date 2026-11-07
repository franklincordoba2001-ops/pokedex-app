# ⚡ Pokédex App — React 19 + Vite + PokéAPI v2

Aplicación web moderna y responsiva construida con **React 19**, **Vite** y **Axios**, diseñada para explorar, consultar y filtrar Pokémon en tiempo real consumiendo la API RESTful de [PokéAPI v2](https://pokeapi.co/).

---

## 🚀 Características Principales

- **Consumo desacoplado de API REST:** Capa de red centralizada en `src/services/pokemonService.js` con manejo robusto de excepciones (`try...catch`) y cliente Axios tipado/configurado.
- **Variables de Entorno Estrictas:** Gestión de endpoints mediante `.env` con prefijo obligatorio `VITE_POKEAPI_URL`.
- **Búsqueda Reactiva en Tiempo Real:** Filtrado en memoria instantáneo (`.filter()`) sin peticiones redundantes ni recargas de página.
- **Visualización Detallada por Componente:** Tarjetas individuales (`PokemonCard.jsx`) con sprites frontales oficiales (*official-artwork*), ID formateado (`#001`), nombres capitalizados, etiquetas temáticas según el tipo elemental y barras de progreso para estadísticas base (**HP** y **Ataque**).
- **Manejo Integral de Estados:**
  - 🔄 **Carga Inicial y Esqueletos:** Spinner animado de Pokéball y *Skeleton Loaders* con efecto *shimmer*.
  - ⚠️ **Captura de Errores de Red:** Banners de alerta amigables con botón de reintento.
  - 🔍 **Sin Coincidencias:** Mensaje visual interactivo para búsquedas sin resultados.
- **Despliegue Continuo (CI/CD):** Preparado con `_redirects` para compatibilidad completa con SPAs en Netlify y Vercel.

---

## 📁 Arquitectura del Proyecto

```text
pokedex-app/
├── public/
│   ├── favicon.svg
│   └── _redirects              # Regla SPA 200 para Netlify
├── src/
│   ├── components/
│   │   └── PokemonCard.jsx     # Tarjeta individual: sprites, tipos y stats base (HP/Atk)
│   ├── services/
│   │   └── pokemonService.js   # Capa de red desacoplada con Axios
│   ├── App.css                 # Diseño moderno, animaciones y cuadrícula responsiva
│   ├── App.jsx                 # Componente orquestador: catálogo y estados reactivos
│   ├── index.css               # Reset y estilos globales
│   └── main.jsx                # Punto de entrada de React
├── .env                        # Variables de entorno locales
├── .env.example                # Plantilla de variables para el equipo / CI
├── .gitignore                  # Exclusión de credenciales, dist y dependencias
├── index.html
├── package.json
└── vite.config.js
```

---

## 🛠️ Requisitos Previos

- [Node.js](https://nodejs.org/) v18.0.0 o superior (recomendado v20+ o v22+).
- [npm](https://www.npmjs.com/) v9.0.0 o superior.

---

## 💻 Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/pokedex-app.git
   cd pokedex-app
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   Copia el archivo `.env.example` a `.env`:
   ```bash
   cp .env.example .env
   ```
   Asegúrate de que contenga:
   ```env
   VITE_POKEAPI_URL=https://pokeapi.co/api/v2
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

5. **Compilar para producción:**
   ```bash
   npm run build
   ```

6. **Vista previa de la compilación:**
   ```bash
   npm run preview
   ```

---

## 🌐 Despliegue en Producción

### Opción 1: Vercel (Recomendada)
1. Conecta tu repositorio de GitHub en [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. En **Environment Variables**, añade:
   - `VITE_POKEAPI_URL` = `https://pokeapi.co/api/v2`
4. Haz clic en **Deploy**.

### Opción 2: Netlify
1. Conecta tu repositorio de GitHub en [Netlify](https://netlify.com).
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. En **Site configuration > Environment variables**, añade:
   - `VITE_POKEAPI_URL` = `https://pokeapi.co/api/v2`
5. El archivo `public/_redirects` gestiona automáticamente la regla `/* /index.html 200` para navegación SPA.

---

## 🧪 Tecnologías Utilizadas

- **React 19**
- **Vite 8**
- **Axios**
- **PokéAPI v2**
- **CSS3 Moderno** (CSS Grid, Flexbox, Custom Properties, CSS Animations)
- **Oxlint**
