const inicio = document.getElementById("inicio");
const nivel1 = document.getElementById("nivel1");

document
.getElementById("btnIniciar")
.addEventListener("click", () => {

    inicio.classList.add("d-none");
    nivel1.classList.remove("d-none");

});
// NIVEL 1

const btnUbicacion = document.getElementById("btnUbicacion");
const resultadoUbicacion = document.getElementById("resultadoUbicacion");
const btnNivel2 = document.getElementById("btnNivel2");

let latitud = null;
let longitud = null;

btnUbicacion.addEventListener("click", obtenerUbicacion);

function obtenerUbicacion() {

    if (!navigator.geolocation) {

        resultadoUbicacion.innerHTML = `
            <div class="alert alert-danger">
                Tu navegador no soporta geolocalización.
            </div>
        `;

        return;
    }

    navigator.geolocation.getCurrentPosition(
        exitoUbicacion,
        errorUbicacion
    );
}

function exitoUbicacion(posicion) {

    latitud = posicion.coords.latitude;
    longitud = posicion.coords.longitude;

    resultadoUbicacion.innerHTML = `
        <div class="alert alert-success">
            <strong>📍 Ubicación obtenida correctamente</strong><br>
            Latitud: ${latitud}<br>
            Longitud: ${longitud}<br>
            Precisión: ${posicion.coords.accuracy} metros<br>
            Hora: ${new Date().toLocaleString()}
        </div>
    `;

    btnNivel2.disabled = false;
}

function errorUbicacion(error) {

    let mensaje = "";

    switch(error.code){

        case error.PERMISSION_DENIED:
            mensaje = "Permiso de ubicación denegado.";
            break;

        case error.POSITION_UNAVAILABLE:
            mensaje = "Ubicación no disponible.";
            break;

        default:
            mensaje = "Error al obtener ubicación.";
    }

    resultadoUbicacion.innerHTML = `
        <div class="alert alert-danger">
            ${mensaje}
        </div>
    `;
}
const nivel2 = document.getElementById("nivel2");

btnNivel2.addEventListener("click", () => {

    nivel1.classList.add("d-none");
    nivel2.classList.remove("d-none");

});
// ======================
// NIVEL 2
// ======================

const canvas = document.getElementById("mapaCanvas");
const ctx = canvas.getContext("2d");

const btnDibujarMapa =
document.getElementById("btnDibujarMapa");

const mensajeMapa =
document.getElementById("mensajeMapa");

const btnNivel3 =
document.getElementById("btnNivel3");

btnDibujarMapa.addEventListener(
    "click",
    dibujarMapa
);

