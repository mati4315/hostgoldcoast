require('dotenv').config();
const Parser = require('rss-parser');
const parser = new Parser();
const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337/api';
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const RSS_FEED_URL = process.env.RSS_FEED_URL;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Retorna solo YYYY-MM-DD
}

async function createSummary(text) {
    try {
        const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
                {
                    role: "system",
                    content: "Eres un experto en crear resúmenes concisos y claros. Tu tarea es resumir el texto proporcionado usando palabras sencillas y manteniendo la información más importante. Devuelve solo el texto del resumen, sin títulos ni formato especial."
                },
                {
                    role: "user",
                    content: `Por favor, crea un resumen conciso y claro del siguiente texto usando palabras sencillas:\n\n${text}`
                }
            ],
            temperature: 0.7,
            max_tokens: 500
        }, {
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Limpiar el formato del resumen
        let summary = response.data.choices[0].message.content.trim();
        
        // Eliminar marcadores de formato
        summary = summary.replace(/\*\*/g, '')  // Eliminar **
                        .replace(/\*/g, '')      // Eliminar *
                        .replace(/^Resumen:?\s*/i, '')  // Eliminar "Resumen:" al inicio
                        .replace(/^Resumen conciso:?\s*/i, '')  // Eliminar "Resumen conciso:" al inicio
                        .replace(/\n+/g, ' ')    // Reemplazar saltos de línea por espacios
                        .replace(/\s+/g, ' ')    // Eliminar espacios múltiples
                        .trim();                 // Eliminar espacios al inicio y final

        return summary;
    } catch (error) {
        console.error('Error al crear el resumen:', error.message);
        return text; // Si hay un error, devolver el texto original
    }
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
                // Crear resumen con DeepSeek
                console.log('Creando resumen con DeepSeek...');
                const summary = await createSummary(fullDescription);
                console.log('\nResumen generado:');
                console.log(summary);
                console.log('----------------------------------------\n');

                // Crear nueva noticia
                const postData = {
                    data: {
                        title: latestNews.title,
                        link: latestNews.link,
                        description: summary,
                        published_date: formatDate(latestNews.pubDate),
                        publishedAt: formatDate(new Date()),
                        imagen: imageUrl
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