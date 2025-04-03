const axios = require('axios');
const prompts = require('../../config/prompts');

async function translateToSpanish(text) {
    try {
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: prompts.translation.system
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: prompts.translation.temperature,
            max_tokens: prompts.translation.maxTokens
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error al traducir:', error.message);
        throw error;
    }
}

/**
 * Traduce los timestamps al español y portugués
 * @param {Array} timestamps - Array de timestamps a traducir
 * @param {string} title - Título de la noticia a traducir al español
 * @returns {Promise<Array>} - Array de timestamps con traducciones
 */
async function translateTimestamps(timestamps, title) {
    try {
        console.log('Traduciendo timestamps al español y portugués...');
        
        // Preparar el prompt para DeepSeek
        const prompt = `Traduce los siguientes textos de timestamps de una noticia al español y portugués, y también traduce el título al español. Solo traduce el texto, no los tiempos. Responde con un objeto JSON que contenga dos arrays: "es" para español y "pt" para portugués, en el mismo orden, y un campo "title_es" para la traducción del título. NO incluyas explicaciones ni formato markdown, solo el JSON:

Título: ${title}

Timestamps:
${JSON.stringify(timestamps.map(t => t.text), null, 2)}

Ejemplo de formato esperado:
{
  "es": ["texto en español 1", "texto en español 2"],
  "pt": ["texto em português 1", "texto em português 2"],
  "title_es": "título en español"
}`;

        // Llamar a la API de DeepSeek
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente especializado en traducción. Tu tarea es traducir los textos al español y portugués manteniendo el mismo orden y sin modificar los tiempos, y también traducir el título al español. Responde SOLO con el objeto JSON, sin explicaciones ni formato markdown."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 1000
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extraer y parsear la respuesta
        const translatedContent = response.data.choices[0].message.content;
        
        // Limpiar la respuesta de posibles marcadores markdown
        const cleanContent = translatedContent.replace(/```json\n?|\n?```/g, '').trim();
        
        try {
            const translations = JSON.parse(cleanContent);
            
            // Validar la estructura de la respuesta
            if (!translations.es || !translations.pt || !translations.title_es || 
                !Array.isArray(translations.es) || !Array.isArray(translations.pt)) {
                throw new Error('Formato de respuesta inválido');
            }

            // Agregar las traducciones al objeto de timestamps
            const timestampsWithTranslation = timestamps.map((timestamp, index) => ({
                ...timestamp,
                text_es: translations.es[index],
                text_pt: translations.pt[index]
            }));

            console.log('Timestamps traducidos exitosamente');
            return {
                timestamps: timestampsWithTranslation,
                title_es: translations.title_es
            };
        } catch (parseError) {
            console.error('Error al parsear la respuesta de DeepSeek:', parseError);
            console.error('Contenido recibido:', cleanContent);
            throw new Error('Error al procesar la respuesta de traducción');
        }
    } catch (error) {
        console.error('Error al traducir timestamps:', error.message);
        throw error;
    }
}

module.exports = {
    translateToSpanish,
    translateTimestamps
}; 