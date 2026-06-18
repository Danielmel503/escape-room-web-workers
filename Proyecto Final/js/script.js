document.addEventListener('DOMContentLoaded', () => {

    const views = {
        inicio: document.getElementById("inicio"),
        nivel1: document.getElementById("nivel1"),
        nivel2: document.getElementById("nivel2"),
        nivel3: document.getElementById("nivel3"),
        nivel4: document.getElementById("nivel4"),
        nivel5: document.getElementById("nivel5")
    };

    function changeView(targetViewKey, hudIndex) {
        Object.values(views).forEach(view => {
            if (view) view.classList.add("d-none");
        });

        if (views[targetViewKey]) {
            views[targetViewKey].classList.remove("d-none");
        }
        updateHUD(hudIndex);
    }

    function updateHUD(activeIndex) {
        for (let i = 1; i <= 5; i++) {
            const hudLi = document.getElementById(`hud-l${i}`);
            if (hudLi) {
                hudLi.classList.remove("hud-active", "hud-current");
                if (i < activeIndex) {
                    hudLi.classList.add("hud-active"); 
                } else if (i === activeIndex) {
                    hudLi.classList.add("hud-current"); 
                }
            }
        }
    }

    startTimer();

    // ==========================================
    // PANTALLA INICIO
    // ==========================================
    const btnIniciar = document.getElementById('btnIniciar');
    if (btnIniciar) {
        btnIniciar.addEventListener('click', () => {
            alert("Iniciando Misión... Cargando Base de Datos de la Ciudad Inteligente.");
            changeView('nivel1', 1);
        });
    }

    // ==========================================
    // Nivel 1
    // ==========================================
    const btnUbicacion = document.getElementById("btnUbicacion");
    const resultadoUbicacion = document.getElementById("resultadoUbicacion");
    const btnNivel2 = document.getElementById("btnNivel2");
    
    let latitud = null;
    let longitud = null;

    if (btnUbicacion) btnUbicacion.addEventListener("click", obtenerUbicacion);

    function obtenerUbicacion() {
        if (!navigator.geolocation) {
            resultadoUbicacion.innerHTML = `
                <div class="alert alert-danger font-monospace">
                    CRITICAL ERROR: El navegador de terminal no soporta geo-localización.
                </div>`;
            return;
        }
        resultadoUbicacion.innerHTML = `<div class="text-info font-monospace py-2">Sincronizando con satélites GPS...</div>`;
        navigator.geolocation.getCurrentPosition(exitoUbicacion, errorUbicacion);
    }

    function exitoUbicacion(posicion) {
        latitud = posicion.coords.latitude;
        longitud = posicion.coords.longitude;

        resultadoUbicacion.innerHTML = `
            <div class="alert alert-success font-monospace">
                <strong>📍 ENLACE SATELITAL ESTABLECIDO</strong><br>
                > LATITUD: ${latitud}<br>
                > LONGITUD: ${longitud}<br>
                > MARGEN PREC: ${posicion.coords.accuracy} metros<br>
                > TIMESTAMPS: ${new Date().toLocaleString()}
            </div>`;

        if (btnNivel2) btnNivel2.disabled = false;
    }

    function errorUbicacion(error) {
        let mensaje = "";
        switch(error.code){
            case error.PERMISSION_DENIED: mensaje = "Acceso denegado por el operador."; break;
            case error.POSITION_UNAVAILABLE: mensaje = "Imposible triangular red de satélites."; break;
            default: mensaje = "Error desconocido de enlace.";
        }
        resultadoUbicacion.innerHTML = `<div class="alert alert-danger font-monospace">ERR: ${mensaje}</div>`;
    }

    if (btnNivel2) {
        btnNivel2.addEventListener("click", () => changeView('nivel2', 2));
    }

    // ==========================================
    // Nivel 2
    // ==========================================
    const canvas = document.getElementById("mapaCanvas");
    const btnDibujarMapa = document.getElementById("btnDibujarMapa");
    const mensajeMapa = document.getElementById("mensajeMapa");
    const btnNivel3 = document.getElementById("btnNivel3");

    if (btnDibujarMapa && canvas) {
        btnDibujarMapa.addEventListener("click", dibujarMapa);
    }

    function dibujarMapa() {
        const ctx = canvas.getContext("2d");
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#00f3ff";
        ctx.lineWidth = 1;
        ctx.fillStyle = "#ffffff";
        
        ctx.font = "bold 16px 'Share Tech Mono', monospace";
        ctx.fillText("MAPA TÁCTICO DE LA SMART CITY", 30, 35);

        // Rectángulo contenedor
        ctx.strokeStyle = "rgba(0, 243, 255, 0.4)";
        ctx.strokeRect(50, 60, 640, 250);

        // Cuadrícula Vectorial
        ctx.strokeStyle = "rgba(0, 243, 255, 0.1)";
        for (let i = 110; i <= 600; i += 80) {
            ctx.beginPath(); ctx.moveTo(i, 60); ctx.lineTo(i, 310); ctx.stroke();
        }
        for (let i = 110; i <= 300; i += 50) {
            ctx.beginPath(); ctx.moveTo(30, i); ctx.lineTo(670, i); ctx.stroke();
        }

        // conversion de coordenadas
        let latVal = latitud !== null ? latitud : 13.69; 
        let lonVal = longitud !== null ? longitud : -89.21;

        let x = ((lonVal + 180) / 360) * 600 + 30;
        let y = ((90 - latVal) / 180) * 250 + 60;

        // Asegurar límites dentro del rectángulo
        x = Math.max(40, Math.min(650, x));
        y = Math.max(70, Math.min(290, y));

        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#ff0055";
        ctx.fill();
        ctx.strokeStyle = "#ffffff";
        ctx.stroke();

        ctx.fillStyle = "#ff0055";
        ctx.font = "12px 'Share Tech Mono', monospace";
        ctx.fillText("📍 TU NODO CENTRAL", x + 15, y + 4);

        mensajeMapa.innerHTML = `
            <div class="alert alert-success font-monospace">
                ✓ Vectorización exitosa sobre Canvas.<br>
                ✓ Nodo geográfico renderizado en coordenadas absolutas cuadrantes (X: ${Math.round(x)}, Y: ${Math.round(y)}).
            </div>`;

        if (btnNivel3) btnNivel3.disabled = false;
    }

    if (btnNivel3) {
        btnNivel3.addEventListener("click", () => changeView('nivel3', 3));
    }

    // ==========================================
    // Nivel 3
    // ==========================================
    const video = document.getElementById("video");
    const btnCamara = document.getElementById("btnCamara");
    const btnCapturar = document.getElementById("btnCapturar");
    const fotoCanvas = document.getElementById("fotoCanvas");
    const fotoGuardada = document.getElementById("fotoGuardada");
    const mensajeCamara = document.getElementById("mensajeCamara");
    const btnNivel4 = document.getElementById("btnNivel4");
    let stream = null;

    if (btnCamara) btnCamara.addEventListener("click", activarCamara);
    if (btnCapturar) btnCapturar.addEventListener("click", capturarFoto);

    async function activarCamara() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (video) video.srcObject = stream;
            mensajeCamara.innerHTML = `<div class="alert alert-info font-monospace">Optica periférica activa... Reconociendo rostro...</div>`;
        } catch (error) {
            mensajeCamara.innerHTML = `<div class="alert alert-danger font-monospace font-sm">ERR_HARDWARE: Denegado o sin cámara conectada.</div>`;
        }
    }

    function capturarFoto() {
        if (!video || !fotoCanvas) return;
        const fotoCtx = fotoCanvas.getContext("2d");
        fotoCtx.drawImage(video, 0, 0, fotoCanvas.width, fotoCanvas.height);

        const imagen = fotoCanvas.toDataURL("image/png");
        localStorage.setItem("fotoExplorador", imagen);

        if (fotoGuardada) fotoGuardada.src = imagen;

        const infoFoto = document.getElementById("infoFoto");
        if (infoFoto) {
            infoFoto.innerHTML = `
                <div class="card bg-dark text-light border-secondary mt-2 shadow font-monospace">
                    <div class="card-body py-2">
                        <small class="text-cyan">✓ EVIDENCIA ENCRIPTADA Y LOCALIZADA EN CACHÉ LOCAL</small><br>
                        <small>REGISTRO: ${new Date().toLocaleDateString()} | ${new Date().toLocaleTimeString()}</small>
                    </div>
                </div>`;
        }

        mensajeCamara.innerHTML = `<div class="alert alert-success font-monospace">✓ Token biométrico almacenado. Autenticación completada.</div>`;
        if (btnNivel4) btnNivel4.disabled = false;

        // Apagar cámara para ahorrar recursos
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    }

    if (btnNivel4) {
        btnNivel4.addEventListener("click", () => changeView('nivel4', 4));
    }

    // ==========================================
    // Nivel 4
    // ==========================================
    const btnProcesar = document.getElementById("btnProcesar");
    const barraProgreso = document.getElementById("barraProgreso");
    const resultadoNivel4 = document.getElementById("resultadoNivel4");
    const btnNivel5 = document.getElementById("btnNivel5");

    if (btnProcesar) btnProcesar.addEventListener("click", procesarSensores);

    function procesarSensores() {
        let datos = [];
        for (let i = 0; i < 20000; i++) {
            datos.push({
                temperatura: Math.floor(Math.random() * 50),
                humedad: Math.floor(Math.random() * 100)
            });
        }

        let progreso = 0;
        if (barraProgreso) { barraProgreso.style.width = "0%"; barraProgreso.innerText = "0%"; }

        let intervalo = setInterval(() => {
            progreso += 10;
            if (barraProgreso) {
                barraProgreso.style.width = progreso + "%";
                barraProgreso.innerText = progreso + "%";
            }
            if (progreso >= 100) clearInterval(intervalo);
        }, 100);

        // Ejecucion del worker Nivel 4
        const worker = new Worker("js/workerNivel4.js");
        worker.postMessage(datos);

        worker.onmessage = function(e) {
            const r = e.data;
            if (resultadoNivel4) {
                resultadoNivel4.innerHTML = `
                    <div class="card bg-dark text-light border-info p-3 font-monospace">
                        <span class="text-cyan mb-2">📊 TELEMETRÍA AMBIENTAL COMPUTADA:</span>
                        <div class="row row-cols-2 g-2">
                            <div>• Prom. Temp: <span class="text-warning">${r.promedioTemp}°C</span></div>
                            <div>• Prom. Hum: <span class="text-warning">${r.promedioHum}%</span></div>
                            <div>• Max Temp: <span class="text-danger">${r.maxTemp}°C</span></div>
                            <div>• Min Temp: <span class="text-primary">${r.minTemp}°C</span></div>
                            <div>• Max Hum: <span class="text-danger">${r.maxHum}%</span></div>
                            <div>• Min Hum: <span class="text-primary">${r.minHum}%</span></div>
                        </div>
                    </div>`;
            }
            if (btnNivel5) btnNivel5.disabled = false;
        };
    }

    if (btnNivel5) {
        btnNivel5.addEventListener("click", () => changeView('nivel5', 5));
    }

    // ==========================================
    // Nivel 5
    // ==========================================
    const btnPortal = document.getElementById("btnPortal");
    const barraNivel5 = document.getElementById("barraNivel5");
    const resultadoNivel5 = document.getElementById("resultadoNivel5");
    const btnDescargar = document.getElementById("btnDescargar");
    let resultadoFinal = null;

    if (btnPortal) btnPortal.addEventListener("click", procesarPortal);
    if (btnDescargar) btnDescargar.addEventListener("click", descargarJSON);

    function procesarPortal() {
        let datos = [];
        for (let i = 0; i < 250000; i++) {
            datos.push({
                temperatura: Math.floor(Math.random() * 120) - 10,
                humedad: Math.floor(Math.random() * 120) - 10,
                presion: Math.floor(Math.random() * 1200) - 100
            });
        }

        let progreso = 0;
        if (barraNivel5) { barraNivel5.style.width = "0%"; barraNivel5.innerText = "0%"; }

        let intervalo = setInterval(() => {
            progreso += 5;
            if (barraNivel5) {
                barraNivel5.style.width = progreso + "%";
                barraNivel5.innerText = progreso + "%";
            }
            if (progreso >= 100) clearInterval(intervalo);
        }, 100);

        // Ejecución segura del Worker del nivel 5
        const worker = new Worker("js/workerNivel5.js");
        worker.postMessage(datos);

        worker.onmessage = function(e) {
            resultadoFinal = e.data;
            if (resultadoNivel5) {
                resultadoNivel5.innerHTML = `
                    <div class="alert alert-success bg-dark border-success text-light p-3 font-monospace">
                        <h4 class="text-success">👑 ¡ACCESO CONCEDIDO AL COMPLEJO!</h4>
                        <p class="mb-1">• Bloques Válidos Procesados: <strong>${resultadoFinal.registrosValidos}</strong></p>
                        <p class="mb-1">• Promedio General Métrico: <strong>${resultadoFinal.promedioGeneral}</strong></p>
                        <p class="mb-1 text-truncate">• Top 10 Temperaturas: <span class="text-warning">${resultadoFinal.topTemperaturas.map(t => t.temperatura).join(", ")}</span></p>
                        <p class="mb-0 text-truncate">• Top 10 Presiones: <span class="text-warning">${resultadoFinal.topPresiones.map(p => p.presion).join(", ")}</span></p>
                    </div>`;
            }
            if (btnDescargar) btnDescargar.classList.remove("d-none");
        };
    }

    function descargarJSON() {
        if (!resultadoFinal) return;
        const blob = new Blob([JSON.stringify(resultadoFinal, null, 2)], { type: "application/json" });
        const enlace = document.createElement("a");
        enlace.href = URL.createObjectURL(blob);
        enlace.download = "resultadoNivel5.json";
        enlace.click();
    }
});

// reloj
function startTimer() {
    let seconds = 0, minutes = 0, hours = 0;
    const timerElement = document.getElementById('timer');

    setInterval(() => {
        seconds++;
        if (seconds >= 60) { seconds = 0; minutes++; }
        if (minutes >= 60) { minutes = 0; hours++; }

        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        if (timerElement) {
            timerElement.textContent = `${h}:${m}:${s}`;
        }
    }, 1000);
}