# Strapi News Scraper

Este proyecto es un scraper de noticias que utiliza Strapi como CMS y procesa el contenido para generar resúmenes y audio.

## Características

- Scraping automático de feeds RSS
- Generación de resúmenes usando DeepSeek AI
- Conversión de texto a audio usando Google Cloud Text-to-Speech
- Generación automática de timestamps para sincronización de audio
- Sistema de fallback robusto para manejo de errores
- Integración con Strapi CMS

## Requisitos

- Node.js 18 o superior
- PostgreSQL 14 o superior
- Cuenta de Google Cloud con Text-to-Speech API habilitada
- API Key de DeepSeek

## Configuración

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno en `.env`:
   ```
   DATABASE_CLIENT=postgres
   DATABASE_HOST=127.0.0.1
   DATABASE_PORT=5432
   DATABASE_NAME=strapi
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=tu_contraseña
   DATABASE_SSL=false
   NODE_ENV=development
   GOOGLE_APPLICATION_CREDENTIALS=./google-credentials.json
   DEEPSEEK_API_KEY=tu_api_key
   ```

4. Inicia el servidor Strapi:
   ```bash
   npm run develop
   ```

## Uso

1. Configura las fuentes RSS en el panel de administración de Strapi
2. Ejecuta el script de scraping:
   ```bash
   node scripts/scrape.js
   ```

## Estructura del Proyecto

```
├── config/
│   ├── prompts.js         # Configuración de prompts para DeepSeek
│   └── database.js        # Configuración de la base de datos
├── scripts/
│   ├── scrape.js         # Script principal de scraping
│   └── services/
│       ├── rss.js        # Servicio de scraping RSS
│       ├── summary.js    # Generación de resúmenes
│       ├── translation.js # Traducción de contenido
│       ├── audio.js      # Generación de audio
│       └── timestamps.js # Generación de timestamps
└── src/
    └── api/
        └── news/
            └── content-types/
                └── news/
                    └── schema.json  # Modelo de datos
```

## Características Principales

### Scraping RSS
- Soporte para múltiples fuentes RSS
- Procesamiento automático de contenido
- Manejo de errores y reintentos

### Generación de Resúmenes
- Uso de DeepSeek AI para resúmenes
- Formato optimizado para niños
- Sistema de fallback para errores

### Generación de Audio
- Integración con Google Cloud Text-to-Speech
- Generación automática de timestamps
- Sistema de sincronización de audio y texto

### Timestamps
- Generación automática de timestamps
- Sistema de fallback para errores de API
- Formato optimizado para sincronización

## Contribuir

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

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
