const Discord = require('discord.js');

module.exports = {
    event: 'interactionCreate',
    execute: (interaction) => {
        if (!interaction.isCommand()) return;
        const name = interaction.commandName.replace(/ +/g, '-');
        if (!name) return;

        const file = require(`../slash-commands/${name}.js`);
        file.run(interaction);
    }
}