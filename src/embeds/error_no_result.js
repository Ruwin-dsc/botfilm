import Resolver from "../resolver.js";


///////////////////////////////////////////
//  EMBED : ERROR : NO RESULT
///////////////////////////////////////////


export default function (author, title) {
    return {
        ephemeral: true,
        embeds: [{
            title: "❌・Aucun Résultat !",
            description: `> 🎥・Aucun film ou série n'a été trouvé pour : \`${title}\``,
            color: "#d41010"
        }],
        components: author.flag ? [{
            type: 1,
            components: [{
                type: 2,
                style: Resolver.resolveButtonStyle("SUCCESS"),
                label: "🎥",
                custom_id: "button_create_new"
            },
            {
                type: 2,
                style: Resolver.resolveButtonStyle("SUCCESS"),
                emoji: "💡",
                label: "Faire une suggestion",
                custom_id: "button_suggestion"
            }
            ]
        }] : [{
            type: 1,
            components: [
                {
                    type: 2,
                    style: Resolver.resolveButtonStyle("SUCCESS"),
                    emoji: "💡",
                    label: "Faire une suggestion",
                    custom_id: "button_suggestion"
                }
            ]
        }]
    };
}