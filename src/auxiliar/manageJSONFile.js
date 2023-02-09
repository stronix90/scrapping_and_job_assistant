const fs = require("fs-extra");

async function readJSON(file) {
    return await fs.readJSON(file)
}

async function writeJSON(file, data) {
    return await fs.writeJSON(file, data)
}

function writeJSONSync(file, data) {
    return fs.writeJSONSync(file, data)
}

async function updateJsonFilePointer(jsonFile, field, pointer) {

    const records = await readJSON(jsonFile)

    const recordsWithPointerUpdated = records.map(record => {

        if (record[field] === pointer)
            return { ...record, last: true }
        else
            return { ...record, last: false }
    })

    await writeJSON(jsonFile, recordsWithPointerUpdated)
}


module.exports = { readJSON, writeJSON, writeJSONSync, updateJsonFilePointer }