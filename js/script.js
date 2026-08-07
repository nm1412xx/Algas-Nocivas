/* ============================================================
   JavaScript - Floración de Algas Nocivas
   Panel de monitoreo, Mapa, Simulador, Encuesta, Gráficos
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    /* ============================================================
       PARTÍCULAS DECORATIVAS DEL HEADER
       ============================================================ */

    var headerParticulas = document.getElementById("headerParticulas");
    for (var i = 0; i < 25; i++) {
        var particula = document.createElement("div");
        particula.className = "header-particula";
        particula.style.left = Math.random() * 100 + "%";
        particula.style.top = Math.random() * 100 + "%";
        particula.style.animationDuration = (3 + Math.random() * 4) + "s";
        particula.style.animationDelay = (Math.random() * 2) + "s";
        particula.style.width = (4 + Math.random() * 6) + "px";
        particula.style.height = particula.style.width;
        headerParticulas.appendChild(particula);
    }

    /* ============================================================
       MENÚ HAMBURGUESA (Navegación móvil)
       ============================================================ */

    var nav = document.querySelector("nav");
    var burgerBtn = document.createElement("button");
    burgerBtn.className = "burger-btn";
    burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    burgerBtn.setAttribute("aria-label", "Abrir menú");
    burgerBtn.style.cssText =
        "display:none; position:fixed; top:12px; right:12px; z-index:1001;" +
        "background:#16293b; color:#c8d6e5; border:2px solid #1a3a5c;" +
        "border-radius:12px; padding:10px 14px; font-size:1.1rem; cursor:pointer;" +
        "transition: all 0.25s ease;";
    document.body.appendChild(burgerBtn);

    function actualizarBurger() {
        if (window.innerWidth <= 768) {
            burgerBtn.style.display = "block";
            if (!nav.classList.contains("abierto")) {
                nav.style.display = "none";
            }
        } else {
            burgerBtn.style.display = "none";
            nav.style.display = "flex";
            nav.classList.remove("abierto");
        }
    }

    burgerBtn.addEventListener("click", function () {
        nav.classList.toggle("abierto");
        if (nav.classList.contains("abierto")) {
            burgerBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
            burgerBtn.style.background = "#c45454";
            burgerBtn.style.borderColor = "#e07070";
        } else {
            burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            burgerBtn.style.background = "#16293b";
            burgerBtn.style.borderColor = "#1a3a5c";
        }
    });

    nav.querySelectorAll("a").forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            if (window.innerWidth <= 768) {
                nav.classList.remove("abierto");
                nav.style.display = "none";
                burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
                burgerBtn.style.background = "#16293b";
                burgerBtn.style.borderColor = "#1a3a5c";
            }
        });
    });

    window.addEventListener("resize", actualizarBurger);
    actualizarBurger();

    /* ============================================================
       PANEL DE MONITOREO EN TIEMPO REAL
       ============================================================ */

    /* Datos de sensores simulados */
    var sensoresData = {
        temp: { valor: 14.2, historial: [], max: 50 },
        nut: { valor: 28, historial: [], max: 50 },
        o2: 7.8,
        ph: 7.4
    };

    /* Gráficos de Chart.js */
    var chartTemp, chartNut;
    var ctxTemp = document.getElementById("graficoTemp");
    var ctxNut = document.getElementById("graficoNut");

    if (ctxTemp) {
        chartTemp = new Chart(ctxTemp, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "Temperatura (°C)",
                    data: [],
                    borderColor: "#4ec48a",
                    backgroundColor: "rgba(78, 196, 138, 0.1)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 500 },
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 8, max: 28, grid: { color: "rgba(26,58,92,0.3)" }, ticks: { color: "#8395a7", font: { size: 10 } } },
                    x: { grid: { display: false }, ticks: { color: "#8395a7", font: { size: 9 }, maxTicksLimit: 8 } }
                }
            }
        });
    }

    if (ctxNut) {
        chartNut = new Chart(ctxNut, {
            type: "line",
            data: {
                labels: [],
                datasets: [{
                    label: "Nutrientes (%)",
                    data: [],
                    borderColor: "#f0c040",
                    backgroundColor: "rgba(240, 192, 64, 0.1)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 2,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 500 },
                plugins: { legend: { display: false } },
                scales: {
                    y: { min: 0, max: 100, grid: { color: "rgba(26,58,92,0.3)" }, ticks: { color: "#8395a7", font: { size: 10 } } },
                    x: { grid: { display: false }, ticks: { color: "#8395a7", font: { size: 9 }, maxTicksLimit: 8 } }
                }
            }
        });
    }

    /* Función para calcular riesgo general */
    function calcularRiesgoGeneral(temp, nut, o2, ph) {
        var puntaje = 0;
        /* Temperatura alta aumenta riesgo */
        if (temp >= 18 && temp <= 25) puntaje += 40;
        else if (temp > 25) puntaje += 30;
        else if (temp > 15) puntaje += 20;
        /* Nutrientes altos aumentan riesgo */
        if (nut >= 60) puntaje += 35;
        else if (nut >= 40) puntaje += 25;
        else if (nut >= 25) puntaje += 15;
        /* Oxígeno bajo aumenta riesgo */
        if (o2 < 5) puntaje += 15;
        else if (o2 < 6.5) puntaje += 8;
        /* pH alcalino aumenta riesgo */
        if (ph > 8.2) puntaje += 10;
        return Math.min(100, puntaje);
    }

    /* Función para clasificar el riesgo */
    function clasificarRiesgo(puntaje) {
        if (puntaje < 30) return { clase: "bajo", texto: "Bajo", icono: "fa-circle-check" };
        if (puntaje < 60) return { clase: "mod", texto: "Moderado", icono: "fa-triangle-exclamation" };
        return { clase: "alto", texto: "ALTO - ALERTA", icono: "fa-radiation" };
    }

    /* Actualiza los indicadores visuales */
    function actualizarIndicadores(temp, nut, o2, ph, riesgo) {
        var riesgoClasif = clasificarRiesgo(riesgo);

        /* Temperatura */
        var elTemp = document.getElementById("valTemp");
        var cardTemp = document.getElementById("cardTemp");
        var estTemp = document.getElementById("estadoTemp");
        if (elTemp) {
            elTemp.textContent = temp.toFixed(1) + "°C";
            estTemp.textContent = temp >= 18 && temp <= 25 ? "Alta" : temp > 15 ? "Normal" : "Baja";
            cardTemp.className = "indicador-card";
            if (temp > 20) cardTemp.classList.add(temp > 25 ? "peligro" : "alerta-val");
        }

        /* Nutrientes */
        var elNut = document.getElementById("valNut");
        var cardNut = document.getElementById("cardNut");
        var estNut = document.getElementById("estadoNut");
        if (elNut) {
            elNut.textContent = Math.round(nut) + "%";
            estNut.textContent = nut >= 60 ? "Crítico" : nut >= 40 ? "Alto" : "Normal";
            cardNut.className = "indicador-card";
            if (nut >= 40) cardNut.classList.add(nut >= 60 ? "peligro" : "alerta-val");
        }

        /* Oxígeno */
        var elO2 = document.getElementById("valO2");
        var cardO2 = document.getElementById("cardO2");
        var estO2 = document.getElementById("estadoO2");
        if (elO2) {
            elO2.textContent = o2.toFixed(1) + " mg/L";
            estO2.textContent = o2 < 5 ? "Bajo" : o2 < 6.5 ? "Moderado" : "Normal";
            cardO2.className = "indicador-card";
            if (o2 < 6.5) cardO2.classList.add(o2 < 5 ? "peligro" : "alerta-val");
        }

        /* pH */
        var elPH = document.getElementById("valPH");
        var cardPH = document.getElementById("cardPH");
        var estPH = document.getElementById("estadoPH");
        if (elPH) {
            elPH.textContent = ph.toFixed(1);
            estPH.textContent = ph > 8.2 ? "Alcalino" : "Normal";
            cardPH.className = "indicador-card";
            if (ph > 8.2) cardPH.classList.add("alerta-val");
        }

        /* Riesgo general */
        var elRiesgo = document.getElementById("riesgoGeneral");
        if (elRiesgo) {
            elRiesgo.className = "riesgo-general " + riesgoClasif.clase;
            elRiesgo.innerHTML = '<i class="fa-solid ' + riesgoClasif.icono + '" aria-hidden="true"></i>' +
                '<span>Riesgo general de floración: <strong>' + riesgoClasif.texto + '</strong> (' + riesgo + '%)</span>';
        }

        /* Actualizar colores de los sensores del mapa */
        actualizarMapaSensores(riesgo);
    }

    /* Historial de mediciones */
    function agregarAlHistorial(temp, nut, o2, ph) {
        var lista = document.getElementById("historialLista");
        if (!lista) return;

        /* Quitar mensaje vacío */
        var vacio = lista.querySelector(".historial-vacio");
        if (vacio) vacio.remove();

        var ahora = new Date();
        var hora = ahora.getHours().toString().padStart(2, "0") + ":" +
            ahora.getMinutes().toString().padStart(2, "0") + ":" +
            ahora.getSeconds().toString().padStart(2, "0");

        var item = document.createElement("div");
        item.className = "historial-item";
        item.innerHTML = '<span>' + hora + '</span>' +
            '<span>T:' + temp.toFixed(1) + '°C | N:' + Math.round(nut) + '% | O2:' + o2.toFixed(1) + '</span>';

        lista.insertBefore(item, lista.firstChild);

        /* Mantener máximo 15 registros */
        while (lista.children.length > 15) {
            lista.removeChild(lista.lastChild);
        }
    }

    /* Simular actualización de datos cada 2 segundos */
    function simularDatos() {
        /* Variación aleatoria de los valores */
        sensoresData.temp.valor += (Math.random() - 0.48) * 0.3;
        sensoresData.temp.valor = Math.max(8, Math.min(28, sensoresData.temp.valor));

        sensoresData.nut.valor += (Math.random() - 0.45) * 2;
        sensoresData.nut.valor = Math.max(5, Math.min(80, sensoresData.nut.valor));

        sensoresData.o2 += (Math.random() - 0.5) * 0.2;
        sensoresData.o2 = Math.max(3, Math.min(12, sensoresData.o2));

        sensoresData.ph += (Math.random() - 0.5) * 0.05;
        sensoresData.ph = Math.max(6.5, Math.min(9, sensoresData.ph));

        var riesgo = calcularRiesgoGeneral(
            sensoresData.temp.valor,
            sensoresData.nut.valor,
            sensoresData.o2,
            sensoresData.ph
        );

        /* Actualizar indicadores */
        actualizarIndicadores(sensoresData.temp.valor, sensoresData.nut.valor, sensoresData.o2, sensoresData.ph, riesgo);

        /* Actualizar gráficos */
        var ahora = new Date();
        var hora = ahora.getHours().toString().padStart(2, "0") + ":" +
            ahora.getMinutes().toString().padStart(2, "0") + ":" +
            ahora.getSeconds().toString().padStart(2, "0");

        if (chartTemp && chartTemp.data.labels.length >= 50) {
            chartTemp.data.labels.shift();
            chartTemp.data.datasets[0].data.shift();
        }
        if (chartTemp) {
            chartTemp.data.labels.push(hora);
            chartTemp.data.datasets[0].data.push(sensoresData.temp.valor);
            chartTemp.update("none");
        }

        if (chartNut && chartNut.data.labels.length >= 50) {
            chartNut.data.labels.shift();
            chartNut.data.datasets[0].data.shift();
        }
        if (chartNut) {
            chartNut.data.labels.push(hora);
            chartNut.data.datasets[0].data.push(sensoresData.nut.valor);
            chartNut.update("none");
        }

        /* Agregar al historial */
        agregarAlHistorial(sensoresData.temp.valor, sensoresData.nut.valor, sensoresData.o2, sensoresData.ph);
    }

    /* Iniciar la simulación cada 2 segundos */
    setInterval(simularDatos, 2000);
    /* Ejecutar inmediatamente */
    simularDatos();

    /* ============================================================
       MAPA INTERACTIVO DE SENSORES
       ============================================================ */

    /* Datos de los sensores en la Región de Los Lagos */
    var sensoresMapa = [
        { id: 1, nombre: "Sensor Bahía de Ancud", lat: -41.87, lng: -73.82, x: 25, y: 30, temp: 14.5, nut: 25, o2: 7.5, ph: 7.2, estado: "bajo" },
        { id: 2, nombre: "Sensor Canal de Chacao", lat: -41.78, lng: -73.52, x: 35, y: 22, temp: 13.8, nut: 30, o2: 8.1, ph: 7.4, estado: "bajo" },
        { id: 3, nombre: "Sensor Puerto Montt", lat: -41.47, lng: -72.94, x: 50, y: 35, temp: 15.2, nut: 35, o2: 7.0, ph: 7.5, estado: "bajo" },
        { id: 4, nombre: "Sensor Golfo de Corcovado", lat: -42.80, lng: -73.90, x: 30, y: 65, temp: 16.5, nut: 45, o2: 6.2, ph: 7.8, estado: "moderado" },
        { id: 5, nombre: "Sensor Isla Grande de Chiloé", lat: -42.60, lng: -74.00, x: 20, y: 55, temp: 13.2, nut: 20, o2: 8.5, ph: 7.1, estado: "bajo" },
        { id: 6, nombre: "Sensor Canal de Darwin", lat: -42.20, lng: -72.60, x: 60, y: 50, temp: 17.8, nut: 55, o2: 5.5, ph: 8.0, estado: "moderado" },
        { id: 7, nombre: "Sensor Seno de Reloncaví", lat: -41.65, lng: -72.40, x: 65, y: 28, temp: 19.5, nut: 65, o2: 4.8, ph: 8.3, estado: "alto" },
        { id: 8, nombre: "Sensor Puerto Varas", lat: -41.32, lng: -72.63, x: 55, y: 18, temp: 12.5, nut: 22, o2: 8.8, ph: 7.0, estado: "bajo" },
        { id: 9, nombre: "Sensor Caleta Huelmo", lat: -41.55, lng: -73.10, x: 42, y: 42, temp: 15.8, nut: 38, o2: 6.8, ph: 7.6, estado: "moderado" },
        { id: 10, nombre: "Sensor Fiordo Aysén", lat: -43.50, lng: -73.20, x: 45, y: 80, temp: 11.2, nut: 15, o2: 9.2, ph: 6.9, estado: "bajo" }
    ];

    /* Genera el mapa SVG */
    function generarMapa() {
        var mapaSVG = document.getElementById("mapaSVG");
        if (!mapaSVG) return;

        var svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">';

        /* Fondo del mar */
        svg += '<rect width="100" height="100" fill="#061e38" rx="2"/>';

        /* Silueta simplificada de la región (decorativa) */
        svg += '<path d="M20 10 L35 8 L50 12 L65 10 L80 15 L85 30 L80 45 L75 60 L70 75 L60 85 L45 90 L30 85 L20 75 L15 60 L12 45 L15 30 L18 15 Z" fill="#0d2137" stroke="#1a3a5c" stroke-width="0.5" opacity="0.6"/>';

        /* Líneas de referencia */
        svg += '<line x1="10" y1="20" x2="90" y2="20" stroke="#1a3a5c" stroke-width="0.2" stroke-dasharray="1,1"/>';
        svg += '<line x1="10" y1="40" x2="90" y2="40" stroke="#1a3a5c" stroke-width="0.2" stroke-dasharray="1,1"/>';
        svg += '<line x1="10" y1="60" x2="90" y2="60" stroke="#1a3a5c" stroke-width="0.2" stroke-dasharray="1,1"/>';
        svg += '<line x1="10" y1="80" x2="90" y2="80" stroke="#1a3a5c" stroke-width="0.2" stroke-dasharray="1,1"/>';

        /* Etiquetas de la región */
        svg += '<text x="50" y="5" font-size="3" fill="#8395a7" text-anchor="middle">Región de Los Lagos</text>';

        /* Puntos de sensores */
        sensoresMapa.forEach(function (sensor) {
            svg += '<g class="sensor-dot ' + sensor.estado + '" data-id="' + sensor.id + '" onclick="mostrarSensor(' + sensor.id + ')">';
            svg += '<circle cx="' + sensor.x + '" cy="' + sensor.y + '" r="5" class="sensor-dot ' + sensor.estado + '"/>';
            svg += '<text x="' + sensor.x + '" y="' + (sensor.y - 7) + '" font-size="2.5" fill="#c8d6e5" text-anchor="middle">' + sensor.nombre.replace("Sensor ", "") + '</text>';
            svg += '</g>';
        });

        svg += '</svg>';
        mapaSVG.innerHTML = svg;
    }

    /* Mostrar información del sensor seleccionado */
    window.mostrarSensor = function (id) {
        var sensor = sensoresMapa.find(function (s) { return s.id === id; });
        if (!sensor) return;

        var panelTitulo = document.getElementById("panelTitulo");
        var panelBody = document.getElementById("panelBody");

        if (panelTitulo) {
            panelTitulo.textContent = sensor.nombre;
        }

        var riesgo = calcularRiesgoGeneral(sensor.temp, sensor.nut, sensor.o2, sensor.ph);
        var riesgoClasif = clasificarRiesgo(riesgo);

        var estadoColor = sensor.estado === "bajo" ? "#4ec48a" : sensor.estado === "moderado" ? "#f0c040" : "#c45454";

        if (panelBody) {
            panelBody.innerHTML =
                '<div class="sensor-dato"><span class="sensor-dato-label">Latitud</span><span class="sensor-dato-value">' + sensor.lat.toFixed(2) + '</span></div>' +
                '<div class="sensor-dato"><span class="sensor-dato-label">Longitud</span><span class="sensor-dato-value">' + sensor.lng.toFixed(2) + '</span></div>' +
                '<div class="sensor-dato"><span class="sensor-dato-label">Temperatura</span><span class="sensor-dato-value">' + sensor.temp.toFixed(1) + '°C</span></div>' +
                '<div class="sensor-dato"><span class="sensor-dato-label">Nutrientes</span><span class="sensor-dato-value">' + Math.round(sensor.nut) + '%</span></div>' +
                '<div class="sensor-dato"><span class="sensor-dato-label">Oxígeno disuelto</span><span class="sensor-dato-value">' + sensor.o2.toFixed(1) + ' mg/L</span></div>' +
                '<div class="sensor-dato"><span class="sensor-dato-label">pH</span><span class="sensor-dato-value">' + sensor.ph.toFixed(1) + '</span></div>' +
                '<div class="sensor-dato"><span class="sensor-dato-label">Riesgo</span><span class="sensor-dato-value" style="color:' + estadoColor + '">' + riesgoClasif.texto + ' (' + riesgo + '%)</span></div>';
        }
    };

    /* Cerrar panel del mapa */
    var btnCerrarPanel = document.getElementById("mapaPanelCerrar");
    if (btnCerrarPanel) {
        btnCerrarPanel.addEventListener("click", function () {
            var panelBody = document.getElementById("panelBody");
            var panelTitulo = document.getElementById("panelTitulo");
            if (panelBody) panelBody.innerHTML = '<p class="mapa-hint"><i class="fa-solid fa-hand-pointer" aria-hidden="true"></i> Haz clic en un punto del mapa para ver la información del sensor.</p>';
            if (panelTitulo) panelTitulo.textContent = "Selecciona un sensor";
        });
    }

    /* Actualizar colores de sensores en el mapa según riesgo general */
    function actualizarMapaSensores(riesgoGeneral) {
        /* Simula variación en los sensores del mapa */
        sensoresMapa.forEach(function (sensor) {
            sensor.temp += (Math.random() - 0.5) * 0.1;
            sensor.nut += (Math.random() - 0.5) * 0.5;
            sensor.o2 += (Math.random() - 0.5) * 0.1;

            var riesgoSensor = calcularRiesgoGeneral(sensor.temp, sensor.nut, sensor.o2, sensor.ph);
            if (riesgoSensor >= 60) sensor.estado = "alto";
            else if (riesgoSensor >= 30) sensor.estado = "moderado";
            else sensor.estado = "bajo";
        });

        /* Regenera los colores del mapa */
        var dots = document.querySelectorAll(".sensor-dot");
        dots.forEach(function (dot) {
            dot.className.baseVal = "";
        });
        sensoresMapa.forEach(function (sensor) {
            var dotsSensor = document.querySelectorAll('.sensor-dot[data-id="' + sensor.id + '"]');
            dotsSensor.forEach(function (dot) {
                dot.classList.add(sensor.estado);
            });
        });
    }

    /* Generar el mapa al cargar */
    generarMapa();

    /* ============================================================
       SIMULADOR DE PROLIFERACIÓN DE ALGAS
       ============================================================ */

    var sliderTemp = document.getElementById("temperatura");
    var sliderNut = document.getElementById("nutrientes");
    var sliderLuz = document.getElementById("luz");
    var valTemp = document.getElementById("valorTemperatura");
    var valNut = document.getElementById("valorNutrientes");
    var valLuz = document.getElementById("valorLuz");
    var btnSimular = document.getElementById("btnSimular");
    var btnReset = document.getElementById("btnResetSimulador");
    var indicador = document.getElementById("indicadorRiesgo");
    var mar = document.getElementById("mar");
    var contador = document.getElementById("contadorAlgas");

    /* Actualiza los valores de los sliders */
    if (sliderTemp) sliderTemp.addEventListener("input", function () { valTemp.textContent = sliderTemp.value; });
    if (sliderNut) sliderNut.addEventListener("input", function () { valNut.textContent = sliderNut.value; });
    if (sliderLuz) sliderLuz.addEventListener("input", function () { valLuz.textContent = sliderLuz.value; });

    /* Calcula el riesgo del simulador */
    function calcularRiesgoSimulador() {
        var temp = parseInt(sliderTemp.value);
        var nut = parseInt(sliderNut.value);
        var luz = parseInt(sliderLuz.value);

        var factorTemp = 0;
        if (temp >= 18 && temp <= 25) factorTemp = 100;
        else if (temp > 25) factorTemp = 80 - (temp - 25) * 5;
        else factorTemp = (temp - 5) * 5;
        factorTemp = Math.max(0, Math.min(100, factorTemp));

        var factorNut = nut;
        var factorLuz = luz;

        var riesgo = Math.round(factorTemp * 0.4 + factorNut * 0.35 + factorLuz * 0.25);
        return Math.min(100, Math.max(0, riesgo));
    }

    /* Ejecutar simulación */
    if (btnSimular) {
        btnSimular.addEventListener("click", function () {
            var riesgo = calcularRiesgoSimulador();
            var cantidadAlgas = Math.round((riesgo / 100) * 40);

            /* Actualizar indicador */
            indicador.className = "indicador-riesgo";
            if (riesgo < 35) {
                indicador.classList.add("bajo");
                indicador.innerHTML = '<i class="fa-solid fa-circle-check"></i><span>Riesgo bajo: condiciones no favorables (' + riesgo + '%)</span>';
            } else if (riesgo < 65) {
                indicador.classList.add("moderado");
                indicador.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><span>Riesgo moderado: monitorear condiciones (' + riesgo + '%)</span>';
            } else {
                indicador.classList.add("alto");
                indicador.innerHTML = '<i class="fa-solid fa-radiation"></i><span>¡Riesgo alto! Posible floración (' + riesgo + '%)</span>';
            }

            /* Limpiar el mar */
            mar.innerHTML = "";
            contador.textContent = "0";

            /* Cambiar color del mar */
            if (riesgo < 35) {
                mar.style.background = "linear-gradient(180deg, #061e38 0%, #0a2d50 100%)";
            } else if (riesgo < 65) {
                mar.style.background = "linear-gradient(180deg, #061e38 0%, #1a4a30 100%)";
            } else {
                mar.style.background = "linear-gradient(180deg, #061e38 0%, #3a1a2e 100%)";
            }

            /* Crear partículas */
            var algaCreada = 0;
            var intervalo = setInterval(function () {
                if (algaCreada >= cantidadAlgas) {
                    clearInterval(intervalo);
                    return;
                }

                var particula = document.createElement("div");
                particula.className = "particula";
                particula.style.left = Math.random() * 90 + "%";
                particula.style.bottom = Math.random() * 60 + "%";
                particula.style.animationDelay = (Math.random() * 0.5) + "s";

                if (riesgo >= 65) {
                    particula.style.width = "18px";
                    particula.style.height = "18px";
                    particula.style.background = "radial-gradient(circle, #c45454 0%, #4a0e0e 70%)";
                }

                mar.appendChild(particula);
                algaCreada++;
                contador.textContent = algaCreada;
            }, 80);
        });
    }

    /* Reiniciar simulador */
    if (btnReset) {
        btnReset.addEventListener("click", function () {
            mar.innerHTML = "";
            contador.textContent = "0";
            indicador.className = "indicador-riesgo";
            indicador.innerHTML = '<i class="fa-solid fa-circle-info"></i><span>Ajusta los valores y presiona "Simular"</span>';
            mar.style.background = "linear-gradient(180deg, #061e38 0%, #0a2d50 100%)";
            sliderTemp.value = 15;
            sliderNut.value = 30;
            sliderLuz.value = 50;
            valTemp.textContent = "15";
            valNut.textContent = "30";
            valLuz.textContent = "50";
        });
    }

    /* ============================================================
       ENCUESTA
       ============================================================ */

    var formulario = document.getElementById("encuestaForm");
    var resultado = document.getElementById("resultadoEncuesta");

    if (formulario) {
        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            var respuestas = {
                p1: "correcta", p2: "correcta", p3: "correcta",
                p4: "correcta", p5: "correcta"
            };
            var correctas = 0;
            var total = 5;
            var sinResponder = 0;

            for (var clave in respuestas) {
                var seleccionada = formulario.querySelector('input[name="' + clave + '"]:checked');
                if (!seleccionada) {
                    sinResponder++;
                } else if (seleccionada.value === respuestas[clave]) {
                    correctas++;
                }
            }

            if (sinResponder > 0) {
                alert("Por favor, responde todas las preguntas antes de enviar.");
                return;
            }

            var porcentaje = Math.round((correctas / total) * 100);
            var mensaje = "";
            var clase = "";

            if (porcentaje >= 80) {
                mensaje = "¡Excelente! Conoces muy bien la marea roja (" + correctas + "/" + total + ").";
                clase = "bueno";
            } else if (porcentaje >= 50) {
                mensaje = "Buen intento, pero puedes aprender más (" + correctas + "/" + total + ").";
                clase = "regular";
            } else {
                mensaje = "Te recomiendo leer el contenido de la página (" + correctas + "/" + total + ").";
                clase = "malo";
            }

            resultado.className = "resultado-encuesta mostrar " + clase;
            resultado.innerHTML =
                '<p><strong>' + mensaje + '</strong></p>' +
                '<p>Acertaste el ' + porcentaje + '% de las preguntas.</p>' +
                '<div class="barra-progreso"><div class="barra-progreso-fill"></div></div>';

            setTimeout(function () {
                var barra = resultado.querySelector(".barra-progreso-fill");
                barra.style.width = porcentaje + "%";
                if (porcentaje >= 80) barra.style.background = "#4ec48a";
                else if (porcentaje >= 50) barra.style.background = "#f0c040";
                else barra.style.background = "#e07070";
            }, 100);

            resultado.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }

    /* ============================================================
       GRÁFICOS ESTÁTICOS (Impacto, Soluciones, Comparación)
       ============================================================ */

    Chart.defaults.color = "#c8d6e5";
    Chart.defaults.font.family = "'Segoe UI', Georgia, serif";

    var coloresGrafico = {
        borde: "#c45454",
        texto: "#c8d6e5",
        rejilla: "rgba(26, 58, 92, 0.4)"
    };

    /* Gráfico 1: Impacto */
    var ctxImpacto = document.getElementById("graficoImpacto");
    if (ctxImpacto) {
        new Chart(ctxImpacto, {
            type: "bar",
            data: {
                labels: ["Economía pesquera", "Salud pública", "Ecosistema marino", "Turismo costero"],
                datasets: [{
                    label: "Impacto estimado (%)",
                    data: [85, 70, 60, 55],
                    backgroundColor: [
                        "rgba(196, 84, 84, 0.7)",
                        "rgba(224, 112, 112, 0.7)",
                        "rgba(13, 59, 46, 0.8)",
                        "rgba(26, 58, 92, 0.8)"
                    ],
                    borderColor: coloresGrafico.borde,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, grid: { color: coloresGrafico.rejilla } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    /* Gráfico 2: Soluciones */
    var ctxSoluciones = document.getElementById("graficoSoluciones");
    if (ctxSoluciones) {
        new Chart(ctxSoluciones, {
            type: "doughnut",
            data: {
                labels: ["Monitoreo científico", "Vedas sanitarias", "Vigilancia satelital", "Educación pública"],
                datasets: [{
                    data: [70, 65, 55, 40],
                    backgroundColor: ["#e07070", "#c45454", "#1a6b4f", "#1a3a5c"],
                    borderColor: "#0a1929",
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: "bottom", labels: { padding: 12 } } }
            }
        });
    }

    /* Gráfico 3: Comparación */
    var ctxComparacion = document.getElementById("graficoComparacion");
    if (ctxComparacion) {
        new Chart(ctxComparacion, {
            type: "radar",
            data: {
                labels: ["Prevención", "Costo", "Sustentabilidad", "Cobertura", "Rapidez"],
                datasets: [
                    {
                        label: "Soluciones actuales",
                        data: [50, 40, 60, 55, 45],
                        backgroundColor: "rgba(196, 84, 84, 0.25)",
                        borderColor: "#c45454",
                        borderWidth: 2
                    },
                    {
                        label: "Solución propuesta",
                        data: [80, 60, 90, 75, 85],
                        backgroundColor: "rgba(13, 59, 46, 0.25)",
                        borderColor: "#0d3b2e",
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: { legend: { position: "bottom" } },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { color: coloresGrafico.texto, backdropColor: "transparent" },
                        grid: { color: coloresGrafico.rejilla },
                        pointLabels: { color: coloresGrafico.texto }
                    }
                }
            }
        });
    }

    /* ============================================================
       ANIMACIONES AL HACER SCROLL
       ============================================================ */

    document.querySelectorAll(".animar").forEach(function (elemento) {
        elemento.classList.add("animar");
    });

    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".animar").forEach(function (elemento) {
        observador.observe(elemento);
    });
});
