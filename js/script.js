/* Script de interacciones - Floración de Algas Nocivas */

document.addEventListener("DOMContentLoaded", function () {

    /* ========== MENÚ HAMBURGUESA (Navegación móvil) ========== */

    /* Crea el botón hamburguesa en pantallas pequeñas */
    var nav = document.querySelector("nav");
    var burgerBtn = document.createElement("button");
    burgerBtn.className = "burger-btn";
    burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    burgerBtn.setAttribute("aria-label", "Abrir menú");
    burgerBtn.style.cssText =
        "display:none; position:fixed; top:12px; right:12px; z-index:1001;" +
        "background:#16293b; color:#c8d6e5; border:2px solid #1a3a5c;" +
        "border-radius:12px; padding:10px 14px; font-size:1.1rem; cursor:pointer;";
    document.body.appendChild(burgerBtn);

    /* Muestra el botón solo en pantallas pequeñas */
    function actualizarBurger() {
        if (window.innerWidth <= 768) {
            burgerBtn.style.display = "block";
            nav.style.display = nav.classList.contains("abierto") ? "flex" : "none";
        } else {
            burgerBtn.style.display = "none";
            nav.style.display = "flex";
            nav.classList.remove("abierto");
        }
    }

    burgerBtn.addEventListener("click", function () {
        nav.classList.toggle("abierto");
        if (nav.classList.contains("abierto")) {
            nav.style.display = "flex";
            nav.style.flexDirection = "column";
            nav.style.gap = "8px";
            burgerBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            nav.style.display = "none";
            burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    });

    /* Cierra el menú al hacer clic en un enlace */
    nav.querySelectorAll("a").forEach(function (enlace) {
        enlace.addEventListener("click", function () {
            if (window.innerWidth <= 768) {
                nav.classList.remove("abierto");
                nav.style.display = "none";
                burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
            }
        });
    });

    window.addEventListener("resize", actualizarBurger);
    actualizarBurger();

    /* ========== SIMULADOR DE PROLIFERACIÓN DE ALGAS ========== */

    var sliderTemp = document.getElementById("temperatura");
    var sliderNut = document.getElementById("nutrientes");
    var sliderLuz = document.getElementById("luz");
    var valTemp = document.getElementById("valorTemperatura");
    var valNut = document.getElementById("valorNutrientes");
    var valLuz = document.getElementById("valorLuz");
    var btnSimular = document.getElementById("btnSimular");
    var indicador = document.getElementById("indicadorRiesgo");
    var mar = document.getElementById("mar");
    var contador = document.getElementById("contadorAlgas");

    /* Actualiza los números junto a cada slider */
    sliderTemp.addEventListener("input", function () {
        valTemp.textContent = sliderTemp.value;
    });
    sliderNut.addEventListener("input", function () {
        valNut.textContent = sliderNut.value;
    });
    sliderLuz.addEventListener("input", function () {
        valLuz.textContent = sliderLuz.value;
    });

    /* Calcula el riesgo de proliferación (0 a 100) */
    function calcularRiesgo() {
        var temp = parseInt(sliderTemp.value);
        var nut = parseInt(sliderNut.value);
        var luz = parseInt(sliderLuz.value);

        /* Temperatura ideal: 18-25 grados (mayor riesgo) */
        var factorTemp = 0;
        if (temp >= 18 && temp <= 25) {
            factorTemp = 100;
        } else if (temp > 25) {
            factorTemp = 80 - (temp - 25) * 5;
        } else {
            factorTemp = (temp - 5) * 5;
        }
        factorTemp = Math.max(0, Math.min(100, factorTemp));

        /* Nutrientes: a mayor cantidad, más riesgo */
        var factorNut = nut;

        /* Luz: a mayor luz, más riesgo (fotosíntesis) */
        var factorLuz = luz;

        /* Promedio ponderado */
        var riesgo = Math.round(factorTemp * 0.4 + factorNut * 0.35 + factorLuz * 0.25);
        return Math.min(100, Math.max(0, riesgo));
    }

    /* Ejecuta la simulación visual */
    btnSimular.addEventListener("click", function () {
        var riesgo = calcularRiesgo();
        var cantidadAlgas = Math.round((riesgo / 100) * 40); /* Hasta 40 partículas */

        /* Actualiza el indicador de riesgo */
        indicador.className = "indicador-riesgo";
        if (riesgo < 35) {
            indicador.classList.add("bajo");
            indicador.innerHTML =
                '<i class="fa-solid fa-circle-check"></i><span>Riesgo bajo: condiciones no favorables (' + riesgo + '%)</span>';
        } else if (riesgo < 65) {
            indicador.classList.add("moderado");
            indicador.innerHTML =
                '<i class="fa-solid fa-triangle-exclamation"></i><span>Riesgo moderado: monitorear las condiciones (' + riesgo + '%)</span>';
        } else {
            indicador.classList.add("alto");
            indicador.innerHTML =
                '<i class="fa-solid fa-radiation"></i><span>¡Riesgo alto! Posible floración de algas nocivas (' + riesgo + '%)</span>';
        }

        /* Limpia el mar */
        mar.innerHTML = "";
        contador.textContent = "0";

        /* Cambia el color del mar según el riesgo */
        if (riesgo < 35) {
            mar.style.background = "linear-gradient(180deg, #061e38 0%, #0a2d50 100%)";
        } else if (riesgo < 65) {
            mar.style.background = "linear-gradient(180deg, #061e38 0%, #1a4a30 100%)";
        } else {
            mar.style.background = "linear-gradient(180deg, #061e38 0%, #3a1a2e 100%)";
        }

        /* Crea las partículas de algas una a una */
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

            /* Algas más grandes y rojas en riesgo alto */
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

    /* ========== ENCUESTA ========== */

    var formulario = document.getElementById("encuestaForm");
    var resultado = document.getElementById("resultadoEncuesta");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault(); /* Evita que la página se recargue */

        /* Respuestas correctas */
        var respuestas = {
            p1: "correcta",
            p2: "correcta",
            p3: "correcta",
            p4: "correcta",
            p5: "correcta"
        };
        var correctas = 0;
        var total = 5;
        var sinResponder = 0;

        /* Cuenta las correctas */
        for (var clave in respuestas) {
            var seleccionada = formulario.querySelector('input[name="' + clave + '"]:checked');
            if (!seleccionada) {
                sinResponder++;
            } else if (seleccionada.value === respuestas[clave]) {
                correctas++;
            }
        }

        /* Si falta responder alguna pregunta, avisa */
        if (sinResponder > 0) {
            alert("Por favor, responde todas las preguntas antes de enviar.");
            return;
        }

        var porcentaje = Math.round((correctas / total) * 100);

        /* Determina la calificación */
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

        /* Muestra el resultado */
        resultado.className = "resultado-encuesta mostrar " + clase;
        resultado.innerHTML =
            '<p><strong>' + mensaje + '</strong></p>' +
            '<p>Acertaste el ' + porcentaje + '% de las preguntas.</p>' +
            '<div class="barra-progreso"><div class="barra-progreso-fill"></div></div>';

        /* Anima la barra de progreso después de un momento */
        setTimeout(function () {
            var barra = resultado.querySelector(".barra-progreso-fill");
            barra.style.width = porcentaje + "%";
            if (porcentaje >= 80) {
                barra.style.background = "#4ec48a";
            } else if (porcentaje >= 50) {
                barra.style.background = "#f0c040";
            } else {
                barra.style.background = "#e07070";
            }
        }, 100);

        /* Desplaza hacia el resultado */
        resultado.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    /* ========== GRÁFICOS CON CHART.JS ========== */

    /* Configuración común para los gráficos */
    var coloresGrafico = {
        fondo: "rgba(196, 84, 84, 0.6)",
        borde: "#c45454",
        texto: "#c8d6e5",
        rejilla: "rgba(26, 58, 92, 0.4)"
    };

    Chart.defaults.color = coloresGrafico.texto;
    Chart.defaults.font.family = "'Segoe UI', Georgia, serif";

    /* Gráfico 1: Impacto de la marea roja */
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

    /* Gráfico 2: Efectividad de soluciones actuales */
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

    /* Gráfico 3: Comparación soluciones actuales vs. propuesta */
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

    /* ========== ANIMACIONES AL HACER SCROLL ========== */

    /* Añade la clase .animar a todas las secciones */
    document.querySelectorAll("section, .alerta, .reflexion, blockquote").forEach(function (elemento) {
        elemento.classList.add("animar");
    });

    /* Usa IntersectionObserver para añadir .visible cuando el elemento entra en pantalla */
    var observador = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (entrada) {
            if (entrada.isIntersecting) {
                entrada.target.classList.add("visible");
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".animar").forEach(function (elemento) {
        observador.observe(elemento);
    });
});
