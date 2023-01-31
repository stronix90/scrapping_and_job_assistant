const { DataTypes } = require("sequelize");

function AlmacenModel(DB) {
    return DB.define("Almacenes",
        {
            id:
            {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            warehouseUser: DataTypes.STRING,
        }
    )
}

module.exports = {AlmacenModel}