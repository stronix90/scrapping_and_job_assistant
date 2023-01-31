const { diffDateToday, convUsToArDate } = require("../auxiliar/auxiliar");


async function getRequestInfo(page, config, solContainerId, i) {
    // Get data from Grid
    let gridData
    if (config.results.gridData) {
        const recordData = await page
            .locator(`#${solContainerId} > div`)
            .nth(i)
            .allInnerTexts();
        gridData = recordData.join("").split("\n\t\n");
    }


    // Extra data options (To use this is required to select the record)
    let extraData = {}
    if (config.results.detailsData?.enable) {
        await page.locator(`#${solContainerId} > div`).nth(i).click();                                          // Click on record to open more data

        if (config.results.detailsData?.rol) extraData.rol = await getRol(page)                                           // Get rol          

        if (config.results.detailsData?.fields) extraData.fields = await getDetailsInfo(page, config.results.detailsData?.fields)   // Get extra fields
    }


    // Generate record object
    return {
        id: gridData[0],
        code: gridData[4],
        operationType: gridData[3].substring(2, 100),
        state: gridData[2],
        user: gridData[1],
        daysDelay: diffDateToday(convUsToArDate(gridData[7])),
        rol: extraData?.rol,
        description: gridData[5],
        date: gridData[6],
        //"Fecha últ interacción": gridData[7],
        ...extraData?.fields,
    };
}

async function getRol(page) {
    let rol = "";

    try {
        // Hace click en buscador de rol actual
        await page
            .locator(".x-btn-text.icon_cadena_aprobacion")
            .nth(1)
            .click();

        try {
            // Obtiene el rol actual
            rol = await page
                .locator(
                    ".x-window.x-resizable-pinned table > tbody > tr > td > div"
                )
                .first()
                .innerText();
        } finally {
            // Cierra ventana
            await page.locator(".x-tool.x-tool-close").click();
            return rol
        }
    } catch (error) { }
}


async function getDetailsInfo(page, fields) {

    for (const property in fields) {

        // Datos anidados
        if (typeof (fields[property]) === "object") {
            const value = await page
                .locator(`tr:has(td:has-text('${property}')) td`)
                .nth(1)
                .innerText();

            const subFieldsRows = value.split("\n")
            const subFieldsFilter = fields[property]

            Object.keys(subFieldsFilter).forEach(filter => {

                let result = subFieldsRows.find(row => row.includes(filter))

                if (property === "Adicionales")
                    subFieldsFilter[filter] = result ? `${result.split(":")[1].trim()}` : ""
                else
                    subFieldsFilter[filter] = result ? `${property}.${result.split(":")[1].trim()}` : ""
            })

            fields = { ...fields, ...subFieldsFilter }
            delete fields[property]

        }

        // Datos sencillos
        else {
            const value = await page
                .locator(`tr:has(.TituloFila:has-text('${property}')) td`).nth(1).innerText()
            fields[property] = value
        }
    }
    return fields
}

module.exports = getRequestInfo