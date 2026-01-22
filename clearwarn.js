const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Yetkili rol ID'si
const YETKILI_ROL_ID = '1463878849510113450';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clearwarn')
        .setDescription('Bir kullanýcýnýn tüm uyarýlarýný temizler')
        .addUserOption(option =>
            option
                .setName('kullanýcý')
                .setDescription('Uyarýlarý temizlenecek kullanýcý')
                .setRequired(true)
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
                content: `? **${targetUser.tag}** kullanýcýsýnýn zaten hiç uyarýsý yok!`,
                flags: 64
            });
        }

        const clearedCount = warnsData[targetUser.id].warns.length;

        // Tüm uyarýlarý temizle
        warnsData[targetUser.id].warns = [];

        // Dosyaya kaydet
        try {
            fs.writeFileSync(warnsPath, JSON.stringify(warnsData, null, 2));
        } catch (error) {
            console.error('Warns.json yazýlamadý:', error);
            return interaction.reply({
                content: '? Uyarýlar temizlenirken bir hata oluþtu!',
                flags: 64
            });
        }

        // Baþarý mesajý
        await interaction.reply({
            content: `? **${targetUser.tag}** kullanýcýsýnýn tüm uyarýlarý temizlendi!\n` +
                     `??? **Temizlenen Uyarý Sayýsý:** ${clearedCount}`,
            flags: 64
        });

        // Kullanýcýya DM göndermeyi dene
        try {
            await targetUser.send(
                `? **${interaction.guild.name}** sunucusundaki tüm uyarýlarýnýz temizlendi!\n\n` +
                `?? **Yetkili:** ${interaction.user.tag}\n` +
                `??? **Temizlenen Uyarý:** ${clearedCount}`
            );
        } catch (error) {
            console.log(`${targetUser.tag} kullanýcýsýna DM gönderilemedi.`);
        }
    }
};