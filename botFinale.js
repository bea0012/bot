/**
 * Configuración para desactivar mensajes de deprecación.
 * @type {boolean}
 */
process.noDeprecation = true;

/**
 * Módulos necesarios de Telegraf y axios.
 * @const {Object}
 */
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');

/**
 * Token de la API de Telegram.
 * @const {string}
 */
const mitoken = require('./variable.js');

/**
 * Clave de la API de The Movie Database.
 * @const {string}
 */
const API_KEY = 'b509df2013cf7d5813fe673b713249dc';

/**
 * Crear una instancia del bot de Telegram.
 * @const {Telegraf}
 */
const bot = new Telegraf(mitoken);

/**
 * Muestra el menú principal con opciones de películas y series.
 * @param {Object} ctx - Contexto de la conversación.
 * @return {void}
 */
const showMainMenu = (ctx) => {
    /**
     * Teclado con opciones de películas y series.
     * @type {Object}
     */
    const keyboard = Markup.keyboard([
        ['🎬Películas Populares', '🏆Películas Mejor Puntuadas'],
        ['📺Series Populares'],
    ]).resize();

    ctx.reply('¿Qué quieres ver hoy? 👀:', keyboard);
};

/**
 * Maneja la acción de seleccionar una opción de películas o series.
 * @param {string} url - URL de la API para obtener la información.
 * @param {Object} ctx - Contexto de la conversación.
 * @param {string} title - Título para mostrar en el mensaje.
 * @return {void}
 */

bot.start((ctx) => {
    ctx.reply('¡Hola! Soy tu solución, que eres más de ¿🍿pelis o 📺series? Eso da igual porqué aquí podrás encontrar de todo, investiga y descubre que serie deberías empezar o que película te estas perdiendo. ¡Bienvenido a ¿Peli o Serie?!');
    showMainMenu(ctx);
});

const fetchMovies = async (url, ctx, title) => {
    try {
        /**
         * Respuesta de la API de películas o series.
         * @type {Object}
         */
        const response = await axios.get(url, {
            params: {
                api_key: API_KEY,
            },
        });

        /**
         * Lista de películas o series.
         * @type {Array}
         */
        const movies = response.data.results;

        /**
         * Botones generados a partir de las películas o series.
         * @type {Array}
         */
        const buttons = movies.map((movie) => {
            return Markup.button.callback(movie.title, `movie_${movie.id}`);
        });

        /**
         * Teclado en línea con los botones de películas o series.
         * @type {Object}
         */
        const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

        ctx.reply(title, keyboard);
    } catch (error) {
        console.error(error);
        ctx.reply(`Hubo un error al obtener el catálogo de ${title}. Por favor, intenta de nuevo más tarde. 🚧`);
    }
};

/**
 * Maneja la selección de 'Películas Populares'.
 * @param {Object} ctx - Contexto de la conversación.
 * @return {void}
 */
bot.hears('🎬Películas Populares', async (ctx) => {
    await fetchMovies('https://api.themoviedb.org/3/movie/popular', ctx, '🎬Películas Populares');
});

/**
 * Maneja la selección de 'Películas Mejor Puntuadas'.
 * @param {Object} ctx - Contexto de la conversación.
 * @return {void}
 */
bot.hears('🏆Películas Mejor Puntuadas', async (ctx) => {
    await fetchMovies('https://api.themoviedb.org/3/movie/top_rated', ctx, '🏆Películas Mejor Puntuadas');
});

/**
 * Maneja la selección de 'Series Populares'.
 * @param {Object} ctx - Contexto de la conversación.
 * @return {void}
 */
bot.hears('📺Series Populares', async (ctx) => {
    try {
        /**
         * Respuesta de la API de series.
         * @type {Object}
         */
        const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
            params: {
                api_key: API_KEY,
            },
        });

        /**
         * Lista de series.
         * @type {Array}
         */
        const series = response.data.results;

        /**
         * Botones generados a partir de las series.
         * @type {Array}
         */
        const buttons = series.map((serie) => {
            return Markup.button.callback(serie.name, `series_${serie.id}`);
        });

        /**
         * Teclado en línea con los botones de series.
         * @type {Object}
         */
        const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

        ctx.reply('📺Series Populares:', keyboard);
    } catch (error) {
        console.error(error);
        ctx.reply('Hubo un error al obtener el catálogo de series. Por favor, intenta de nuevo más tarde.');
    }
});

/**
 * Acción para mostrar más información sobre una película.
 * @param {Object} ctx - Contexto de la conversación.
 * @return {void}
 */
bot.action(/movie_(\d+)/, async (ctx) => {
    /**
     * ID de la película seleccionada.
     * @type {string}
     */
    const movieId = ctx.match[1];

    /**
     * Enlace a la página de la película en The Movie Database.
     * @type {string}
     */
    const movieLink = `https://www.themoviedb.org/movie/${movieId}`;

    ctx.reply(`Más info sobre la película que buscas: ${movieLink}`);
});

/**
 * Acción para mostrar más información sobre una serie.
 * @param {Object} ctx - Contexto de la conversación.
 * @return {void}
 */
bot.action(/series_(\d+)/, async (ctx) => {
    /**
     * ID de la serie seleccionada.
     * @type {string}
     */
    const seriesId = ctx.match[1];

    /**
     * Enlace a la página de la serie en The Movie Database.
     * @type {string}
     */
    const seriesLink = `https://www.themoviedb.org/tv/${seriesId}`;

    ctx.reply(`Más info sobre la serie que buscas: ${seriesLink}`);
});

/**
 * Maneja cualquier texto enviado por el usuario.
 * @param {Object} ctx - Contexto de la conversación.
 * @return {void}
 */
bot.on('text', (ctx) => {
    ctx.reply(`Recibí tu mensaje: ${ctx.message.text}`);
});

/**
 * Inicia el bot de Telegram.
 * @return {void}
 */
bot.launch();
