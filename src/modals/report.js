
///////////////////////////////////////////
//  MODAL : CREATE
///////////////////////////////////////////


export default {
    title: "Menu de Report",
    custom_id: "modal_report",
    components: [{
        type: 1,
        components: [{
            type: 4,
            custom_id: "rtitle",
            label: "🍿・Titre du film ou série :",
            style: 1,
            min_length: 1,
            max_length: 64,
            placeholder: "🍿・Veuiller mettre le titre ",
            required: true
        }]
    },
    {
        type: 1,
        components: [{
            type: 4,
            custom_id: "rdescription",
            label: "✏️・Description :",
            style: 2,
            min_length: 1,
            max_length: 3000,
            placeholder: "✏️・Veuillez mettre le problème.",
            required: true
        }]
    }
    ]
}