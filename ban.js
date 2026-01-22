const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// Yetkili rol ID'si
const YETKILI_ROL_ID = '1463878849510113450';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bir kullanýcýyý sunucudan yasaklar')
        .addUserOption(option =>
            option
                .setName('kullanýcý')
                .setDescription('Yasaklanacak kullanýcý')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('sebep')
                .setDescription('Yasaklama sebebi')
                .setRequired(false)
        )
        .addIntegerOption(option =>
            option
                .setName('mesaj-sil')
                .setDescription('Kaç günlük mesajlarý silinsin? (0-7)')
                .setRequired(false)
                .setMinValue(0)
                .setMaxValue(7)
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
        const reason = interaction.options.getString('sebep') || 'Sebep belirtilmedi';
        const deleteMessageDays = interaction.options.getInteger('mesaj-sil') || 0;

        // Sunucuda üyeyi bul
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        // Kendini banlama kontrolü
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: '? Kendinizi yasaklayamazsýnýz!',
                flags: 64
            });
        }

        // Botu banlama kontrolü
        if (targetUser.bot) {
            return interaction.reply({
                content: '? Botlarý yasaklayamazsýnýz!',
                flags: 64
            });
        }

        // Sunucu sahibini banlama kontrolü
        if (targetUser.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: '? Sunucu sahibini yasaklayamazsýnýz!',
                flags: 64
            });
        }

        // Eðer üye sunucudaysa kontroller yap
        if (member) {
            // Botun yetkisi var mý kontrol et
            if (!member.bannable) {
                return interaction.reply({
                    content: '? Bu kullanýcýyý yasaklayamýyorum! Kullanýcýnýn rolü benden yüksek olabilir veya bot yetkim yeterli deðil.',
                    flags: 64
                });
            }

            // Rol hiyerarþisi kontrolü
            if (interaction.member.roles.highest.position <= member.roles.highest.position) {
                return interaction.reply({
                    content: '? Bu kullanýcýyý yasaklayamazsýnýz! Kullanýcýnýn rolü sizinle ayný veya daha yüksek.',
                    flags: 64
                });
            }
        }

        // Kullanýcýya DM göndermeyi dene (ban öncesi)
        try {
            await targetUser.send(
                `?? **${interaction.guild.name}** sunucusundan yasaklandýnýz!\n\n` +
                `?? **Sebep:** ${reason}\n` +
                `?? **Yetkili:** ${interaction.user.tag}`
            );
        } catch (error) {
            console.log(`${targetUser.tag} kullanýcýsýna DM gönderilemedi.`);
        }

        // Kullanýcýyý yasakla
        try {
            await interaction.guild.members.ban(targetUser.id, {
                deleteMessageSeconds: deleteMessageDays * 24 * 60 * 60, // Gün cinsinden saniyeye çevir
                reason: reason
            });
            
            await interaction.reply({
                content: `? **${targetUser.tag}** baþarýyla sunucudan yasaklandý!\n` +
                         `?? **Sebep:** ${reason}\n` +
                         `?? **Yetkili:** ${interaction.user.tag}\n` +
                         `??? **Silinen Mesajlar:** ${deleteMessageDays} günlük`,
                flags: 64
            });
        } catch (error) {
            console.error('Ban hatasý:', error);
            return interaction.reply({
                content: '? Kullanýcý yasaklanýrken bir hata oluþtu!',
                flags: 64
            });
        }
    }
};