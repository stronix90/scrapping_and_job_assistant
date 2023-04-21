const nodeoutlook = require('nodejs-nodemailer-outlook');

nodeoutlook.sendEmail({
    auth: {
        user: "luna.trenes@outlook.com",
        pass: "Clave0822."
    },
    from: "Brian Luna <luna.trenes@outlook.com>",
    cc: "www.correo.com@gmail.com; brian.luna@trenesargentinos.gob.ar",
    subject: "Holasss",
    html: "Hola!!!",
    onError: (e) => {
        console.log("Error al enviar email")
        console.error(e)
        console.log("Error al enviar email")
    },
});