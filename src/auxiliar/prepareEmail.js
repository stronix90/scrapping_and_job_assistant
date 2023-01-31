const prepareEmail = (data) => {

    // Open table
    let htmlOutput = `<table style='font-family: Arial, Helvetica, sans-serif; border-collapse: collapse; width: 100%;'>`

    // Write column title in Table
    htmlOutput += `<tr>`;
    Object.keys(data[0]).forEach((columnName) => {
        htmlOutput += `<th style='border: 1px solid #ddd; padding: 12px 8px; text-align: left; background-color: #04AA6D; color: white;'>${columnName}</th>`
    });
    htmlOutput += "</tr>";

    // White data
    data.forEach((record, index) => {
        htmlOutput += `<tr style='border: 1px solid #ddd; padding: 8px;${index % 2 === 0 ? 'background-color: #f2f2f2;' : ''}'>`

        Object.keys(record).forEach((columnName) => {
            htmlOutput += `<td style='border: 1px solid #ddd; padding: 8px;'>${record[columnName]}</td>`;
        });

        htmlOutput += "</tr>";
    });

    // Close table
    htmlOutput += `</table>`;

    return htmlOutput;
};

module.exports = prepareEmail;