function dibujarMapa(){

    ctx.font = "18px Arial";

ctx.fillText(
    "Mapa Simplificado",
    260,
    30
);
    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    // Rectángulo
    ctx.strokeRect(
        50,
        50,
        600,
        250
    );
    // Cuadrícula vertical

for(let i = 150; i <= 550; i += 100){

    ctx.beginPath();
    ctx.moveTo(i,50);
    ctx.lineTo(i,300);
    ctx.stroke();

}

// Cuadrícula horizontal

for(let i = 100; i <= 250; i += 50){

    ctx.beginPath();
    ctx.moveTo(50,i);
    ctx.lineTo(650,i);
    ctx.stroke();

}

    // Línea
    ctx.beginPath();
    ctx.moveTo(50,175);
    ctx.lineTo(650,175);
    ctx.stroke();

    // Convertir coordenadas a posición en el mapa
    let x =
    ((longitud + 180) / 360) * 600 + 50;

    let y =
    ((90 - latitud) / 180) * 250 + 50;

    // Dibujar ubicación
    ctx.beginPath();
    ctx.arc(
        x,
        y,
        10,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "red";
    ctx.fill();

    ctx.font = "14px Arial";

    ctx.fillText(
    "Tu ubicación",
    x + 15,
    y
   );

    mensajeMapa.innerHTML = `
    <div class="alert alert-success">
        ✓ Mapa dibujado correctamente.<br>
        ✓ Ubicación marcada utilizando las coordenadas obtenidas.
    </div>
    `;

    btnNivel3.disabled = false;
}
const nivel3 =
document.getElementById("nivel3");

btnNivel3.addEventListener("click", () => {

    nivel2.classList.add("d-none");
    nivel3.classList.remove("d-none");

});

// ======================
// NIVEL 3
// ======================

const video =
document.getElementById("video");

const btnCamara =
document.getElementById("btnCamara");

const btnCapturar =
document.getElementById("btnCapturar");

const fotoCanvas =
document.getElementById("fotoCanvas");

const fotoCtx =
fotoCanvas.getContext("2d");

const fotoGuardada =
document.getElementById("fotoGuardada");

const mensajeCamara =
document.getElementById("mensajeCamara");

const btnNivel4 =
document.getElementById("btnNivel4");

let stream = null;

btnCamara.addEventListener(
    "click",
    activarCamara
);

async function activarCamara(){

    try{

        stream =
        await navigator.mediaDevices.getUserMedia({
            video:true
        });

        video.srcObject = stream;

        mensajeCamara.innerHTML = `
        <div class="alert alert-success">
            Cámara activada correctamente.
        </div>
        `;

    }
    catch(error){

        mensajeCamara.innerHTML = `
        <div class="alert alert-danger">
            Error al acceder a la cámara.
        </div>
        `;
 
    }
}
btnCapturar.addEventListener(
    "click",
    capturarFoto
);

function capturarFoto(){

    fotoCtx.drawImage(
        video,
        0,
        0,
        fotoCanvas.width,
        fotoCanvas.height
    );

    const imagen =
    fotoCanvas.toDataURL("image/png");

    localStorage.setItem(
        "fotoExplorador",
        imagen
    );

   fotoGuardada.classList.add(
    "border",
    "rounded",
    "shadow"
);

const infoFoto =
document.getElementById("infoFoto");

infoFoto.innerHTML = `
<div class="card mt-3 shadow">
    <div class="card-body">
        <h5>📸 Evidencia Capturada</h5>

        <p>
        Fecha:
        ${new Date().toLocaleDateString()}
        </p>

        <p>
        Hora:
        ${new Date().toLocaleTimeString()}
        </p>

        <p>
        Estado:
        Guardada en LocalStorage
        </p>
    </div>
    </div>
    `;

    mensajeCamara.innerHTML = `
    <div class="alert alert-success">
        Fotografía capturada y guardada.
    </div>
    `;

    btnNivel4.disabled = false;
}
const nivel4 =
document.getElementById("nivel4");

btnNivel4.addEventListener("click", () => {

    nivel3.classList.add("d-none");
    nivel4.classList.remove("d-none");

});
// ======================
// NIVEL 4
// ======================

const btnProcesar =
document.getElementById("btnProcesar");

const barraProgreso =
document.getElementById("barraProgreso");

const resultadoNivel4 =
document.getElementById("resultadoNivel4");

const btnNivel5 =
document.getElementById("btnNivel5");

btnProcesar.addEventListener(
    "click",
    procesarSensores
);

function procesarSensores(){

    let datos = [];

    for(let i = 0; i < 20000; i++){

        datos.push({

            temperatura:
            Math.floor(Math.random() * 50),

            humedad:
            Math.floor(Math.random() * 100)

        });
    }

    let progreso = 0;

    let intervalo = setInterval(() => {

        progreso += 10;

        barraProgreso.style.width =
        progreso + "%";

        barraProgreso.innerText =
        progreso + "%";

        if(progreso >= 100){

            clearInterval(intervalo);

        }

    },100);

    const worker =
    new Worker("js/workerNivel4.js");

    worker.postMessage(datos);

    worker.onmessage = function(e){

        const r = e.data;

        resultadoNivel4.innerHTML = `
        <div class="card p-3">
            <h4>Estadísticas</h4>

            <p>Promedio Temperatura:
            ${r.promedioTemp}</p>

            <p>Promedio Humedad:
            ${r.promedioHum}</p>

            <p>Máxima Temperatura:
            ${r.maxTemp}</p>

            <p>Mínima Temperatura:
            ${r.minTemp}</p>

            <p>Máxima Humedad:
            ${r.maxHum}</p>

            <p>Mínima Humedad:
            ${r.minHum}</p>
        </div>
        `;

        btnNivel5.disabled = false;
    };

}
const nivel5 =
document.getElementById("nivel5");

btnNivel5.addEventListener("click", () => {

    nivel4.classList.add("d-none");
    nivel5.classList.remove("d-none");

});
// ======================
// NIVEL 5
// ======================

const btnPortal =
document.getElementById("btnPortal");

const barraNivel5 =
document.getElementById("barraNivel5");

const resultadoNivel5 =
document.getElementById("resultadoNivel5");

const btnDescargar =
document.getElementById("btnDescargar");

let resultadoFinal = null;

btnPortal.addEventListener(
    "click",
    procesarPortal
);

function procesarPortal(){

    let datos = [];

    for(let i = 0; i < 250000; i++){

        datos.push({

            temperatura:
            Math.floor(Math.random()*120)-10,

            humedad:
            Math.floor(Math.random()*120)-10,

            presion:
            Math.floor(Math.random()*1200)-100

        });

    }

    let progreso = 0;

    let intervalo = setInterval(() => {

        progreso += 5;

        barraNivel5.style.width =
        progreso + "%";

        barraNivel5.innerText =
        progreso + "%";

        if(progreso >= 100){

            clearInterval(intervalo);

        }

    },100);

    const worker =
    new Worker("js/workerNivel5.js");

    worker.postMessage(datos);

    worker.onmessage = function(e){

        resultadoFinal = e.data;

        resultadoNivel5.innerHTML = `
        <div class="card p-3">

            <h4>Resultados Finales</h4>

            <p>
            Registros válidos:
            ${resultadoFinal.registrosValidos}
            </p>

            <p>
            Promedio General:
            ${resultadoFinal.promedioGeneral}
            </p>

            <p>
            Top 10 Temperaturas:
            ${resultadoFinal.topTemperaturas
                .map(t => t.temperatura)
                .join(", ")}
            </p>

            <p>
            Top 10 Presiones:
            ${resultadoFinal.topPresiones
                .map(p => p.presion)
                .join(", ")}
            </p>

        </div>
        `;

        btnDescargar.classList.remove(
            "d-none"
        );

    };

}
btnDescargar.addEventListener(
    "click",
    descargarJSON
);

function descargarJSON(){

    const blob = new Blob(

        [
            JSON.stringify(
                resultadoFinal,
                null,
                2
            )
        ],

        {
            type:
            "application/json"
        }

    );

    const enlace =
    document.createElement("a");

    enlace.href =
    URL.createObjectURL(blob);

    enlace.download =
    "resultadoNivel5.json";

    enlace.click();

}