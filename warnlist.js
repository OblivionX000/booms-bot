const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Yetkili rol ID'si
const YETKILI_ROL_ID = '1463878849510113450';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warnlist')
        .setDescription('Bir kullanýcýnýn uyarý geçmiþini gösterir')
        .addUserOption(option =>
            option
                .setName('kullanýcý')
                .setDescription('Uyarýlarý görüntülenecek kullanýcý')
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
                content: `? **${targetUser.tag}** kullanýcýsýnýn hiç uyarýsý yok!`,
                flags: 64
            });
        }

        const warns = warnsData[targetUser.id].warns;

        // Embed oluþtur
        const embed = new EmbedBuilder()
            .setColor('#ff9900')
            .setTitle(`?? Uyarý Geçmiþi`)
            .setDescription(`**Kullanýcý:** ${targetUser.tag}\n**Toplam Uyarý:** ${warns.length}`)
            .setThumbnail(targetUser.displayAvatarURL())
            .setTimestamp();

        // Her uyarýyý embed'e ekle
        warns.forEach((warn, index) => {
            const date = new Date(warn.date);
            const formattedDate = `${date.toLocaleDateString('tr-TR')} ${date.toLocaleTimeString('tr-TR')}`;
            
            embed.addFields({
                name: `${index + 1}. Uyarý`,
                value: `?? **Sebep:** ${warn.reason}\n` +
                       `?? **Yetkili:** ${warn.moderator}\n` +
                       `?? **Tarih:** ${formattedDate}`,
                inline: false
            });
        });

        await interaction.reply({
            embeds: [embed],
            flags: 64
        });
    }
};