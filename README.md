# Proyecto Strapi con Scraping RSS y Generación de Audio

Este proyecto utiliza Strapi como CMS y cuenta con un sistema automatizado para:
1. Scraping de noticias desde feeds RSS
2. Generación automática de resúmenes usando DeepSeek AI
3. Conversión de texto a audio usando Google Cloud Text-to-Speech

## Estructura del Proyecto

```
├── config/
│   └── google-credentials.json    # Credenciales de Google Cloud (no incluido en git)
├── public/
│   └── uploads/
│       └── audio/                # Directorio para archivos de audio generados
├── scripts/
│   ├── scrape-rss.js            # Script principal de scraping
│   └── services/
│       ├── textToSpeech.js      # Servicio de Google Cloud Text-to-Speech
│       ├── deepseek.js          # Servicio de DeepSeek para resúmenes
│       └── utils.js             # Funciones de utilidad
└── src/
    └── api/
        └── noticia/             # Modelo de contenido para noticias
```

## Requisitos Previos

- Node.js v22.13.1 o superior
- PostgreSQL
- Cuenta de Google Cloud con Text-to-Speech API habilitada
- API Key de DeepSeek

## Configuración

1. Crear archivo `.env` en la raíz del proyecto con las siguientes variables:
```env
STRAPI_API_TOKEN=tu_token_de_strapi
RSS_FEED_URL=url_del_feed_rss
DEEPSEEK_API_KEY=tu_api_key_de_deepseek
```

2. Configurar las credenciales de Google Cloud:
   - Crear un archivo `config/google-credentials.json` con las credenciales de servicio
   - Asegurarse de que el archivo esté en `.gitignore`

## Modelo de Contenido

El modelo "noticia" incluye los siguientes campos:
- `title` (string): Título de la noticia
- `description` (text): Resumen generado por DeepSeek
- `link` (string): URL original de la noticia
- `pubDate` (datetime): Fecha de publicación original
- `imagen` (string): URL de la imagen principal
- `audioUrl` (string): URL del archivo de audio generado

## Funcionalidades

### 1. Scraping RSS
- Obtiene la noticia más reciente del feed RSS
- Extrae título, contenido, fecha y URL
- Verifica duplicados antes de crear nuevas entradas

### 2. Generación de Resúmenes
- Utiliza DeepSeek AI para crear resúmenes concisos
- Limpia el formato del resumen para mantener solo el texto
- Incluye manejo de errores con fallback a resumen simple

### 3. Generación de Audio
- Convierte el resumen en audio usando Google Cloud Text-to-Speech
- Guarda los archivos MP3 en `public/uploads/audio`
- Usa el título de la noticia para nombrar el archivo
- Configurado para español con voz neutra

## Uso

1. Iniciar Strapi:
```bash
npm run develop
```

2. Ejecutar el script de scraping:
```bash
node scripts/scrape-rss.js
```

## Flujo de Trabajo

1. El script obtiene la noticia más reciente del feed RSS
2. Verifica si la noticia ya existe en la base de datos
3. Si es nueva:
   - Genera un resumen usando DeepSeek
   - Convierte el resumen en audio
   - Crea una nueva entrada en Strapi con todos los datos

## Notas Importantes

- Las credenciales de Google Cloud deben mantenerse seguras y no subirse al repositorio
- El script procesa solo la noticia más reciente para evitar duplicados
- Los archivos de audio se almacenan localmente en `public/uploads/audio`
- Se recomienda ejecutar el script periódicamente para mantener el contenido actualizado

## Próximos Pasos

- [ ] Implementar programación automática del scraping
- [ ] Agregar más fuentes RSS
- [ ] Mejorar el manejo de errores
- [ ] Implementar sistema de caché para evitar llamadas innecesarias a las APIs
- [ ] Agregar más opciones de configuración para la generación de audio

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
