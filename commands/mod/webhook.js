const { MessageAttachment, MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const config = require("./../../config.json");

const db = {
    data: new Map(),
    get: (key) => db.data.get(key),
    set: (key, value) => db.data.set(key, value),
    delete: (key) => db.data.delete(key),
  };

module.exports = {
  name: "webhook",
  category: "mod",
  description: "Criar Webhook",
  usage: "canal",

   async execute(message, args) {
 

    if (!message.member.permissions.has('ADMINISTRATOR')) {
      const novip = new MessageEmbed()
        .setDescription(`${message.author}, você não pode utilizar esse comando!`)
        .setColor(config.embedColor);

      return message.channel.send({ embeds: [novip] }).then((msg) => {
        setTimeout(() => msg.delete(), 5000);
      });
    }

        let canal = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])

        let embedmsgs = new MessageEmbed()
        .setDescription(`${message.author}, por favor execute o comando da maneira correta (${config.prefix}webhook <#${message.channel.id}>)`)
        .setColor(config.embedColor)

        if (!canal) {

            return message.channel.send({ embeds: [embedmsgs] }).then((msg) => {

                setTimeout(() => msg.delete(), 7000);
            })

        }

        const web = new MessageEmbed()
            .setAuthor({ name: `Criando no canal: ${canal.name}`, iconURL: `https://cdn.discordapp.com/emojis/1015228066315911230.gif` })
            .setTitle(`Título`)
            .setDescription(`> Todos os campos os quais estiverem vazios não irão aparecer ao enviar a mensagem.`)
            .setThumbnail(`https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662`)
            .setColor(config.embedColor)
            .setImage(`https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662`)
            .setFooter({ text: `${message.guild.name} ©` })

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Definir Título")
                    .setCustomId("title")
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setLabel("Definir Descrição")
                    .setCustomId("desc")
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setLabel("Definir Imagem")
                    .setCustomId("setimage")
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setLabel("Definir Imagem de Canto")
                    .setCustomId("imagemcanto")
                    .setStyle('SECONDARY'))

        const row2 = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel("Enviar")
                    .setCustomId("enviar")
                    .setStyle('SUCCESS'),
                new MessageButton()
                    .setLabel("Fechar o painel de criação")
                    .setCustomId("fechar")
                    .setStyle('DANGER'))

                    const MESSAGE = await message.channel.send({ embeds: [web], components: [row, row2] });
                    const filter = (i) => i.user.id === message.author.id;
        const collector = MESSAGE.createMessageComponentCollector({ filter });

        collector.on('collect', async (b) => {

            if (b.customId == 'title') {

                let embedmsgs = new MessageEmbed()
                    .setDescription(`Envie no chat o título desejado para o Webhook\nPara cancelar a operação digite: \`cancelar\``)
                    .setColor(config.embedColor)

                b.reply({ embeds: [embedmsgs], ephemeral: true });

                let coletor = b.channel.createMessageCollector({ filter: mm => mm.author.id == b.user.id, max: 1 })

                coletor.on("collect", async (message) => {

                    message.delete();

                    let title = message.content;

                    if (title == "cancelar") {

                        coletor.stop('Collector stopped manually');

                        let errado = new MessageEmbed()
                            .setDescription(`Operação cancelada com sucesso.`)
                            .setColor(config.embedColor)

                        return b.editReply({ embeds: [errado], ephemeral: true })

                    } else {

                        let correto = new MessageEmbed()
                            .setDescription(`Título definido com sucesso.`)
                            .setColor(config.embedColor)

                        b.editReply({ embeds: [correto], ephemeral: true })

                        await db.set(`title_${MESSAGE.id}`, title);

                       let titulo = await db.get(`title_${MESSAGE.id}`);
                        if (!titulo) titulo = 'Título';
                        let desc = await db.get(`desc_${MESSAGE.id}`);
                        if (!desc) desc = `> Todos os campos os quais estiverem vazios não irão aparecer ao enviar a mensagem.`
                        let thumb = await db.get(`imagemdecanto_${MESSAGE.id}`);
                        if (!thumb) thumb = "https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662"
                        let image = await db.get(`setimage_${MESSAGE.id}`);
                        if (!image) image = "https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662"

                        const webhookWl = new MessageEmbed()
                            .setTitle(`${titulo}`)
                            .setDescription(`${desc}`)
                            .setThumbnail(`${thumb}`)
                            .setColor(config.embedColor)
                            .setImage(`${image}`)
                            .setFooter({ text: `${b.guild.name} ©` })

                        MESSAGE.edit({ embeds: [webhookWl] });

                    }
                })
            }

            if (b.customId == 'desc') {

                let tit = await db.get(`title_${MESSAGE.id}`)

                if (!tit) {

                    let semtitulo = new MessageEmbed()
                        .setDescription(`Você ainda não definiu o \`Título\` do Webhook.`)
                        .setColor(config.embedColor)

                    return b.reply({ embeds: [semtitulo], ephemeral: true });

                }

                let embedmsgs = new MessageEmbed()
                    .setDescription(`Envie no chat a descrição desejada para o Webhook\nPara cancelar a operação digite: \`cancelar\``)
                    .setColor(config.embedColor)

                b.reply({ embeds: [embedmsgs], ephemeral: true });

                let coletor = b.channel.createMessageCollector({ filter: mm => mm.author.id == b.user.id, max: 1 })

                coletor.on("collect", async (message) => {

                    message.delete();

                    let descr = message.content;

                    if (descr == "cancelar") {

                        coletor.stop('Collector stopped manually');

                        let errado = new MessageEmbed()
                            .setDescription(`Operação cancelada com sucesso.`)
                            .setColor(config.embedColor)

                        return b.editReply({ embeds: [errado], ephemeral: true })

                    } else {

                        let correto = new MessageEmbed()
                            .setDescription(`Descrição definida com sucesso.`)
                            .setColor(config.embedColor)

                        b.editReply({ embeds: [correto], ephemeral: true })

                        await db.set(`desc_${MESSAGE.id}`, descr);

                       let titulo = await db.get(`title_${MESSAGE.id}`);
                        if (!titulo) titulo = 'Título';
                        let desc = await db.get(`desc_${MESSAGE.id}`);
                        if (!desc) desc = `> Todos os campos os quais estiverem vazios não irão aparecer ao enviar a mensagem.`
                        let thumb = await db.get(`imagemdecanto_${MESSAGE.id}`);
                        if (!thumb) thumb = "https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662"
                        let image = await db.get(`setimage_${MESSAGE.id}`);
                        if (!image) image = "https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662"

                        const webhookWl = new MessageEmbed()
                            .setTitle(`${titulo}`)
                            .setDescription(`${desc}`)
                            .setThumbnail(`${thumb}`)
                            .setColor(config.embedColor)
                            .setImage(`${image}`)
                            .setFooter({ text: `${b.guild.name} ©` })

                        MESSAGE.edit({ embeds: [webhookWl] })
                    }

                })
            }

            if (b.customId == "setimage") {

                let descri = await db.get(`desc_${MESSAGE.id}`)

                if (!descri) {

                    let semdesc = new MessageEmbed()
                        .setDescription(`Você ainda não definiu a \`Descrição\` do Webhook.`)
                        .setColor(config.embedColor)

                    return b.reply({ embeds: [semdesc], ephemeral: true });

                }

                let embedcargo = new MessageEmbed()
                    .setTitle('SUA DM TEM QUE SER ABERTA PRA SETAR A IMAGEM')
                    .setDescription(`Envie no chat a imagem anexada desejada para o Webhook\nPara cancelar a operação digite: \`cancelar\``)
                    .setColor(config.embedColor)

                b.reply({ embeds: [embedcargo], ephemeral: true });

                let coletor = b.channel.createMessageCollector({ filter: mm => mm.author.id == b.user.id, max: 1 })

                coletor.on("collect", async (message) => {

                    message.delete();

                  
                        if (!message.attachments.first()) {

                        let semImagem = new MessageEmbed()
                            .setDescription(`Você não enviou uma imagem válida.`)
                            .setColor(config.embedColor);
                        return b.editReply({ embeds: [semImagem], ephemeral: true });
                    }
                
                    let url_imagem = message.attachments.first().url;

                    message.attachments.forEach(async function (Attachment) {

                        url_imagem = Attachment.url


                        if (message.content == "cancelar") {

                            coletor.stop('Collector stopped manually');

                            let errado = new MessageEmbed()
                                .setDescription(`Operação cancelada com sucesso.`)
                                .setColor(config.embedColor)

                            return b.editReply({ embeds: [errado], ephemeral: true })

                         } else {
                            let correto = new MessageEmbed()
                            .setDescription(`Imagem definida com sucesso.`)
                            .setColor(config.embedColor);
                        b.editReply({ embeds: [correto], ephemeral: true });

    
                            

                            const membro = message.member;

                            let imagem = new MessageAttachment(`${url_imagem}`)

                            let MENSAGEM = await membro.send({ files: [imagem.attachment] });

                            await db.set(`setimage_${MESSAGE.id}`, url_imagem);

                           let titulo = await db.get(`title_${MESSAGE.id}`);
                            if (!titulo) titulo = 'Título';
                            let desc = await db.get(`desc_${MESSAGE.id}`);
                            if (!desc) desc = `> Todos os campos os quais estiverem vazios não irão aparecer ao enviar a mensagem.`
                            let thumb = await db.get(`imagemdecanto_${MESSAGE.id}`);
                            if (!thumb) thumb = "https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662"
                            let image = await db.get(`setimage_${MESSAGE.id}`);
                            if (!image) image = "https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662"

                            const webhookWl = new MessageEmbed()
        .setTitle(`${titulo}`)
        .setDescription(`${desc}`)
        .setThumbnail(`${thumb}`)
        .setColor(config.embedColor)
        .setImage(`${url_imagem}`) 
        .setFooter({ text: `${b.guild.name} ©` });

                            MESSAGE.edit({ embeds: [webhookWl] });

                        }
                    })
                })
            }

            if (b.customId == "imagemcanto") {

                let descri = await db.get(`desc_${MESSAGE.id}`);

                if (!descri) {

                    let semdesc = new MessageEmbed()
                        .setDescription(`Você ainda não definiu a \`Descrição\` do Webhook.`)
                        .setColor(config.embedColor)

                    return b.reply({ embeds: [semdesc], ephemeral: true });

                }

                let embedcargo = new MessageEmbed()
                   .setTitle('SUA DM TEM QUE SER ABERTA PRA SETAR A IMAGEM')
                    .setDescription(`Envie no chat a imagem anexada desejada para o Webhook\nPara cancelar a operação digite: \`cancelar\``)
                    .setColor(config.embedColor)

                b.reply({ embeds: [embedcargo], ephemeral: true });

                let coletor = b.channel.createMessageCollector({ filter: mm => mm.author.id == b.user.id, max: 1 })

                coletor.on("collect", async (message) => {

                    message.delete();

                    
                    if (!message.attachments.first()) {
                        let semImagem = new MessageEmbed()
                            .setDescription(`Você não enviou uma imagem válida.`)
                            .setColor(config.embedColor);
                        return b.editReply({ embeds: [semImagem], ephemeral: true });
                    }

                    let url_imagem = message.attachments.first().url;


                    message.attachments.forEach(async function (Attachment) {

                        url_imagem = Attachment.url

                        if (message.content == "cancelar") {

                            coletor.stop('Collector stopped manually');

                            let errado = new MessageEmbed()
                                .setDescription(`Operação cancelada com sucesso.`)
                                .setColor(config.embedColor)

                            return b.editReply({ embeds: [errado], ephemeral: true })

                        } else {

                            let correto = new MessageEmbed()
                                .setDescription(`Imagem definida com sucesso.`)
                                .setColor(config.embedColor)

                            b.editReply({ embeds: [correto], ephemeral: true })

                            const membro = message.member;


                            let imagem = new MessageAttachment(`${url_imagem}`)

                            let MENSAGEM = await membro.send({ files: [imagem.attachment] });

                            await db.set(`imagemdecanto_${MESSAGE.id}`, url_imagem);

                           let titulo = await db.get(`title_${MESSAGE.id}`);
                            if (!titulo) titulo = 'Título';
                            let desc = await db.get(`desc_${MESSAGE.id}`);
                            if (!desc) desc = `> Todos os campos os quais estiverem vazios não irão aparecer ao enviar a mensagem.`
                            let thumb = await db.get(`imagemdecanto_${MESSAGE.id}`);
                            if (!thumb) thumb = "https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662"
                            let image = await db.get(`setimage_${MESSAGE.id}`);
                            if (!image) image = "https://media.discordapp.net/attachments/1111554140288581693/1135624172060561539/image.png?width=717&height=662"

                            const webhookReg = new MessageEmbed()
                                .setTitle(`${titulo}`)
                                .setDescription(`${desc}`)
                                .setThumbnail(`${url_imagem}`)
                                .setColor(config.embedColor)
                                .setImage(`${image}`)
                                .setFooter({ text: `${b.guild.name} ©` })

                            MESSAGE.edit({ embeds: [webhookReg] });
                        }
                    })
                }
                )

            } 

            if (b.customId == 'enviar') {

                let descri = await db.get(`desc_${MESSAGE.id}`);

                if (!descri) {

                    let semdesc = new MessageEmbed()
                        .setDescription(`Você ainda não configurou o \`Webhook\`.`)
                        .setColor(config.embedColor)

                    return b.reply({ embeds: [semdesc], ephemeral: true });

                } else {

                    let enviado = new MessageEmbed()
                        .setDescription(`Webhook enviado com sucesso.`)
                        .setColor(config.embedColor)

                    let enviadoCanal = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setLabel("Conferir no canal")
                                .setURL(`https://discord.com/channels/${b.guild.id}/${canal.id}`)
                                .setStyle('LINK'))

                    b.reply({ embeds: [enviado], components: [enviadoCanal], ephemeral: true });

                   let titulo = await db.get(`title_${MESSAGE.id}`);
                    let desc = await db.get(`desc_${MESSAGE.id}`);
                    let thumb = await db.get(`imagemdecanto_${MESSAGE.id}`);
                    let image = await db.get(`setimage_${MESSAGE.id}`);

                    const embedWeb = new MessageEmbed()
                        .setTitle(titulo)
                        .setDescription(desc)
                        .setThumbnail(thumb)
                        .setColor(config.embedColor)
                        .setImage(image)
                        .setFooter({ text: `${b.guild.name} ©` })

                    await canal.send({ embeds: [embedWeb] }).catch(err => { });

                    MESSAGE.delete();
                    
                    await db.delete(`title_${MESSAGE.id}`);
                    await db.delete(`desc_${MESSAGE.id}`);
                    await db.delete(`imagemdecanto_${MESSAGE.id}`);
                    await db.delete(`setimage_${MESSAGE.id}`);

                }
            } 

            if (b.customId == 'fechar') {

                b.deferUpdate();

                MESSAGE.delete();
            }

        })
    }
}