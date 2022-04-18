const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    configs: {
        name: 'roles-react',
        description: "Manage the roles react", 
        options: [
            {
                name: 'add',
                type: 'SUB_COMMAND',
                description: "Add a role",
                options: [
                    {
                        name: 'channel',
                        description: "Channel's message",
                        type: 'CHANNEL',
                        required: true
                    },
                    {
                        name: 'id',
                        description: "Message id",
                        type: 'STRING',
                        required: true
                    },
                    {
                        name: 'role',
                        description: "Role",
                        required: true,
                        type: "ROLE"
                    },
                    {
                        name: 'reaction',
                        description: "Reaction identifier",
                        required: true,
                        type: 'STRING'
                    }
                ]
            },
            {
                name: 'remove',
                type: 'SUB_COMMAND',
                description: "Remove a role",
                options: [
                    {
                        name: 'channel',
                        description: "Channel's message",
                        type: 'CHANNEL',
                        required: true
                    },
                    {
                        name: 'id',
                        description: "Message id",
                        type: 'STRING',
                        required: true
                    },
                    {
                        name: 'role',
                        description: "Role",
                        required: true,
                        type: "ROLE"
                    }
                ]
            }
        ]
    },
    /**
     * @param {Discord.CommandInteraction} interaction 
     */
    run: async(interaction) => {
        const subCommand = interaction.options.getSubcommand(); // Get sub command
        const channel = interaction.options.get('channel').channel;

        if (!channel.type === 'GUILD_TEXT') return interaction.reply({ content: "Please specify a text channel" }); // We sort by type, we need only text channels
        await channel.messages.fetch();

        const msg = channel.messages.cache.get(interaction.options.get('id').value);
        if (!msg) return interaction.reply({ content: `I can't find this message. please use an id` }); // Check if message exists

        const rId = interaction.options.get('role').role.id;
        const db = require('../db.json');

        if (subCommand === 'add') {
            if (!db.rolesreact[msg.guild.id]) db.rolesreact[msg.guild.id] = {};

            msg.react(interaction.options.get('reaction').value).catch(() => {
                return interaction.reply({ content: "Please use the id of the emoji to react" });
            });
            setTimeout(() => {
                if (interaction.replied) return; // Return if already replied, so if emoji is inacurrate
                
                const id = `${interaction.options.get('reaction').value}.${msg.id}`;
                db.rolesreact[msg.guild.id][id] = {
                    message: msg.id,
                    channel: channel.id,
                    reaction: interaction.options.get('reaction').value,
                    role: rId
                };

                fs.writeFileSync(`./db.json`, JSON.stringify(db, null, 1)); // Register the JSON database
                interaction.reply({ content: `Added ${interaction.options.get('reaction').value} on ${msg.id} in <#${channel.id}> with the role \`${rId}\`` });
            }, 1000);
        } else {
            if (!db.rolesreact[msg.guild.id]) db.rolesreact[msg.guild.id] = {};

            msg.reactions.cache.get(interaction.options.get('reaction').value).remove().catch(() => {
                return interaction.reply({ content: "Please use the id of the emoji to unreact" });
            });
            setTimeout(() => {
                if (interaction.replied) return; // Return if already replied, so if emoji is inacurrate
                
                const id = `${interaction.options.get('reaction').value}.${msg.id}`;
                if (!db.rolesreact[msg.guild.id][id]) return interaction.reply({ content: `This reaction isn't a reacting role` });

                delete db.rolesreact[msg.guild.id][id];

                fs.writeFileSync(`./db.json`, JSON.stringify(db, null, 1)); // Register the JSON database
                interaction.reply({ content: `Removed ${interaction.options.get('reaction').value} on ${msg.id} in <#${channel.id}> with the role \`${rId}\`` });
            }, 1000);
        }
    }
}