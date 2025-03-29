const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');

// Configuración del cliente de Google Cloud Text-to-Speech
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: path.join(__dirname, '../../config/google-credentials.json')
});

/**
 * Genera un archivo de audio MP3 a partir de un texto usando Google Cloud Text-to-Speech
 * @param {string} text - El texto a convertir en audio
 * @param {string} title - El título de la noticia (se usa para el nombre del archivo)
 * @returns {Promise<string|null>} - La URL relativa del archivo de audio o null si hay un error
 */
async function generateAudio(text, title) {
  try {
    // Limpiar el título para usarlo como nombre de archivo
    const cleanTitle = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Crear directorio para los archivos de audio si no existe
    const audioDir = path.join(__dirname, '../../public/uploads/audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    const outputFile = path.join(audioDir, `${cleanTitle}.mp3`);

    // Configurar la solicitud
    const request = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
      audioConfig: { audioEncoding: 'MP3' },
    };

    // Realizar la solicitud a la API
    const [response] = await client.synthesizeSpeech(request);

    // Guardar el archivo de audio
    fs.writeFileSync(outputFile, response.audioContent, 'binary');

    // Retornar la URL relativa del archivo
    return `/uploads/audio/${cleanTitle}.mp3`;
  } catch (error) {
    console.error('Error al generar el audio:', error);
    return null;
  }
}

module.exports = {
  generateAudio
}; 