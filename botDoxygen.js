process.noDeprecation = true;
/**
 * @file main.js
 * @brief Bot de Telegram que proporciona información sobre películas y series utilizando la API de The Movie Database (TMDb).
 * @version 1.0
 */

// Importar módulos necesarios
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const mitoken = require('./variable.js');

// Configurar token de la API de TMDb
const API_KEY = 'b509df2013cf7d5813fe673b713249dc';

// Crear instancia de Telegraf (bot)
const bot = new Telegraf(mitoken);

/**
 * @brief Muestra el menú principal con opciones para películas y series.
 * @param ctx Contexto de la conversación.
 */
const showMainMenu = (ctx) => {
    const keyboard = Markup.keyboard([
        ['Películas Populares', 'Películas Mejor Puntuadas'],
        ['Series Populares'],
    ]).resize();

    ctx.reply('¿Qué quieres ver hoy?:', keyboard);
};

// Comando /start
/**
 * @brief Maneja el comando /start.
 * @param ctx Contexto de la conversación.
 */
bot.start((ctx) => {
    ctx.reply('¡Hola! Soy tu solución, ¿eres más de pelis o series? Aquí podrás encontrar de todo. ¡Bienvenido a ¿Peli o Serie?! 🍿');
    showMainMenu(ctx);
});

// Comando /help
/**
 * @brief Maneja el comando /help.
 * @param ctx Contexto de la conversación.
 */
bot.help((ctx) => {
    ctx.reply('Puedes usar /start para comenzar y /help para obtener ayuda.');
});

// Manejar selecciones del menú principal

/**
 * @brief Obtiene y muestra el catálogo de películas desde la API de TMDb.
 * @param url URL de la API para obtener el catálogo.
 * @param ctx Contexto de la conversación.
 * @param title Título para mostrar en el mensaje.
 */
const fetchMovies = async (url, ctx, title) => {
    try {
        const response = await axios.get(url, {
            params: {
                api_key: API_KEY,
            },
        });

        const movies = response.data.results;

        const buttons = movies.map((movie) => {
            return Markup.button.callback(movie.title, `movie_${movie.id}`);
        });

        const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

        ctx.reply(title, keyboard);
    } catch (error) {
        console.error(error);
        ctx.reply(`Hubo un error al obtener el catálogo de ${title}. Por favor, intenta de nuevo más tarde.`);
    }
};

/**
 * @brief Maneja la selección de "Películas Populares".
 * @param ctx Contexto de la conversación.
 */
bot.hears('Películas Populares', async (ctx) => {
    await fetchMovies('https://api.themoviedb.org/3/movie/popular', ctx, 'Películas Populares');
});

/**
 * @brief Maneja la selección de "Películas Mejor Puntuadas".
 * @param ctx Contexto de la conversación.
 */
bot.hears('Películas Mejor Puntuadas', async (ctx) => {
    await fetchMovies('https://api.themoviedb.org/3/movie/top_rated', ctx, 'Películas Mejor Puntuadas');
});

/**
 * @brief Obtiene y muestra el catálogo de series desde la API de TMDb.
 * @param ctx Contexto de la conversación.
 */
bot.hears('Series Populares', async (ctx) => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/tv/top_rated', {
            params: {
                api_key: API_KEY,
            },
        });

        const series = response.data.results;

        const buttons = series.map((serie) => {
            return Markup.button.callback(serie.name, `series_${serie.id}`);
        });

        const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

        ctx.reply('Series Populares:', keyboard);
    } catch (error) {
        console.error(error);
        ctx.reply('Hubo un error al obtener el catálogo de series. Por favor, intenta de nuevo más tarde.');
    }
});

/**
 * @brief Maneja la acción de seleccionar una película.
 * @param ctx Contexto de la conversación.
 */
bot.action(/movie_(\d+)/, async (ctx) => {
    const movieId = ctx.match[1];
    const movieLink = `https://www.themoviedb.org/movie/${movieId}`;

    ctx.reply(`Más info sobre la película que buscas: ${movieLink}`);
});

/**
 * @brief Maneja la acción de seleccionar una serie.
 * @param ctx Contexto de la conversación.
 */
bot.action(/series_(\d+)/, async (ctx) => {
    const seriesId = ctx.match[1];
    const seriesLink = `https://www.themoviedb.org/tv/${seriesId}`;

    ctx.reply(`Más info sobre la serie que buscas: ${seriesLink}`);
});

/**
 * @brief Maneja mensajes de texto.
 * @param ctx Contexto de la conversación.
 */
bot.on('text', (ctx) => {
    ctx.reply(`Recibí tu mensaje: ${ctx.message.text}`);
});

// Iniciar el bot
/**
 * @brief Inicia el bot de Telegram.
 */
bot.launch();
