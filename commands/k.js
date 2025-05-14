// Lazımi modul və köməkçi fayllar daxil edilir
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const JsonHelper = require("../utils/jsonHelper");

module.exports = {
    // Slash komanda strukturu yaradılır
    data: new SlashCommandBuilder()
        .setName("qadın") // Komandanın adı "qadın"
        .setDescription("Qadın qeydiyyatı üçün.") // Komanda haqqında açıqlama
        .addUserOption(option => 
            option.setName("istifadeci")
                .setDescription("Qeydiyyat olunacaq istifadəçi")
                .setRequired(true)) // İstifadəçi seçimi (mütləqdir)
        .addStringOption(option => 
            option.setName("ad")
                .setDescription("İstifadəçi adı")
                .setRequired(true)) // Ad seçimi (mütləqdir)
        .addIntegerOption(option => 
            option.setName("yas")
                .setDescription("İstifadəçi yaşı")
                .setRequired(true)), // Yaş seçimi (mütləqdir)

    // Slash komandanın icrası
    async execute(interaction) {
        // Konfiqurasiya faylından ID-lər alınır
        const config = require("../config.json");
        const kayıtKanalı = config.registerChannelID; // Qeydiyyat kanalı ID-si
        const logKanalı = config.logChannelID; // Log kanalı ID-si
        const chatKanalı = config.chatChannelID; // Chat kanalı ID-si

        // Əgər komanda düzgün kanalda işlədilməyibsə, istifadəçiyə xəbər verilir
        if (interaction.channel.id !== kayıtKanalı) {
            return interaction.reply({ 
                content: "Bu əmr yalnız qeydiyyat kanalında istifadə edilə bilər!", 
                ephemeral: true // Mesajı yalnız komandanı yazan görür
            });
        }

        // Əmrdən daxil olan məlumatlar alınır
        const user = interaction.options.getUser("istifadeci"); // Qeydiyyatdan keçəcək istifadəçi
        const isim = interaction.options.getString("ad"); // Ad
        const yaş = interaction.options.getInteger("yas"); // Yaş
        const member = interaction.guild.members.cache.get(user.id); // Serverdəki üzv

        // Əgər üzv tapılmırsa, xəbərdarlıq edilir
        if (!member) return interaction.reply({ 
            content: "İstifadəçi tapılmadı.", 
            ephemeral: true 
        });

        // Qeydiyyatsız rol silinir
        await member.roles.remove(config.unregisteredRoleID).catch(console.error);

        // Qadın və üzv rolları əlavə olunur
        await member.roles.add([config.femaleRoleID, config.memberRoleID]).catch(console.error);

        // İstifadəçinin nickname-i adı və yaşı ilə yenilənir
        await member.setNickname(`${isim} | ${yaş}`).catch(console.error);

        // Qeydiyyat məlumatı JSON faylına yazılır
        const kayitHelper = new JsonHelper("kayitlar.json");
        kayitHelper.incrementRegister(interaction.user.id, "female"); 

        // Log kanalı əldə edilir (hazırda istifadə olunmur, amma istəsən əlavə edə bilərsən)
        const logChannel = interaction.guild.channels.cache.get(logKanalı);

        // Chat kanalında xoş gəldin mesajı göndərilir
        const chatChannel = interaction.guild.channels.cache.get(chatKanalı);
        if (chatChannel) chatChannel.send(`🎉 ${user}, sunucumuza xoş gəldin!`);

        // Embed formatında qeydiyyat təsdiqi göndərilir
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: `Qeydiyyat olundu!`,
                        iconURL: member.user.displayAvatarURL({ dynamic: true })
                    })
                    .setColor('#00FF00') // Yaşıl rəng
                    .setDescription(`:white_small_square: ${interaction.user} tərəfindən <@&1354944437439959082> rolu və ${user} məlumatları ilə qeydiyyat edildi.`)
                    .setTimestamp() // Tarix əlavə olunur
                    .setFooter({ text: 'Qeydiyyat prosesi tamamlandı.' }) // Alt yazı
            ],
            ephemeral: false // Bütün istifadəçilər görə bilər
        });
    }
};
