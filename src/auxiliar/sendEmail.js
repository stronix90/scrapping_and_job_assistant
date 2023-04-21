const nodeoutlook = require('nodejs-nodemailer-outlook');
const CONFIG = require('../config');

const sendEmail = async (to, subject, data) => {

    if (CONFIG.email.type === "simulated") {
        console.log("Email simulado a ", to, " con el asunto ", subject, " y el contenido ", data)
        return
    }
    else if (CONFIG.email.type === "devreceiver") {
        subject += " - Receptor original: " + to
        to = CONFIG.email.devReceiver
    }

    else if (CONFIG.email.type === "real") {
        console.log("Enviando email a ", to)
    }

    else {
        console.log("Tipo de procesamiento de email incorrecto. No se enviará")
        return
    }

    nodeoutlook.sendEmail({
        auth: {
            user: CONFIG.email.user,
            pass: CONFIG.email.pass
        },
        from: CONFIG.email.from,
        to: to,
        cc: "brian.luna@trenesargentinos.gob.ar; ivan.lucero@trenesargentinos.gob.ar ; luz.cardenas@trenesargentinos.gob.ar",
        subject: subject,
        html: JSON.stringify(data),
        replyTo: CONFIG.email.reply,
        onError: (e) => {
            console.log("Error al enviar email")
            console.error(e)
            console.log("Error al enviar email")
        },
    });
}

module.exports = sendEmail