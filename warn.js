const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Yetkili rol ID'si
const YETKILI_ROL_ID = '1463878849510113450';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Bir kullanýcýya uyarý verir')
        .addUserOption(option =>
            option
                .setName('kullanýcý')
                .setDescription('Uyarý verilecek kullanýcý')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('sebep')
                .setDescription('Uyarý sebebi')
                .setRequired(true)
        ),

    async execute(interaction) {
        // Rol kontrolü
        if (!interaction.member.roles.cache.has(YETKILI_ROL_ID)) {
            return interaction.reply({
                content: '? Bu komutu kullanmak için gerekli yetkiye sahip deðilsiniz!',
                flags: 64 // MessageFlags.Ephemeral
            });
        }

        const targetUser = interaction.options.getUser('kullanýcý');
        const reason = interaction.options.getString('sebep');

        // Kendine uyarý verme kontrolü
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: '? Kendinize uyarý veremezsiniz!',
                flags: 64
            });
        }

        // Bota uyarý verme kontrolü
        if (targetUser.bot) {
            return interaction.reply({
                content: '? Botlara uyarý veremezsiniz!',
                flags: 64
            });
        }

        // Warns.json dosyasýný yükle
        const warnsPath = path.join(__dirname, '../data/warns.json');
        let warnsData = {};

        try {
            const data = fs.readFileSync(warnsPath, 'utf8');
            warnsData = JSON.parse(data);
        } catch (error) {
            console.error('Warns.json okunamadý:', error);
        }

        // Kullanýcýnýn uyarý geçmiþini al veya oluþtur
        if (!warnsData[targetUser.id]) {
            warnsData[targetUser.id] = {
                username: targetUser.tag,
                warns: []
            };
        }

        // Yeni uyarý ekle
        const warnData = {
            id: Date.now().toString(),
            reason: reason,
            moderator: interaction.user.tag,
            moderatorId: interaction.user.id,
            date: new Date().toISOString()
        };

        warnsData[targetUser.id].warns.push(warnData);
        warnsData[targetUser.id].username = targetUser.tag; // Kullanýcý adýný güncelle

        // Dosyaya kaydet
        try {
            fs.writeFileSync(warnsPath, JSON.stringify(warnsData, null, 2));
        } catch (error) {
            console.error('Warns.json yazýlamadý:', error);
            return interaction.reply({
                content: '? Uyarý kaydedilirken bir hata oluþtu!',
                flags: 64
            });
        }

        const warnCount = warnsData[targetUser.id].warns.length;

        // Baþarý mesajý
        await interaction.reply({
            content: `? **${targetUser.tag}** kullanýcýsýna uyarý verildi!\n` +
                     `?? **Sebep:** ${reason}\n` +
                     `?? **Toplam Uyarý:** ${warnCount}`,
            flags: 64
        });

        // Kullanýcýya DM göndermeyi dene
        try {
            await targetUser.send(
                `?? **${interaction.guild.name}** sunucusunda uyarý aldýnýz!\n\n` +
                `?? **Sebep:** ${reason}\n` +
                `?? **Yetkili:** ${interaction.user.tag}\n` +
                `?? **Toplam Uyarý Sayýnýz:** ${warnCount}`
            );
        } catch (error) {
            // DM gönderilemezse sessizce geç (kullanýcý DM kapalý olabilir)
            console.log(`${targetUser.tag} kullanýcýsýna DM gönderilemedi.`);
        }
    }
};