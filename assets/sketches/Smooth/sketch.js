let sliderSmoothK;

function setup() {
  createCanvas(min(windowWidth,1200),min(windowWidth,1200));
  sliderSmoothK = createSlider(0.01, 1, 0.5, 0.01); // min, max, value, step
  sliderSmoothK.position(10, 10); 
  sliderSmoothK.style('width', '180px');
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

      const unione = opSmoothUnion(c2, c1, r1, kValue); 
      const bordoUnione = abs(unione) < soglia; 

      const valoreOnde = sin(unione * onde) * 0.5 + 0.5*0.1; 

if (unione < 0) { 
          fill(valoreOnde*255*2, 0, 0); 
      } else {
        if (unione>0) {
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
  
  function opSmoothUnion(  d1, d2,d3, k )
{
    // Smooth union of d1 and d2
    let res_d1_d2 = sUnionBinary(d1, d2, k);
    // Smooth union of the result with d3
    return sUnionBinary(res_d1_d2, d3, k);
}
