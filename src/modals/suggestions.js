///////////////////////////////////////////
//  MODAL : Suggestions
///////////////////////////////////////////


export default {
    title: "Menu de Suggestion",
    custom_id: `modal_suggest`,
    components: [{
        type: 1,
        components: [{
            type: 4,
            custom_id: "stitle",
            label: "🍿・Titre :",
            style: 1,
            min_length: 1,
            max_length: 64,
            placeholder: "🍿・Titre du film/série/animé",
            required: true
        }]
    },
    {
        type: 1,
        components: [{
            type: 4,
            custom_id: "sgenre",
            label: "✏️・Genre :",
            style: 2,
            min_length: 1,
            max_length: 3000,
            placeholder: "✏️・Genre du film/série/animé",
            required: true
        }]
    },
    {
        type: 1,
        components: [{
            type: 4,
            custom_id: "sdate",
            label: "🫀・Date :",
            style: 1,
            min_length: 1,
            max_length: 255,
            placeholder: "🫀・Date de parution",
            required: true
        }]
    }
    ]
}