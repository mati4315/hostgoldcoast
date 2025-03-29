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

const STRAPI_URL = 'http://localhost:1337/api';
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const RSS_FEED_URL = process.env.RSS_FEED_URL;

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
        const latestNews = feed.items[0];
        
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
        console.log('\nDescripción completa:');
        console.log(fullDescription);
        console.log('----------------------------------------\n');
        
        try {
            // Verificar si la noticia ya existe
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

            if (response.data.data.length === 0) {
                // Crear resumen con DeepSeek
                console.log('Creando resumen con DeepSeek...');
                const summary = await createSummary(fullDescription);
                console.log('\nResumen generado:');
                console.log(summary);
                console.log('----------------------------------------\n');

                // Generar audio del resumen
                const audioUrl = await generateAudio(summary, latestNews.title);

                // Crear nueva noticia
                const postData = {
                    data: {
                        title: latestNews.title,
                        link: latestNews.link,
                        description: summary,
                        pubDate: new Date(latestNews.pubDate),
                        publishedAt: new Date(),
                        imagen: imageUrl,
                        audioUrl: audioUrl
                    }
                };

                try {
                    const createResponse = await axios.post(`${STRAPI_URL}/noticias`, postData, {
                        headers: {
                            'Authorization': `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    console.log('✅ Nueva noticia creada exitosamente');
                } catch (createError) {
                    console.error('Error al crear la noticia:', createError.response?.data || createError.message);
                    console.error('Datos enviados:', JSON.stringify(postData, null, 2));
                }
            } else {
                console.log('ℹ️ La noticia ya existe en la base de datos');
            }
        } catch (error) {
            console.error('Error al procesar la noticia:', error.response?.data || error.message);
            if (error.response) {
                console.error('Estado de la respuesta:', error.response.status);
                console.error('Datos de la respuesta:', error.response.data);
            }
        }
        
        console.log('\nProceso de scraping completado.');
    } catch (error) {
        console.error('Error al procesar el feed RSS:', error);
    }
}

// Ejecutar el scraping
fetchAndSaveNews().then(() => process.exit(0)).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
}); 