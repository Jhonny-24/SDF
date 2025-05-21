let sliderSmoothK;
let currentOperation = "union"; // Default operation

let canvasXOffset = 60; // Offset per posizionare il canvas (fixed)

let btnAddition, btnSubtraction, btnIntersection;

// Base dimensions for UI elements
const baseButtonSize = 40;
const baseButtonSpacing = 60;
const baseButtonFontSize = 24;
const baseSliderWidth = 180; // Length of the slider
const baseSliderThickness = 2; // Thickness of the slider bar (2px, double button border)
const baseSliderThumbSize = 15;
const buttonRelativeX = -10; // X offset for buttons relative to their centered calculation
const sliderRelativeX = 11;  // X offset for slider relative to its centered calculation

// let currentSliderTrackColor = '#ffffff'; // Removed: Track is always white
let currentSliderThumbColor = '#ffff00'; // Default: yellow (changed from white)

function _applyResponsiveUiStyles() {
  let scale = (windowWidth < 600 && windowWidth > 0) ? 0.5 : 1.0;

  let currentButtonSize = baseButtonSize * scale;
  let currentButtonSpacing = baseButtonSpacing * scale;
  let currentButtonFontSize = baseButtonFontSize * scale;
  let currentSliderWidth = baseSliderWidth * scale;
  let currentSliderThickness = baseSliderThickness * scale;
  let currentSliderThumbSize = baseSliderThumbSize * scale;

  // Calculate horizontal position base for centered elements within canvasXOffset
  let buttonX = (canvasXOffset - currentButtonSize) / 2;

  // Update buttons
  btnAddition.position(buttonX + buttonRelativeX, 0);
  btnAddition.size(currentButtonSize, currentButtonSize);
  btnAddition.style('font-size', currentButtonFontSize + 'px');

  btnSubtraction.position(buttonX + buttonRelativeX, currentButtonSpacing);
  btnSubtraction.size(currentButtonSize, currentButtonSize);
  btnSubtraction.style('font-size', currentButtonFontSize + 'px');

  btnIntersection.position(buttonX + buttonRelativeX, currentButtonSpacing * 2);
  btnIntersection.size(currentButtonSize, currentButtonSize);
  btnIntersection.style('font-size', currentButtonFontSize + 'px');

  // Determine the slider's X offset based on scale
  let currentSliderXOffset = sliderRelativeX; // Default (11)
  if (scale === 0.5) {
    currentSliderXOffset = 0; // When small, use button's relative X (-10) to move it left
  }

  // Update slider
  sliderSmoothK.position(buttonX + currentSliderXOffset, currentButtonSpacing * 3);
  sliderSmoothK.style('width', currentSliderWidth + 'px');
  sliderSmoothK.style('height', currentSliderThickness + 'px');
  sliderSmoothK.style('background', '#ffffff'); // Track is always white

  // Update slider thumb style (remove old, add new)
  const styleId = 'sliderThumbStyle';
  let existingStyleElement = document.getElementById(styleId);
  if (existingStyleElement) {
    existingStyleElement.remove();
  }
  let styleElem = document.createElement('style');
  styleElem.id = styleId;
  styleElem.innerHTML = `
    #${sliderSmoothK.elt.id}::-webkit-slider-thumb {
      -webkit-appearance: none !important;
      appearance: none !important;
      width: ${currentSliderThumbSize}px !important;
      height: ${currentSliderThumbSize}px !important;
      border-radius: 0 !important; /* Changed from 50% to 0 for square */
      background: ${currentSliderThumbColor} !important; /* Use variable for thumb color */
      cursor: pointer !important;
      border: none !important; // Ensures no outline
    }
    #${sliderSmoothK.elt.id}::-moz-range-thumb {
      width: ${currentSliderThumbSize}px !important;
      height: ${currentSliderThumbSize}px !important;
      border-radius: 50% !important;
      background: ${currentSliderThumbColor} !important; /* Use variable for thumb color */
      cursor: pointer !important;
      border: none !important; // Ensures no outline
    }
  `;
  document.head.appendChild(styleElem);
}

