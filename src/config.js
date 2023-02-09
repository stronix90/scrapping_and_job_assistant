require('dotenv').config()

const arguments = process.argv
const isDev = arguments[2]?.toLowerCase() === 'dev'
const useMock = arguments[3]?.toLowerCase() === 'mock'
const emailType = arguments[4]?.toLowerCase()

const CONFIG = {
    env: {
        dev: isDev,
        mock: useMock
    },
    system: {
        user: process.env.SYSTEM_USERNAME,
        password: process.env.SYSTEM_PASSWORD
    },
    email: {
        from: process.env.EMAIL_FROM,
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
        reply: process.env.EMAIL_REPLY,
        devReceiver: process.env.EMAIL_DEV_RECEIVER,
        type: emailType || "simulated"
    }
}

module.exports = CONFIG