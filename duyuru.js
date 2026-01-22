const { SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');

// Yetkili rol ID'si
const YETKILI_ROL_ID = '1463878849510113450';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duyuru')
        .setDescription('Belirtilen kanala duyuru gönderir')
        .addChannelOption(option =>
            option
                .setName('kanal')
                .setDescription('Duyurunun gönderileceði kanal')
                .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('baþlýk')
                .setDescription('Duyuru baþlýðý')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('mesaj')
                .setDescription('Duyuru mesajý')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('renk')
                .setDescription('Duyuru rengi (hex kod, örn: #ff0000)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName('görsel')
                .setDescription('Duyuru görseli (URL)')
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

        const channel = interaction.options.getChannel('kanal');
        const title = interaction.options.getString('baþlýk');
        const message = interaction.options.getString('mesaj');
        const color = interaction.options.getString('renk') || '#0099ff';
        const image = interaction.options.getString('görsel');

        // Kanal yazma izni kontrolü
        if (!channel.permissionsFor(interaction.guild.members.me).has('SendMessages')) {
            return interaction.reply({
                content: '? Belirtilen kanala mesaj gönderme iznim yok!',
                flags: 64
            });
        }

        // Renk formatý kontrolü
        const hexColorRegex = /^#[0-9A-F]{6}$/i;
        let embedColor = color;
        if (!hexColorRegex.test(color)) {
            embedColor = '#0099ff'; // Geçersiz renk ise varsayýlan mavi
        }

        // Embed oluþtur
        const embed = new EmbedBuilder()
            .setTitle(`?? ${title}`)
            .setDescription(message)
            .setColor(embedColor)
            .setFooter({ 
                text: `Duyuruyu yapan: ${interaction.user.tag}`, 
                iconURL: interaction.user.displayAvatarURL() 
            })
            .setTimestamp();

        // Eðer görsel URL'i varsa ekle
        if (image) {
            // URL geçerliliðini kontrol et
            try {
                new URL(image);
                embed.setImage(image);
            } catch (error) {
                // Geçersiz URL, görsel ekleme
            }
        }

        // Duyuruyu gönder
        try {
            await channel.send({ embeds: [embed] });
            
            await interaction.reply({
                content: `? Duyuru baþarýyla <#${channel.id}> kanalýna gönderildi!`,
                flags: 64
            });
        } catch (error) {
            console.error('Duyuru gönderme hatasý:', error);
            return interaction.reply({
                content: '? Duyuru gönderilirken bir hata oluþtu!',
                flags: 64
            });
        }
    }
};