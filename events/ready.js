module.exports = {
    event: 'ready',
    execute: (client) => {
        console.log('Ready !');

        const slashCommandsBuilder = () => {
            const fs = require('fs');

            fs.readdirSync('./slash-commands').filter((x) => x.endsWith('.js')).forEach((fileName) => {
                const file = require(`../slash-commands/${fileName}`);

                client.application.commands.create({
                    name: file.configs.name,
                    description: file.configs.description,
                    options: file.configs.options,
                    type: 'CHAT_INPUT'
                });
            });
        };

        slashCommandsBuilder();
        setInterval(slashCommandsBuilder, 600000);
    }
};