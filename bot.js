process.noDeprecation = true;
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const mitoken = require('./variable.js');
const API_KEY = 'b509df2013cf7d5813fe673b713249dc';

const bot = new Telegraf(mitoken);

const showMainMenu = (ctx) => {
    const keyboard = Markup.keyboard([
        ['🎬Películas Populares', '🏆Películas Mejor Puntuadas'],
        ['📺Series Populares'],
    ]).resize();

    ctx.reply('¿Qué quieres ver hoy?👀:', keyboard);
};

bot.start((ctx) => {
    ctx.reply('¡Hola! Soy tu solución, que eres más de ¿🍿pelis o 📺series? Eso da igual porqué aquí podrás encontrar de todo, investiga y descubre que serie deberías empezar o que película te estas perdiendo. ¡Bienvenido a ¿Peli o Serie?!');
    showMainMenu(ctx);
});

bot.help((ctx) => {
    ctx.reply('Puedes usar /start para comenzar y /ayuda para obtener ayuda.');
});

// Manejar selecciones del menú principal
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
        ctx.reply(`Hubo un error al obtener el catálogo de ${title}. Por favor, intenta de nuevo más tarde.🚧`);
    }
};

bot.hears('🎬Películas Populares', async (ctx) => {
    await fetchMovies('https://api.themoviedb.org/3/movie/popular', ctx, '🎬Películas Populares');
});

bot.hears('🏆Películas Mejor Puntuadas', async (ctx) => {
    await fetchMovies('https://api.themoviedb.org/3/movie/top_rated', ctx, '🏆Películas Mejor Puntuadas');
});

bot.hears('📺Series Populares', async (ctx) => {
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

        ctx.reply('📺Series Populares:', keyboard);
    } catch (error) {
        console.error(error);
        ctx.reply('Hubo un error al obtener el catálogo de series. Por favor, intenta de nuevo más tarde.');
    }
});

bot.action(/movie_(\d+)/, async (ctx) => {
    const movieId = ctx.match[1];
    const movieLink = `https://www.themoviedb.org/movie/${movieId}`;

    ctx.reply(`Más info sobre la película que buscas: ${movieLink}`);
});

bot.action(/series_(\d+)/, async (ctx) => {
    const seriesId = ctx.match[1];
    const seriesLink = `https://www.themoviedb.org/tv/${seriesId}`;

    ctx.reply(`Más info sobre la serie que buscas: ${seriesLink}`);
});

bot.on('text', (ctx) => {
    ctx.reply(`Recibí tu mensaje: ${ctx.message.text}`);
});

bot.launch();
