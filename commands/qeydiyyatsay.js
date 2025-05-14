// Gərəkli modul və fayllar daxil edilir
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js"); // Discord.js'dən lazımlı komponentlər
const JsonHelper = require("../utils/jsonHelper"); // Özəl JSON köməkçi modulu (qeydiyyat məlumatları üçün)

// Slash komanda export olunur
module.exports = {
    data: new SlashCommandBuilder()
        .setName("qeydiyyatsayi") // Komandanın adı: /qeydiyyatsayi
        .setDescription("Kimin neçə qeydiyyat sayı olduğunu göstərir.") // Komandanın təsviri
        .addUserOption(option => // İstifadəçi seçimi əlavə edilir (opsional)
            option.setName("istifadeci")
                .setDescription("Statistikasını görmək istədiyiniz istifadəçi")
                .setRequired(false)), // İstifadəçi seçmək məcburi deyil

    async execute(interaction) {
        const kayitHelper = new JsonHelper("kayitlar.json"); // Qeydiyyat məlumatları olan JSON faylını yükləyir
        const targetUser = interaction.options.getUser("istifadeci"); // Komanda ilə seçilən istifadəçini alır
        
        // Əgər istifadəçi seçilibsə, onun statistikası göstərilir
        if (targetUser) {
            // İstifadəçiyə aid məlumatlar əldə edilir (əgər yoxdursa, default olaraq sıfır göstərilir)
            const userData = kayitHelper.read()[targetUser.id] || { total: 0, male: 0, female: 0 };
            
            // Embed (gözdə görünən mesaj) yaradılır və məlumatlar əlavə olunur
            const embed = new EmbedBuilder()
                .setColor(0x3498db) // Mavi rəng
                .setTitle(`${targetUser.username} Kayıt İstatistikleri`) // Başlıq
                .setThumbnail(targetUser.displayAvatarURL({ dynamic: true })) // İstifadəçinin profil şəkli
                .addFields(
                    { name: '👤 Toplam qeydiyyat', value: `${userData.total}`, inline: true },
                    { name: '👨 Kişi qeydiyyat', value: `${userData.male}`, inline: true },
                    { name: '👩 Qadın qeydiyyat', value: `${userData.female}`, inline: true }
                )
                .setTimestamp(); // Zaman möhürü
                
            return interaction.reply({ embeds: [embed] }); // Embed mesajını cavab olaraq göndər
        }
        
        // Əgər istifadəçi seçilməyibsə, ən çox qeydiyyat edən ilk 10 istifadəçi sıralanır
        const sortedEntries = kayitHelper.getSortedEntries("total"); // Qeydiyyatlar `total` əsasına görə sıralanır
        
        if (sortedEntries.length === 0) {
            // Əgər heç qeydiyyat edən yoxdursa, mesaj göndər
            return interaction.reply({ content: "Hələ heç kim qeydiyyatdan keçməyib." });
        }
        
        // Sıralama mesajı üçün boş dəyişən yaradılır
        let sıralama = "";
        const limit = Math.min(sortedEntries.length, 10); // Ən çox 10 nəfər göstəriləcək
        
        // İlk 10 istifadəçini dövrə alıb sıralama mesajına əlavə edir
        for (let i = 0; i < limit; i++) {
            const [userID, data] = sortedEntries[i]; // Həm user ID, həm məlumatlar çıxarılır
            sıralama += `**${i+1}.** <@${userID}> - Toplam: **${data.total}** (👨 ${data.male} | 👩 ${data.female})\n`;
        }
        
        // Toplu sıralama üçün embed yaradılır
        const embed = new EmbedBuilder()
            .setColor(0x3498db)
            .setTitle('📊 Qeydiyyat Sıralaması') // Embed başlığı
            .setDescription(sıralama) // Sıralama məlumatı
            .setFooter({ text: 'Ətraflı məlumat üçün: /qeydiyyatsayı @user' }) // Alt yazı
            .setTimestamp();
            
        return interaction.reply({ embeds: [embed] }); // Embed göndərilir
    }
};
