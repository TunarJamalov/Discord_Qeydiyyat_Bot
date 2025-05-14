# Qaqa Discord Qeydiyyat Botu

Azərbaycan Discord serverləri üçün hazırlanmış qeydiyyat botu. Bu bot istifadəçiləri qeydiyyatdan keçirmək, onlara müvafiq rollar vermək və server statistikasını izləmək üçün nəzərdə tutulmuşdur.

## 📋 Xüsusiyyətlər

- Kişi və qadın qeydiyyat əmrləri
- Qeydiyyatsız etmə əmri
- Qeydiyyat statistikası
- Yeni üzvlərə avtomatik rol verilməsi
- Xoş gəldin mesajları

## 🚀 Quraşdırma

### Tələblər

- [Node.js](https://nodejs.org/) (v16.9.0 və ya daha yeni)
- [Discord Bot Token](https://discord.com/developers/applications)
- Discord serveri (Guild)

### Addımlar

1. Layihəni klonlayın və ya yükləyin
2. Terminalda layihə qovluğuna keçin
3. Asılılıqları quraşdırın:

```bash
npm install
```

4. `config.json` faylını düzəldin (aşağıda izah olunub)
5. Slash əmrləri qeydiyyatdan keçirin:

```bash
node deploy-commands.js
```

6. Botu işə salın:

```bash
node index.js
```

## ⚙️ Konfiqurasiya

`config.json` faylında aşağıdakı məlumatları düzəltməlisiniz:

```json
{
    "token": "BOT_TOKEN_BURAYA", 
    "welcomeChannelID": "XOŞ_GƏLDİN_KANAL_ID",
    "chatChannelID": "CHAT_KANAL_ID",
    "logChannelID": "LOG_KANAL_ID",
    "unregisteredRoleID": "QEYDİYYATSIZ_ROL_ID",
    "botRoleID": "BOT_ROL_ID",
    "maleRoleID": "KİŞİ_ROL_ID",
    "femaleRoleID": "QADIN_ROL_ID",
    "memberRoleID": "ÜZV_ROL_ID",
    "registerChannelID": "QEYDİYYAT_KANAL_ID",
    "clientId": "BOT_CLIENT_ID",
    "guildId": "SERVER_ID"
}
```

### Konfiqurasiya Parametrləri

- **token**: Discord Developer Portalından əldə etdiyiniz bot tokeni
- **welcomeChannelID**: Yeni üzvlər qoşulduqda xoş gəldin mesajı göndəriləcək kanalın ID-si
- **chatChannelID**: Ümumi söhbət kanalının ID-si (qeydiyyatdan sonra xoş gəldin mesajı göndərilir)
- **logChannelID**: Qeydiyyat hadisələrinin loglanacağı kanalın ID-si
- **unregisteredRoleID**: Qeydiyyatsız üzvlərə veriləcək rolun ID-si
- **botRoleID**: Botlara veriləcək rolun ID-si
- **maleRoleID**: Kişi üzvlərə veriləcək rolun ID-si
- **femaleRoleID**: Qadın üzvlərə veriləcək rolun ID-si
- **memberRoleID**: Qeydiyyatdan keçmiş üzvlərə veriləcək ümumi rolun ID-si
- **registerChannelID**: Qeydiyyat əmrlərinin istifadə edilə biləcəyi kanalın ID-si
- **clientId**: Botunuzun client ID-si (Discord Developer Portalından)
- **guildId**: Discord serverinizin (guild) ID-si

## 🔧 Əmrlər

### `/kişi`
Kişi qeydiyyatı üçün istifadə olunur.

**Parametrlər:**
- `istifadeci`: Qeydiyyat olunacaq istifadəçi
- `ad`: İstifadəçinin adı
- `yas`: İstifadəçinin yaşı

### `/qadın`
Qadın qeydiyyatı üçün istifadə olunur.

**Parametrlər:**
- `istifadeci`: Qeydiyyat olunacaq istifadəçi
- `ad`: İstifadəçinin adı
- `yas`: İstifadəçinin yaşı

### `/qeydiyyatsiz`
İstifadəçini qeydiyyatsız vəziyyətinə qaytarır.

**Parametrlər:**
- `kullanıcı`: Qeydiyyatsız ediləcək istifadəçi

### `/qeydiyyatsay`
Qeydiyyat statistikasını göstərir.

**Parametrlər:**
- `yetkili`: (İstəyə bağlı) Statistikası göstəriləcək yetkili

### `/ping`
Botun gecikmə müddətini yoxlamaq üçün sadə əmr.

## 📁 Fayl Strukturu

- `index.js`: Ana bot faylı
- `deploy-commands.js`: Slash əmrlərini qeydiyyatdan keçirmək üçün skript
- `config.json`: Bot konfiqurasiyası
- `commands/`: Əmr faylları qovluğu
  - `e.js`: Kişi qeydiyyat əmri
  - `k.js`: Qadın qeydiyyat əmri
  - `ping.js`: Ping əmri
  - `qeydiyyatsay.js`: Qeydiyyat statistikası əmri
  - `qeydiyyatsız.js`: Qeydiyyatsız etmə əmri
- `events/`: Hadisə işləyiciləri qovluğu
  - `guildMemberAdd.js`: Yeni üzv qoşulduqda işləyən hadisə
  - `interactionCreate.js`: İstifadəçi əmrləri işlədikdə işləyən hadisə
- `utils/`: Yardımçı funksiyalar qovluğu
  - `jsonHelper.js`: JSON faylları ilə işləmək üçün köməkçi sinif
- `data/`: Məlumat saxlama qovluğu

## 🔄 Əmrləri Yeniləmək

Əmrlərdə dəyişiklik etdikdən sonra, onları Discord-a yenidən qeydiyyatdan keçirməlisiniz:

```bash
node deploy-commands.js
```

## 📝 Qeydlər

- Bot yalnız qeydiyyat kanalında qeydiyyat əmrlərini işlədə bilər
- Qeydiyyat statistikası `data/kayitlar.json` faylında saxlanılır
- Botun bütün kanalları görmək və rolları idarə etmək icazəsi olmalıdır
- İstədiyiniz kimi commands və events qovluqlarındaki faylların textlərini dəyişə bilərsiniz
- Sual yarandıqda tunarcamalov@gmail.com mail adresimə yazabilərsiniz

## 🛠️ Xəta Həlli

1. **Əmrlər görünmür**: `deploy-commands.js` faylını işlətdiyinizdən əmin olun
2. **Bot rol verə bilmir**: Botun rol vermək icazəsi olduğundan və bot rolunun digər rollardan yuxarıda olduğundan əmin olun
3. **Xoş gəldin mesajı göndərilmir**: Botun müvafiq kanala mesaj göndərmək icazəsi olduğundan əmin olun

## 📜 Lisenziya

ISC © Tunar Camalov
