///////////////////////////////////////////
//  MODAL : EDIT
///////////////////////////////////////////


export default function(poster) {
    return {
        title: "Menu d'éditation",
        custom_id: `modal_edit_${poster.id}`,
        components: [{
                type: 1,
                components: [{
                    type: 4,
                    custom_id: "title",
                    label: "🍿・Titre",
                    style: 1,
                    min_length: 1,
                    max_length: 64,
                    value: poster.title,
                    placeholder: "🍿・Nouveau titre ?",
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
                    value: poster.description,
                    placeholder: "✏️・Mettre les liens des films comme ceci []()",
                    required: true
                }]
            },
            {
                type: 1,
                components: [{
                    type: 4,
                    custom_id: "media",
                    label: "🖼️・Banner",
                    style: 1,
                    min_length: 1,
                    max_length: 255,
                    value: poster.media,
                    placeholder: "🖼️・Nouvelle image ?",
                    required: true
                }]
            },
            {
                type: 1,
                components: [{
                    type: 4,
                    custom_id: "category",
                    label: "🫀・Category",
                    style: 1,
                    min_length: 1,
                    max_length: 255,
                    value: poster.category,
                    placeholder: "🫀・Nouvelle catégorie ?",
                    required: true
                }]
            }
        ]
    };
}