let sliderSmoothK;
let currentOperation = "union"; // Default operation

// Variabili per i pulsanti
let btnAddition, btnSubtraction, btnIntersection;
let canvasXOffset = 60; // Offset per posizionare il canvas
let buttonSize = 40; // Dimensione dei pulsanti
let buttonSpacing = 60; // Spazio tra i pulsanti

function setup() {
  // Crea il canvas con un offset per lasciare spazio ai pulsanti
  let canvas = createCanvas(min(windowWidth,1200),min(windowWidth,1200));
  canvas.position(canvasXOffset, 0);
  
  // Centramento bottoni nello spazio a sinistra
  let buttonX = (canvasXOffset - buttonSize) / 2;
  
  // Crea i pulsanti HTML alla sinistra del canvas
  btnAddition = createButton('+');
  btnAddition.position(buttonX-10, 0); // Allineato al bordo superiore del canvas
  btnAddition.size(buttonSize, buttonSize);
  btnAddition.style('background-color', 'black');
  btnAddition.style('color', 'white');
  btnAddition.style('border', '1px solid white');
  btnAddition.style('font-size', '24px');
  btnAddition.mousePressed(() => currentOperation = "union");
  
  btnSubtraction = createButton('-');
  btnSubtraction.position(buttonX-10, buttonSpacing);
  btnSubtraction.size(buttonSize, buttonSize);
  btnSubtraction.style('background-color', 'black');
  btnSubtraction.style('color', 'white');
  btnSubtraction.style('border', '1px solid white');
  btnSubtraction.style('font-size', '24px');
  btnSubtraction.mousePressed(() => currentOperation = "subtraction");
  
  btnIntersection = createButton('∩');
  btnIntersection.position(buttonX-10, buttonSpacing * 2);
  btnIntersection.size(buttonSize, buttonSize);
  btnIntersection.style('background-color', 'black');
  btnIntersection.style('color', 'white');
  btnIntersection.style('border', '1px solid white');
  btnIntersection.style('font-size', '24px');
  btnIntersection.mousePressed(() => currentOperation = "intersection");
  
  // Crea lo slider verticale al centro rispetto ai pulsanti
  sliderSmoothK = createSlider(0.01, 1, 0.5, 0.01); // min, max, value, step
  sliderSmoothK.position(buttonX+11, buttonSpacing * 3 );
  sliderSmoothK.style('width', '180px');
  
  // Applica gli stili allo slider
  sliderSmoothK.style('appearance', 'none');
  sliderSmoothK.style('-webkit-appearance', 'none');
  sliderSmoothK.style('background', '#333333');
  sliderSmoothK.style('height', '5px');
  sliderSmoothK.style('outline', 'none');
  
  // Crea uno stile per la manopola dello slider GIALLA
  let styleElem = document.createElement('style');
  styleElem.innerHTML = `
    #${sliderSmoothK.elt.id}::-webkit-slider-thumb {
      -webkit-appearance: none !important;
      appearance: none !important;
      width: 15px !important;
      height: 15px !important;
      border-radius: 50% !important;
      background: #ffff00 !important; /* Giallo */
      cursor: pointer !important;
      border: none !important;
    }
    #${sliderSmoothK.elt.id}::-moz-range-thumb {
      width: 15px !important;
      height: 15px !important;
      border-radius: 50% !important;
      background: #ffff00 !important; /* Giallo */
      cursor: pointer !important;
      border: none !important;
    }
  `;
  document.head.appendChild(styleElem);
  
  // Applica la rotazione per renderlo verticale
  sliderSmoothK.style('transform', 'rotate(90deg)');
  sliderSmoothK.style('transform-origin', 'left top');
}

function draw() {   
  const pix = min(windowWidth, 1200)/120;
  const soglia = pix * 0.5 / windowWidth * 2; 
  
  const normMouseX = mouseX / windowWidth * 2 - 1;
  const normMouseY = mouseY / min(windowWidth,1200) * 2 - 1;
  const onde = 80; 
  
  const kValue = sliderSmoothK.value();

  background(0); 

  noStroke();
  
  const numPixX = floor(min(1200,windowWidth) / pix);
  const numPixY = floor(min(1200,windowWidth) / pix); 

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
  strokeWeight(0.5*(windowHeight/windowWidth));

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
  btnAddition.style('background-color', currentOperation === "union" ? '#ffff00' : 'black');
  btnAddition.style('color', currentOperation === "union" ? 'black' : 'white');
  
  btnSubtraction.style('background-color', currentOperation === "subtraction" ? '#ffff00' : 'black');
  btnSubtraction.style('color', currentOperation === "subtraction" ? 'black' : 'white');
  
  btnIntersection.style('background-color', currentOperation === "intersection" ? '#ffff00' : 'black');
  btnIntersection.style('color', currentOperation === "intersection" ? 'black' : 'white');
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