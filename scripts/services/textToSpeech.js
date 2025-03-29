const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const ffmpeg = require('fluent-ffmpeg');

// Configuración del cliente de Google Cloud Text-to-Speech
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: path.join(__dirname, '../../config/google-credentials.json')
});

/**
 * Obtiene la duración real de un archivo MP3 usando ffmpeg
 * @param {string} filePath - Ruta al archivo MP3
 * @returns {Promise<number>} - Duración en segundos
 */
function getDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error('Error al obtener la duración del audio:', err);
        // Fallback al cálculo basado en tamaño si falla ffmpeg
        const fileSize = fs.statSync(filePath).size;
        const bitrate = 128000;
        const estimatedDuration = Math.ceil((fileSize * 8) / bitrate);
        console.log('Usando duración estimada:', estimatedDuration, 'segundos');
        resolve(estimatedDuration);
        return;
      }

      const duration = metadata.format.duration;
      console.log('Duración real del audio:', duration, 'segundos');
      resolve(Math.ceil(duration));
    });
  });
}

/**
 * Genera un archivo de audio MP3 a partir de un texto usando Google Cloud Text-to-Speech
 * @param {string} text - El texto a convertir en audio
 * @param {string} title - El título de la noticia (se usa para el nombre del archivo)
 * @returns {Promise<{url: string, duration: number}>} - La URL relativa del archivo de audio y su duración
 */
async function generateAudio(text, title) {
  try {
    // Configurar la solicitud
    const request = {
      input: { text },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { 
        audioEncoding: 'MP3',
        speakingRate: 1.0,
        pitch: 0
      },
    };

    // Realizar la solicitud de síntesis de texto a voz
    const [response] = await client.synthesizeSpeech(request);
    const audioContent = response.audioContent;

    // Crear un nombre de archivo único
    const fileName = `${uuidv4()}.mp3`;
    const filePath = path.join(__dirname, '../../public/uploads/audio', fileName);

    // Asegurarse de que el directorio existe
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Escribir el archivo de audio
    fs.writeFileSync(filePath, audioContent, 'binary');

    // Obtener la duración real del audio
    const durationInSeconds = await getDuration(filePath);

    // Devolver la URL del archivo y su duración
    return {
      url: `/uploads/audio/${fileName}`,
      duration: durationInSeconds
    };
  } catch (error) {
    console.error('Error al generar el audio:', error);
    throw error;
  }
}

module.exports = {
  generateAudio
}; 