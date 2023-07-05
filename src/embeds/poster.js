import Resolver from "../resolver.js";
import Index from "../index.js";

///////////////////////////////////////////
//  UTILS
///////////////////////////////////////////


const REGEX_LINK = /^https?:\/\/([^\/]+)/;


///////////////////////////////////////////
//  EMBED : POSTER
///////////////////////////////////////////


export default function (author, poster) {
    let url = REGEX_LINK.test(poster.media) ? poster.media : null;
    let components = [{
        type: 2,
        style: Resolver.resolveButtonStyle("SUCCESS"),
        label: "🩸・Report",
        custom_id: "button_report",
        disabled: false
        },
        {
            type: 2,
            style: Resolver.resolveButtonStyle("SECONDARY"),
            emoji: "⭕",
            label: "Enlever pub",
            custom_id: "button_nopub"
    }];

    // Check host permissions.
    author.flag && components.push({
        type: 2,
        style: Resolver.resolveButtonStyle("SECONDARY"),
        label: "✏️・Editez le film ou série",
        custom_id: `button_edit_${poster.id}`
    }, {
        type: 2,
        style: Resolver.resolveButtonStyle("DANGER"),
        label: "❌・Supprimez le film ou série",
        custom_id: `button_delete_${poster.id}`
    });

    return {
        ephemeral: true,
        embeds: [{
            title: poster.title,
            description: poster.description,
            color: "#d41010",
            image: { url }
        }],
        components: [{
            type: 1,
            components
        }]
    };
}