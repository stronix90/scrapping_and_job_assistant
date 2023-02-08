const CONFIG = require("../../../config");
const assignWarehouseApprovers = require("./assignWarehouseApprovers")
const createExcel = require("../../../auxiliar/convertJSONtoExcel");
const prepareEmail = require("../../../auxiliar/prepareEmail");
const sendEmail = require("../../../auxiliar/sendEmail");
const { delay } = require("../../../auxiliar/auxiliar");


async function warehouseProcess(requests, { path }) {

    // const userEmail = {
    //     "Varela": "brian.luna@trenesargentinos.gob.ar",
    //     "De Luca": "brian.luna@trenesargentinos.gob.ar",
    //     "Gonzalez": "brian.luna@trenesargentinos.gob.ar",
    //     "Gianoli": "brian.luna@trenesargentinos.gob.ar",
    //     "Damelli": "brian.luna@trenesargentinos.gob.ar",
    //     "Gomez": "brian.luna@trenesargentinos.gob.ar",
    //     "Alcaraz": "brian.luna@trenesargentinos.gob.ar",
    //     "Rocha": "brian.luna@trenesargentinos.gob.ar"
    // }
    const userEmail = {
        "Varela": "sebastian.varela@trenesargentinos.gob.ar",
        "De Luca": "ezequiel.deluca@trenesargentinos.gob.ar",
        "Gonzalez": "oscarsergio.gonzalez@trenesargentinos.gob.ar",
        "Gianoli": "vanesa.gianoli@trenesargentinos.gob.ar",
        "Damelli": "ezequiel.damelli@trenesargentinos.gob.ar",
        "Gomez": "marcelo.gomez@trenesargentinos.gob.ar",
        "Alcaraz": "gaston.alcaraz@trenesargentinos.gob.ar",
        "Rocha": "hernan.rocha@trenesargentinos.gob.ar"
    }

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



            if (solicitudes.length > 0) {
                solicitudes
                    .sort((a, b) => b["Días demorada"] - a["Días demorada"])
                    .map(solicitud => {
                        const date = new Date(solicitud["Fecha Asignación"]).toLocaleDateString()
                        solicitud["Fecha Asignación"] = date
                    })

                const html = prepareEmail(solicitudes)
                sendEmail(userEmail[key], `Solicitudes de almacenes. ${key}`, html)

                console.log(`Email enviado a ${key}`)

                await delay(30000)
            }


        }
    }


    // Create excel
    const filepath = CONFIG.env.dev
        ? `./almacenes.xlsx`
        : `${path}/almacenes.xlsx`

    try {
        createExcel(assignedWarehouseApprovers, filepath)

    } catch (error) {
        console.log("*** EL ARCHIVO ESTÁ ABIERTO, NO SE PUDO GRABAR ***")
        console.log(error)
    }

}

module.exports = warehouseProcess