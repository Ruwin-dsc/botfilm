import Config from "../config.js";
import fs from "fs";
import Fuse from "fuse.js"
import Resolver from "../resolver.js";

const fuse = new Fuse(unserializeFromFile(), {
    includeScore: true,
    keys: [
        "title"
    ]
});

function unserializeFromFile() {
    let json = fs.readFileSync(`storage/${Config.id}.json`);
    let docs = JSON.parse(json);

    return docs.map((doc, i) => (doc.id = i, doc));
}

var listres = fuse._docs.map(function (a) { return a?.title }).sort().join("\n");

export default {
    ephemeral: true,
    embeds: [{
        color: "#d41010",
        description: `📌・Voici la liste des **liens disponibles** films et séries sur le serveur.\n\n${listres.substring(11600, 15400)}`,
    },],
    components: [{
        type: 1,
        components: [{
            type: 2,
            style: Resolver.resolveButtonStyle("SECONDARY"),
            label: "⏮️",
            custom_id: "button_suivantt"
        }]

    }

    ]
};