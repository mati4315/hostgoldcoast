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

module.exports = {
    translateToSpanish
}; 