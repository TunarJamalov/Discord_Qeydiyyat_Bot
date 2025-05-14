// Lazımlı Discord.js modul komponentləri daxil edilir
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// Komanda export olunur
module.exports = {
    data: new SlashCommandBuilder()
        .setName("qeydiyyatsiz") // Slash komanda adı: /qeydiyyatsiz
        .setDescription("Bu istifadəçini qeydiyyatsız edir.") // Komandanın izahı
        .addUserOption(option => // İstifadəçi seçimi əlavə olunur
            option.setName("kullanıcı") // Slash komanda üçün dəyişən adı
                .setDescription("Kayıtsız yapılacak kullanıcı") // İstifadəçi seçimi izahı
                .setRequired(true) // İstifadəçi seçimi məcburidir
        ),

    async execute(interaction) {
        
        // Komanda yalnız server içində istifadə oluna bilər
        if (!interaction.inGuild()) {
            return interaction.reply({
                content: "Bu komut yalnızca sunucularda kullanılabilir!", // DM-də işləmir
                ephemeral: true // Yalnız göndərən istifadəçiyə görünəcək
            });
        }

        const config = require("../config.json"); // Konfiqurasiya faylından məlumatlar alınır (role ID və log kanalı)
        const user = interaction.options.getUser("kullanıcı"); // Slash komanda ilə seçilən istifadəçi alınır
        
        try {
            // İstifadəçi server üzvü olaraq alınır
            const member = await interaction.guild.members.fetch(user.id).catch(() => null);
            
            // Əgər istifadəçi tapılmazsa, xəbərdarlıq verilir
            if (!member) {
                return interaction.reply({ 
                    content: "İstifadəçi sunucuda bulunamadı!", 
                    ephemeral: true 
                });
            }

            // İstifadəçiyə yalnız "qeydiyyatsız" rolu verilir (digər rollar silinir)
            await member.roles.set([config.unregisteredRoleID]);

            // İstifadəçinin adı sıfırlanır (nickname silinir)
            await member.setNickname(null);

            // Əgər log kanalı mövcuddursa, hadisə ora bildirilir
            const logChannel = interaction.guild.channels.cache.get(config.logChannelID);
            if (logChannel) {
                await logChannel.send(`🔄 ${user} **qeydiyyatsız** vəziyətinə ${interaction.user} tərəfindən alındı.`);
            }

            // Əsas cavab göndərilir (64: ephemeral bayrağı)
            return interaction.reply({ 
                content: `🔄 ${user} qeydiyyatsız edildi!`, 
                flags: 64 
            });
            
        } catch (error) {
            // Əgər hər hansı xəta baş verərsə, konsola yazılır və istifadəçiyə bildirilir
            console.error("Qeydiyyatsız komutunda hata:", error);
            return interaction.reply({
                content: "İstifadəçi qeydiyyatsız edilirken bir hata oluştu!",
                flags: 64
            });
        }
    }
};
