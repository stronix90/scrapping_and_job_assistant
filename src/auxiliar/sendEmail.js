const nodeoutlook = require('nodejs-nodemailer-outlook');
const CONFIG = require('../config');

const sendEmail = async (to, subject, data) => {
    nodeoutlook.sendEmail({
        auth: {
            user: CONFIG.email.user,
            pass: CONFIG.email.pass
        },
        from: CONFIG.email.from,
        to: to,
        cc: "brian.luna@trenesargentinos.gob.ar",
        subject: subject,
        html: JSON.stringify(data),
        replyTo: CONFIG.email.reply,
        onError: (e) => console.error(e),
        onSuccess: (i) => console.info(i)
    });
}

module.exports = sendEmail