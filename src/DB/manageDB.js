const { Sequelize, DataTypes } = require("sequelize");
const { dirname } = require("path");
const path = require("path");


function DBConnection() {
    return new Sequelize({
        dialect: "sqlite",
        storage: path.resolve("src/DB/KPI.sqlite"),
    });
}


async function createTableBasedOnObject(DB, tableName, data) {

    // Create model based on data
    let model = {}

    for (key in data) {
        if (key === "id") {
            model[key] = {
                type: DataTypes.INTEGER,
                primaryKey: true,
            }
        }
        else {
            model[key] = DataTypes.STRING
        }
    }

    const table = DB.define(tableName, model)
    await table.sync({ force: true })
    return table
}

module.exports = { DBConnection, createTableBasedOnObject }