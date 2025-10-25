/*
    ---------------------------------------------------
    ----------  /udemy.antonydev.tech/  ---------------
    ----------  /curso-ia-web-local/  -----------------
    ----------  /04-modelo-detect-language/  ----------
    ----------  /main.js  -----------------------------
    ---------------------------------------------------
*/

//@ts-check


(() => {


    /**
     * Instancia del modelo `LanguageDetector` que se usará para identificar el idioma
     * del texto ingresado por el usuario. Se inicializa de forma asíncrona al ejecutar `initDetector()`.
     * @type {LanguageDetector|undefined}
     */
    let detector;

     // @ts-ignore
    const LanguageDetector = window.LanguageDetector;



    /**
     * @type {HTMLInputElement|null}
     * @description
     * Campo de texto donde el usuario introduce la frase o texto para detectar su idioma.
     */
    const textInput = document.querySelector('#text');


    /**
     * @type {HTMLPreElement|null}
     * @description
     * Elemento del DOM donde se muestran los resultados del proceso de detección del idioma.
     */
    const output = document.querySelector('#output');


    if(!textInput || !output) {
        throw new Error('❌ Faltan elementos del DOM (verifica #text y #output)');
    }


    /**
     * @type {Record<string, string>}
     * @description
     * Mapa de códigos ISO 639-1 de idiomas a sus nombres equivalentes en español.
     * Este objeto permite mostrar resultados legibles al usuario final.
     */
    const languageNames = {
        af: "Afrikáans", ar: "Árabe", bg: "Búlgaro", bn: "Bengalí", ca: "Catalán",
        cs: "Checo", da: "Danés", de: "Alemán", el: "Griego", en: "Inglés",
        es: "Español", et: "Estonio", fa: "Persa", fi: "Finés", fr: "Francés",
        gu: "Gujarati", he: "Hebreo", hi: "Hindi", hr: "Croata", hu: "Húngaro",
        id: "Indonesio", it: "Italiano", ja: "Japonés", kn: "Canarés", ko: "Coreano",
        lt: "Lituano", lv: "Letón", ml: "Malayalam", mr: "Marathi", nl: "Neerlandés",
        no: "Noruego", pa: "Punyabí", pl: "Polaco", pt: "Portugués", ro: "Rumano",
        ru: "Ruso", sk: "Eslovaco", sl: "Esloveno", so: "Somalí", sq: "Albanés",
        sv: "Sueco", sw: "Suajili", ta: "Tamil", te: "Telugu", th: "Tailandés",
        tr: "Turco", uk: "Ucraniano", ur: "Urdu", vi: "Vietnamita", zh: "Chino"
    };



    //  -------------------------------------------------------------
    //  -----  Función para Inicializar el detector de idiomas  -----
    //  -------------------------------------------------------------

    /**
     * @async
     * @function initDetector
     * @description
     * Inicializa el modelo `LanguageDetector` comprobando primero su disponibilidad.
     * Si el modelo no está cargado localmente, descarga los componentes necesarios.
     * 
     * Una vez listo, invoca automáticamente la función `detectLanguage()` para analizar
     * el texto actual del usuario.
     * 
     * @returns {Promise<void>}
     */
    const initDetector = async () => {

        /**
         * @type {"available" | "unavailable" | "downloadable"}
         * @description Estado actual de disponibilidad del modelo de detección en el navegador.
         */
        const avail = await LanguageDetector.availability();

        if (avail === "unavailable") {
            output.textContent = '⚠️ Lo siento, el detector de idiomas no está disponible en tu navegador.';
            return;
        }

        if (avail === "available") {

            detector = await LanguageDetector.create();
            output.textContent = '✅ El detector de idiomas está listo para usarse.';

            // Ejecutar detección inicial
            detectLanguage();

        } else {

            // Si requiere descarga local, monitorizar el progreso
            detector = await LanguageDetector.create({
                
                /**
                 * Monitorea el progreso de descarga del modelo local
                 * @param {{ addEventListener: (event: string, callback: (e: ProgressEvent) => void) => void }} m
                 */
                monitor(m) {
                    
                    m.addEventListener('downloadprogress', e => {
                        const percent = Math.round((e.loaded / e.total) * 100);
                        output.textContent = `⏳ Descargando modelo de IA Local ${percent}%`;
                    });
                }
            });
        }

        await detector.ready;
        output.textContent = '✅ El detector de idiomas está listo para usarse.';

        // Ejecutar detección inicial
        detectLanguage();
    };



    // ------------------------------------------
    // -----  Función para detectar idioma  -----
    // ------------------------------------------

    /**
     * @async
     * @function detectLanguage
     * @description
     * Analiza el texto actual del campo de entrada e intenta detectar
     * el idioma o idiomas predominantes en él utilizando el modelo `LanguageDetector`.
     * 
     * Los resultados se muestran en pantalla con su nivel de confianza.
     * 
     * @returns {Promise<void>}
     */
    const detectLanguage = async () => {

        const text = textInput.value.trim();

        if (!detector || text === "") return;

        /**
         * @typedef {Object} DetectionResult
         * @property {string} detectedLanguage - Código ISO 639-1 del idioma detectado (por ejemplo, `"en"`, `"es"`).
         * @property {number} confidence - Nivel de confianza de la predicción (valor entre `0` y `1`).
         */

        /**
         * @type {DetectionResult[]}
         * @description Resultado de la detección del modelo.
         */
        const result = await detector.detect(text);

        // Traducir los códigos a nombres legibles en español
        const textOutput = result
            
            .map(lang => {
                const nombre = languageNames[lang.detectedLanguage] || lang.detectedLanguage;
                return `${nombre} (${lang.detectedLanguage}): ${(lang.confidence * 100).toFixed(2)}%`;
            })
            
            // .join("&nbsp;&nbsp;&nbsp;");
            .join("<br>");

        // Mostrar resultados formateados en el HTML
        output.innerHTML = `
            🗣️ Idioma(s) detectado(s):
            <h3 class="detected-languages">${textOutput}</h3>
        `;

    };

  

    //  -----  Inicia el detector de idiomas al cargar el script  -----
    initDetector();


    //  -----  Detectar automáticamente mientras el usuario escribe  -----
    textInput.addEventListener('input', detectLanguage);


})();
