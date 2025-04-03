require('dotenv').config();
const Parser = require('rss-parser');
const parser = new Parser();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const textToSpeech = require('@google-cloud/text-to-speech');
const { cleanHtml, extractImageUrl, formatDate } = require('./services/utils');
const { createSummary } = require('./services/deepseek');
const { generateAudio } = require('./services/textToSpeech');
const { generateTimestamps } = require('./services/timestamps');
const { translateTimestamps } = require('./services/translate');

// Configuración y variables de entorno
const STRAPI_URL = 'http://localhost:1337/api';
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const RSS_FEED_URL = process.env.RSS_FEED_URL;
const NUMERO_NOTI = process.env.NUMERO_NOTI;

// Información de depuración
console.log('🔑 Variables de entorno:');
console.log('RSS_FEED_URL:', RSS_FEED_URL);
console.log('API_TOKEN configurado:', API_TOKEN ? 'Sí' : 'No');
console.log('DEEPSEEK_API_KEY configurado:', process.env.DEEPSEEK_API_KEY ? 'Sí' : 'No');
console.log('----------------------------------------\n');

// Configuración de Google Cloud Text-to-Speech
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: path.join(__dirname, '../config/google-credentials.json')
});

async function fetchAndSaveNews() {
    try {
        console.log('Iniciando proceso de scraping...');
        const feed = await parser.parseURL(RSS_FEED_URL);
        
        if (feed.items.length === 0) {
            console.log('No se encontraron noticias en el feed RSS');
            return;
        }

        // Tomar solo la noticia más reciente
        const latestNews = feed.items[parseInt(NUMERO_NOTI)];
        
        // Extraer la descripción completa del contenido codificado
        const fullDescription = cleanHtml(latestNews['content:encoded'] || latestNews.content || latestNews.description);
        const imageUrl = extractImageUrl(latestNews['content:encoded']) || 
                        extractImageUrl(latestNews.content) || 
                        extractImageUrl(latestNews.description);
        
        console.log('\n📰 Detalles de la noticia más reciente:');
        console.log('----------------------------------------');
        console.log(`Título: ${latestNews.title}`);
        console.log(`Fecha de publicación: ${formatDate(latestNews.pubDate)}`);
        console.log(`Enlace: ${latestNews.link}`);
        console.log(`Imagen: ${imageUrl || 'No se encontró imagen'}`);
        console.log('----------------------------------------\n');
        
        try {
            // Verificar si la noticia ya existe
            console.log('Verificando si la noticia ya existe en Strapi...');
            console.log(`URL de la API: ${STRAPI_URL}/noticias`);
            
            const response = await axios.get(`${STRAPI_URL}/noticias`, {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`
                },
                params: {
                    filters: {
                        link: latestNews.link
                    }
                }
            });

            console.log('Respuesta de la API:', response.status);
            console.log('Datos:', response.data);

            if (response.data.data.length === 0) {
                // Crear resumen con DeepSeek
                console.log('Creando resumen con DeepSeek...');
                const summary = await createSummary(fullDescription);
                console.log('\nResumen generado');
                console.log('----------------------------------------\n');

                // Generar audio del resumen
                console.log('Generando audio del resumen...');
                const { url: audioUrl, duration: audioDuration } = await generateAudio(summary, latestNews.title);
                console.log('Audio generado exitosamente');
                console.log('URL del audio:', audioUrl);
                console.log('----------------------------------------\n');

                // Generar timestamps
                console.log('Generando timestamps...');
                const timestamps = await generateTimestamps(summary, audioDuration);
                console.log('Timestamps generados exitosamente');
                console.log('----------------------------------------\n');
               
                // Traducir timestamps
                console.log('Traduciendo timestamps al español y portugués...');
                const translationResult = await translateTimestamps(timestamps, latestNews.title);
                const timestampsWithTranslation = translationResult.timestamps;
                const title_es = translationResult.title_es;
                console.log('Timestamps traducidos exitosamente');
                 // Crear nueva noticia
                const data = {
                    data: {
                        title: latestNews.title,
                        pubDate: new Date(latestNews.pubDate).toISOString(),
                        publishedAt: new Date().toISOString(),
                        imagen: imageUrl,
                        audioUrl: audioUrl,
                        link: latestNews.link,
                        description: latestNews.description || latestNews.title,
                        title_es: title_es,
                        timestamps: timestampsWithTranslation
                    }
                };

                console.log('\nCreando nueva noticia en Strapi...');

                try {
                    const createResponse = await axios.post(`${STRAPI_URL}/noticias`, data, {
                        headers: {
                            'Authorization': `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('✅ Nueva noticia creada exitosamente');
                    console.log('ID de la noticia:', createResponse.data.data.id);
                } catch (createError) {
                    console.error('❌ Error al crear la noticia:');
                    console.error('Código:', createError.code);
                    console.error('Mensaje:', createError.message);
                    if (createError.response) {
                        console.error('Estado:', createError.response.status);
                        console.error('Datos:', JSON.stringify(createError.response.data, null, 2));
                    }
                }
            } else {
                console.log('La noticia ya existe en la base de datos');
            }
        } catch (error) {
            console.error('❌ Error al procesar la noticia:');
            console.error('Código:', error.code);
            console.error('Mensaje:', error.message);
            if (error.response) {
                console.error('Estado:', error.response.status);
                console.error('Datos:', JSON.stringify(error.response.data, null, 2));
            }
        }
    } catch (error) {
        console.error('❌ Error al obtener el feed RSS:', error.message);
    }
}

fetchAndSaveNews(); 