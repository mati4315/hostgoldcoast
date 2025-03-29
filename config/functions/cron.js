require('dotenv').config();
const Parser = require('rss-parser');
const parser = new Parser();

async function fetchAndSaveNews() {
    try {
        // Parsear el feed RSS
        const feed = await parser.parseURL(process.env.RSS_FEED_URL);
        
        // Iterar sobre cada entrada del feed
        for (const item of feed.items) {
            // Verificar si la entrada ya existe en Strapi usando el link como identificador único
            const existing = await strapi.services.noticias.findOne({ link: item.link });
            
            if (!existing) {
                // Si no existe, crear una nueva entrada
                await strapi.services.noticias.create({
                    title: item.title,
                    link: item.link,
                    description: item.description || item.contentSnippet,
                    published_date: item.pubDate
                });
                console.log(`Nueva noticia creada: ${item.title}`);
            }
        }
    } catch (error) {
        console.error('Error al procesar el feed RSS o crear entradas:', error);
    }
}

// Configurar el cron job para que se ejecute cada 15 minutos
module.exports = {
    '* */4 * * *': async () => {
        await fetchAndSaveNews();
    }
}; 