const { dirname } = require("path");
const appDir = dirname(require.main.filename)
const path = require("path");

const { writeJSONSync, readJSON } = require("./manageJSONFile")

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

    let newPointer = ""

    for (let i = userStartIndex; i < usersCount + userStartIndex; i++) {
        const iMod = i % usersCount
        let qtyToAssign = recordsPerUser

        if (extras > 0 && extrasPend > 0) {
            qtyToAssign++

            extrasPend--

            // Get new pointer
            if (extrasPend === 0)
                newPointer = userList[iMod].name
        }
        flatAssigned.push(...Array(qtyToAssign).fill(userList[iMod].name))
    }

    // Resultado
    records.map((record, index) => {
        record[userFieldName] = flatAssigned[index]
        return null
    })

    // Update pointer in file
    // const userListResponse = await 

    if (newPointer !== "") {
        readJSON(path.resolve("src/process/specials/warehouse/userList_data.json"))
            .then(fileUserLists => {
                return fileUserLists.map(user => {
                    if (user.name === newPointer) {
                        return { ...user, last: true }
                    }
                    else {
                        return { ...user, last: false }
                    }
                })
            })
            .then(newFileUserLists =>
                writeJSONSync(path.resolve("src/process/specials/warehouse/userList_data.json"), newFileUserLists)
            )
    }



    return records
}

module.exports = assignRecordsTousers