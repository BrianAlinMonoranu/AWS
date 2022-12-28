const greeting = {
    en: "Hello",
    fr: "Bonjour",
    hi: "Namaste",
    es: "Hola",
};

//async means that everything else can also be running while this function runs
export const handler = async(event) => {
    let name = event.pathParameters.name;
    let { lang, ...info } = event.queryStringParameters;
    let message = `${greeting[lang] ? greeting[lang] : greeting["en"]} ${name}`;
    let response = {
        message: message,
        info: info,
    };

    //This is for good HTTP response instead of just returning response
    return {
        statusCode: 200,
        body: JSON.stringify(response),
    };
};
