import Resolver from "../resolver.js";
import fs from "fs";
import Fuse from "fuse.js";
import Config from "../config.js";

///////////////////////////////////////////
//  EMBED : search_embed
///////////////////////////////////////////
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


export default {
    embeds: [{
        title: "🎥・Films Series Animes",
        description: `Les Films Series et Animes sont désormais disponibles sur le bot !\nNous comptons déja **${Liens}** Liens ajoutés !`,
        fields: [{
            name: '🔎・Comment rechercher un film un anime ou une serie ?',
            value: "Cliquez sur le bouton 🔎 ci-dessous pour trouver ce que vous souhaitez.\nPour voir la liste : <#1084522469949440151>",
            inline: false,
        },
        {
            name: "⭕・Un Probleme ?",
            value: 'Allez dans le salon <#1084904086215860235> !',
            inline: false,
        },
        {            
            name: "💶・Comment nous soutenir ?",
            value: 'Allez dans le salon <#1092209578978058320> !',
            inline: false,
        },
        ],

        color: "#d41010",
        custom_id: "searchEmbed",
    }],
    components: [{
        type: 1,
        components: [
            {
            type: 2,
            style: Resolver.resolveButtonStyle("DANGER"),
            emoji: "🔎",
            label: "Recherche",
            custom_id: "button_search"
        },
        {
            type: 2,
            style: Resolver.resolveButtonStyle("SECONDARY"),
            emoji: "⭕",
            label: "Enlever pub",
            custom_id: "button_nopub"
        },
        {
            type: 2,
            style: Resolver.resolveButtonStyle("SUCCESS"),
            emoji: "💡",
            label: "Faire une suggestion",
            custom_id: "button_suggestion"
        }
        ]
    }]
}