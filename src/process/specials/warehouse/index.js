const CONFIG = require("../../../config");
const assignWarehouseApprovers = require("./assignWarehouseApprovers")
const createExcel = require("../../../auxiliar/convertJSONtoExcel");
const prepareEmail = require("../../../auxiliar/prepareEmail");
const sendEmail = require("../../../auxiliar/sendEmail");
const { delay, groupArrayByKey } = require("../../../auxiliar/auxiliar");
const { readJSON } = require("../../../auxiliar/manageJSONFile");
const path = require("path");


async function warehouseProcess(requests, { path: pathDestination }) {
    const userLists = await readJSON(path.resolve("src/process/specials/warehouse/userList_data.json"))

    // Assign approvers
    const assignedWarehouseApprovers = await assignWarehouseApprovers(requests)

    // Group by approvers
    const requestsGroupByApprovers = groupArrayByKey(assignedWarehouseApprovers, "USUARIO")

    // Enviar email
    sendEmailFromObject(requestsGroupByApprovers, userLists)

    // Create excel
    const filepath = CONFIG.env.dev
        ? `./almacenes.xlsx`
        : `${pathDestination}/almacenes.xlsx`

    try {
        createExcel(assignedWarehouseApprovers, filepath)

    } catch (error) {
        console.log("*** EL ARCHIVO ESTÁ ABIERTO, NO SE PUDO GRABAR ***")
        console.log(error)
    }

}

async function sendEmailFromObject(object, userListsEmail) {

    console.log("Se van a enviar ", Object.keys(object).length, "email")

    for (const username in object) {
        const solicitudes = object[username];
        const email = userListsEmail.find(user => user.name === username).email

        if (solicitudes.length > 0) {
            solicitudes
                .sort((a, b) => b["Días demorada"] - a["Días demorada"])
                .map(solicitud => {
                    const date = new Date(solicitud["Fecha Asignación"]).toLocaleDateString()
                    solicitud["Fecha Asignación"] = date
                })

            const html = prepareEmail(solicitudes)

            console.log(`Enviando email a ${username}`)
            sendEmail(email, `Solicitudes de almacenes. ${username}`, html)

            await delay(30000)
        }
    }
}

module.exports = warehouseProcess