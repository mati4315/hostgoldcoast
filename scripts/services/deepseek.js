const axios = require('axios');

/**
 * Crea un resumen del texto usando la API de DeepSeek
 * @param {string} text - El texto a resumir
 * @returns {Promise<string>} - El resumen generado
 */
async function createSummary(text) {
  try {
    const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: "Eres un asistente experto en crear resúmenes concisos y claros. Tu tarea es resumir el texto proporcionado en un párrafo corto, manteniendo los puntos clave y la información más relevante. No uses títulos ni formato especial, solo el texto del resumen."
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    let summary = response.data.choices[0].message.content;
    
    // Limpiar el formato del resumen
    summary = summary
      .replace(/\*\*/g, '') // Eliminar negrita
      .replace(/\*/g, '')   // Eliminar cursiva
      .replace(/^Resumen:?\s*/i, '') // Eliminar "Resumen:" al inicio
      .replace(/\n/g, ' ')  // Eliminar saltos de línea
      .replace(/\s+/g, ' ') // Eliminar espacios múltiples
      .trim();              // Eliminar espacios al inicio y final

    return summary;
  } catch (error) {
    console.error('Error al crear el resumen:', error);
    return text.substring(0, 200) + '...'; // Fallback a un resumen simple
  }
}

module.exports = {
  createSummary
}; 