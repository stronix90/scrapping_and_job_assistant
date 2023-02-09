function assignRecordsTousers(records, userList, userFieldName = "user") {

    // Inicialización de variables
    const recordsCount = records.length
    const usersCount = userList.length

    const recordsPerUser = Math.floor(recordsCount / usersCount)
    const extras = recordsCount % usersCount
    let extrasPend = extras

    const userStartIndex = userList.findIndex(user => user.last === true) + 1

    const flatAssigned = []

    let newPointer = ""


    // Recorre lista de usuarios y establece la cantidad de registros a asignar a cada uno
    for (let i = userStartIndex; i < usersCount + userStartIndex; i++) {
        const iMod = i % usersCount
        let recordsForCurrentUser = recordsPerUser

        if (extras > 0 && extrasPend > 0) {
            extrasPend--
            recordsForCurrentUser++


            // Get new pointer
            if (extrasPend === 0)
                newPointer = userList[iMod].name
        }
        flatAssigned.push(...Array(recordsForCurrentUser).fill(userList[iMod].name))
    }

    // Recorre lista de registros y asigna el usuario correspondiente
    records.map((record, index) => {
        record[userFieldName] = flatAssigned[index]
        return null
    })

    return { records, newPointer }
}

module.exports = assignRecordsTousers