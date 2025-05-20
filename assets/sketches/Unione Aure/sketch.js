// js/sketchDemo4.js

// Rimuovi le variabili globali come currentCanvasWidthDemo4, currentCanvasHeightDemo4 da qui
// se sono gestite da p5.js (p.width, p.height) o passate/calcolate diversamente.
// Le costanti possono rimanere globali se sono veramente costanti di configurazione per questo sketch.

// --- Parametri di Risoluzione e Canvas ---
const DESIRED_CELLS_ON_SHORTER_DIM_DEMO4 = 400;
const FIXED_CANVAS_HEIGHT_DEMO4 = 600;
// ... (altre costanti specifiche per la Demo 4) ...

window.sketchDemo4Code = function(p) { // Avvolgi tutto in questa funzione

    // Variabili specifiche dello sketch (ora interne alla funzione)
    // let currentCanvasWidthDemo4; // Usa p.width
    // let currentCanvasHeightDemo4; // Usa p.height

    let smoothnessSliderDemo4;
    let smoothnessLabelDemo4;
    let circleButtonDemo4, squareButtonDemo4, triangleButtonDemo4;
    let shapeButtonsDemo4 = [];
    let mouseShapeTypeDemo4 = 'circle'; // Stato iniziale

    // --- Funzioni Helper (SDF, lerp, etc.) ---
    // Queste funzioni possono essere definite qui dentro o, se sono veramente generiche,
    // potrebbero stare in un file utility separato e importate/incluse.
    // Per ora, le lasciamo qui dentro, accessibili solo a questo sketch.

    function sdfBox(px, py, halfWidth, halfHeight) {
        // ... implementazione ...
        const dx = Math.abs(px) - halfWidth;
        const dy = Math.abs(py) - halfHeight;
        const outerDist = Math.sqrt(Math.pow(Math.max(dx, 0), 2) + Math.pow(Math.max(dy, 0), 2));
        const innerDist = Math.min(Math.max(dx, dy), 0);
        return outerDist + innerDist;
    }

    const K_SQRT3_TRI_DEMO4 = Math.sqrt(3.0);
    function sdfEquilateralTriangleCorrected(px_initial, py_initial, r) {
        // ... implementazione ...
        let px_tri = px_initial;
        let py_tri = py_initial;
        px_tri = Math.abs(px_tri) - r;
        py_tri = py_tri + r / K_SQRT3_TRI_DEMO4;
        const px_before_cond_transform = px_tri;
        const py_before_cond_transform = py_tri;
        if (px_before_cond_transform + K_SQRT3_TRI_DEMO4 * py_before_cond_transform > 0.0) {
            px_tri = (px_before_cond_transform - K_SQRT3_TRI_DEMO4 * py_before_cond_transform) / 2.0;
            py_tri = (-K_SQRT3_TRI_DEMO4 * px_before_cond_transform - py_before_cond_transform) / 2.0;
        }
        const val_to_clamp = px_tri;
        const min_bound = -2.0 * r;
        const max_bound = 0.0;
        const clamped_val = Math.min(Math.max(val_to_clamp, min_bound), max_bound);
        px_tri = px_tri - clamped_val;
        return -Math.sqrt(px_tri * px_tri + py_tri * py_tri) * Math.sign(py_tri);
    }

    function sminPoly(a, b, k) {
        // ... implementazione ...
        if (k <= 0) { return Math.min(a, b); }
        let h = 0.5 + 0.5 * (b - a) / k;
        h = Math.max(0.0, Math.min(1.0, h));
        return (b * (1 - h) + a * h) - k * h * (1.0 - h);
    }

    function lerpJS(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    function lerpColorJS(color1_arr, color2_arr, amount) {
        const r_val = lerpJS(color1_arr[0], color2_arr[0], amount);
        const g_val = lerpJS(color1_arr[1], color2_arr[1], amount);
        const b_val = lerpJS(color1_arr[2], color2_arr[2], amount);
        return [r_val, g_val, b_val];
    }


    p.setup = function() {
        let canvasHolder4 = document.getElementById('canvas-holder-4'); // Usa l'ID passato
        // La larghezza del canvas sarà gestita da p5.js in base al contenitore,
        // o puoi impostarla specificamente.
        // Se vuoi una larghezza specifica, puoi prenderla dal contenitore.
        let currentCanvasWidthDemo4 = canvasHolder4.offsetWidth; // Larghezza del contenitore
        let currentCanvasHeightDemo4 = FIXED_CANVAS_HEIGHT_DEMO4;

        // Il canvas viene già parentato da new p5(..., 'canvas-holder-4') in main.js
        // quindi non è necessario canvasDemo4.parent() qui.
        p.createCanvas(currentCanvasWidthDemo4, currentCanvasHeightDemo4);
        p.pixelDensity(1);

        let controlsHolder4 = document.getElementById('controls-holder-4');
        if (!controlsHolder4) {
            console.error('#controls-holder-4 non trovato per i controlli della Demo 4');
            return;
        }

        smoothnessLabelDemo4 = p.createP('Fattore di Morbidezza Unione (k):');
        smoothnessLabelDemo4.parent(controlsHolder4);

        smoothnessSliderDemo4 = p.createSlider(0.01, 0.6, 0.1, 0.01);
        smoothnessSliderDemo4.parent(controlsHolder4);
        smoothnessSliderDemo4.addClass('slider');

        let buttonsGroupDemo4 = p.createDiv();
        buttonsGroupDemo4.parent(controlsHolder4);
        buttonsGroupDemo4.addClass('demo4-buttons-group');

        function setActiveButton(selectedButton) {
            shapeButtonsDemo4.forEach(btn => btn.removeClass('active'));
            selectedButton.addClass('active');
        }

        circleButtonDemo4 = p.createButton('Cursore Cerchio');
        circleButtonDemo4.parent(buttonsGroupDemo4);
        circleButtonDemo4.mousePressed(() => {
            mouseShapeTypeDemo4 = 'circle';
            setActiveButton(circleButtonDemo4);
        });
        shapeButtonsDemo4.push(circleButtonDemo4);

        squareButtonDemo4 = p.createButton('Cursore Quadrato');
        squareButtonDemo4.parent(buttonsGroupDemo4);
        squareButtonDemo4.mousePressed(() => {
            mouseShapeTypeDemo4 = 'square';
            setActiveButton(squareButtonDemo4);
        });
        shapeButtonsDemo4.push(squareButtonDemo4);

        triangleButtonDemo4 = p.createButton('Cursore Triangolo');
        triangleButtonDemo4.parent(buttonsGroupDemo4);
        triangleButtonDemo4.mousePressed(() => {
            mouseShapeTypeDemo4 = 'triangle';
            setActiveButton(triangleButtonDemo4);
        });
        shapeButtonsDemo4.push(triangleButtonDemo4);

        setActiveButton(circleButtonDemo4); // Stato iniziale
    };

    p.windowResized = function() {
        let canvasHolder4 = document.getElementById('canvas-holder-4');
        if (canvasHolder4) {
            let currentCanvasWidthDemo4 = canvasHolder4.offsetWidth;
            // FIXED_CANVAS_HEIGHT_DEMO4 rimane fissa
            p.resizeCanvas(currentCanvasWidthDemo4, FIXED_CANVAS_HEIGHT_DEMO4);
        }
    };

    p.draw = function() {
        p.loadPixels();

        const currentSmoothnessK = smoothnessSliderDemo4.value();
        const timeShift = p.frameCount * AURA_ANIMATION_SPEED_DEMO4;

        const aspect = p.width / p.height;

        // Usa p.mouseX, p.mouseY, p.width, p.height
        const mouse_u_mapped = (p.mouseX / p.width) * 2.0 - 1.0;
        const mouse_v_mapped = (p.mouseY / p.height) * 2.0 - 1.0;

        let mouse_px, mouse_py;
        if (aspect >= 1.0) {
            mouse_px = mouse_u_mapped * aspect;
            mouse_py = -mouse_v_mapped;
        } else {
            mouse_px = mouse_u_mapped;
            mouse_py = -mouse_v_mapped / aspect;
        }

        let actualPixelBlockSize;
        let numBlocksX, numBlocksY;

        if (p.width < p.height) {
            actualPixelBlockSize = p.width / DESIRED_CELLS_ON_SHORTER_DIM_DEMO4;
            numBlocksX = DESIRED_CELLS_ON_SHORTER_DIM_DEMO4;
            numBlocksY = Math.ceil(p.height / actualPixelBlockSize);
        } else {
            actualPixelBlockSize = p.height / DESIRED_CELLS_ON_SHORTER_DIM_DEMO4;
            numBlocksY = DESIRED_CELLS_ON_SHORTER_DIM_DEMO4;
            numBlocksX = Math.ceil(p.width / actualPixelBlockSize);
        }

        for (let gy_block = 0; gy_block < numBlocksY; gy_block++) {
            for (let gx_block = 0; gx_block < numBlocksX; gx_block++) {
                const screen_center_x = (gx_block + 0.5) * actualPixelBlockSize;
                const screen_center_y = (gy_block + 0.5) * actualPixelBlockSize;

                const u_mapped = (screen_center_x / p.width) * 2.0 - 1.0;
                const v_mapped = (screen_center_y / p.height) * 2.0 - 1.0;

                let px, py;
                if (aspect >= 1.0) {
                    px = u_mapped * aspect;
                    py = -v_mapped;
                } else {
                    px = u_mapped;
                    py = -v_mapped / aspect;
                }

                let finalColor = [...COLOR_BLACK_DEMO4]; // Assicurati che COLOR_BLACK_DEMO4 sia definito (es. const)

                const sdfStaticCircle = p.dist(px, py, STATIC_CIRCLE_CENTER_X_NORM_DEMO4, STATIC_CIRCLE_CENTER_Y_NORM_DEMO4) - STATIC_CIRCLE_RADIUS_NORM_DEMO4;
                const sdfSquareStatic = sdfBox(px - SQUARE_CENTER_X_NORM_DEMO4, py - SQUARE_CENTER_Y_NORM_DEMO4, SQUARE_HALF_SIZE_NORM_DEMO4, SQUARE_HALF_SIZE_NORM_DEMO4);
                const sdfTriangleStatic = sdfEquilateralTriangleCorrected(px - TRIANGLE_CENTER_X_NORM_DEMO4, py - TRIANGLE_CENTER_Y_NORM_DEMO4, TRIANGLE_SIZE_PARAM_NORM_DEMO4);
                
                let sdfForAura = sminPoly(sdfStaticCircle, sdfSquareStatic, currentSmoothnessK);
                sdfForAura = sminPoly(sdfForAura, sdfTriangleStatic, currentSmoothnessK);

                let sdfMouseShape;
                if (mouseShapeTypeDemo4 === 'circle') {
                    sdfMouseShape = p.dist(px, py, mouse_px, mouse_py) - MOUSE_SHAPE_SIZE_NORM_DEMO4;
                } else if (mouseShapeTypeDemo4 === 'square') {
                    sdfMouseShape = sdfBox(px - mouse_px, py - mouse_py, MOUSE_SHAPE_SIZE_NORM_DEMO4, MOUSE_SHAPE_SIZE_NORM_DEMO4);
                } else if (mouseShapeTypeDemo4 === 'triangle') {
                    sdfMouseShape = sdfEquilateralTriangleCorrected(px - mouse_px, py - mouse_py, MOUSE_SHAPE_SIZE_NORM_DEMO4);
                }
                
                sdfForAura = sminPoly(sdfForAura, sdfMouseShape, currentSmoothnessK);

                const absSdf = Math.abs(sdfForAura);
                if (absSdf < AURA_SHARP_EDGE_THICKNESS_DEMO4 / 2.0) {
                    finalColor = COLOR_AURA_EDGE_DEMO4;
                } else {
                    const distNormFromEdge = absSdf - (AURA_SHARP_EDGE_THICKNESS_DEMO4 / 2.0);
                    const effectiveDistFromEdge = distNormFromEdge - timeShift;
                    const rawLineCycleVal = effectiveDistFromEdge / AURA_LINE_SPACING_DEMO4;
                    const lineCyclePos = ((rawLineCycleVal % 1.0) + 1.0) % 1.0;
                    const lineNum = Math.floor(rawLineCycleVal);
                    let t_lerp;

                    if (sdfForAura < 0) {
                        if (lineCyclePos < AURA_LINE_WIDTH_FACTOR_DEMO4) {
                            t_lerp = Math.max(0, Math.min(1, lineNum / AURA_MAX_INTERNAL_LINES_DEMO4));
                            finalColor = lerpColorJS(COLOR_AURA_INSIDE_LINE_NEAR_DEMO4, COLOR_AURA_INSIDE_LINE_FAR_DEMO4, t_lerp);
                        } else { finalColor = COLOR_AURA_INSIDE_FILL_DEMO4; }
                    } else {
                        if (lineCyclePos < AURA_LINE_WIDTH_FACTOR_DEMO4) {
                            t_lerp = Math.max(0, Math.min(1, lineNum / AURA_MAX_EXTERNAL_LINES_DEMO4));
                            finalColor = lerpColorJS(COLOR_AURA_OUTSIDE_LINE_NEAR_DEMO4, COLOR_AURA_OUTSIDE_LINE_FAR_DEMO4, t_lerp);
                        } else {
                            const t_fill_fade = Math.max(0, Math.min(1, effectiveDistFromEdge / AURA_EXTERNAL_FILL_FADE_DISTANCE_DEMO4));
                            finalColor = lerpColorJS(COLOR_AURA_OUTSIDE_FILL_DEMO4, COLOR_BLACK_DEMO4, t_fill_fade);
                        }
                    }
                }
                
                const r_col = finalColor[0];
                const g_col = finalColor[1];
                const b_col = finalColor[2];

                const blockStartX = Math.floor(gx_block * actualPixelBlockSize);
                const blockEndX = Math.floor((gx_block + 1) * actualPixelBlockSize);
                const blockStartY = Math.floor(gy_block * actualPixelBlockSize);
                const blockEndY = Math.floor((gy_block + 1) * actualPixelBlockSize);

                for (let cy = blockStartY; cy < blockEndY; cy++) {
                    for (let cx = blockStartX; cx < blockEndX; cx++) {
                        if (cx >= 0 && cx < p.width && cy >= 0 && cy < p.height) {
                            const index = (cx + cy * p.width) * 4;
                            p.pixels[index + 0] = r_col;
                            p.pixels[index + 1] = g_col;
                            p.pixels[index + 2] = b_col;
                            p.pixels[index + 3] = 255;
                        }
                    }
                }
            }
        }
        p.updatePixels();
    };

    // Definisci qui le costanti usate sopra, es:
    const COLOR_BLACK_DEMO4 = [0, 0, 0, 255];
    const AURA_ANIMATION_SPEED_DEMO4 = 0.0007;
    // ... e tutte le altre costanti come STATIC_CIRCLE_CENTER_X_NORM_DEMO4, ecc.
    // Queste costanti devono essere definite *all'interno* di sketchDemo4Code
    // o passate in qualche modo se sono dinamiche, oppure rimanere globali se sono
    // veramente costanti di configurazione solo per questo file.
    // Per semplicità, le ho lasciate fuori, ma è meglio averle dentro o chiaramente namespaced.
    // Per questo esempio, assumo che le costanti definite all'inizio del file sketchDemo4.js
    // siano accessibili. Se le sposti dentro, rimuovile dall'inizio del file.

    // Esempio di definizione costanti DENTRO la funzione per incapsulamento:
    const MOUSE_SHAPE_SIZE_NORM_DEMO4 = 0.35;
    const STATIC_CIRCLE_CENTER_X_NORM_DEMO4 = 0.6;
    const STATIC_CIRCLE_CENTER_Y_NORM_DEMO4 = -0.6;
    const STATIC_CIRCLE_RADIUS_NORM_DEMO4 = 0.25;
    const SQUARE_CENTER_X_NORM_DEMO4 = -0.6;
    const SQUARE_CENTER_Y_NORM_DEMO4 = 0.0;
    const SQUARE_HALF_SIZE_NORM_DEMO4 = 0.2;
    const TRIANGLE_CENTER_X_NORM_DEMO4 = 0.6;
    const TRIANGLE_CENTER_Y_NORM_DEMO4 = 0.5;
    const TRIANGLE_SIZE_PARAM_NORM_DEMO4 = 0.2;
    const AURA_SHARP_EDGE_THICKNESS_DEMO4 = 0.008;
    const AURA_LINE_SPACING_DEMO4 = 0.035;
    const AURA_LINE_WIDTH_FACTOR_DEMO4 = 0.35;
    const AURA_MAX_INTERNAL_LINES_DEMO4 = 8;
    const AURA_MAX_EXTERNAL_LINES_DEMO4 = 15;
    const AURA_EXTERNAL_FILL_FADE_DISTANCE_DEMO4 = AURA_MAX_EXTERNAL_LINES_DEMO4 * AURA_LINE_SPACING_DEMO4 * 2.0;
    const COLOR_AURA_EDGE_DEMO4 = [255, 255, 255];
    const COLOR_AURA_INSIDE_LINE_NEAR_DEMO4 = [190, 210, 255];
    const COLOR_AURA_INSIDE_LINE_FAR_DEMO4 = [90, 130, 220];
    const COLOR_AURA_INSIDE_FILL_DEMO4 = [30, 50, 90];
    const COLOR_AURA_OUTSIDE_LINE_NEAR_DEMO4 = [255, 200, 100];
    const COLOR_AURA_OUTSIDE_LINE_FAR_DEMO4 = [180, 100, 0];
    const COLOR_AURA_OUTSIDE_FILL_DEMO4 = [50, 25, 0];

}; // Fine di sketchDemo4Code