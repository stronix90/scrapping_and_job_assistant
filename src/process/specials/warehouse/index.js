const CONFIG = require("../../../config");
const assignWarehouseApprovers = require("./assignWarehouseApprovers")
const createExcel = require("../../../auxiliar/convertJSONtoExcel");
const prepareEmail = require("../../../auxiliar/prepareEmail");
const sendEmail = require("../../../auxiliar/sendEmail");
const { delay } = require("../../../auxiliar/auxiliar");


async function warehouseProcess(requests, { path }) {

    const assignedWarehouseApprovers = await assignWarehouseApprovers(requests)

    // Group by approvers
    const requestsGroupByApprovers = assignedWarehouseApprovers.reduce((group, request) => {
        const { USUARIO } = request;
        group[USUARIO] = group[USUARIO] ?? [];
        group[USUARIO].push(request);
        return group;
    }, {});


    // Send email to each approver
    console.log("Se van a enviar ", Object.keys(requestsGroupByApprovers).length, "email")

    for (const key in requestsGroupByApprovers) {
        if (requestsGroupByApprovers.hasOwnProperty(key)) {
            const solicitudes = requestsGroupByApprovers[key];

            solicitudes.sort((a, b) => b["Días demorada"] - a["Días demorada"])

            const html = prepareEmail(solicitudes)
            sendEmail("brian.luna@trenesargentinos.gob.ar", `Solicitudes de almacenes. ${key}`, html)

            console.log(`Email enviado a ${key}`)

            await delay(30000)
        }
    }

    
    // Create excel
    const filepath = CONFIG.env.dev
        ? `./almacenes.xlsx`
        : `${path}/almacenes.xlsx`

    createExcel(assignedWarehouseApprovers, filepath)

}

module.exports = warehouseProcess