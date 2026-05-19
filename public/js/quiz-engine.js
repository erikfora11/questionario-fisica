const QuizEngine = (() => {
    const PUNTOS_TOTALES = 5;
    let preguntas = [];
    let indiceActual = 0;
    let puntuacion = 0;
    let puntosPorPregunta = 1;
    let usuarioDocumento = null;
    let jsonCargado = false;

    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    async function cargarPreguntas(backupQuestions) {
        try {
            const response = await fetch(window.location.origin + '/data/preguntas.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            jsonCargado = true;
            preguntas = shuffleArray(data).slice(0, 10);
            puntosPorPregunta = PUNTOS_TOTALES / preguntas.length;
            console.log('✅ preguntas.json cargado:', preguntas.length, 'preguntas');
        } catch (err) {
            jsonCargado = false;
            preguntas = shuffleArray(backupQuestions).slice(0, 10);
            puntosPorPregunta = PUNTOS_TOTALES / preguntas.length;
            console.warn('⚠️ Error cargando preguntas.json:', err.message, '- Usando preguntas de respaldo');
        }
    }

    function getQuestions() {
        return preguntas;
    }

    function getIndiceActual() {
        return indiceActual;
    }

    function getPuntuacion() {
        return puntuacion;
    }

    function getPuntosPorPregunta() {
        return puntosPorPregunta;
    }

    function getPuntosTotales() {
        return PUNTOS_TOTALES;
    }

    function getUsuarioDocumento() {
        return usuarioDocumento;
    }

    function esJsonCargado() {
        return jsonCargado;
    }

    function iniciarQuiz(documento) {
        usuarioDocumento = documento;
        indiceActual = 0;
        puntuacion = 0;
    }

    function verificarRespuesta(esCorrecta) {
        if (esCorrecta) {
            puntuacion += puntosPorPregunta;
            if (puntuacion > PUNTOS_TOTALES) puntuacion = PUNTOS_TOTALES;
        }
        return esCorrecta;
    }

    function avanzarPregunta() {
        if (indiceActual < preguntas.length - 1) {
            indiceActual++;
            return false;
        }
        return true;
    }

    function reiniciar() {
        usuarioDocumento = null;
        indiceActual = 0;
        puntuacion = 0;
    }

    return {
        cargarPreguntas,
        getQuestions,
        getIndiceActual,
        getPuntuacion,
        getPuntosPorPregunta,
        getPuntosTotales,
        getUsuarioDocumento,
        esJsonCargado,
        iniciarQuiz,
        verificarRespuesta,
        avanzarPregunta,
        reiniciar
    };
})();