require('dotenv').config();
const Parser = require('rss-parser');
const parser = new Parser();
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337/api';
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const RSS_FEED_URL = process.env.RSS_FEED_URL;

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Retorna solo YYYY-MM-DD
}

function cleanHtml(html) {
    if (!html) return '';
    
    // Eliminar todas las etiquetas HTML
    let text = html.replace(/<[^>]+>/g, ' ');
    
    // Reemplazar entidades HTML comunes
    text = text.replace(/&quot;/g, '"')
               .replace(/&apos;/g, "'")
               .replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&#x27;/g, "'")
               .replace(/&nbsp;/g, ' ');
    
    // Eliminar espacios múltiples y saltos de línea
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
}

function extractImageUrl(content) {
    if (!content) return null;
    
    // Buscar la URL de la imagen en el contenido
    const imgMatches = [
        content.match(/src="([^"]+)"/),
        content.match(/src='([^']+)'/),
        content.match(/data-src="([^"]+)"/),
        content.match(/data-src='([^']+)'/),
        content.match(/data-original="([^"]+)"/),
        content.match(/data-original='([^']+)'/),
        content.match(/data-lazy-src="([^"]+)"/),
        content.match(/data-lazy-src='([^']+)'/),
        content.match(/data-srcset="([^"]+)"/),
        content.match(/data-srcset='([^']+)'/),
        content.match(/srcset="([^"]+)"/),
        content.match(/srcset='([^']+)'/)
    ];
    
    for (const match of imgMatches) {
        if (match && match[1]) {
            // Si es un srcset, tomar la primera URL
            if (match[1].includes(',')) {
                return match[1].split(',')[0].trim().split(' ')[0];
            }
            return match[1];
        }
    }
    
    // Buscar URLs de imágenes directamente
    const imageUrlPattern = /(https?:\/\/[^\s<>"]+?\.(?:jpg|jpeg|gif|png|webp))/i;
    const directUrlMatch = content.match(imageUrlPattern);
    if (directUrlMatch) {
        return directUrlMatch[1];
    }
    
    return null;
}

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
                // Crear nueva noticia
                const postData = {
                    data: {
                        title: latestNews.title,
                        link: latestNews.link,
                        description: fullDescription,
                        published_date: formatDate(latestNews.pubDate),
                        publishedAt: formatDate(new Date()),
                        imagen: imageUrl
                    }
                };

                await axios.post(`${STRAPI_URL}/noticias`, postData, {
                    headers: {
                        'Authorization': `Bearer ${API_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });

                console.log('✅ Nueva noticia creada exitosamente');
            } else {
                console.log('ℹ️ La noticia ya existe en la base de datos');
            }
        } catch (error) {
            console.error(`❌ Error procesando la noticia: ${error.response?.data || error.message}`);
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