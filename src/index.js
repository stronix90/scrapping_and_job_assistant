const CONFIG = require("./config");
const runGetDataFromTablero = require("./process/main");
const { estado, fieldsObj, adicionalesObj } = require("./types/fieldsTypes");


const config = {
    browser: {
        headless: true,
        url: 'https://sofse-pcat-ap.trenesargentinos.gob.ar/materiales/SolicitudAlta/',
    },
    session: {
        user: CONFIG.system.user,
        password: CONFIG.system.password
    },
    filters: {
        enable: true,
        estado: estado.Pendientes,
        descripcion: '',
        cuil: ''
    },
    results: {
        maxPages: 8,
        gridData: true,
        detailsData: {
            enable: true,
            rol: true,
            fields: {
                [fieldsObj.clave]: '',
                [fieldsObj.marcas]: '',
                [fieldsObj.adicionales]: {
                    [adicionalesObj._02_01_unidadMedidaBase]: '',
                    [adicionalesObj._02_02_unidadPeso]: '',
                    [adicionalesObj._02_03_pesoNeto]: '',
                    [adicionalesObj._02_04_unidadDimensionVolumetrica]: '',
                    [adicionalesObj._02_05_largo]: '',
                    [adicionalesObj._02_06_ancho]: '',
                    [adicionalesObj._02_07_alto]: '',
                    [adicionalesObj._04_03_precioInicial]: '',
                }
            }
        }
    },
    output: {
        catalogacion: {
            enable: true,
            path: 'T:/AlmacenCentralLiniers/Catalogacion/01. REPORTES/1. Demora en roles/',
            fixedFileName: 'data',
        },
        warehouse: {
            enable: true,
            path: 'T:/AlmacenCentralLiniers/Catalogacion/01. REPORTES/1. Demora en roles/',
            fixedFileName: 'almacenes',
        },
    }
}

runGetDataFromTablero(config);
