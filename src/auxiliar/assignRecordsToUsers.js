const { dirname } = require("path");
const appDir = dirname(require.main.filename)
const path = require("path");

const { writeJSONSync } = require("./manageJSONFile")

function assignRecordsTousers(records, userList, userFieldName = "user") {

    // Inicialización de variables
    const recordsCount = records.length
    const usersCount = userList.length

    const recordsPerUser = Math.floor(recordsCount / usersCount)
    const extras = recordsCount % usersCount
    let extrasPend = extras

    const userStartIndex = userList.findIndex(user => user.last === true) + 1

    const flatAssigned = []


    // Proceso
    for (let i = userStartIndex; i < usersCount + userStartIndex; i++) {
        const iMod = i % usersCount
        let qtyToAssign = recordsPerUser

        if (extras > 0 && extrasPend > 0) {
            qtyToAssign++

            extrasPend--
            if (extrasPend === 0) {
                userList.map(user => user.last = false)
                userList[iMod].last = true
            }
        }
        flatAssigned.push(...Array(qtyToAssign).fill(userList[iMod].name))
    }

    // Resultado
    records.map((record, index) => {
        record[userFieldName] = flatAssigned[index]
        return null
    })

    writeJSONSync(path.resolve("src/process/specials/warehouse/userList_data.json"), userList)
    return records
}

module.exports = assignRecordsTousers