const axios = require('axios');
const prompts = require('../../config/prompts');

async function generateTimestamps(text, audioDuration) {
    console.log('Generando timestamps con los siguientes parámetros:');
    console.log('Longitud del texto:', text.length, 'caracteres');
    console.log('Duración del audio:', audioDuration, 'segundos');
    
    if (!audioDuration || audioDuration <= 0) {
        console.warn('⚠️ Advertencia: audioDuration no es válido, usando valor por defecto de 60 segundos');
        audioDuration = 60;
    }

    try {
        const systemPrompt = prompts.timestamps.system(audioDuration);
        console.log('Prompt del sistema:', systemPrompt);
        
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: prompts.timestamps.temperature,
            max_tokens: 2000,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            throw new Error('Respuesta inválida de la API');
        }

        const content = response.data.choices[0].message.content.trim();
        console.log('Respuesta de la API:', content);
        
        // Intentar extraer el JSON de la respuesta
        let jsonStr = content;
        if (content.includes('[') && content.includes(']')) {
            jsonStr = content.substring(content.indexOf('['), content.lastIndexOf(']') + 1);
        }

        try {
            const timestamps = JSON.parse(jsonStr);
            console.log('Timestamps generados:', JSON.stringify(timestamps, null, 2));
            return timestamps;
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            console.log('Usando sistema de fallback para timestamps');
            return generateBasicTimestamps(text, audioDuration);
        }
    } catch (error) {
        console.error('Error al generar timestamps:', error.message);
        if (error.response) {
            console.error('Detalles del error:', error.response.data);
        }
        console.log('Usando sistema de fallback para timestamps');
        return generateBasicTimestamps(text, audioDuration);
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