const fs = require("fs-extra");

async function readJSON (file) {
    return await fs.readJSON(file)
}

async function writeJSON (file, data) {
    return await fs.writeJSON(file, data)
}

function writeJSONSync (file, data) {
    return fs.writeJSONSync(file, data)
}


module.exports = { readJSON, writeJSON, writeJSONSync }