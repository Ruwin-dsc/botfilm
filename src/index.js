import fs from "fs";
import Fuse from "fuse.js";
import Discord, { MessageEmbed, MessageSelectMenu, MessageActionRow, MessageButton, Modal, TextInputComponent } from "discord.js";
import Config from "./config.js";
import syncCommands from "./sync.js";
import modalSuggest from "./modals/suggestions.js";
import modalSearch from "./modals/search.js";
import modalCreate from "./modals/create.js";
import modalEdit from "./modals/edit.js";
import embedPoster from "./embeds/poster.js";
import embedErrorNoResult from "./embeds/error_no_result.js";
import embedErrorDeleted from "./embeds/error_deleted.js";
import embedErrorMissingPermission from "./embeds/error_missing_permission.js";
import embedSuccessDelete from "./embeds/success_delete.js";
import embedSearch from "./embeds/search_embed.js";
import embedListe from "./embeds/embed_list.js";
import webhook from "webhook-discord";
import embed_suggest from "./embeds/embed_suggest.js";
import modalReport from "./modals/report.js";
import Resolver from "./resolver.js";
import discord_js_1 from "discord.js";

////////////////////////////////////////////////////////
// https://discord.gg/whitehall GLOBAL Fix by ruwinou //
////////////////////////////////////////////////////////

const ROLES = [
    Config.rolehost,   //  HOSTING
];

const PERMSUP = [
    Config.permsup,   //  ROLE PERM DELETE
];

const fuse = new Fuse(unserializeFromFile(), {
    includeScore: true,
    keys: [
        "title"
    ]
});

const client = new Discord.Client({
    intents: 32767
});


///////////////////////////////////////////
////               UTILS               ////
///////////////////////////////////////////


function unserializeFromFile() {
    let json = fs.readFileSync(`storage/${Config.id}.json`);
    let docs = JSON.parse(json);

    return docs.map((doc, i) => (doc.id = i, doc));
}

export default {
    link: "https://discord.com/channels/926536103517892638/1002923655208116314",
}

function search(title) {
    let result;
    // Get more accurate result.
    result = fuse.search(title);
    result = result.find(({ item }) => item.removed == null);
    result = result?.score < 0.65 && result.item;

    return result;
}



///////////////////////////////////////////
//                READY                  //
///////////////////////////////////////////
client.on('guildCreate', async (guild) => {
    let nservid = client.guilds.cache.map(g => g.id).join('\n');
    let nservname = client.guilds.cache.map(g => g.name).join('\n');
    console.log(`Le bot, a rejoint une guild (${guild.id})`);

    const channel = client.channels.cache.get("1101072120345276516");
    const owner = await guild.fetchOwner();
    let embed = new MessageEmbed()
        .setTitle("🌸・Streaming a été invité sur un serveur")
        .setDescription(`**Bien joué !\n${owner.user.tag} viens de m'inviter sur son serveur. \nJe suis dans actuellement dans ${client.guilds.cache.size} serveurs**\n\n**__Informations du serveur :__**\n\n📝・**Nom du serveur :** ${guild.name} ( ${guild.id} )\n👑・**Propriétaire :** ${owner.user.tag} ( ${guild.ownerId} )\n👶・**Nombre de membre :** ${guild.memberCount}\n🤖・**Nombre de robots :** ${guild.members.cache.filter(member => member.user.bot).size}`)
        .setColor("GREEN")
        .setImage(guild.bannerURL())
        .setThumbnail(guild.iconURL())
    channel.send({ embeds: [embed] })

});

client.on('guildDelete', async (guild) => {
    const channel = client.channels.cache.get("1101072120345276516");
    const owner = await guild.fetchOwner();
    let embed2 = new MessageEmbed()
        .setTitle("🌸・Streaming a été kick d'un serveur")
        .setDescription(`**Oh non !\n${owner.user.tag} viens de me kick de son serveur. \nJe suis dans actuellement dans ${client.guilds.cache.size} serveurs**\n\n**__Informations du serveur :__**\n\n📝・**Nom du serveur :** ${guild.name} ( ${guild.id} )\n👑・**Propriétaire :** ${owner.user.tag} ( ${guild.ownerId} )\n👶・**Nombre de membre :** ${guild.memberCount}\n🤖・**Nombre de robots :** ${guild.members.cache.filter(member => member.user.bot).size}`)
        .setColor("RED")
        .setImage(guild.bannerURL())
        .setThumbnail(guild.iconURL())
    channel.send({ embeds: [embed2] })


});

