// Gərəkli modul və fayllar daxil edilir
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const JsonHelper = require("../utils/jsonHelper");

module.exports = {
    // Slash komanda qurulması
    data: new SlashCommandBuilder()
        .setName("kişi") // Komanda adı
        .setDescription("Kişi qeydiyyatı üçün.") // Komandanın açıqlaması
        .addUserOption(option => 
            option.setName("istifadeci")
                .setDescription("Qeydiyyat olunacaq istifadəçi")
                .setRequired(true)) // İstifadəçi seçimi
        .addStringOption(option => 
            option.setName("ad")
                .setDescription("İstifadəçi adı")
                .setRequired(true)) // Ad seçimi
        .addIntegerOption(option => 
            option.setName("yas")
                .setDescription("İstifadəçi yaşı")
                .setRequired(true)), // Yaş seçimi

    // Komanda icrası
    async execute(interaction) {
        // Konfiqurasiya faylından ID-lər alınır
        const config = require("../config.json");
        const kayıtKanalı = config.registerChannelID; // Qeydiyyat kanalı ID-si
        const logKanalı = config.logChannelID; // Log kanalı ID-si
        const chatKanalı = config.chatChannelID; // Chat kanalı ID-si

        // Əmr yalnız qeydiyyat kanalında işləyir
        if (interaction.channel.id !== kayıtKanalı) {
            return interaction.reply({ 
                content: "Bu əmr yalnız qeydiyyat kanalında istifadə edilə bilər!", 
                ephemeral: true 
            });
        }

        // Əmrdən alınan məlumatlar
        const user = interaction.options.getUser("istifadeci"); // İstifadəçi
        const isim = interaction.options.getString("ad"); // Ad
        const yaş = interaction.options.getInteger("yas"); // Yaş
        const member = interaction.guild.members.cache.get(user.id); // Guild üzvü

        // Əgər istifadəçi tapılmazsa cavab ver
        if (!member) return interaction.reply({ 
            content: "İstifadəçi tapılmadı.", 
            ephemeral: true 
        });

        // İstifadəçidən qeydiyyatsız rol silinir
        await member.roles.remove(config.unregisteredRoleID).catch(console.error);

        // İstifadəçiyə kişi və üzv rolları verilir
        await member.roles.add([config.maleRoleID, config.memberRoleID]).catch(console.error);

        // İstifadəçinin adı və yaşı nickname olaraq təyin olunur
        await member.setNickname(`${isim} | ${yaş}`).catch(console.error);

        // Qeydiyyat sayğacı artırılır (JSON faylına yazılır)
        const kayitHelper = new JsonHelper("kayitlar.json");
        kayitHelper.incrementRegister(interaction.user.id, "male");

        // Log kanalı əldə edilir (istifadə olunmur burada, amma bəlkə əlavə etmək istəmisən)
        const logChannel = interaction.guild.channels.cache.get(logKanalı);
        
        // Chat kanalında istifadəçiyə xoş gəlmisiniz mesajı göndərilir
        const chatChannel = interaction.guild.channels.cache.get(chatKanalı);
        if (chatChannel) chatChannel.send(`🎉 ${user}, sunucumuza xoş gəldin!`);

        // İstifadəçiyə qeydiyyat təsdiq mesajı embed ilə göndərilir
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Qeydiyyat olundu!`,
                        iconURL: member.user.displayAvatarURL({ dynamic: true })
                    })
                    .setColor('#00FF00') // Yaşıl rəng
                    .setDescription(`:white_small_square: ${interaction.user} tərəfindən <@&1354944438144733345> rolu və ${user} məlumatları ilə qeydiyyat edildi.`)
                    .setTimestamp() // Tarix əlavə edilir
                    .setFooter({ text: 'Qeydiyyat prosesi tamamlandı.' })
            ],
            ephemeral: false // Hamı görə bilər
        });
    }
};
