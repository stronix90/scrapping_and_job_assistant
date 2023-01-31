const xl = require("excel4node");

//Write Data in Excel file
const createExcel = (data, outputPath) => {
    const wb = new xl.Workbook();
    const ws = wb.addWorksheet("Worksheet Name");

    // Write column title in Excel file
    let rowIndex = 1;
    let columnIndex = 1;

    Object.keys(data[0]).forEach((columnName) => {
        ws.cell(rowIndex, columnIndex++).string(columnName);
    });

    // White data
    rowIndex = 2;
    data.forEach((record) => {
        let columnIndex = 1;
        Object.keys(record).forEach((columnName) => {
            ws.cell(rowIndex, columnIndex++).string(record[columnName]);
        });
        rowIndex++;
    });
    wb.write(outputPath);
    console.log("File created");
};

module.exports = createExcel;
