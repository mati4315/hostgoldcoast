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
 * Obtiene la duración exacta del archivo de audio usando FFmpeg
 * @param {string} filePath - Ruta al archivo MP3
 * @returns {Promise<number>} - Duración en segundos
 */
function getExactAudioDuration(filePath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        console.error('Error al obtener la duración exacta:', err.message);
        // Fallback al cálculo por tamaño si falla FFmpeg
        const fileSize = fs.statSync(filePath).size;
        const bitrate = 128000; // 128 kbps para MP3
        const duration = Math.ceil((fileSize * 8) / bitrate);
        console.log('Usando duración estimada por tamaño:', duration, 'segundos');
        resolve(duration);
        return;
      }
      
      const duration = Math.round(metadata.format.duration);
      console.log('Duración exacta del audio:', duration, 'segundos');
      resolve(duration);
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
        speakingRate: 0.9,
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
    console.log('Archivo de audio creado:', filePath);
    console.log('Tamaño del archivo:', fs.statSync(filePath).size, 'bytes');

    // Obtener la duración exacta del audio usando FFmpeg
    const duration = await getExactAudioDuration(filePath);
      
    // Devolver la URL del archivo y su duración
    return {
      url: `/uploads/audio/${fileName}`,
      duration: duration
    };
  } catch (error) {
    console.error('Error al generar el audio:', error);
    throw error;
  }
}

module.exports = {
  generateAudio
}; 