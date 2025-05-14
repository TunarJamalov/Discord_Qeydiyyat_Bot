// Fayl sistemi əməliyyatları üçün Node.js modulları
const fs = require('node:fs');
const path = require('node:path');
// Discord.js kitabxanasından lazımi modulları idxal edir
const { Client, Collection, GatewayIntentBits } = require('discord.js');
// Konfiqurasiya faylından bot tokenini əldə edir
const { token } = require('./config.json');

// Discord klienti yaradır və lazımi icazələri (intents) təyin edir
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,          // Server məlumatlarına giriş
    GatewayIntentBits.GuildMembers,    // Server üzvləri məlumatlarına giriş
    GatewayIntentBits.GuildMessages,   // Server mesajlarına giriş
    GatewayIntentBits.MessageContent   // Mesaj məzmununa giriş
] });

// Bot əmrlərini saxlamaq üçün kolleksiya yaradır
client.commands = new Collection();
// Əmrlərin saxlandığı qovluğun yolunu təyin edir
const commandsPath = path.join(__dirname, 'commands');
// Əmr fayllarını (.js sonluqlu) oxuyub siyahıya alır
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Hər bir əmr faylını yükləyib əmrlər kolleksiyasına əlavə edir
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    // Əmrdə həm 'data' həm də 'execute' xüsusiyyətləri varsa, onu əmrlər kolleksiyasına əlavə edir
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] ${filePath} faylında məlumat çatışmır və ya icra olunur`);
    }
}

// Hadisə işləyicilərinin saxlandığı qovluğun yolunu təyin edir
const eventsPath = path.join(__dirname, 'events');
// Hadisə fayllarını (.js sonluqlu) oxuyub siyahıya alır
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

// Hər bir hadisə faylını yükləyib müvafiq hadisə dinləyicilərini qeydiyyatdan keçirir
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    // Hadisənin bir dəfə (once) və ya davamlı (on) dinlənilməsini təyin edir
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

// Botu Discord-a qoşur
client.login(token);