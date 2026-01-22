const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Yetkili rol ID'si
const YETKILI_ROL_ID = '1463878849510113450';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unwarn')
        .setDescription('Bir kullanýcýnýn uyarýsýný kaldýrýr')
        .addUserOption(option =>
            option
                .setName('kullanýcý')
                .setDescription('Uyarýsý kaldýrýlacak kullanýcý')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName('sýra')
                .setDescription('Kaldýrýlacak uyarýnýn sýra numarasý (1, 2, 3...)')
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction) {
        // Rol kontrolü
        if (!interaction.member.roles.cache.has(YETKILI_ROL_ID)) {
            return interaction.reply({
                content: '? Bu komutu kullanmak için gerekli yetkiye sahip deðilsiniz!',
                flags: 64
            });
        }

        const targetUser = interaction.options.getUser('kullanýcý');
        const warnIndex = interaction.options.getInteger('sýra') - 1; // Array 0'dan baþlar

        // Warns.json dosyasýný yükle
        const warnsPath = path.join(__dirname, '../data/warns.json');
        let warnsData = {};

        try {
            const data = fs.readFileSync(warnsPath, 'utf8');
            warnsData = JSON.parse(data);
        } catch (error) {
            console.error('Warns.json okunamadý:', error);
            return interaction.reply({
                content: '? Uyarý verileri okunamadý!',
                flags: 64
            });
        }

        // Kullanýcýnýn uyarýsý var mý kontrol et
        if (!warnsData[targetUser.id] || warnsData[targetUser.id].warns.length === 0) {
            return interaction.reply({
                content: `? **${targetUser.tag}** kullanýcýsýnýn hiç uyarýsý yok!`,
                flags: 64
            });
        }

        // Geçerli sýra numarasý kontrolü
        if (warnIndex < 0 || warnIndex >= warnsData[targetUser.id].warns.length) {
            return interaction.reply({
                content: `? Geçersiz uyarý sýrasý! Bu kullanýcýnýn ${warnsData[targetUser.id].warns.length} uyarýsý var.`,
                flags: 64
            });
        }

        // Uyarýyý sil
        const removedWarn = warnsData[targetUser.id].warns.splice(warnIndex, 1)[0];

        // Dosyaya kaydet
        try {
            fs.writeFileSync(warnsPath, JSON.stringify(warnsData, null, 2));
        } catch (error) {
            console.error('Warns.json yazýlamadý:', error);
            return interaction.reply({
                content: '? Uyarý kaldýrýlýrken bir hata oluþtu!',
                flags: 64
            });
        }

        const remainingWarns = warnsData[targetUser.id].warns.length;

        // Baþarý mesajý
        await interaction.reply({
            content: `? **${targetUser.tag}** kullanýcýsýnýn uyarýsý kaldýrýldý!\n` +
                     `?? **Kaldýrýlan Sebep:** ${removedWarn.reason}\n` +
                     `?? **Kalan Uyarý:** ${remainingWarns}`,
            flags: 64
        });
    }
};