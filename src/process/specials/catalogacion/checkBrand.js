const prepareEmail = require("../../../auxiliar/prepareEmail");
const sendEmail = require("../../../auxiliar/sendEmail");
const { fieldsObj } = require("../../../types/fieldsTypes");

function checkBrand(requests) {

    // Parameterize request brands
    const requestsWithBrand = []

    requests.forEach(request => {
        const requestId = request["id"]
        const brands = request[fieldsObj.marcas]
        brands.split("\n").forEach(brandWithRF => {

            if (brandWithRF === "-") return

            const [brand, ...RF] = brandWithRF.split(":")
            const RFString = RF.join("").trim()
            requestsWithBrand.push({
                request: requestId,
                brand: brand,
                RF: RFString
            })
        })
    })

    // Check for duplicated RF or empty RF
    const dataForEmail = []

    requestsWithBrand.forEach(requestWithBrand => {
        if (requestWithBrand.RF === "") {
            dataForEmail.push({ ...requestWithBrand, message: "RF vacío" })
        }
        else {
            const currentRF = requestWithBrand.RF
            const currentID = requestWithBrand.request

            const requestsWithSameRF = requestsWithBrand.filter(requestWithBrand => requestWithBrand.RF === currentRF && requestWithBrand.request !== currentID)
            if (requestsWithSameRF.length > 0) {
                dataForEmail.push({ ...requestWithBrand, message: `Misma RF ${requestsWithSameRF.map(req => req.request).join(" - ")}` })
            }
        }
    })

    // Sort by RF and prepare email
    dataForEmail.sort((a, b) => a.RF > b.RF ? 1 : -1)
    const dataForEmailHTML = prepareEmail(dataForEmail.flat())

    sendEmail("brian.luna@trenesargentinos.gob.ar", "Solicitudes con MARCAS/RF llamativas", dataForEmailHTML)

    return null

}

module.exports = checkBrand