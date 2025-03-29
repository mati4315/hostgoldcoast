const cheerio = require('cheerio');

/**
 * Limpia el HTML y extrae solo el texto
 * @param {string} html - El contenido HTML a limpiar
 * @returns {string} - El texto limpio
 */
function cleanHtml(html) {
  if (!html) return '';
  const $ = cheerio.load(html);
  return $('body').text().trim();
}

/**
 * Extrae la URL de la primera imagen encontrada en el HTML
 * @param {string} html - El contenido HTML a analizar
 * @returns {string|null} - La URL de la imagen o null si no se encuentra
 */
function extractImageUrl(html) {
  if (!html) return null;
  const $ = cheerio.load(html);
  const img = $('img').first();
  return img.attr('src') || null;
}

/**
 * Formatea una fecha a formato ISO
 * @param {string|Date} date - La fecha a formatear
 * @returns {string} - La fecha formateada
 */
function formatDate(date) {
  if (!date) return new Date().toISOString();
  const d = new Date(date);
  return d.toISOString();
}

module.exports = {
  cleanHtml,
  extractImageUrl,
  formatDate
}; 