self.onmessage = function(e){

    const datos = e.data;

    let sumaTemp = 0;
    let sumaHum = 0;

    let maxTemp = -Infinity;
    let minTemp = Infinity;

    let maxHum = -Infinity;
    let minHum = Infinity;

    datos.forEach((sensor) => {

        sumaTemp += sensor.temperatura;
        sumaHum += sensor.humedad;

        if(sensor.temperatura > maxTemp)
            maxTemp = sensor.temperatura;

        if(sensor.temperatura < minTemp)
            minTemp = sensor.temperatura;

        if(sensor.humedad > maxHum)
            maxHum = sensor.humedad;

        if(sensor.humedad < minHum)
            minHum = sensor.humedad;
    });

    self.postMessage({

        promedioTemp:
        (sumaTemp / datos.length).toFixed(2),

        promedioHum:
        (sumaHum / datos.length).toFixed(2),

        maxTemp,
        minTemp,
        maxHum,
        minHum

    });

};