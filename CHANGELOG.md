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

### Seguridad
- Implementación de manejo seguro de credenciales
- Protección de archivos sensibles en `.gitignore`
- Validación de datos antes de crear entradas

### Documentación
- Creación de README.md con instrucciones detalladas
- Documentación de la estructura del proyecto
- Guía de configuración y requisitos

### Technical Details
- Se utiliza la API de DeepSeek para realizar las traducciones
- El servicio de traducción mantiene el mismo tono y estilo del texto original
- La traducción se realiza después de generar el resumen y antes de crear el audio

## Próximas Mejoras
- Implementación de programación automática
- Sistema de caché para optimizar llamadas a APIs
- Soporte para múltiples fuentes RSS
- Más opciones de configuración para audio
- Mejoras en el manejo de errores y logging

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