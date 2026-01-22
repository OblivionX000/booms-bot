const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

// Yetkili rol ID'si
const YETKILI_ROL_ID = '1463878849510113450';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Bir kullanýcýyý sunucudan atar')
        .addUserOption(option =>
            option
                .setName('kullanýcý')
                .setDescription('Atýlacak kullanýcý')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('sebep')
                .setDescription('Atýlma sebebi')
                .setRequired(false)
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

        // Sunucuda üyeyi bul
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: '? Bu kullanýcý sunucuda bulunamadý!',
                flags: 64
            });
        }

        // Kendini atma kontrolü
        if (targetUser.id === interaction.user.id) {
            return interaction.reply({
                content: '? Kendinizi atamazsýnýz!',
                flags: 64
            });
        }

        // Botu atma kontrolü
        if (targetUser.bot) {
            return interaction.reply({
                content: '? Botlarý atamazsýnýz!',
                flags: 64
            });
        }

        // Sunucu sahibini atma kontrolü
        if (targetUser.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: '? Sunucu sahibini atamazsýnýz!',
                flags: 64
            });
        }

        // Botun yetkisi var mý kontrol et
        if (!member.kickable) {
            return interaction.reply({
                content: '? Bu kullanýcýyý atamýyorum! Kullanýcýnýn rolü benden yüksek olabilir veya bot yetkim yeterli deðil.',
                flags: 64
            });
        }

        // Rol hiyerarþisi kontrolü - komutu kullanan kiþinin rolü hedeften yüksek olmalý
        if (interaction.member.roles.highest.position <= member.roles.highest.position) {
            return interaction.reply({
                content: '? Bu kullanýcýyý atamazsýnýz! Kullanýcýnýn rolü sizinle ayný veya daha yüksek.',
                flags: 64
            });
        }

        // Kullanýcýya DM göndermeyi dene (kick öncesi)
        try {
            await targetUser.send(
                `?? **${interaction.guild.name}** sunucusundan atýldýnýz!\n\n` +
                `?? **Sebep:** ${reason}\n` +
                `?? **Yetkili:** ${interaction.user.tag}`
            );
        } catch (error) {
            console.log(`${targetUser.tag} kullanýcýsýna DM gönderilemedi.`);
        }

        // Kullanýcýyý at
        try {
            await member.kick(reason);
            
            await interaction.reply({
                content: `? **${targetUser.tag}** baþarýyla sunucudan atýldý!\n` +
                         `?? **Sebep:** ${reason}\n` +
                         `?? **Yetkili:** ${interaction.user.tag}`,
                flags: 64
            });
        } catch (error) {
            console.error('Kick hatasý:', error);
            return interaction.reply({
                content: '? Kullanýcý atýlýrken bir hata oluþtu!',
                flags: 64
            });
        }
    }
};