module.exports = {
    name: 'interactionCreate', // Event adı: interactionCreate
    once: false, // Bu event birdəfəlik deyil, hər dəfə işləyəcək

    async execute(interaction) {
        // Əgər interaction Slash command deyilsə, dayandır
        if (!interaction.isChatInputCommand()) return;

        // Slash komandasını əldə et
        const command = interaction.client.commands.get(interaction.commandName);

        // Komanda tapılmazsa, heç nə etmə
        if (!command) return;

        try {
            // Komandanın `execute()` funksiyasını işə sal
            await command.execute(interaction);
        } catch (error) {
            // Əgər bir xəta baş verərsə, onu konsola yaz
            console.error(error);

            // İstifadəçiyə xəta mesajı göndər (yalnız ona görünəcək)
            await interaction.reply({ 
                content: 'Bu əmri yerinə yetirərkən xəta baş verdi!', 
                ephemeral: true 
            });
        }
    },
};
