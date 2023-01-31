const path = require("path");

const assignRecordsTousers = require("../../../auxiliar/assignRecordsToUsers");
const { readJSON } = require("../../../auxiliar/manageJSONFile");
const { DBConnection, createTableBasedOnObject } = require("../../../DB/manageDB");
const { AlmacenModel } = require("../../../DB/models");


async function assignWarehouseApprovers(requests) {
    const userFieldName = "warehouseUser"
    

    // Get User List
    const userList = await readJSON(path.resolve("src/process/specials/warehouse/userList_data.json"))


    // Connect to DB and define Almacenes Model
    const DB = DBConnection();
    const historicalWarehouseAssignmentsTable = AlmacenModel(DB)
    await historicalWarehouseAssignmentsTable.sync()


    // Get new records and load them into a table
    const warehouseRequests = requests.filter(
        (record) => record.rol === "ALMACENES"
    );
    const warehouseRequestTable = await createTableBasedOnObject(DB, "warehouseRequests", { ...warehouseRequests[0], [userFieldName]: '' })
    await warehouseRequestTable.bulkCreate(warehouseRequests);


    // Get records unassigned, assign them and update the table
    const unassignedWarehouseRequests = await DB.query(`
        SELECT new.id
        FROM warehouseRequests as new LEFT JOIN Almacenes as prev
        ON prev.id = new.id
        WHERE prev.${userFieldName} IS NULL
        `);

    const assignedWarehouseRequests = assignRecordsTousers(unassignedWarehouseRequests[0], userList, userFieldName)
    await historicalWarehouseAssignmentsTable.bulkCreate(
        assignedWarehouseRequests,
        { updateOnDuplicate: [userFieldName, "updatedAt"] }
    )


    // Get all new records
    const requestsOutput = await DB.query(`
        SELECT
            CAST(new.id as varchar(10)) as Solicitud,
            new.description as "Descripción",
            new.daysDelay as "Días demorada",
            new.mensajeDensidad as "Mensaje Vol y Peso",
            prev.${userFieldName} as "USUARIO",
            prev.updatedAt as "Fecha Asignación"
        FROM warehouseRequests as new LEFT JOIN Almacenes as prev
        ON prev.id = new.id
        GROUP BY new.id
    `);

    return requestsOutput[0]
}

module.exports = assignWarehouseApprovers