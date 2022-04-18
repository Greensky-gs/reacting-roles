const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
    event: 'messageReactionRemove',
    execute: async(reaction, user) => {
        const message = reaction.message;
        if (!message.guild) return;

        await message.guild.roles.fetch(); // Put roles in guild's cache
        const db = require('../db.json');

        if (!db.rolesreact[message.guild.id]) return; // Guild isn't in db
        if (!db.rolesreact[message.guild.id][reaction.emoji.id]) return // Message isn't set
        if (!db.rolesreact[message.guild.id][reaction.emoji.id].message !== message) return; // Not the same reaction
        const role = message.guild.roles.cache.get(db.rolesreact[message.guild.id][reaction.emoji.id].role);

        if (!role) return; // Role doesn't exist
        user.member.roles.remove(role).catch(() => {});
    }
}