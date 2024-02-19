process.noDeprecation = true;
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const mitoken = require('./variable.js');
const API_KEY = 'b509df2013cf7d5813fe673b713249dc';

const bot = new Telegraf(mitoken);

// Función para mostrar el menú principal
const showMainMenu = (ctx) => {
    const keyboard = Markup.keyboard([
        ['Catálogo de Películas'],
        ['Catálogo de Series'],
    ]).resize();

    ctx.reply('Selecciona una opción:', keyboard);
};

bot.start((ctx) => {
    ctx.reply('¡Hola! Soy tu bot de Telegram. ¡Bienvenido!');
    showMainMenu(ctx);
});

bot.help((ctx) => {
    ctx.reply('Puedes usar /start para comenzar y /ayuda para obtener ayuda.');
});

// Manejar selecciones del menú principal
bot.hears('Catálogo de Películas', async (ctx) => {
    try {
        // Lógica para mostrar el catálogo de películas
        const response = await axios.get('https://api.themoviedb.org/3/movie/popular', {
            params: {
                api_key: API_KEY,
            },
        });

        const movies = response.data.results;

        const buttons = movies.map((movie) => {
            return Markup.button.callback(movie.title, `movie_${movie.id}`);
        });

        const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

        ctx.reply('Catálogo de Películas:', keyboard);
    } catch (error) {
        console.error(error);
        ctx.reply('Hubo un error al obtener el catálogo de películas. Por favor, intenta de nuevo más tarde.');
    }
});

bot.hears('Catálogo de Series', async (ctx) => {
    try {
        // Lógica para mostrar el catálogo de series
        const response = await axios.get('https://api.themoviedb.org/3/tv/popular', {
            params: {
                api_key: API_KEY,
            },
        });

        const series = response.data.results;

        const buttons = series.map((serie) => {
            return Markup.button.callback(serie.name, `series_${serie.id}`);
        });

        const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

        ctx.reply('Catálogo de Series:', keyboard);
    } catch (error) {
        console.error(error);
        ctx.reply('Hubo un error al obtener el catálogo de series. Por favor, intenta de nuevo más tarde.');
    }
});

// Acciones para detalles de películas y series
bot.action(/movie_(\d+)/, async (ctx) => {
    const movieId = ctx.match[1];
    const movieLink = `https://www.themoviedb.org/movie/${movieId}`;

    // Enviar el enlace directo a la página de la película
    ctx.reply(`Enlace a la película: ${movieLink}`);
});

bot.action(/series_(\d+)/, async (ctx) => {
    const seriesId = ctx.match[1];
    const seriesLink = `https://www.themoviedb.org/tv/${seriesId}`;

    // Enviar el enlace directo a la página de la serie
    ctx.reply(`Enlace a la serie: ${seriesLink}`);
});

bot.on('text', (ctx) => {
    ctx.reply(`Recibí tu mensaje: ${ctx.message.text}`);
});

bot.launch();
