const CONFIG = require("../../../config");
const { createTableBasedOnObject, DBConnection } = require("../../../DB/manageDB");
const createExcel = require("../../../auxiliar/convertJSONtoExcel");
const checkPrice = require("./checkPrice");
const checkBrand = require("./checkBrand");


async function catalogacionProcess(requests, { path, fixedFileName }, firstRun) {

    // Subprocess, One execution per day
    if (firstRun) {
        checkBrand(requests)
    }

    // Insert special catalogación calculated data
    requests.map(request => {
        try {
            const mensajeCatalogacion = []
            mensajeCatalogacion.push(checkPrice(request))
            request.mensajeCatalogacion += mensajeCatalogacion.join(" | ")

        } catch (error) {
            console.log(error)
        }
        return null
    })



    // FIll the DB with the request data
    const DB = DBConnection();
    const KPI_RequestTable = await createTableBasedOnObject(DB, "KPIs", requests[0])
    await KPI_RequestTable.bulkCreate(requests);


    // Get just needed data from DB
    const requestsOutput = await DB.query(`
    SELECT
        CAST(id as varchar(10)) as Solicitud,
        code as Código,
        operationType as Tipo,
        state as Estado,
        user as Solicitante,
        daysDelay as 'Días demora',
        rol as Rol,
        description as 'Descripción',
        date as Fecha,
        Clave,
        'Descripción Ampliada',
        mensajeDensidad,
        mensajeCatalogacion
    FROM KPIs
    `);

    // Create Excel file
    const filepath = CONFIG.env.dev
        ? `./${fixedFileName}.xlsx`
        : `${path}/${fixedFileName}.xlsx`


    try {
        createExcel(requestsOutput[0], filepath);
    } catch (error) {
        console.log("*** EL ARCHIVO ESTÁ ABIERTO, NO SE PUDO GRABAR ***")
        console.log(error)
    }

}

module.exports = catalogacionProcess