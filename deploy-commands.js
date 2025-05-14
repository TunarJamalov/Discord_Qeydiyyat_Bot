// Discord.js kitabxanasından lazımi modulları idxal edir
const { REST, Routes } = require('discord.js');

// Konfiqurasiya faylından bot məlumatlarını əldə edir
const { clientId, token, guildId } = require('./config.json');

// Fayl sistemini idarə etmək üçün Node.js modullarını idxal edir
const fs = require('node:fs');
const path = require('node:path');

// Əmrləri saxlamaq üçün boş massiv yaradır
const commands = [];

// Əmrlərin saxlandığı qovluğun yolunu təyin edir
const commandsPath = path.join(__dirname, 'commands');

// Əmr fayllarını (.js sonluqlu) oxuyub siyahıya alır
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Hər bir əmr faylını yükləyib əmrlər siyahısına əlavə edir
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Əmrdə 'data' xüsusiyyəti varsa, onu əmrlər siyahısına əlavə edir
    if ('data' in command) {
        commands.push(command.data.toJSON());
    } else {
        console.log(`[WARNING] ${filePath} faylında məlumat mülkiyyəti yoxdur`);
    }
}

// Discord API ilə əlaqə yaratmaq üçün REST klienti yaradır
const rest = new REST({ version: '10' }).setToken(token);

// Asinxron özü-özünü işlədən funksiya - əmrləri Discord-a qeydiyyatdan keçirir
(async () => {
    try {
        console.log(`[INFO] ${commands.length} əmr yadda saxlanılır...`);
      
        // REST API istifadə edərək əmrləri Discord serverinə (guild) yükləyir
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`[SUCCESS] ${data.length} slash əmri uğurla yükləndi!`);
    } catch (error) {
        console.error(error);
    }
})();