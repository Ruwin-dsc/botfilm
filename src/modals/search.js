///////////////////////////////////////////
//  MODAL : CREATE
///////////////////////////////////////////


export default {
    title: "Menu de recherche",
    custom_id: "modal_search",
    components: [{
        type: 1,
        components: [{
            type: 4,
            custom_id: "title",
            label: "🍿・Titre :",
            style: 1,
            min_length: 1,
            max_length: 64,
            placeholder: "🍿・Entrez le titre de votre film/serie/anime.",
            required: true
        }]
    }]
}