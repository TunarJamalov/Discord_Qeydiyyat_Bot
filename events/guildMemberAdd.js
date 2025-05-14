// Lazım olan Discord.js modulları daxil edilir
const { EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    // Event adı: guildMemberAdd
    name: "guildMemberAdd",

    // Yeni üzv qoşulduqda işləyəcək funksiyanı təyin edirik
    execute(member) {
        // Əgər member və ya guild undefined olarsa, kod dayanır
        if (!member || !member.guild) {
            console.error('Member or guild is undefined in guildMemberAdd event');
            return;
        }

        const config = require("../config.json"); // Konfiqurasiya faylından məlumat alınır

        // Xoş gəldin mesajı göndəriləcək kanal
        const channel = member.guild.channels.cache.get(config.welcomeChannelID);
        if (!channel) {
            console.error("Kanal tapılmadı.");
            return;
        }

        // Botun həmin kanalda mesaj göndərmək icazəsi yoxdursa, xəbərdarlıq verilir
        if (!channel.permissionsFor(member.guild.members.me).has(PermissionsBitField.Flags.SendMessages)) {
            console.error("Botun bu kanalda mesaj göndərmək icazəsi yoxdur.");
            return;
        }

        // Əgər qoşulan istifadəçi botdursa, ona bot rolu verilir
        if (member.user.bot) {
            member.roles.add(config.botRoleID).catch(error => {
                console.error("Bot rolunu əlavə edərkən xəta baş verdi:", error);
            });
        } else {
            // Əgər insan istifadəçidirsə, ona qeydiyyatsız rolu verilir
            member.roles.add(config.unregisteredRoleID).catch(error => {
                console.error("Qeydiyyatdan keçməmiş rolu əlavə edərkən xəta baş verdi:", error);
            });
        }

        // Xoş gəldin mesajı üçün Embed hazırlanır
        const embed = new EmbedBuilder()
            .setColor("#2b2d31") // Embed rəngi
            .setAuthor({
                name: `Xoş Gəlmisən!`,
                iconURL: member.user.displayAvatarURL({ dynamic: true }) // İstifadəçinin avatarı
            })
            .setDescription(`# 🍵 Salam! \n📌 Səsli söhbətdən sonra qeydiyyat aparılacaq., ${member}.\n🔊 **<#1362123218097279147>** kanallarından birinə qatıl!\n\n🔔 **Qeydiyyat heyətini çağırmaq üçün:**\n ▫ \`/çağır\` komandasından istifadə edəbilərsən; amma xahiş edirik **spam etmə** və ya qeydiyyat heyətini **şəxsi etiket atma**.`)
            .setImage("https://media.discordapp.net/attachments/1362123226377093294/1362378798426750996/banner.jpg?ex=68022da1&is=6800dc21&hm=8b11756e9f23a3d3054bc58d3e81c33719d31f9d3ed9a2a3d7820eac3d1dc7d1&=&format=webp&width=1440&height=810") // Banner şəkli
            .setFooter({ text: "📜 Gözlədiyiniz müddətdə qaydalar və məzmun haqqında məlumat üçün #rules kanalına baxa bilərsiniz." });

        // Hazırlanmış Embed mesajı kanala göndərilir
        channel.send({ embeds: [embed] });
    }
};
