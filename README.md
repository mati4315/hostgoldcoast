# Sistema de Noticias con Resúmenes y Audio

Este proyecto es un sistema automatizado que obtiene noticias de fuentes RSS, genera resúmenes usando IA, los traduce al español y crea versiones de audio.

## Características

- Scraping automático de feeds RSS
- Generación de resúmenes usando DeepSeek
- Traducción automática al español
- Conversión de texto a audio usando Google Cloud Text-to-Speech
- Almacenamiento en Strapi CMS
- Sistema de verificación de duplicados

## Requisitos

- Node.js v18 o superior
- PostgreSQL
- Cuenta en Google Cloud con Text-to-Speech API habilitada
- API Key de DeepSeek

## Configuración

1. Clonar el repositorio
2. Instalar dependencias: `npm install`
3. Configurar variables de entorno en `.env`:
   ```
   STRAPI_API_TOKEN=tu_token_aqui
   RSS_FEED_URL=url_del_feed_rss
   DEEPSEEK_API_KEY=tu_api_key_aqui
   ```
4. Configurar credenciales de Google Cloud en `config/google-credentials.json`

## Estructura del Proyecto

```
├── src/
│   └── api/
│       └── noticia/
│           └── content-types/
│               └── noticia/
│                   └── schema.json
├── scripts/
│   ├── scrape-rss.js
│   └── services/
│       ├── deepseek.js
│       ├── textToSpeech.js
│       ├── translate.js
│       └── utils.js
├── config/
│   └── google-credentials.json
└── .env
```

## Campos del Modelo Noticia

- `title`: Título de la noticia
- `link`: URL de la noticia original
- `description`: Resumen en inglés generado por DeepSeek
- `description_es`: Traducción al español del resumen
- `pubDate`: Fecha de publicación original
- `imagen`: URL de la imagen principal
- `audioUrl`: URL del archivo de audio generado
- `prompt`: Prompt utilizado para generar el resumen

## Uso

1. Iniciar Strapi: `npm run develop`
2. Ejecutar el script de scraping: `node scripts/scrape-rss.js`

## Notas Técnicas

- El sistema utiliza DeepSeek para generar resúmenes y traducciones
- Las traducciones mantienen el mismo tono y estilo del texto original
- Los archivos de audio se generan en inglés
- El sistema verifica duplicados antes de crear nuevas entradas

# hostgoldcoast

Este es el backend de Gold Coast, desarrollado con Strapi.

## 🚀 Getting started with Strapi

Strapi viene con una [Command Line Interface](https://docs.strapi.io/dev-docs/cli) (CLI) que te permite crear y gestionar tu proyecto en segundos.

### `develop`

Inicia tu aplicación Strapi con autoReload activado. [Más información](https://docs.strapi.io/dev-docs/cli#strapi-develop)

```
npm run develop
# o
yarn develop
```

### `start`

Inicia tu aplicación Strapi con autoReload desactivado. [Más información](https://docs.strapi.io/dev-docs/cli#strapi-start)

```
npm run start
# o
yarn start
```

### `build`

Construye tu panel de administración. [Más información](https://docs.strapi.io/dev-docs/cli#strapi-build)

```
npm run build
# o
yarn build
```

## ⚙️ Deployment

Strapi te ofrece muchas opciones de despliegue para tu proyecto, incluyendo [Strapi Cloud](https://cloud.strapi.io). Explora la [sección de despliegue de la documentación](https://docs.strapi.io/dev-docs/deployment) para encontrar la mejor solución para tu caso de uso.

```
yarn strapi deploy
```

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Centro de recursos de Strapi.
- [Strapi documentation](https://docs.strapi.io) - Documentación oficial de Strapi.
- [Strapi tutorials](https://strapi.io/tutorials) - Lista de tutoriales creados por el equipo principal y la comunidad.
- [Strapi blog](https://strapi.io/blog) - Blog oficial de Strapi con artículos del equipo y la comunidad.
- [Changelog](https://strapi.io/changelog) - Información sobre actualizaciones de productos, nuevas características y mejoras generales.

## ✨ Community

- [Discord](https://discord.strapi.io) - Únete al chat con la comunidad de Strapi, incluyendo el equipo principal.
- [Forum](https://forum.strapi.io/) - Lugar para discutir, hacer preguntas y encontrar respuestas, mostrar tu proyecto Strapi y recibir feedback o simplemente hablar con otros miembros de la comunidad.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - Una lista curada de cosas increíbles relacionadas con Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
