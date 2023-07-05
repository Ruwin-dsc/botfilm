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
        description: `>  \`・\` **${Liens}** Liens sont disponibles actuellement\n>  \`・\` Rendez vous dans le salon <#1084522477738274886>`,
        color: "#d41010",
        custom_id: "embedRecherche",
    }],
    components: [
        {
            type: 1,
            components: [{
                type: 2,
                style: Resolver.resolveButtonStyle("PRIMARY"),
                label: "📰",
                custom_id: "button_list"
            }
            ]
        }
    ]
}