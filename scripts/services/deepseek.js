const axios = require('axios');
const prompts = require('../../config/prompts');

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
          content: prompts.summary.system
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: prompts.summary.temperature,
      max_tokens: prompts.summary.maxTokens
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error al crear el resumen:', error.message);
    throw error;
  }
}

module.exports = {
  createSummary
}; 