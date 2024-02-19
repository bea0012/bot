process.noDeprecation = true;
const { Telegraf, Markup } = require('telegraf');
const mitoken = require('./variable.js');
const core = require('core-js');
const axios = require('axios');
module.exports = mitoken;


const bot = new Telegraf(mitoken);

// Saludo de presentación
bot.start((ctx) => {
    ctx.reply('¡Hola! Soy tu bot de Telegram. ¡Bienvenido!');
    enviarMenu(ctx);
});

// Comando /ayuda
bot.help((ctx) => {
    ctx.reply('Puedes usar /start para comenzar y /ayuda para obtener ayuda.');
});

// Manejar botones
bot.action('catalogoPeliculas', async (ctx) => {
    try {
        const apiKeyPeliculas = 'TU_CLAVE_DE_API_DE_PELICULAS'; // Reemplaza con tu clave de API de películas
        const respuestaPeliculas = await axios.get(`URL_DE_LA_API_DE_PELICULAS_EN_CARTELERA?api_key=${apiKeyPeliculas}&otros_parametros`);
        const catalogo = respuestaPeliculas.data; // Ajusta según la respuesta de la API
        ctx.reply(`Catálogo de Películas en Cartelera:\n${JSON.stringify(catalogo, null, 2)}`);
    } catch (error) {
        console.error(error);
        ctx.reply('Ocurrió un error al obtener el catálogo de películas.');
    }
});

bot.action('verTiempo', async (ctx) => {
    try {
        const apiKeyTiempo = 'TU_CLAVE_DE_API_DEL_TIEMPO'; // Reemplaza con tu clave de API del tiempo
        const ciudad = 'NombreDeLaCiudad'; // Reemplaza con el nombre de la ciudad
        const respuestaTiempo = await axios.get(`URL_DE_LA_API_DEL_TIEMPO?api_key=${apiKeyTiempo}&ciudad=${ciudad}&otros_parametros`);
        const informacionTiempo = respuestaTiempo.data; // Ajusta según la respuesta de la API
        ctx.reply(`Información del Tiempo:\n${JSON.stringify(informacionTiempo, null, 2)}`);
    } catch (error) {
        console.error(error);
        ctx.reply('Ocurrió un error al obtener la información del tiempo.');
    }
});

bot.action('verNoticias', async (ctx) => {
    try {
        const apiKeyNoticias = 'TU_CLAVE_DE_API_DE_NOTICIAS'; // Reemplaza con tu clave de API de noticias
        const respuestaNoticias = await axios.get(`URL_DE_LA_API_DE_NOTICIAS?api_key=${apiKeyNoticias}&otros_parametros`);
        const noticias = respuestaNoticias.data; // Ajusta según la respuesta de la API
        ctx.reply(`Últimas Noticias:\n${JSON.stringify(noticias, null, 2)}`);
    } catch (error) {
        console.error(error);
        ctx.reply('Ocurrió un error al obtener las últimas noticias.');
    }
});

// Función para enviar el menú con los botones
function enviarMenu(ctx) {
    ctx.reply('Selecciona una opción:', Markup.inlineKeyboard([
        Markup.button.callback('Catálogo de Películas', 'catalogoPeliculas'),
        Markup.button.callback('Ver Tiempo', 'verTiempo'),
        Markup.button.callback('Ver Noticias', 'verNoticias'),
    ]));
}

// Iniciar el bot
bot.launch();