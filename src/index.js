const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const {gameOptions, againOptions} = require('./keyboard');

const bot = new TelegramBot(config.token, {
    polling: true
});

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Я загадал число от 0 до 9, попробуй угадать его');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId,'Отгадывай', gameOptions);
};

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Приветствие'},
        {command: '/info', description: 'Узнать инфрмацию о себе'},
        {command: '/game', description: 'Мини-игра'}
    ]);

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.from.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/629/439/62943973-f1e5-422a-91ff-0436fd9c9722/192/1.webp');
            return bot.sendMessage(chatId, `Эххе бляя, я тебе ахуенно сделаю братишка`)
        }
    
        if (text === '/info') {
            return bot.sendMessage(chatId, `Здарова ${msg.from.first_name} ${msg.from.last_name}`)
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'Такой команды не существует');
    });

    bot.on('callback_query', (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === 'again') {
            return startGame(chatId);
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю ты угадал цифру ${chats[chatId]}`, againOptions);
        } else {
            return bot.sendMessage(chatId, `Ты не угадал цифру, правильная цифра: ${chats[chatId]}`, againOptions);
        }
    });
}

start();