///////////////////////////////////////////
//  MODAL : CREATE
///////////////////////////////////////////


export default {
    title: "Menu de création",
    custom_id: "modal_create",
    components: [{
            type: 1,
            components: [{
                type: 4,
                custom_id: "title",
                label: "🍿・Titre",
                style: 1,
                min_length: 1,
                max_length: 64,
                placeholder: "🍿・Mettre le titre.",
                required: true
            }]
        },
        {
            type: 1,
            components: [{
                type: 4,
                custom_id: "description",
                label: "✏️・Description",
                style: 2,
                min_length: 1,
                max_length: 3000,
                placeholder: "✏️・Mettre les liens comme ceci []()",
                required: true
            }]
        },
        {
            type: 1,
            components: [{
                type: 4,
                custom_id: "banner",
                label: "🖼️・Image",
                style: 1,
                min_length: 1,
                max_length: 255,
                placeholder: "🖼️・Mettre le lien de l'image [4K]",
                required: true
            }]
        },
        {
            type: 1,
            components: [{
                type: 4,
                custom_id: "category",
                label: "🫀・Catégorie",
                style: 1,
                min_length: 1,
                max_length: 255,
                placeholder: "🫀・Mettre la catégorie Film/Série/Anime.",
                required: true
            }]
        }
    ]
}