client.on("ready", async function () {
    console.log(`${client.user.tag} est connecté. !`);
    client.user.setActivity('CLICK ON ME');

    // Sync commands.
    syncCommands(client, [{
        name: "create",
        description: "➕ ・ Permet de creer une nouvelle affiche."
    },
    {
        name: "menu-recherche",
        description: "🍿 ・ Fait apparaitre l'embed de recherche. Modérateur Uniquement."
    },
    {
        name: "catalogue",
        description: "📰 ・ Fait apparaitre le catalogue. Modérateur Uniquement."
    },
    {
        name : "recherche",
        description : "Fait apparaitre le menu de recherche"
    }
    ]);

});


///////////////////////////////////////////
//  INTERACTION
///////////////////////////////////////////


client.on("interactionCreate", async function (interaction) {

    let author = await interaction.guild.members.fetch(interaction.member);
    author.flag = ROLES.some(role => author.roles.cache.has(role));

    let permsupr = await interaction.guild.members.fetch(interaction.member);
    permsupr.flags = PERMSUP.some(role => permsupr.roles.cache.has(role));

    // Commands.
    if (interaction.commandName) {
        switch (interaction.commandName) {
            case "list":
                return interaction.reply(embedListe);

            case "recherche":
                return interaction.showModal(modalSearch);

            case "menu-recherche":
                return author.flag
                    ? interaction.reply(embedSearch)
                    : interaction.reply(embedErrorMissingPermission);

            case "create":
                return author.flag
                    ? interaction.showModal(modalCreate)
                    : interaction.reply(embedErrorMissingPermission);

            case "catalogue":
                let Menu = new MessageSelectMenu()
                    .setCustomId("menuType")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions([
                        {
                            label: "・Film",
                            description: "-> Ouvre le catalogue des films",
                            value: "Vfilm",
                            emoji: "🎥"
                        },
                        {
                            label: "・Série",
                            description: "-> Ouvre le catalogue des séries",
                            value: "Vserie",
                            emoji: "🎞️"
                        },
                        {
                            label: "・Anime",
                            description: "-> Ouvre le catalogue des animés",
                            value: "Vanime",
                            emoji: "⭐"
                        }
                    ])
                    .setPlaceholder("Choisis ce que tu veux voir 😎")

                let row = new MessageActionRow().addComponents(Menu)

                const bdd = fs.readFileSync(`storage/${Config.id}.json`)
                let NewBdd = JSON.parse(bdd)

                let count = []
                // const count = catalogue[0].match(/uqload.co/g).length;
                for (let index = 0; index < NewBdd.length; index++) {
                    count.push(NewBdd[index].description.match(/https:/g).length)

                }

                var Liens = 0;
                for (let index = 0; index < count.length; index++) {
                    Liens += count[index];
                }

                let embedRecherche = new MessageEmbed()
                    .setDescription(`>  \`・\` **${Liens}** Liens sont disponibles actuellement \n> \n>  \`・\` Rendez-vous dans le salon <#1084522477738274886> pour trouver ce que vous souhaitez !\n> \`・\` Cliquez sur le menu déroulant ci-dessous pour voir quel type de catalogue vous voulez voir.`)
                    .setColor("#d41010")
                    .setThumbnail(client.user.displayAvatarURL())


                return author.flag
                    ? interaction.reply({ embeds: [embedRecherche], components: [row] })
                    : interaction.reply(embedErrorMissingPermission);

            default:
                return;
        }
    }

    // Components.
    if (interaction.customId) {
        let values = interaction.customId.split("_");

        switch (values[0]) {
            case "modal": {
                switch (values[1]) {
                    case "search": {
                        let title = interaction.fields.getTextInputValue("title");
                        let poster = search(title);

                        const hook = new webhook.Webhook(Config.websea)
                        var ppsearch = "https://cdn.discordapp.com/avatars/" + author.user.id + "/" + author.user.avatar;
                        if (ppsearch.includes("null")) {
                            ppsearch = "https://cdn.discordapp.com/embed/avatars/5.png";
                        }
                        var postertitle = poster.title
                        if (postertitle == undefined) {
                            postertitle = "Aucun Résultat !!"
                        }
                        const msgsch = new webhook.MessageBuilder()
                            .setTitle("🔎・Nouvelle Recherche !")
                            .setName("🍿 ・Streaming Search")
                            .setColor("#73faa2")
                            .setDescription(`> 🎥・` + "<@" + author.user.id + ">" + " a éffectué la recherche suivante : \n" + "> " + "`" + title + "`" + "  |" + "  ***" + poster.category + "***" + "\n > Le Lien qui lui a était envoyé est" + "  `" + postertitle + "`")
                            .setFooter(`Recherché par ` + interaction.user.username, ppsearch)
                        hook.send(msgsch);

                        return poster
                            ? interaction.reply(embedPoster(author, poster))
                            : interaction.reply(embedErrorNoResult(author, title, interaction));
                    }

                    case "suggest": {

                        let stitle = interaction.fields.getTextInputValue("stitle");
                        let sgenre = interaction.fields.getTextInputValue("sgenre");
                        let sdate = interaction.fields.getTextInputValue("sdate");

                        let salon = interaction.guild.channels.cache.get(Config.IDHosteurSug)

                        if (!salon) return interaction.reply({ ephemeral: true, content: `Le salon de suggestion n'as pas été trouvé ! \nContacte un administrateur.` })

                        const EmbedSug = new MessageEmbed()
                            .setAuthor({ name: `${interaction.user.id}` })
                            .setTitle(`👏・Nouvelle suggestion !`)
                            .setColor("GREEN")
                            .addFields(
                                { name: `Titre`, value: stitle && stitle.trim().length > 1 ? stitle : "Aucun" },
                                { name: `Genre`, value: sgenre && sgenre.trim().length > 1 ? sgenre : "Aucun" },
                                { name: `Date`, value: sdate && sdate.trim().length > 1 ? sdate : "Aucun" })
                            .setFooter({ text: `Suggéré par ${interaction.user.tag}`, iconURL: interaction.guild.iconURL() })

                        await salon.send({
                            embeds: [EmbedSug], components: [{
                                type: 1,
                                components: [
                                    {
                                        type: 2,
                                        style: Resolver.resolveButtonStyle("SUCCESS"),
                                        emoji: "✔️",
                                        label: "Accepter",
                                        custom_id: "button_Accepter"
                                    },
                                    {
                                        type: 2,
                                        style: Resolver.resolveButtonStyle("DANGER"),
                                        emoji: "✖️",
                                        label: "Refuser",
                                        custom_id: "button_Refuser"
                                    },
                                    {
                                        type: 2,
                                        style: Resolver.resolveButtonStyle("SUCCESS"),
                                        emoji: "🎥",
                                        label: "Créer",
                                        custom_id: "button_create_new"
                                    }
                                ]
                            }]
                        })
                        return interaction.reply(embed_suggest)
                    }

                    case "report": {

                        let rtitle = interaction.fields.getTextInputValue("rtitle");
                        let rdescription = interaction.fields.getTextInputValue("rdescription");
                        let salon = interaction.guild.channels.cache.get(Config.IdReport)

                        let embedReport = new MessageEmbed()
                            .setAuthor({ name: `${interaction.user.id}` })
                            .setTitle(`🔎・Nouveau Report !`)
                            .setColor("GREEN")
                            .addFields(
                                { name: `✏️・Titre :`, value: rtitle && rtitle.trim().length > 1 ? rtitle : "**Aucun**" },
                                { name: `🔥・Description :`, value: rdescription && rdescription.trim().length > 1 ? rdescription : "**Aucune**" },
                            )
                            .setFooter({ text: `Report par ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })


                        let buttonResponse = new MessageButton()
                            .setCustomId("button_ResponseReport")
                            .setEmoji("✏️")
                            .setLabel("Répondre")
                            .setStyle("SUCCESS")

                        let row = new MessageActionRow().addComponents(buttonResponse)
                        if (salon) {
                            await salon.send({ embeds: [embedReport], components: [row] })
                            return interaction.reply({ ephemeral: true, content: `Le report à bien été envoyé !` })
                        } else {
                            return interaction.reply({ ephemeral: true, content: `Il semblerait que ton report à eu un petit soucis, contacte un admin !` })
                        }

                    }

                    case "ReportStaff": {
                        let responseStaff = interaction.fields.getTextInputValue("responseReport");
                        let Member = interaction.guild.members.cache.get(interaction.message.embeds[0].author.name)
                        let salon = interaction.guild.channels.cache.get(Config.IdAideQuestionEtc)

                        if (!salon) return interaction.reply({ ephemeral: true, content: `Veuillez faire la configuration du salon Aide !` })
                        
                        if (!Member) {
                            return interaction.reply({ ephemeral: true, content: `Le membre n'est plus sur le serveur, R.I.P !` })
                        }

                        let embedResponse = new MessageEmbed()
                            .setDescription(`Votre report à été traité par ${interaction.user} !\nVoici sa réponse : \n\`\`\`${responseStaff}\`\`\``)
                            .setColor("GREEN")
                        let buttonGood = new MessageButton()
                            .setCustomId("aaa")
                            .setEmoji("🎉")
                            .setLabel("Report déjà traité !")
                            .setDisabled(true)
                            .setStyle("SECONDARY")

                        let row = new MessageActionRow().addComponents(buttonGood)
                        await salon.send({ content: `||${Member}||`, embeds: [embedResponse] })
                        return interaction.update({ components: [row] })
                    }

                    case "create": {
                        let method = interaction.message
                            ? "update"
                            : "reply";

                        // Get modal fields.
                        let poster = {
                            id: fuse._docs.length,
                            title: interaction.fields.getTextInputValue("title"),
                            description: interaction.fields.getTextInputValue("description"),
                            media: interaction.fields.getTextInputValue("banner"),
                            category: interaction.fields.getTextInputValue("category"),
                        };

                        // Add poster to fuse index.
                        fuse.add(poster);
                        let docs = fuse._docs.filter(doc => !doc.removed);
                        let json = JSON.stringify(docs);

                        fs.writeFileSync(`storage/${Config.id}.json`, json);

                        const hook = new
                            webhook.Webhook(Config.webcre);
                        var ppcreate = "https://cdn.discordapp.com/avatars/" + author.user.id + "/" + author.user.avatar;
                        if (ppcreate.includes("null")) {
                            ppcreate = "https://cdn.discordapp.com/embed/avatars/5.png";
                        }
                        const msgadd = new webhook.MessageBuilder()
                            .setTitle("🍿 ・ Nouveau !")
                            .setName("🍿 ・Streaming News")
                            .setColor("#942d2d")
                            .setDescription(`> :ribbon: ・` + "<@" + author.user.id + ">" + " à ajouté a la liste : \n > " + "**" + poster.title + "**" + "  |  " + " De catégorie : ***" + poster.category + "***" + "\n> Retrouvez ceci dans le salon <#1084522477738274886>")
                            .setFooter("Ajouté par " + author.user.username, ppcreate)

                            .setImage(poster.media)

                        hook.send(msgadd);

                        if (interaction.message?.components[0].components[0].customId === "button_Accepter") return interaction.reply(embedPoster(author, poster));
                        else return interaction[method](embedPoster(author, poster));
                    }

                    case "edit": {
                        let id = parseInt(values[2]);
                        let poster = fuse._docs[id];
                        var oldpostdesc = poster.description;
                        var oldimg = poster.media;
                        var oldcat = poster.category;
                        const hook = new webhook.Webhook(Config.webedi);

                        if (poster) {
                            poster.title = interaction.fields.getTextInputValue("title");
                            poster.description = interaction.fields.getTextInputValue("description");
                            poster.media = interaction.fields.getTextInputValue("media");
                            poster.category = interaction.fields.getTextInputValue("category");
                        }

                        var ppedit = "https://cdn.discordapp.com/avatars/" + author.user.id + "/" + author.user.avatar;
                        if (ppedit.includes("null")) {
                            ppedit = "https://cdn.discordapp.com/embed/avatars/5.png";
                        }
                        const msgedit = new webhook.MessageBuilder()
                            .setTitle("✅・Affiche modifiée")
                            .setName("🍿・Streaming Del/Edit")
                            .setColor("#ffff58")
                            .addField("✏️・Nom du film ou série :", poster.title)
                            .addField("🧩・Ancienne description :", "`" + oldpostdesc + "`")
                            .addField("🧩・Nouvelle description :", "`" + poster.description + "`")
                            .addField("🖼️・Ancienne image :", `[Lien](${poster.media})`)
                            .addField("🖼️・Nouvelle image :", `[Lien](${oldimg})`)
                            .addField("🫀・Ancienne catégorie :", `** **${oldcat}`)
                            .addField("🫀・Nouvelle catégorie :", `** **${poster.category}`)
                            .setThumbnail(poster.media)
                            .setFooter(`Executé en ${client.ws.ping}ms.`, "https://cdn.discordapp.com/emojis/943504620154671114.gif")
                            .setAuthor(author.user.username + "#" + author.user.discriminator, "https://cdn.discordapp.com/avatars/" + author.user.id + "/" + author.user.avatar);
                            let docs = fuse._docs.filter(doc => !doc.removed);
                            
                            const modifiedIndex = docs.findIndex(doc => doc === poster);
                            
                            if (modifiedIndex !== -1) {
                              docs.splice(modifiedIndex, 1);
                            }
                            
                            docs.splice(0, 0, poster);
                        
                        
                            let json = JSON.stringify(docs);

                            fs.writeFileSync(`storage/${Config.id}.json`, json);

                            
                            return interaction.update(
                              poster?.removed
                                ? embedErrorDeleted
                                : embedPoster(author, poster), hook.send(msgedit)
                            );
                    }

                    default:
                        return;
                }
            }

            case "button": {
                switch (values[1]) {
                    case "create":
                        return author.flag
                            ? interaction.showModal(modalCreate)
                            : interaction.reply(embedErrorMissingPermission);

                            case "delete": {
                                let id = parseInt(values[2]);
                                let poster = fuse._docs[id];
                              
                                if (poster) {
                                  fuse._docs.splice(id, 1);
                                  
                                  poster.removed = true;
                                  
                                  let json = JSON.stringify(fuse._docs);
                                  
                                  fs.writeFileSync(`storage/${Config.id}.json`, json);
                              
                                  return permsupr.flags
                            ? interaction.update(
                                poster?.removed
                                    ? embedErrorDeleted
                                    : embedSuccessDelete((
                                        poster.removed = true,
                                        poster
                                    ), author, client)
                            )
                            : interaction.reply(embedErrorMissingPermission);
                              }
                              }

                    case "edit": {
                        let id = parseInt(values[2]);
                        let poster = fuse._docs[id];

                        return author.flag
                            ? interaction.showModal(
                                poster?.removed
                                    ? embedErrorDeleted
                                    : modalEdit(poster)
                            )
                            : interaction.reply(embedErrorMissingPermission);
                    }

                    case "ResponseReport": {
                        let modal = new Modal()
                            .setCustomId("modal_ReportStaff")
                            .setTitle("Menu de réponse")


                        let response = new TextInputComponent()
                            .setCustomId("responseReport")
                            .setLabel("Ta réponse")
                            .setRequired(true)
                            .setMaxLength(700)
                            .setMinLength(2)
                            .setPlaceholder("Exemple : Le lien fonctionne de nouveau !")
                            .setStyle("SHORT")

                        const actionrow = new MessageActionRow().addComponents(response)
                        modal.addComponents(actionrow)
                        return interaction.showModal(modal)
                    }
                    case "search":
                        return interaction.showModal(modalSearch);

                    case "suggest":
                        return interaction.showModal(modalSuggest);

                    case "report":
                        return interaction.showModal(modalReport);

                    case "list":
                        let Menu = new MessageSelectMenu()
                            .setCustomId("menuType")
                            .setMaxValues(1)
                            .setMinValues(1)
                            .addOptions([
                                {
                                    label: "・Film",
                                    description: "-> Ouvre le catalogue des films",
                                    value: "Vfilm",
                                    emoji: "🎥"
                                },
                                {
                                    label: "・Série",
                                    description: "-> Ouvre le catalogue des séries",
                                    value: "Vserie",
                                    emoji: "🎞️"
                                },
                                {
                                    label: "・Anime",
                                    description: "-> Ouvre le catalogue des animés",
                                    value: "Vanime",
                                    emoji: "⭐"
                                }
                            ])
                            .setPlaceholder("Choisis le type de film que tu veux 😎")

                        let row = new MessageActionRow().addComponents(Menu)

                        let embed = new MessageEmbed()
                            .setDescription(`📌・Veuillez choisir le type de film que vous voulez voir !`)

                        return interaction.reply({ ephemeral: true, embeds: [embed], components: [row] })

                    case "nopub":
                        let embedLookNoPub = new MessageEmbed()
                            .setColor("#000000")
                            .setDescription(`**・ Il vous suffit de creér un compte sur** [Uqload](https://uqload.co/)\n**・ Une fois votre compte creé, vous n'aurez plus aucune pub**\n**・ Se connecter, et profitez de vos films et séries !**\n**・ Mettre un compte Paypal à l'incription est facultatif**`)
                            .setTitle(`🍿 ・ Comment regarder des films et séries sans pub ?`)

                        return interaction.reply({ ephemeral: true, embeds: [embedLookNoPub] })

                    case "Accepter": {
                        let IdMembre = interaction.message.embeds[0].author.name
                        let TitreFilm = interaction.message.embeds[0].fields[0].value
                        let salonSug = interaction.guild.channels.cache.get(Config.IDSug)

                        if (!salonSug) return interaction.reply({ ephemeral: true, content: `Il n'existe pas de salon suggestion !` })

                        let embedRepMembre = new MessageEmbed()
                            .setTitle(`🍿・Suggestion accepté !`)
                            .setDescription(`Ta suggestion a été traitée par : **${interaction.user.username}** !`)
                            .addFields(
                                { name: `Titre :`, value: `\`${TitreFilm}\`` },
                                { name: `Message du créateur :`, value: `\`Bon visionnage !\`` })
                            .setColor("GREEN")


                        if (permsupr.flags) {
                            await salonSug.send({ content: `||<@!${IdMembre}>||`, embeds: [embedRepMembre] })

                            return interaction.update({
                                components: [{
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            style: Resolver.resolveButtonStyle("SUCCESS"),
                                            emoji: "🎉",
                                            label: "Suggestion accepté !",
                                            custom_id: "toz",
                                            disabled: true
                                        },
                                    ]
                                }]
                            })
                        } else return interaction.reply(embedErrorMissingPermission);


                    }

                    case "Refuser": {
                        let IdMembre = interaction.message.embeds[0].author.name
                        let TitreFilm = interaction.message.embeds[0].fields[0].value
                        let salonSug = interaction.guild.channels.cache.get(Config.IDSug)

                        if (!salonSug) return interaction.reply({ ephemeral: true, content: `Il n'existe pas de salon suggestion !` })

                        let embedRepMembre = new MessageEmbed()
                            .setTitle(`🥤・Suggestion déjà sur le bot !`)
                            .setDescription(`Ta suggestion a été traitée par : **${interaction.user.username}** !`)
                            .addFields(
                                { name: `Titre :`, value: `\`${TitreFilm}\`` },
                                { name: `Message du créateur :`, value: `\`Merci de vérifier !\`` })
                            .setColor("DARK_GREEN")

                        if (permsupr.flags) {
                            await salonSug.send({ content: `||<@!${IdMembre}>||`, embeds: [embedRepMembre] })

                            return interaction.update({
                                components: [{
                                    type: 1,
                                    components: [
                                        {
                                            type: 2,
                                            style: Resolver.resolveButtonStyle("DANGER"),
                                            emoji: "❌",
                                            label: "Suggestion refusée !",
                                            custom_id: "toz",
                                            disabled: true
                                        },
                                    ]
                                }]
                            })
                        } else return interaction.reply(embedErrorMissingPermission);
                    }

                    case "suggestion":
                        return interaction.showModal(modalSuggest);

                    default:
                        return;
                }
            }

            case "menuType": {

                let Menu = new MessageSelectMenu()
                    .setCustomId("menuType")
                    .setMaxValues(1)
                    .setMinValues(1)
                    .addOptions([
                        {
                            label: "・Film",
                            description: "-> Ouvre le catalogue des films",
                            value: "Vfilm",
                            emoji: "🎥"
                        },
                        {
                            label: "・Série",
                            description: "-> Ouvre le catalogue des séries",
                            value: "Vserie",
                            emoji: "🎞️"
                        },
                        {
                            label: "・Anime",
                            description: "-> Ouvre le catalogue des animés",
                            value: "Vanime",
                            emoji: "⭐"
                        }
                    ])
                    .setPlaceholder("Choisis ce que tu veux voir 😎")

                let row = new MessageActionRow().addComponents(Menu)

                await interaction.update({ components: [row] })

                switch (interaction.values[0]) {
                    case "Vfilm": {
                        const bdd = fs.readFileSync(`storage/${Config.id}.json`)
                        let NewBdd = JSON.parse(bdd)
                        NewBdd = NewBdd.filter(e => e.category === "Film")


                        let nameFilm = []
                        for (let index = 0; index < NewBdd.length; index++) {
                            nameFilm.push({ name: NewBdd[index].title })

                        }

                        let test = await Alpabet(NewBdd)

                        let name = []
                        for (let index = 0; index < test.length; index++) {
                            name.push(test[index].name)

                        }

                        let embed = [
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(0, 1000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(1000, 2000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(2000, 3000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(3000, 4000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(4000, 5000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(5000, 6000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(6000, 7000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(7000, 8000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(8000, 9000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(9000, 10000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(10000, 11000) || "*Page vide*"}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(11000, 12000) || "*Page vide*"}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des films`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(12000, 13000) || "*Page vide*"}`)
                                .setColor("GREY"),           
                        ]


                        sendPaginatedEmbeds(interaction, embed)



                        return
                    }

                    case "Vserie": {
                        const bdd = fs.readFileSync(`storage/${Config.id}.json`)
                        let NewBdd = JSON.parse(bdd)
                        NewBdd = NewBdd.filter(e => e.category === "Série")


                        let nameSerie = []
                        for (let index = 0; index < NewBdd.length; index++) {
                            nameSerie.push({ name: NewBdd[index].title })

                        }

                        let test = await Alpabet(NewBdd)

                        let name = []
                        for (let index = 0; index < test.length; index++) {
                            name.push(test[index].name)

                        }

                        let embed = [
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(0, 1000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(1000, 2000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(2000, 3000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(3000, 4000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(4000, 5000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(5000, 6000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(6000, 7000) || "*Page vide*"}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(7000, 8000) || "*Page vide*"}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(8000, 9000) || "*Page vide*"}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(9000, 10000) || "*Page vide*"}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des séries`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(10000, 11000) || "*Page vide*"}`)
                                .setColor("GREY"),
                        ]

                        sendPaginatedEmbeds(interaction, embed)



                        return
                    }

                    case "Vanime": {
                        const bdd = fs.readFileSync(`storage/${Config.id}.json`)
                        let NewBdd = JSON.parse(bdd)
                        NewBdd = NewBdd.filter(e => e.category === "Anime")


                        let nameAnime = []
                        for (let index = 0; index < NewBdd.length; index++) {
                            nameAnime.push({ name: NewBdd[index].title })

                        }

                        let test = await Alpabet(NewBdd)

                        let name = []
                        for (let index = 0; index < test.length; index++) {
                            name.push(test[index].name)

                        }

                        let embed = [
                            new MessageEmbed()
                                .setTitle(`Catalogue des animés`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(0, 1000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des animés`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(1000, 2000)}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des animés`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(2000, 3000) || "*Page vide*"}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des animés`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(3000, 4000) || "*Page vide*"}`)
                                .setColor("GREY"),
                            new MessageEmbed()
                                .setTitle(`Catalogue des animés`)
                                .setDescription(`‎- ${name.join("\n‎- ").substring(4000, 5000) || "*Page vide*"}`)
                                .setColor("GREY"),
                                
                        ]
                        sendPaginatedEmbeds(interaction, embed)

                        return

                    }
                }
            }
        }
    }
});


//////////////////////////////////////
//             PROCESS              //
//////////////////////////////////////


process.on("uncaughtException", function (exception, reason) {
   console.log(exception)
});


process.on("SIGINT", function () {

    // Save on exit.
    let docs = fuse._docs.filter(doc => !doc.removed);
    let json = JSON.stringify(docs);

    fs.writeFileSync(`storage/${Config.id}.json`, json);

    // Exit process.
    process.exit();
});


///////////////////////////////////////////
//  MAIN
///////////////////////////////////////////


client.login(Config.token);

///////////////////////////////////////////
//  FUNCTION
///////////////////////////////////////////

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Default to half an hour.
const defaultTime = 1800000;
/**
 * Sends a paginated message from the given embeds.
 * @param interaction The interaction to reply to.
 * @param embeds The array of embeds to use.
 */
function sendPaginatedEmbeds(interaction, embeds, options) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        let currentPage = 0;
        // Precheck
        // if (interaction instanceof discord_js_1.Interaction && interaction.replied) {
        //     throw new Error('Cannot paginate when interaction is already replied to.');
        // }
        const generateOptionsForPage = (page) => {
            var _a, _b, _c, _d, _e;
            const beginning = page === 0;
            const end = page === embeds.length - 1;
            const currentEmbed = embeds[page];
            const buttonStyle = (_a = options === null || options === void 0 ? void 0 : options.style) !== null && _a !== void 0 ? _a : 'PRIMARY';
            if (!currentEmbed) {
                throw new Error('Embed page number out of bounds');
            }

            const nextButton = new discord_js_1.MessageButton()
                .setCustomId('nextButton')
                .setEmoji("▶️")
                .setLabel((_b = options === null || options === void 0 ? void 0 : options.nextLabel) !== null && _b !== void 0 ? _b : 'Suivant')
                .setStyle(buttonStyle);
            if (end) {
                nextButton.disabled = true;
            }
            const previousButton = new discord_js_1.MessageButton()
                .setCustomId('previousButton')
                .setEmoji("◀️")
                .setLabel((_c = options === null || options === void 0 ? void 0 : options.previousLabel) !== null && _c !== void 0 ? _c : 'Précédent')
                .setStyle(buttonStyle);
            if (beginning) {
                previousButton.disabled = true;
            }
            const row = new discord_js_1.MessageActionRow().addComponents([
                previousButton,
                nextButton,
            ]);

            if (((_d = options === null || options === void 0 ? void 0 : options.showPagePosition) !== null && _d !== void 0 ? _d : true) === true) {
                currentEmbed.setFooter({
                    text: `${(_e = options === null || options === void 0 ? void 0 : options.pageLabel) !== null && _e !== void 0 ? _e : 'Page'} ${currentPage + 1} / ${embeds.length}`,
                });
            }
            return {
                ephemeral: true,
                embeds: [currentEmbed],
                components: [row],
            };
        };
        const messageOptions = generateOptionsForPage(0);
        let message;
        if (interaction instanceof discord_js_1.Interaction) {
            message = interaction.deferred
                ? (yield interaction.followUp(Object.assign(Object.assign({}, messageOptions), { fetchReply: true, content: options === null || options === void 0 ? void 0 : options.content })))
                : (yield interaction.followUp(Object.assign(Object.assign({}, messageOptions), { fetchReply: true, content: options === null || options === void 0 ? void 0 : options.content })));
        }
        else {
            message = yield interaction.channel.send(Object.assign(Object.assign({}, messageOptions), { content: options === null || options === void 0 ? void 0 : options.content }));
        }
        const collector = message.createMessageComponentCollector({
            componentType: 'BUTTON',
            time: (_a = options === null || options === void 0 ? void 0 : options.time) !== null && _a !== void 0 ? _a : defaultTime,
        });
        collector.on('collect', (collectInteraction) => __awaiter(this, void 0, void 0, function* () {
            yield collectInteraction.deferUpdate();
            if (!collectInteraction.isButton()) {
                return;
            }
            if (collectInteraction.customId === 'nextButton') {
                currentPage++;
            }

            else if (collectInteraction.customId === 'previousButton') {
                currentPage--;
            }
            else {
                currentPage--;
            }
            const replyOptions = generateOptionsForPage(currentPage);
            yield collectInteraction.editReply(replyOptions);
        }));
        collector.on('end', () => __awaiter(this, void 0, void 0, function* () {
            if (!message.editable) {
                return;
            }
            // remove footer if enabled
            if ((options === null || options === void 0 ? void 0 : options.showPagePosition) === undefined ||
                (options === null || options === void 0 ? void 0 : options.showPagePosition) === true) {
                const [embed] = message.embeds;
                if (embed) {
                    embed.footer = null;
                    yield message.edit({ ephemeral: true, components: [], embeds: [embed] });
                    return;
                }
            }
            yield message.edit({ ephemeral: true, components: [] });
        }));
        return message;
    });
}

function Alpabet(data) {

    var name = []
    for (let index = 0; index < data.length; index++) {
        name.push({ name: data[index].title, id: data[index].id })
    }
    let result = name.sort((a, b) =>
        a.name.localeCompare(b.name));
    // console.log(result)
    return result;
}
