const { chromium } = require("playwright");
const path = require("path");
const { delay } = require("../auxiliar/auxiliar");
const checkDensity = require("./specials/catalogacion/checkDensity");
const getRequestInfo = require("./getRecordData");
const warehouseProcess = require("./specials/warehouse");
const catalogacionProcess = require("./specials/catalogacion");
const CONFIG = require("./../config");
const { readJSON } = require("../auxiliar/manageJSONFile");
const DELAY_BEETWEEN_REQUESTS = 1200000;


const runGetDataFromTablero = async (config) => {
    const browser = await chromium.launch(config.browser.headless);
    let currentDate = new Date()
    let hora = currentDate.getHours()
    let day = currentDate.getDay() // 0 = domingo, 6 = sabado
    const response = await readJSON(path.resolve("src/temp.json"))
    let previusDay = new Date(response.warehousePreviousDays) || new Date("2000-1-1")


    do {

        const enabledToRun = CONFIG.env.dev
            ? true
            : (hora >= 6 && hora < 18) && day != 0 && day != 6

        if (enabledToRun) {

            // ** GET REQUESTS **
            const requests = CONFIG.env.mock
                ? require("../DB/mock/caño")
                : await mainProcess(browser, config)


            // ** GENERAL POST PROCESS **
            requests.map(request => {
                try {
                    request.mensajeDensidad = checkDensity(request)

                } catch (error) {
                    request.mensajeDensidad = "Contacte con soporte. No se pudo obtener los datos"
                    console.log(error.message, request.id)
                }
                return null
            })

            // ** SPECIAL POST PROCESS **

            // One execution per day
            if (currentDate.toLocaleDateString() != previusDay.toLocaleDateString()) {
                previusDay = currentDate
                warehouseProcess(requests, config.output.warehouse)
            }

            // Execute every loop
            catalogacionProcess(requests, config.output.catalogacion)

        }
        else {
            console.log(`Día y horario no operativo. ${new Date().toLocaleString()}`)
        }

        await delay(DELAY_BEETWEEN_REQUESTS)
        currentDate = new Date()
        hora = currentDate.getHours()
        day = currentDate.getDay() // 0 = domingo, 6 = sabado

    } while (true);
}


const mainProcess = async (browser, config) => {

    const page = await browser.newPage();
    await page.goto(config.browser.url);


    await page.fill("#User", config.session.user);
    await page.fill("#Passsword", config.session.password);
    await page.keyboard.press("Enter");

    await page.waitForSelector(".icon_logout", { timeout: 120000 });

    await page.locator(".x-tab-strip-text:has-text('Tablero')").click()

    // Open search options
    await page.locator(".x-tool.x-tool-expand-north").nth(1).click()


    // Filters
    if (config.filters.enable) {

        // Filtro por estado
        if (config.filters.estado) {
            await page.locator(".x-form-trigger.x-form-arrow-trigger").nth(4).click()                       // Show 'Estado' dropdown
            await page.locator(`.x-combo-list-item:has-text('${config.filters.estado}')`).click()                  // Select 'Estado' option
        }

        // Filtro de descripción
        if (config.filters.descripcion) {
            await page.locator(".x-form-text.x-form-field.x-box-item").nth(6).fill(config.filters.descripcion)     // Enter 'Descripción' value
        }

        // Filtro de CUIL
        if (config.filters.cuil) {
            await page.locator(".x-form-text.x-form-field.x-box-item").nth(7).fill(config.filters.cuil)            // Enter 'CUIL' value
        }

        await page.locator(".x-btn-text.icon_boton_buscar_filtro").nth(1).click()                           // Click on 'Buscar' button
    }



    const MAX_PAGES = config.results.maxPages || 15;
    for (let i = 0; i < MAX_PAGES; i++) {
        await page.locator(".x-btn-text.icon_more").nth(1).click();
    }

    // Get records container's id
    const solContainerId = await page
        .locator("div.x-grid3-body")
        .nth(1)
        .getAttribute("id");

    // Get record count
    const recordCount = await page.locator(`#${solContainerId} > div`).count();
    console.log(`Se van a procesar ${recordCount} registros`);

    await page.waitForTimeout(3000);
    const requests = [];


    // Bucle on records. Get all data
    console.time('recorrerBucle');

    for (let i = 0; i < recordCount; i++) {

        const requestInfo = await getRequestInfo(page, config, solContainerId, i)
        requests.push(requestInfo);

        console.log(`${i + 1} de ${recordCount} registros procesados`);
    }

    console.timeEnd('recorrerBucle')
    console.log("Proceso finalizado");

    page.close()

    return requests
}


module.exports = runGetDataFromTablero