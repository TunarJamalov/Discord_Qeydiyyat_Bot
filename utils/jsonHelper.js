// Lazımi modullar import edilir
const fs = require("fs"); // Fayl sistemində əməliyyatlar aparmaq üçün
const path = require("path"); // Fayl yollarını düzgün yaratmaq üçün

// JsonHelper sinfi yaradılır
class JsonHelper {
    constructor(filename) {
        // Fayl yolu təyin olunur: "../data/filename"
        this.filePath = path.join(__dirname, "../data", filename);

        // Qovluq varsa keç, yoxdursa yarat
        this.ensureDirectoryExists();
    }

    // Faylın yerləşdiyi qovluğun mövcudluğunu yoxlayır və yoxdursa yaradır
    ensureDirectoryExists() {
        const dataDir = path.dirname(this.filePath);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true }); // `recursive: true` ilə bütün aralıq qovluqları da yaradılır
        }
    }

    // JSON faylını oxuyur və obyekt kimi geri qaytarır
    read() {
        // Fayl yoxdursa, boş obyekt döndür
        if (!fs.existsSync(this.filePath)) {
            return {};
        }

        try {
            // Faylı oxuyur
            const data = fs.readFileSync(this.filePath, "utf-8");
            // JSON formatında parse edir
            return JSON.parse(data);
        } catch (error) {
            // Əgər oxuma və ya parse zamanı xəta olarsa, onu console-a çıxarır
            console.error(`JSON faylını oxumaq xətası (${this.filePath}):`, error);
            return {};
        }
    }

    // JSON faylına məlumat yazır
    write(data) {
        try {
            // Qovluq mövcuddurmu yoxlayır
            this.ensureDirectoryExists();
            // Obyekti fayla yazır (gözəl formatlanmış şəkildə)
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), "utf-8");
            return true;
        } catch (error) {
            // Yazma zamanı xəta baş verərsə console-a çıxarır
            console.error(`JSON faylının yazılması xətası (${this.filePath}):`, error);
            return false;
        }
    }

    // İstifadəçi qeydiyyatlarını artırır
    incrementRegister(userID, gender) {
        // Məlumatları oxuyur
        const data = this.read();

        // Əgər istifadəçi sistemdə yoxdursa, ilkin dəyərləri təyin edir
        if (!data[userID]) {
            data[userID] = {
                total: 0,
                male: 0,
                female: 0
            };
        }

        // Ümumi qeydiyyat sayını artırır
        data[userID].total++;

        // Genderə görə qeydiyyat sayını artırır
        if (gender === "male") {
            data[userID].male++;
        } else if (gender === "female") {
            data[userID].female++;
        }

        // Yenilənmiş məlumatları fayla yazır
        return this.write(data);
    }

    // İstifadəçiləri müəyyən göstəriciyə görə sıralayır
    getSortedEntries(sortBy = "total", descending = true) {
        const data = this.read();

        // Məlumatları array şəklində götürür və sıralayır
        return Object.entries(data)
            .sort((a, b) => {
                const valueA = a[1][sortBy]; // Məsələn: a[1].total
                const valueB = b[1][sortBy];
                return descending ? valueB - valueA : valueA - valueB;
            });
    }
}

// Bu sinif digər fayllarda istifadə oluna bilməsi üçün eksport edilir
module.exports = JsonHelper;
