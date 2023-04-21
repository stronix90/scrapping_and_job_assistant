const { adicionalesObj } = require('../../../types/fieldsTypes')

function checkDensity({ [adicionalesObj._02_01_unidadMedidaBase]: UMB, "02.02. UNIDAD DE PESO": weightUnit, "02.03. PESO NETO": weight, "02.04. UN. DIMENSIÓN VOLUMÉTRICA": volumenUnit, "02.05. LARGO": length, "02.06. ANCHO": width, "02.07. ALTO": heigth }) {
    let weightMultiplier = 1

    if (typeof (UMB) === "undefined") throw new Error("No se ha encontrado la Key UNIDAD DE MEDIDA BASE")
    if (typeof (weightUnit) === "undefined") throw new Error("No se ha encontrado la Key PESO UNIDAD")
    if (typeof (weight) === "undefined") throw new Error("No se ha encontrado la Key PESO NETO")
    if (typeof (volumenUnit) === "undefined") throw new Error("No se ha encontrado la Key VOL UNIDAD")
    if (typeof (length) === "undefined") throw new Error("No se ha encontrado la Key LARGO")
    if (typeof (width) === "undefined") throw new Error("No se ha encontrado la Key ANCHO")
    if (typeof (heigth) === "undefined") throw new Error("No se ha encontrado la Key ALTO")


    // Normalice weight to KG
    switch (weightUnit) {
        case "GR - GRAMOS":
            weightMultiplier = .001
            break;

        case "KG - KILOGRAMOS":
            weightMultiplier = 1
            break;

        case "TON - TONELADAS":
            weightMultiplier = 1000
            break;

        default:
            throw new Error("La Key PESO UNIDAD no tiene un valor válido")
    }
    const weighKG = Number(weight * weightMultiplier)


    // Normalice volume to CM3
    switch (volumenUnit) {
        case "MM3 - MILIMETROS CUBICOS":
            length = Number(length / 10)
            width = Number(width / 10)
            heigth = Number(heigth / 10)
            break;

        case "CM3 - CENTIMETROS CUBICOS":
            length = Number(length)
            width = Number(width)
            heigth = Number(heigth)
            break;

        case "M3 - METROS CUBICOS":
            length = Number(length * 100)
            width = Number(width * 100)
            heigth = Number(heigth * 100)
            break;

        default:
            throw new Error * ("La Key VOL UNIDAD no tiene un valor válido")
    }
    const volumeCM3 = length * width * heigth

    // If UMB is Volumetric or Weight, then make some checks
    let mensaje = ""
    switch (UMB) {
        case "M - METROS":
            console.log(typeof length)
            if (!(length === 100 || width === 100 || heigth === 100))
                mensaje += "Al menos una medida debe ser de 1 Metro o su equivante"
            break;

        case "M2 - METROS CUADRADOS":
            if (!(length * width === 10000 || length * heigth === 10000 || width * heigth === 10000))
                mensaje += "Al menos dos medidas deben ser 1 Metro o su equivalente"
            break;

        case "M3 - METROS CUBICOS":
            if (!(length * width * heigth === 1000000))
                mensaje += "Las medidas deben ser 1 x 1 x 1 Metro"
            break;

        case "CM3 - CENTIMETROS CUBICOS":
            if (volumeCM3 !== 1)
                mensaje += "Las medidas deben ser 1 x 1 x 1 CM"
            break;

        case "LTS - LITROS":
            if (volumeCM3 !== 1000)
                mensaje += "Las medidas deben ser 10 x 10 x 10 CM"
            break;

        case "GR - GRAMOS":
            if (weighKG !== 0.001)
                mensaje += "El peso debe ser de 1 gramo"
            break;

        case "KG - KILOGRAMOS":
            if (weighKG !== 1)
                mensaje += "El peso debe ser de 1 kilogramo"
            break;

        case "TON - TONELADAS":
            if (weighKG !== 1000)
                mensaje += "El peso debe ser de 1 tonelada"
            break;

        default:
            break;
    }


    // Calculate density and compare
    const density = (weighKG * 1000) / volumeCM3

    if (density < 0.005)
        return mensaje, "Revisar volumen y peso. El peso es muy bajo para el volumen informado (Densidad: " + density.toFixed(2) + ")"

    else if (density < 0.05)
        return mensaje, "Revisar volumen y peso. El peso bajo para el volumen informado (Densidad: " + density.toFixed(2) + ")"

    else if (density >= 10)
        return mensaje, "Revisar volumen y peso. El peso es muy alto para el volumen informado (Densidad: " + density.toFixed(2) + ")"

    else
        return mensaje

}

module.exports = checkDensity;