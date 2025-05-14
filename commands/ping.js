// Gərəkli modul və fayllar daxil edilir
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping') // Komanda adı
        .setDescription('Pong!'), // Komandanın açıqlaması
    async execute(interaction) {
        await interaction.reply('Pong!'); // Cavab verilir
    },
};