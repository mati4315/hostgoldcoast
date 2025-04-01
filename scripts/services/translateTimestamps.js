const axios = require('axios');

/**
 * Traduce los timestamps al español y portugués y los agrega al mismo objeto
 * @param {Object} timestamps - Objeto con los timestamps en inglés
 * @returns {Promise<Object>} - Objeto con los timestamps incluyendo las traducciones
 */
async function translateTimestamps(timestamps) {
    try {
        console.log('Traduciendo timestamps al español y portugués...');
        
        // Preparar el prompt para DeepSeek
        const prompt = `Traduce los siguientes textos de timestamps de una noticia al español y portugués. Solo traduce el texto, no los tiempos. Responde con un objeto JSON que contenga dos arrays: "es" para español y "pt" para portugués, en el mismo orden:

${JSON.stringify(timestamps.map(t => t.text), null, 2)}

Responde solo con el objeto JSON con los arrays de traducciones, sin explicaciones adicionales.`;

        // Llamar a la API de DeepSeek
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "Eres un asistente especializado en traducción. Tu tarea es traducir los textos al español y portugués manteniendo el mismo orden y sin modificar los tiempos."
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
        const translations = JSON.parse(translatedContent);

        // Agregar las traducciones al objeto de timestamps
        const timestampsWithTranslation = timestamps.map((timestamp, index) => ({
            ...timestamp,
            text_es: translations.es[index],
            text_pt: translations.pt[index]
        }));

        console.log('Timestamps traducidos exitosamente');
        return timestampsWithTranslation;
    } catch (error) {
        console.error('Error al traducir timestamps:', error.message);
        throw error;
    }
}

module.exports = {
    translateTimestamps
}; 