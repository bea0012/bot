process.noDeprecation = true;
const { Telegraf, Markup } = require('telegraf');
const axios = require('axios');
const mitoken = require('./variable.js');
const API_KEY = 'b509df2013cf7d5813fe673b713249dc';

const bot = new Telegraf(mitoken);

// Función para mostrar el menú principal
const showMainMenu = (ctx) => {
    const keyboard = Markup.keyboard([
        ['Películas Populares', 'Películas Mejor Puntuadas'],
        ['Series Populares', 'Series Mejor Puntuadas'],
    ]).resize();

    ctx.reply('Selecciona una opción:', keyboard);
};

const fetchMoviesOrSeries = async (url, ctx, title) => {
    try {
        const response = await axios.get(url, {
            params: {
                api_key: API_KEY,
            },
        });

        console.log('API Response Headers:', response.headers); // Añade este log para verificar los encabezados de respuesta.

        const items = response.data.results;

        const buttons = items.map((item) => {
            return Markup.button.callback(item.title || item.name, `${title.toLowerCase()}_${item.id}`);
        });

        const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

        ctx.reply(title, keyboard);
    } catch (error) {
        console.error(error);
        ctx.reply(`Hubo un error al obtener el catálogo de ${title}. Por favor, intenta de nuevo más tarde.`);
    }
};

bot.start((ctx) => {
    ctx.reply('¡Hola! Soy tu bot de Telegram. ¡Bienvenido!');
    showMainMenu(ctx);
});

bot.help((ctx) => {
    ctx.reply('Puedes usar /start para comenzar y /ayuda para obtener ayuda.');
});

bot.hears('Películas Populares', async (ctx) => {
    await fetchMoviesOrSeries('https://api.themoviedb.org/3/movie/popular', ctx, 'Películas Populares');
});

bot.hears('Películas Mejor Puntuadas', async (ctx) => {
    await fetchMoviesOrSeries('https://api.themoviedb.org/3/movie/top_rated', ctx, 'Películas Mejor Puntuadas');
});

bot.hears('Series Populares', async (ctx) => {
    await fetchMoviesOrSeries('https://api.themoviedb.org/3/tv/popular', ctx, 'Series Populares');
});

bot.hears('Series Mejor Puntuadas', async (ctx) => {
    await fetchMoviesOrSeries('https://api.themoviedb.org/3/tv/top_rated', ctx, 'Series Mejor Puntuadas');
});

// Resto del código...

bot.launch();
