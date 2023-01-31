const { DBConnection } = require("./src/DB/manageDB");
const { AlmacenModel } = require("./src/DB/models");

const historicoAlmacenes = require("./csvjson")

const loadData = async () => {
    const DB = DBConnection();
    const historicalWarehouseAssignmentsTable = AlmacenModel(DB)
    await historicalWarehouseAssignmentsTable.sync()

    historicalWarehouseAssignmentsTable.bulkCreate(
        historicoAlmacenes,
        { updateOnDuplicate: ["warehouseUser", "updatedAt"] }
    )
}

loadData()