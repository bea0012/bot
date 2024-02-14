const { Telegraf } = require('telegraf');

// Reemplaza 'TOKEN' con el token de tu bot, que obtendrás al hablar con BotFather en Telegram.
const bot = new Telegraf('6608239042:AAH77ZLdcqT010Eujl9eHytYzpBc1faYE8A');

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
bot.launch().then(() => {
    console.log('El bot está en funcionamiento');
});
