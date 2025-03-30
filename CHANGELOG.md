# Registro de Cambios

## [1.0.0] - 2025-03-29

### Agregado
- Implementación inicial del sistema de scraping RSS
- Integración con DeepSeek AI para generación de resúmenes
- Integración con Google Cloud Text-to-Speech para generación de audio
- Modelo de contenido "noticia" en Strapi
- Sistema de verificación de duplicados
- Nuevo campo `description_es` al modelo Noticia para almacenar la traducción al español
- Nuevo servicio de traducción usando la API de DeepSeek
- Integración de traducción automática al español en el proceso de scraping
- Sistema de autenticación para integración con Vue.js
- API de registro y login de usuarios
- Configuración CORS para integración con frontend

### Mejorado
- Reorganización del código en módulos separados:
  - `textToSpeech.js`: Servicio para generación de audio
  - `deepseek.js`: Servicio para generación de resúmenes
  - `utils.js`: Funciones de utilidad
- Mejor manejo de errores en todas las operaciones
- Limpieza y formateo de resúmenes
- Sistema de nombres de archivo para audio basado en títulos
- Modificado el script de scraping para incluir la traducción al español
- Actualizado el proceso de creación de noticias para guardar tanto el resumen original como su traducción
- Configuración de JWT para autenticación segura
- Documentación de integración con Vue.js

### Seguridad
- Implementación de manejo seguro de credenciales
- Protección de archivos sensibles en `.gitignore`
- Validación de datos antes de crear entradas
- Implementación de JWT para autenticación
- Configuración de CORS para seguridad

### Documentación
- Creación de README.md con instrucciones detalladas
- Documentación de la estructura del proyecto
- Guía de configuración y requisitos
- Documentación de la API de autenticación
- Ejemplos de integración con Vue.js

### Technical Details
- Se utiliza la API de DeepSeek para realizar las traducciones
- El servicio de traducción mantiene el mismo tono y estilo del texto original
- La traducción se realiza después de generar el resumen y antes de crear el audio
- Implementación de JWT con expiración de 30 días
- Configuración CORS para permitir peticiones desde Vue.js

## Próximas Mejoras
- Implementación de programación automática
- Sistema de caché para optimizar llamadas a APIs
- Soporte para múltiples fuentes RSS
- Más opciones de configuración para audio
- Mejoras en el manejo de errores y logging
- Implementación de recuperación de contraseña
- Sistema de roles y permisos más granular

## [Unreleased]

### Changed
- Mejorado el sistema de generación de timestamps para audio
- Optimizada la integración con DeepSeek API
- Mejorado el manejo de errores en la generación de timestamps
- Ajustados los parámetros de la API para mejor rendimiento
- Simplificado el cálculo de duración de audio
- Actualizada la URL del feed RSS

### Fixed
- Corregido el modelo de DeepSeek en la generación de timestamps
- Mejorado el sistema de fallback para timestamps cuando falla la API
- Eliminadas dependencias no utilizadas
- Corregido el formato del archivo .env 