const Discord = require('discord.js');
const fs = require('fs');

const client = new Discord.Client({
    partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'],
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS]
});

fs.readdirSync('./events').filter(x => x.endsWith('.js')).forEach((fileName) => {
    let prop = require(`./events/${fileName}`);
    client.on(prop.event, prop.execute);
});

const { token } = require('./data.json');

client.login(token);