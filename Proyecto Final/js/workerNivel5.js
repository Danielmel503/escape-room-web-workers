self.onmessage = function(e){

    const datos = e.data;

    let validos = [];

    datos.forEach(registro => {

        if(
            registro.temperatura >= 0 &&
            registro.humedad >= 0 &&
            registro.presion >= 0
        ){
            validos.push(registro);
        }

    });

    let suma = 0;

    validos.forEach(r => {

        suma +=
        r.temperatura +
        r.humedad +
        r.presion;

    });

    const promedioGeneral =
    (suma / (validos.length * 3)).toFixed(2);

    const topTemperaturas =
    [...validos]
    .sort((a,b) =>
        b.temperatura - a.temperatura
    )
    .slice(0,10);

    const topPresiones =
    [...validos]
    .sort((a,b) =>
        b.presion - a.presion
    )
    .slice(0,10);

    self.postMessage({

        promedioGeneral,
        registrosValidos:
        validos.length,

        topTemperaturas,
        topPresiones

    });

};