const axios = require('axios');

async function translateToSpanish(text) {
    try {
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "Eres un traductor profesional. Tu tarea es traducir el siguiente texto al español, manteniendo el mismo tono y estilo, pero adaptándolo naturalmente al español."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
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

module.exports = {
    translateToSpanish
}; 