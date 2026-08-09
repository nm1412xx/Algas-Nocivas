
document.addEventListener("DOMContentLoaded", function () { // Espera a que todo el HTML cargue antes de ejecutar el script (así los elementos ya existen)

    /* ========== MENÚ HAMBURGUESA (Navegación móvil) ========== */

    var nav = document.querySelector("nav");                         // Busca la etiqueta <nav> (la barra de navegación) de la página
    var burgerBtn = document.createElement("button");                // Crea un nuevo botón (todavía no visible en la página)
    burgerBtn.className = "burger-btn";                              // Le pone la clase "burger-btn" por si el CSS tiene estilos para ella
    burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';        // Dentro del botón pone el ícono de barras (☰), el símbolo del menú hamburguesa
    burgerBtn.setAttribute("aria-label", "Abrir menú");              // Etiqueta de accesibilidad: los lectores de pantalla dirán "Abrir menú"
    burgerBtn.style.cssText =                                        // Aplica estilos directamente al botón con CSS en línea:
        "display:none; position:fixed; top:12px; right:12px; z-index:1001;" + // (oculto por defecto, fijo en la esquina superior derecha, por encima de todo)
        "background:#16293b; color:#c8d6e5; border:2px solid #1a3a5c;" +      // (fondo azul oscuro, texto azul claro, borde azul)
        "border-radius:12px; padding:10px 14px; font-size:1.1rem; cursor:pointer;"; // (esquinas redondeadas, espacio interno, tamaño de letra, cursor de mano)
    document.body.appendChild(burgerBtn);                            // Inserta el botón al final del <body> para que aparezca en la página

    /* Muestra el botón solo en pantallas pequeñas */
    function actualizarBurger() {                                    // Define la función que revisa el tamaño de la ventana y ajusta botón y menú
        if (window.innerWidth <= 768) {                              // Si la ventana mide 768 px o menos (celular/tablet en vertical):
            burgerBtn.style.display = "block";                       //   Muestra el botón hamburguesa
            nav.style.display = nav.classList.contains("abierto") ? "flex" : "none"; //   Muestra el menú solo si la clase "abierto" está activa; si no, lo oculta
        } else {                                                     // Si la pantalla es grande (computadora):
            burgerBtn.style.display = "none";                        //   Oculta el botón hamburguesa (no se necesita)
            nav.style.display = "flex";                              //   Muestra siempre el menú completo en horizontal
            nav.classList.remove("abierto");                         //   Quita la clase "abierto" por si quedó activada
        }
    }

    burgerBtn.addEventListener("click", function () {                // Al hacer clic en el botón hamburguesa:
        nav.classList.toggle("abierto");                             //   Activa o desactiva la clase "abierto" en el menú (abrir/cerrar)
        if (nav.classList.contains("abierto")) {                     //   Si el menú quedó abierto:
            nav.style.display = "flex";                              //     Muéstralo
            nav.style.flexDirection = "column";                      //     Apila los enlaces en columna (uno debajo de otro)
            nav.style.gap = "8px";                                   //     Separa cada enlace por 8 px
            burgerBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'; //     Cambia el ícono ☰ por una X (para indicar "cerrar")
        } else {                                                     //   Si el menú quedó cerrado:
            nav.style.display = "none";                              //     Oculta el menú
            burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>'; //     Vuelve a poner el ícono ☰
        }
    });

    /* Cierra el menú al hacer clic en un enlace */
    nav.querySelectorAll("a").forEach(function (enlace) {            // Recorre todos los enlaces (<a>) que hay dentro del <nav>
        enlace.addEventListener("click", function () {               //   A cada enlace le agrega un evento de clic:
            if (window.innerWidth <= 768) {                          //     Solo en pantallas pequeñas (donde el menú está desplegado):
                nav.classList.remove("abierto");                     //       Quita la clase "abierto"
                nav.style.display = "none";                          //       Oculta el menú
                burgerBtn.innerHTML = '<i class="fa-solid fa-bars"></i>'; //       Restaura el ícono ☰ en el botón
            }
        });
    });

    window.addEventListener("resize", actualizarBurger);             // Cuando se redimensiona la ventana (girar el celular, cambiar tamaño), vuelve a revisar
    actualizarBurger();                                              // Ejecuta la función una primera vez al cargar la página

    /* ========== SIMULADOR DE PROLIFERACIÓN DE ALGAS ========== */

    var sliderTemp = document.getElementById("temperatura");         // Obtiene el slider (control deslizante) de temperatura del HTML
    var sliderNut = document.getElementById("nutrientes");           // Obtiene el slider de nutrientes
    var sliderLuz = document.getElementById("luz");                  // Obtiene el slider de luz
    var valTemp = document.getElementById("valorTemperatura");       // Obtiene el elemento donde se muestra el número de la temperatura
    var valNut = document.getElementById("valorNutrientes");         // Obtiene el elemento donde se muestra el número de nutrientes
    var valLuz = document.getElementById("valorLuz");                // Obtiene el elemento donde se muestra el número de luz
    var btnSimular = document.getElementById("btnSimular");          // Obtiene el botón que inicia la simulación
    var indicador = document.getElementById("indicadorRiesgo");      // Obtiene el contenedor donde se muestra el nivel de riesgo (texto + ícono)
    var mar = document.getElementById("mar");                        // Obtiene el elemento visual que representa el mar
    var contador = document.getElementById("contadorAlgas");         // Obtiene el contador que muestra cuántas algas se han creado

    /* Actualiza los números junto a cada slider */
    sliderTemp.addEventListener("input", function () {               // Cada vez que el usuario mueve el slider de temperatura:
        valTemp.textContent = sliderTemp.value;                      //   Actualiza el número mostrado con el valor actual del slider
    });
    sliderNut.addEventListener("input", function () {                // Lo mismo para el slider de nutrientes:
        valNut.textContent = sliderNut.value;                        //   Actualiza su número
    });
    sliderLuz.addEventListener("input", function () {                // Lo mismo para el slider de luz:
        valLuz.textContent = sliderLuz.value;                        //   Actualiza su número
    });

    /* Calcula el riesgo de proliferación (0 a 100) */
    function calcularRiesgo() {                                      // Define la función que calcula el riesgo total
        var temp = parseInt(sliderTemp.value);                       //   Lee el valor del slider de temperatura y lo convierte a número entero
        var nut = parseInt(sliderNut.value);                         //   Lee el valor del slider de nutrientes y lo convierte a número
        var luz = parseInt(sliderLuz.value);                         //   Lee el valor del slider de luz y lo convierte a número

        /* Temperatura ideal: 18-25 grados (mayor riesgo) */
        var factorTemp = 0;                                          //   Variable para el factor de riesgo por temperatura (empieza en 0)
        if (temp >= 18 && temp <= 25) {                              //   Si la temperatura está en el rango ideal (18-25 °C):
            factorTemp = 100;                                        //     El riesgo por temperatura es máximo (100)
        } else if (temp > 25) {                                      //   Si hace más calor que el ideal:
            factorTemp = 80 - (temp - 25) * 5;                       //     El riesgo empieza en 80 y baja 5 puntos por cada grado extra (26 °C = 75, 27 °C = 70...)
        } else {                                                     //   Si hace frío (menos de 18 °C):
            factorTemp = (temp - 5) * 5;                             //     El riesgo sube 5 puntos por cada grado a partir de 5 °C (10 °C = 25, 15 °C = 50...)
        }
        factorTemp = Math.max(0, Math.min(100, factorTemp));         //   Asegura que el factor nunca sea menor a 0 ni mayor a 100

        /* Nutrientes: a mayor cantidad, más riesgo */
        var factorNut = nut;                                         //   El factor es directo: slider en 70 → factor 70

        /* Luz: a mayor luz, más riesgo (fotosíntesis) */
        var factorLuz = luz;                                         //   Directo también: más luz favorece la fotosíntesis, más riesgo

        /* Promedio ponderado */
        var riesgo = Math.round(factorTemp * 0.4 + factorNut * 0.35 + factorLuz * 0.25); // Combina los tres factores: temperatura pesa 40%, nutrientes 35%, luz 25%
        return Math.min(100, Math.max(0, riesgo));                   //   Devuelve el riesgo final, garantizando que quede entre 0 y 100
    }

    /* Ejecuta la simulación visual */
    btnSimular.addEventListener("click", function () {               // Cuando se hace clic en el botón "Simular":
        var riesgo = calcularRiesgo();                               //   Calcula el porcentaje de riesgo con los valores actuales de los sliders
        var cantidadAlgas = Math.round((riesgo / 100) * 40); /* Hasta 40 partículas */ // Convierte el riesgo en número de algas (riesgo 100% → 40 algas, 50% → 20...)

        /* Actualiza el indicador de riesgo */
        indicador.className = "indicador-riesgo";                    //   Primero resetea las clases del indicador (quita el estado anterior)
        if (riesgo < 35) {                                           //   Si el riesgo es menor a 35% (bajo):
            indicador.classList.add("bajo");                         //     Agrega la clase "bajo" (color verde)
            indicador.innerHTML =                                    //     Muestra el mensaje de riesgo bajo con ícono de check:
                '<i class="fa-solid fa-circle-check"></i><span>Riesgo bajo: condiciones no favorables (' + riesgo + '%)</span>';
        } else if (riesgo < 65) {                                    //   Si el riesgo es menor a 65% (moderado):
            indicador.classList.add("moderado");                     //     Agrega la clase "moderado" (color amarillo)
            indicador.innerHTML =                                    //     Muestra el mensaje de advertencia con ícono de triángulo:
                '<i class="fa-solid fa-triangle-exclamation"></i><span>Riesgo moderado: monitorear las condiciones (' + riesgo + '%)</span>';
        } else {                                                     //   Si el riesgo es 65% o más (alto):
            indicador.classList.add("alto");                         //     Agrega la clase "alto" (color rojo)
            indicador.innerHTML =                                    //     Muestra la alerta de posible floración con ícono de radiación:
                '<i class="fa-solid fa-radiation"></i><span>¡Riesgo alto! Posible floración de algas nocivas (' + riesgo + '%)</span>';
        }

        /* Limpia el mar */
        mar.innerHTML = "";                                          //   Borra todo el contenido anterior del mar (las algas de la simulación previa)
        contador.textContent = "0";                                  //   Reinicia el contador visible a 0

        /* Cambia el color del mar según el riesgo */
        if (riesgo < 35) {                                           //   Si el riesgo es bajo:
            mar.style.background = "linear-gradient(180deg, #061e38 0%, #0a2d50 100%)"; //     Mar azul profundo (mar sano)
        } else if (riesgo < 65) {                                    //   Si el riesgo es moderado:
            mar.style.background = "linear-gradient(180deg, #061e38 0%, #1a4a30 100%)"; //     El fondo vira a verde (crecimiento de algas)
        } else {                                                     //   Si el riesgo es alto:
            mar.style.background = "linear-gradient(180deg, #061e38 0%, #3a1a2e 100%)"; //     Vira a rojizo oscuro (marea roja)
        }

        /* Crea las partículas de algas una a una */
        var algaCreada = 0;                                          //   Contador interno de partículas ya creadas (empieza en 0)
        var intervalo = setInterval(function () {                    //   Ejecuta esta función cada 80 milisegundos (efecto de proliferación gradual):
            if (algaCreada >= cantidadAlgas) {                       //     Si ya se crearon todas las algas:
                clearInterval(intervalo);                            //       Detiene el intervalo
                return;                                              //       Y sale de la función
            }

            var particula = document.createElement("div");           //     Crea un nuevo <div> para cada partícula de alga
            particula.className = "particula";                       //     Le asigna la clase "particula" (que trae la animación CSS de flotación)
            particula.style.left = Math.random() * 90 + "%";         //     La posiciona en horizontal al azar dentro del mar (0 a 90% del ancho)
            particula.style.bottom = Math.random() * 60 + "%";       //     La posiciona al azar en el tercio inferior (0 a 60% desde abajo)
            particula.style.animationDelay = (Math.random() * 0.5) + "s"; //     Le da un retraso de animación al azar para que no aparezcan todas a la vez

            /* Algas más grandes y rojas en riesgo alto */
            if (riesgo >= 65) {                                      //     Si el riesgo es alto:
                particula.style.width = "18px";                      //       Partícula más ancha (18 px)
                particula.style.height = "18px";                     //       Partícula más alta (18 px)
                particula.style.background = "radial-gradient(circle, #c45454 0%, #4a0e0e 70%)"; //       Color rojo intenso con degradado radial (marea roja)
            }

            mar.appendChild(particula);                              //     Añade la partícula al mar
            algaCreada++;                                            //     Aumenta el contador interno en 1
            contador.textContent = algaCreada;                       //     Actualiza el número visible en pantalla
        }, 80);                                                      //   Cada 80 ms se crea una nueva partícula
    });

    /* ========== ENCUESTA ========== */

    var formulario = document.getElementById("encuestaForm");        // Obtiene el formulario de la encuesta del HTML
    var resultado = document.getElementById("resultadoEncuesta");    // Obtiene el contenedor donde se mostrará el resultado

    formulario.addEventListener("submit", function (evento) {        // Cuando el usuario envía el formulario:
        evento.preventDefault(); /* Evita que la página se recargue */ // Detiene la recarga/navegación por defecto de un form

        /* Respuestas correctas */
        var respuestas = {                                           //   Define cuál es la respuesta correcta de cada pregunta:
            p1: "correcta",                                          //     p1 → la opción con value="correcta"
            p2: "correcta",                                          //     p2 → la opción con value="correcta"
            p3: "correcta",                                          //     p3 → la opción con value="correcta"
            p4: "correcta",                                          //     p4 → la opción con value="correcta"
            p5: "correcta"                                           //     p5 → la opción con value="correcta"
        };
        var correctas = 0;                                           //   Contador de respuestas acertadas (empieza en 0)
        var total = 5;                                               //   Total de preguntas de la encuesta
        var sinResponder = 0;                                        //   Contador de preguntas que el usuario no respondió

        /* Cuenta las correctas */
        for (var clave in respuestas) {                              //   Recorre cada pregunta (p1, p2, p3, p4, p5):
            var seleccionada = formulario.querySelector('input[name="' + clave + '"]:checked'); //     Busca el botón de opción marcado de esa pregunta
            if (!seleccionada) {                                     //     Si no hay ninguno marcado:
                sinResponder++;                                      //       Cuenta una pregunta sin responder
            } else if (seleccionada.value === respuestas[clave]) {   //     Si la opción marcada coincide con la respuesta correcta:
                correctas++;                                         //       Suma un acierto
            }
        }

        /* Si falta responder alguna pregunta, avisa */
        if (sinResponder > 0) {                                      //   Si hay preguntas sin responder:
            alert("Por favor, responde todas las preguntas antes de enviar."); //     Muestra una ventana de aviso
            return;                                                  //     Y detiene el proceso (no muestra resultado)
        }

        var porcentaje = Math.round((correctas / total) * 100);      //   Calcula el porcentaje de aciertos (ejemplo: 4/5 = 80%)

        /* Determina la calificación */
        var mensaje = "";                                            //   Variable para el mensaje de resultado (empieza vacía)
        var clase = "";                                              //   Variable para la clase CSS del resultado (empieza vacía)
        if (porcentaje >= 80) {                                      //   Si acertó 80% o más:
            mensaje = "¡Excelente! Conoces muy bien la marea roja (" + correctas + "/" + total + ")."; //     Mensaje de felicitación
            clase = "bueno";                                         //     Clase CSS que pinta el resultado en verde
        } else if (porcentaje >= 50) {                               //   Si acertó entre 50% y 79%:
            mensaje = "Buen intento, pero puedes aprender más (" + correctas + "/" + total + ")."; //     Mensaje intermedio
            clase = "regular";                                       //     Clase CSS de color amarillo
        } else {                                                     //   Si acertó menos del 50%:
            mensaje = "Te recomiendo leer el contenido de la página (" + correctas + "/" + total + ")."; //     Mensaje de repaso
            clase = "malo";                                          //     Clase CSS de color rojo
        }

        /* Muestra el resultado */
        resultado.className = "resultado-encuesta mostrar " + clase; //   Asigna las clases: estilos base + "mostrar" (hace visible el bloque) + calificación
        resultado.innerHTML =                                        //   Escribe el contenido del resultado (mensaje, porcentaje y barra vacía):
            '<p><strong>' + mensaje + '</strong></p>' +
            '<p>Acertaste el ' + porcentaje + '% de las preguntas.</p>' +
            '<div class="barra-progreso"><div class="barra-progreso-fill"></div></div>';

        /* Anima la barra de progreso después de un momento */
        setTimeout(function () {                                     //   Ejecuta esta función 100 ms después (da tiempo al navegador a pintar la barra vacía antes de animarla):
            var barra = resultado.querySelector(".barra-progreso-fill"); //     Selecciona el relleno interno de la barra de progreso
            barra.style.width = porcentaje + "%";                    //     Establece su ancho según el porcentaje acertado (ej. 80%)
            if (porcentaje >= 80) {                                  //     Si el porcentaje es 80% o más:
                barra.style.background = "#4ec48a";                  //       Barra verde
            } else if (porcentaje >= 50) {                           //     Si es 50% o más:
                barra.style.background = "#f0c040";                  //       Barra amarilla
            } else {                                                 //     Si es menos del 50%:
                barra.style.background = "#e07070";                  //       Barra roja
            }
        }, 100);                                                     //   100 milisegundos de retraso

        /* Desplaza hacia el resultado */
        resultado.scrollIntoView({ behavior: "smooth", block: "center" }); //   Hace scroll suave para que el resultado quede centrado en la pantalla
    });

    /* ========== GRÁFICOS CON CHART.JS ========== */

    /* Configuración común para los gráficos */
    var coloresGrafico = {                                           // Objeto con la paleta de colores que usarán los tres gráficos:
        fondo: "rgba(196, 84, 84, 0.6)",                             //   rojo semitransparente para rellenos
        borde: "#c45454",                                            //   rojo para los bordes
        texto: "#c8d6e5",                                            //   azul claro para etiquetas y textos
        rejilla: "rgba(26, 58, 92, 0.4)"                             //   azul oscuro sutil para las líneas de cuadrícula
    };

    Chart.defaults.color = coloresGrafico.texto;                     // Aplica el color de texto por defecto a todos los gráficos de Chart.js
    Chart.defaults.font.family = "'Segoe UI', Georgia, serif";       // Aplica la fuente por defecto a todos los gráficos

    /* Gráfico 1: Impacto de la marea roja */
    var ctxImpacto = document.getElementById("graficoImpacto");      // Obtiene el elemento <canvas> donde Chart.js dibujará el primer gráfico
    if (ctxImpacto) {                                                // Solo crea el gráfico si ese elemento existe en la página (evita errores)
        new Chart(ctxImpacto, {                                      //   Crea un nuevo gráfico de Chart.js en ese canvas:
            type: "bar",                                             //     tipo: gráfico de barras verticales
            data: {                                                  //     Datos del gráfico:
                labels: ["Economía pesquera", "Salud pública", "Ecosistema marino", "Turismo costero"], //       Etiquetas del eje X (categorías)
                datasets: [{                                         //       Serie de datos (hay una sola):
                    label: "Impacto estimado (%)",                   //         Título que aparecería en la leyenda
                    data: [85, 70, 60, 55],                          //         Valores de cada barra (%)
                    backgroundColor: [                               //         Color individual para cada barra:
                        "rgba(196, 84, 84, 0.7)",                    //           Economía pesquera → rojo
                        "rgba(224, 112, 112, 0.7)",                  //           Salud pública → rojo claro
                        "rgba(13, 59, 46, 0.8)",                    //           Ecosistema marino → verde oscuro
                        "rgba(26, 58, 92, 0.8)"                      //           Turismo costero → azul oscuro
                    ],
                    borderColor: coloresGrafico.borde,               //         Borde de cada barra (rojo)
                    borderWidth: 1                                   //         Grosor del borde (1 px)
                }]
            },
            options: {                                               //     Opciones de visualización:
                responsive: true,                                    //       Se adapta al ancho disponible de la pantalla
                maintainAspectRatio: true,                           //       Conserva las proporciones al redimensionar
                plugins: { legend: { display: false } },             //       Oculta la leyenda (solo hay una serie de datos)
                scales: {                                            //       Configuración de los ejes:
                    y: { beginAtZero: true, max: 100, grid: { color: coloresGrafico.rejilla } }, //         Eje Y: empieza en 0, máximo 100, cuadrícula de color azul sutil
                    x: { grid: { display: false } }                  //         Eje X: sin líneas de cuadrícula
                }
            }
        });
    }

    /* Gráfico 2: Efectividad de soluciones actuales */
    var ctxSoluciones = document.getElementById("graficoSoluciones"); // Obtiene el canvas del segundo gráfico
    if (ctxSoluciones) {                                             // Solo si existe en la página:
        new Chart(ctxSoluciones, {                                   //   Crea un nuevo gráfico:
            type: "doughnut",                                        //     tipo: dona (anillo, como un gráfico de pastel con agujero en el centro)
            data: {                                                  //     Datos:
                labels: ["Monitoreo científico", "Vedas sanitarias", "Vigilancia satelital", "Educación pública"], //       Etiquetas de cada porción
                datasets: [{                                         //       Serie de datos:
                    data: [70, 65, 55, 40],                          //         Valores de efectividad de cada solución (%)
                    backgroundColor: ["#e07070", "#c45454", "#1a6b4f", "#1a3a5c"], //         Color de cada porción
                    borderColor: "#0a1929",                          //         Borde oscuro entre porciones
                    borderWidth: 3                                   //         Grosor del borde (3 px)
                }]
            },
            options: {                                               //     Opciones:
                responsive: true,                                    //       Adaptable al ancho
                maintainAspectRatio: true,                           //       Conserva proporciones
                plugins: { legend: { position: "bottom", labels: { padding: 12 } } } //       Leyenda debajo del gráfico, con 12 px entre etiquetas
            }
        });
    }

    /* Gráfico 3: Comparación soluciones actuales vs. propuesta */
    var ctxComparacion = document.getElementById("graficoComparacion"); // Obtiene el canvas del tercer gráfico
    if (ctxComparacion) {                                            // Solo si existe en la página:
        new Chart(ctxComparacion, {                                  //   Crea un nuevo gráfico:
            type: "radar",                                           //     tipo: radar (pentágono con 5 ejes)
            data: {                                                  //     Datos:
                labels: ["Prevención", "Costo", "Sustentabilidad", "Cobertura", "Rapidez"], //       Los 5 criterios a comparar (forman las puntas del pentágono)
                datasets: [                                          //       Dos series de datos (dos polígonos superpuestos):
                    {
                        label: "Soluciones actuales",                //         Etiqueta de la primera serie
                        data: [50, 40, 60, 55, 45],                  //         Puntuaciones (0-100) en cada criterio
                        backgroundColor: "rgba(196, 84, 84, 0.25)",  //         Relleno rojo tenue
                        borderColor: "#c45454",                      //         Línea roja
                        borderWidth: 2                               //         Grosor de línea (2 px)
                    },
                    {
                        label: "Solución propuesta",                 //         Etiqueta de la segunda serie
                        data: [80, 60, 90, 75, 85],                  //         Puntuaciones (0-100) en cada criterio
                        backgroundColor: "rgba(13, 59, 46, 0.25)",   //         Relleno verde tenue
                        borderColor: "#0d3b2e",                      //         Línea verde oscura
                        borderWidth: 2                               //         Grosor de línea (2 px)
                    }
                ]
            },
            options: {                                               //     Opciones:
                responsive: true,                                    //       Adaptable al ancho
                maintainAspectRatio: true,                           //       Conserva proporciones
                plugins: { legend: { position: "bottom" } },         //       Leyenda debajo del gráfico
                scales: {                                            //       Ejes:
                    r: {                                             //         "r" es el eje radial en gráficos tipo radar:
                        beginAtZero: true,                           //           El centro vale 0
                        max: 100,                                    //           El borde vale 100
                        ticks: { color: coloresGrafico.texto, backdropColor: "transparent" }, //           Color de los números 0-100, sin fondo detrás
                        grid: { color: coloresGrafico.rejilla },     //           Color de los círculos concéntricos
                        pointLabels: { color: coloresGrafico.texto } //           Color de las etiquetas de las 5 puntas
                    }
                }
            }
        });
    }

    /* ========== ANIMACIONES AL HACER SCROLL ========== */

    /* Añade la clase .animar a todas las secciones */
    document.querySelectorAll("section, .alerta, .reflexion, blockquote").forEach(function (elemento) { // Selecciona todas las secciones, alertas, reflexiones y citas de la página
        elemento.classList.add("animar");                          //   Y les agrega la clase "animar" (en CSS suele iniciar con opacidad 0, invisibles)
    });

    /* Usa IntersectionObserver para añadir .visible cuando el elemento entra en pantalla */
    // IntersectionObserver es una herramienta del navegador que vigila cuándo un elemento entra al área visible
    var observador = new IntersectionObserver(function (entradas) { // Crea el observador; "entradas" es la lista de elementos detectados:
        entradas.forEach(function (entrada) {                      //   Recorre cada elemento detectado:
            if (entrada.isIntersecting) {                          //     Si el elemento está visible en la pantalla:
                entrada.target.classList.add("visible");           //       Le agrega la clase "visible" (en CSS lo hace aparecer con una transición suave)
            }
        });
    }, { threshold: 0.15 });                                       //   threshold: 0.15 → se activa cuando al menos el 15% del elemento es visible

    document.querySelectorAll(".animar").forEach(function (elemento) { // Toma todos los elementos con la clase "animar":
        observador.observe(elemento);                              //   Y le dice al observador que los vigile
    });
});