function setup() {
  let canvas = createCanvas(min(windowWidth,1200),min(windowWidth,1200));
  canvas.position(canvasXOffset, 0);
  
  btnAddition = createButton('+');
  // Initial minimal styling, position/size set by _applyResponsiveUiStyles
  btnAddition.style('background-color', 'black');
  btnAddition.style('color', 'white');
  btnAddition.style('border', '1px solid white');
  btnAddition.mousePressed(() => currentOperation = "union");
  
  btnSubtraction = createButton('-');
  btnSubtraction.style('background-color', 'black');
  btnSubtraction.style('color', 'white');
  btnSubtraction.style('border', '1px solid white');
  btnSubtraction.mousePressed(() => currentOperation = "subtraction");
  
  btnIntersection = createButton('∩');
  btnIntersection.style('background-color', 'black');
  btnIntersection.style('color', 'white');
  btnIntersection.style('border', '1px solid white');
  btnIntersection.mousePressed(() => currentOperation = "intersection");
  
  sliderSmoothK = createSlider(0.01, 1, 0.5, 0.01);
  sliderSmoothK.style('appearance', 'none');
  sliderSmoothK.style('-webkit-appearance', 'none');
  sliderSmoothK.style('outline', 'none');
  sliderSmoothK.style('transform', 'rotate(90deg)');
  sliderSmoothK.style('transform-origin', 'left top');

  // Event handlers for slider color change
  sliderSmoothK.input(() => {
    // currentSliderTrackColor = '#ffff00'; // Removed: Track stays white
    currentSliderThumbColor = '#ffff00'; // Yellow
    _applyResponsiveUiStyles(); 
  });

  sliderSmoothK.changed(() => {
    // currentSliderTrackColor = '#ffffff'; // Removed: Track stays white
    currentSliderThumbColor = '#ffffff'; // White
    _applyResponsiveUiStyles(); 
  });

  _applyResponsiveUiStyles(); // Apply initial styles
}

function windowResized() {
  let newCanvasWidth = min(windowWidth,1200);
  let newCanvasHeight = min(windowWidth,1200); // Keeping canvas square based on width
  resizeCanvas(newCanvasWidth, newCanvasHeight);
  
  let mainCanvas = select('canvas');
  if (mainCanvas) {
    mainCanvas.position(canvasXOffset, 0);
  }
  _applyResponsiveUiStyles();
}

function draw() {   
  const canvasActualWidth = width; // p5.js 'width' is canvas width
  const canvasActualHeight = height; // p5.js 'height' is canvas height

  const pix = min(canvasActualWidth, canvasActualHeight)/120; 
  const soglia = pix * 0.5 / canvasActualWidth * 2; 
  
  // Adjust mouseX for canvas offset before normalization
  const normMouseX = mouseX / canvasActualWidth * 2 - 1;
  const normMouseY = mouseY / canvasActualHeight * 2 - 1; // mouseY is fine if canvas Y is 0
  const onde = 80; 
  
  const kValue = sliderSmoothK.value();

  background(0); 

  noStroke();
  
  const numPixX = floor(canvasActualWidth / pix);
  const numPixY = floor(canvasActualHeight / pix); 

  for (let j = 0; j < numPixX; j++) {    
    for (let i = 0; i < numPixY; i++) {   

        const u = i / (numPixX - 1) * 2 - 1;
        const v = j / (numPixY - 1) * 2 - 1;
        
        const r1 = rettangolo(v+0.5, u+0.5, 0.25, 0.35, 45); 
        const c1 = cerchio(v-0.5, u+0.5, 0.3);
        const c2 = cerchio(v-normMouseX, u-normMouseY, 0.1);
        
      const bordor1 = abs(r1) < soglia ; 
      const bordoc1 = abs(c1) < soglia ; 
      const bordoc2 = abs(c2) < soglia ; 

      let result;
      switch(currentOperation) {
        case "union":
          result = opSmoothUnion(c2, c1, r1, kValue); 
          break;
        case "subtraction":
          result = opSmoothSubtraction(c2, c1, r1, kValue);
          break;
        case "intersection":
          result = opSmoothIntersection(c2, c1, r1, kValue);
          break;
      }
      const bordoUnione = abs(result) < soglia; 

      const valoreOnde = sin(result * onde) * 0.5 + 0.5*0.1; 

      if (result < 0) { 
        fill(valoreOnde*255*2, 0, 0); 
      } else {
        if (result>0) {
          fill(0, valoreOnde*255*2, 0); 
        } else {
          fill(0);
        }
      }
      if (abs(bordoUnione)>soglia){
        fill(255)
      } 
      rect(j * pix, i * pix, pix, pix); 
    }
  }
  
  stroke(255);
  strokeWeight(0.5 * (canvasActualHeight > 0 ? (canvasActualHeight / canvasActualWidth) : 1));

  for(let i =0; i<numPixX+1; i++) {
    const x = i*pix
    line(x, 0, x, height)
  }
  for(let i =0; i<numPixY+1; i++) {
    const y = i*pix
    line(0, y, width, y)
  }
  
  // Aggiorna lo stile dei pulsanti in base all'operazione corrente
  updateButtonStyles();
}

