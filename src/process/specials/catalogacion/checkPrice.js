function checkPrice({ Clave: clave, operationType, rol, '04.03. PRECIO INICIAL': precioInicial }) {
    const RolPrecio = ['PATRIMONIO', 'ALMACENES', 'CATALOGADORES', 'DOCUMENTACION Y NORMAS TECNICAS', 'SHMA', 'COMEX', 'CONTABILIDAD']


    if (typeof(clave) === undefined) throw new Error("No se ha encontrado la Key Clave")
    if (typeof(operationType) === undefined) throw new Error("No se ha encontrado la Key Tipo")
    if (typeof(rol) === undefined) throw new Error("No se ha encontrado la Key Rol")
    if (typeof(precioInicial) === undefined) throw new Error("No se ha encontrado la Key 04.03. PRECIO INICIAL")


    if (
        clave !== "MR" &&
        operationType === "Alta Item" &&
        RolPrecio.includes(rol) &&
        (precioInicial === "-" || precioInicial === "")
    )
        return "Sin precio"
    else
        return ''

}

module.exports = checkPrice