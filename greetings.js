const greeting = {
    "en": "Hello",
    "fr": "Bonjour",
    "hi": "Namaste",
    "es": "Hola"
}

export const handler = async(event) => {
    let name = event.pathParameters.name;
    let { lang, ...info } = event.queryStringParameters;
    let message = `${greeting[lang]? greeting[lang] : greeting['en']} ${name}`
};
