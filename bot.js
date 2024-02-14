const { Telegraf } = require('telegraf');
const mitoken = require('./variable.js');
module.exports = mitoken;
console.log(mitoken);
// Reemplaza 'TOKEN' con el token de tu bot, que obtendrás al hablar con BotFather en Telegram.
const bot = new Telegraf(mitoken);

// Comando /start
bot.start((ctx) => {
    ctx.reply('¡Hola! Soy tu bot de Telegram. ¡Bienvenido!');
});

// Comando /ayuda
bot.help((ctx) => {
    ctx.reply('Puedes usar /start para comenzar y /ayuda para obtener ayuda.');
});

// Manejar mensajes de texto
bot.on('text', (ctx) => {
    ctx.reply(`Recibí tu mensaje: ${ctx.message.text}`);
});

// Iniciar el bot
bot.launch();