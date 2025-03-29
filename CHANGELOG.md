# Registro de Cambios

## [1.0.0] - 2025-03-29

### Agregado
- Implementación inicial del sistema de scraping RSS
- Integración con DeepSeek AI para generación de resúmenes
- Integración con Google Cloud Text-to-Speech para generación de audio
- Modelo de contenido "noticia" en Strapi
- Sistema de verificación de duplicados

### Mejorado
- Reorganización del código en módulos separados:
  - `textToSpeech.js`: Servicio para generación de audio
  - `deepseek.js`: Servicio para generación de resúmenes
  - `utils.js`: Funciones de utilidad
- Mejor manejo de errores en todas las operaciones
- Limpieza y formateo de resúmenes
- Sistema de nombres de archivo para audio basado en títulos

### Seguridad
- Implementación de manejo seguro de credenciales
- Protección de archivos sensibles en `.gitignore`
- Validación de datos antes de crear entradas

### Documentación
- Creación de README.md con instrucciones detalladas
- Documentación de la estructura del proyecto
- Guía de configuración y requisitos

## Próximas Mejoras
- Implementación de programación automática
- Sistema de caché para optimizar llamadas a APIs
- Soporte para múltiples fuentes RSS
- Más opciones de configuración para audio
- Mejoras en el manejo de errores y logging 