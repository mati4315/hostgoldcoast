const axios = require('axios');
const prompts = require('../../config/prompts');

/**
 * Genera timestamps para el texto proporcionado
 * @param {string} text - Texto a dividir en timestamps
 * @param {number} audioDuration - Duración total del audio en segundos
 * @returns {Promise<Array>} - Array de timestamps
 */
async function generateTimestamps(text, audioDuration) {
    try {
        console.log('Generando timestamps...');
        console.log('Generando timestamps con los siguientes parámetros:');
        console.log(`Longitud del texto: ${text.length} caracteres`);
        console.log(`Duración del audio: ${audioDuration} segundos`);

        // Preparar el prompt para OpenAI
        const prompt = `Divide el siguiente texto en segmentos que coincidan con la duración del audio (${audioDuration} segundos). Cada segmento debe tener un tiempo de inicio y fin en formato "min:sec". Responde con un array de objetos JSON con la siguiente estructura exacta:

[
  {
    "text": "texto del segmento 1",
    "start": "00:00",
    "end": "00:10"
  },
  {
    "text": "texto del segmento 2",
    "start": "00:10",
    "end": "00:20"
  }
]

Texto a dividir:
${text}

Responde SOLO con el array JSON, sin explicaciones ni formato markdown.`;

        // Llamar a la API de OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4-turbo-preview",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 1000
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extraer y limpiar la respuesta
        const content = response.data.choices[0].message.content;
        const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
        
        try {
            const timestamps = JSON.parse(cleanContent);
            console.log('Timestamps generados:', JSON.stringify(timestamps, null, 2));
            console.log('Timestamps generados exitosamente');
            return timestamps;
        } catch (parseError) {
            console.error('Error al parsear la respuesta de OpenAI:', parseError);
            console.error('Contenido recibido:', cleanContent);
            throw new Error('Error al procesar la respuesta de timestamps');
        }
    } catch (error) {
        console.error('Error al generar timestamps:', error.message);
        throw error;
    }
}

function generateBasicTimestamps(text, duration) {
    console.log('Generando timestamps básicos con duración:', duration, 'segundos');
    // Dividir el texto en oraciones
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const totalChars = text.length;
    const timestamps = [];
    let currentTime = 0;

    sentences.forEach((sentence, index) => {
        const sentenceLength = sentence.length;
        const sentenceDuration = Math.round((sentenceLength / totalChars) * duration);
        
        const start = formatTime(currentTime);
        currentTime += sentenceDuration;
        const end = formatTime(currentTime);

        timestamps.push({
            text: sentence.trim(),
            start,
            end
        });
    });

    console.log('Timestamps básicos generados:', JSON.stringify(timestamps, null, 2));
    return timestamps;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

module.exports = {
    generateTimestamps
}; 