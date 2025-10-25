/*
    ---------------------------------------------------
    ----------  /udemy.antonydev.tech/  ---------------
    ----------  /curso-ia-web-local/  -----------------
    ----------  /04-modelo-detect-language/  ----------
    ----------  /main.js  -----------------------------
    ---------------------------------------------------
*/
    


(() => {


    /**
     * @type {LanguageDetector}
     * @description
     *     Instancia del detector de idiomas creada por LanguageDetector.create().
     *     Es null/undefined hasta que la inicialización haya finalizado correctamente.
     */
    let detector;


    /**
     * @type {HTMLInputElement}
     * @description Elemento de entrada de texto donde el usuario escribe el texto a analizar.
     */
    const textInput = document.querySelector('#text');


    /**
     * @type {HTMLPreElement}
     * @description Elemento HTML donde se muestran los resultados de la detección de idioma.
     */
    const output = document.querySelector('#output');

    
    /**
     * @type {Object}
     * @description Mapa de códigos de idioma a nombres de idioma en español.
     *      Basado en ISO 639-1.
     */
    const languageNames = {
        af: "Afrikáans",
        ar: "Árabe",
        bg: "Búlgaro",
        bn: "Bengalí",
        ca: "Catalán",
        cs: "Checo",
        da: "Danés",
        de: "Alemán",
        el: "Griego",
        en: "Inglés",
        es: "Español",
        et: "Estonio",
        fa: "Persa",
        fi: "Finés",
        fr: "Francés",
        gu: "Gujarati",
        he: "Hebreo",
        hi: "Hindi",
        hr: "Croata",
        hu: "Húngaro",
        id: "Indonesio",
        it: "Italiano",
        ja: "Japonés",
        kn: "Canarés",
        ko: "Coreano",
        lt: "Lituano",
        lv: "Letón",
        ml: "Malayalam",
        mr: "Marathi",
        nl: "Neerlandés",
        no: "Noruego",
        pa: "Punyabí",
        pl: "Polaco",
        pt: "Portugués",
        ro: "Rumano",
        ru: "Ruso",
        sk: "Eslovaco",
        sl: "Esloveno",
        so: "Somalí",
        sq: "Albanés",
        sv: "Sueco",
        sw: "Suajili",
        ta: "Tamil",
        te: "Telugu",
        th: "Tailandés",
        tr: "Turco",
        uk: "Ucraniano",
        ur: "Urdu",
        vi: "Vietnamita",
        zh: "Chino"
    };



    //  -------------------------------------------------------------
    //  -----  Función para Inicializar el detector de idiomas  -----
    //  -------------------------------------------------------------

    /**
     * @async
     * @function initDetector
     * @description Inicializa el detector de idiomas.
     * @returns {Promise<void>}
    */

    const initDetector = async () => {


        /**
         * @type {string}
         * @description Disponibilidad del detector de idiomas en el navegador.
         */
        const avail = await LanguageDetector.availability();


        if (avail === "unavailable") {
            output.textContent = '⚠️ Lo siento, El detector de idiomas no esta disponible en tu navegador.';
            return;
        }

        if ((avail === "available")) {

            detector = await LanguageDetector.create();
            output.textContent = '✅ El detector de idiomas está listo para usarse.';

            //  -----  Ejecutar función para detectar idioma  -----
            detectLanguage();

        }


        else {

            detector = await LanguageDetector.create({

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


        //  -----  Ejecutar función para detectar idioma  -----
        detectLanguage();

    }



    // ------------------------------------------
    // -----  Función para detectar idioma  -----
    // ------------------------------------------

    /**
     * @async
     * @function detectLanguage
     * @description Detecta el idioma del texto ingresado.
     * @returns {Promise<void>}
     */

    const detectLanguage = async () => {

        const text = textInput.value.trim();

        if (!detector || text === "")
            return;


        /**
         * @typedef {Object} DetectionResult
         * @property {string} detectedLanguage - Código ISO del idioma detectado (por ejemplo, "en", "es").
         * @property {number} confidence - Nivel de confianza (0 a 1).
        */

        /**
         * @type {DetectionResult[]}
         * @description Resultado de la detección de idioma.
        */
        const result = await detector.detect(text);


        //  -----  Traducir código de idioma a español  -----
        const textOutput = result

            .map(lang => {

                /**
                 * @type {string}
                 * @description Nombre del idioma en español.
                 */
                const nombre = languageNames[lang.detectedLanguage] || lang.detectedLanguage;

                return `${nombre} (${lang.detectedLanguage}): ${(lang.confidence * 100).toFixed(2)}%`;
            })

            .join("&nbsp; &nbsp; &nbsp;");

        //  -----  Mostrar resultados en el HTML  -----            
        output.innerHTML = `
            🗣️ Idioma(s) detectado(s):
            <h3 class="detected-languages"> ${textOutput} </h3>
        `;

    };


    //  -----  Inicializar el detector de idiomas  -----
    initDetector();


    //  -----  Evento Input para detectar idioma  -----
    textInput.addEventListener('input', detectLanguage);


})();