function updateButtonStyles() {
  // Imposta lo stile del pulsante attivo (giallo quando selezionato)
  if (currentOperation === "union") {
    btnAddition.style('background-color', '#ffff00');
    btnAddition.style('color', 'black');
    btnAddition.style('border', '1px solid #ffff00'); // Bordo giallo
  } else {
    btnAddition.style('background-color', 'black');
    btnAddition.style('color', 'white');
    btnAddition.style('border', '1px solid white'); // Bordo bianco
  }
  
  if (currentOperation === "subtraction") {
    btnSubtraction.style('background-color', '#ffff00');
    btnSubtraction.style('color', 'black');
    btnSubtraction.style('border', '1px solid #ffff00'); // Bordo giallo
  } else {
    btnSubtraction.style('background-color', 'black');
    btnSubtraction.style('color', 'white');
    btnSubtraction.style('border', '1px solid white'); // Bordo bianco
  }
  
  if (currentOperation === "intersection") {
    btnIntersection.style('background-color', '#ffff00');
    btnIntersection.style('color', 'black');
    btnIntersection.style('border', '1px solid #ffff00'); // Bordo giallo
  } else {
    btnIntersection.style('background-color', 'black');
    btnIntersection.style('color', 'white');
    btnIntersection.style('border', '1px solid white'); // Bordo bianco
  }
}

function rettangolo(px, py, halfWidth, halfHeight, angDegrees) {

  const c = cos(angDegrees);
  const s = sin(angDegrees);

  const px_rotated = c * px + s * py;
  const py_rotated = -s * px + c * py;

  const dx = abs(px_rotated) - halfWidth;
  const dy = abs(py_rotated) - halfHeight;

  if (dx <= 0 && dy <= 0) { 
    return max(dx, dy);    
  } else { 
    const ox = max(dx, 0); 
    const oy = max(dy, 0);
    return sqrt(ox * ox + oy * oy); 
  }
}

  
function cerchio(x, y, r) {
  return sqrt(x ** 2 + y ** 2) - r;
}


//da rifare


function sUnionBinary(sd1, sd2, k_local) {
    const h_local = constrain(0.5 + 0.5 * (sd2 - sd1) / k_local, 0.0, 1.0);
    return lerp(sd2, sd1, h_local) - k_local * h_local * (1.0 - h_local);
}

// Binary smooth subtraction function
function sSubtractionBinary(sd1, sd2, k_local) {
    const h_local = constrain(0.5 - 0.5 * (sd2 + sd1) / k_local, 0.0, 1.0);
    return lerp(sd2, -sd1, h_local) + k_local * h_local * (1.0 - h_local);
}

// Binary smooth intersection function
function sIntersectionBinary(sd1, sd2, k_local) {
    const h_local = constrain(0.5 - 0.5 * (sd2 - sd1) / k_local, 0.0, 1.0);
    return lerp(sd2, sd1, h_local) + k_local * h_local * (1.0 - h_local);
}
  
function opSmoothUnion(d1, d2, d3, k) {
    // Smooth union of d1 and d2
    let res_d1_d2 = sUnionBinary(d1, d2, k);
    // Smooth union of the result with d3
    return sUnionBinary(res_d1_d2, d3, k);
}

function opSmoothSubtraction(d1, d2, d3, k) {
    // For subtraction: smoothly blend between -d1 and min(d2, d3)
    // First get the minimum between d2 and d3
    const minD2D3 = min(d2, d3);
    // Then blend between -d1 and minD2D3
    const h = constrain(0.5 + 0.5 * (-d1 - minD2D3) / k, 0.0, 1.0);
    return lerp(minD2D3, -d1, h) - k * h * (1.0 - h);
}

function opSmoothIntersection(d1, d2, d3, k) {
    // For intersection: smoothly blend between d1 and min(d2, d3)
    // First get the minimum between d2 and d3
    const minD2D3 = min(d2, d3);
    // Then blend between d1 and minD2D3
    const h = constrain(0.5 + 0.5 * (d1 - minD2D3) / k, 0.0, 1.0);
    return lerp(minD2D3, d1, h) - k * h * (1.0 - h);
}