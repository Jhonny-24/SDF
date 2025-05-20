const Csize =1200;

function setup() {
  createCanvas(Csize,Csize);
}
function draw() {   
  const pix = 10;
  const soglia = pix * 0.5 / width * 2; 
  
  const normMouseX = mouseX / width * 2 - 1;
  const normMouseY = mouseY / height * 2 - 1;
  const onde = 160; 
  
  background(0); 

  stroke(255); 
  strokeWeight(0.5);
  
  const numPixX = floor(Csize / pix);
  const numPixY = floor(Csize / pix); 

  for (let j = 0; j < numPixX; j++) {    
    for (let i = 0; i < numPixY; i++) {   

        const u = i / (numPixX - 1) * 2 - 1;
        const v = j / (numPixY - 1) * 2 - 1;
        
        const r1 = rettangolo(v+0.5, u+0.5, 0.25, 0.35); 
        const c1 = cerchio(v-0.5, u+0.5, 0.3);
        const c2 = cerchio(v-normMouseX, u-normMouseY, 0.1);
        
      const bordor1 = abs(r1) < soglia ; 
      const bordoc1 = abs(c1) < soglia ; 
      const bordoc2 = abs(c2) < soglia ; 

      const unione = min(c2, min(c1, r1)); 
      const bordoUnione = abs(unione) < soglia; 

      const valoreOnde = sin(unione * onde ) * 0.5 + 0.5; 

      if (bordoUnione) { 
        fill(255); 
      } else if (unione < 0) { 
        if (valoreOnde < 0.5) {
          fill(255, 0, 0); 
        } else {
          fill(0);
        }
      } else {
        if (valoreOnde > 0.5) {
          fill(0, 255, 0); 
        } else {
          fill(0);
        }
      }

      rect(j * pix, i * pix, pix, pix); 
    }
  }
}

function rettangolo(px, py, halfWidth, halfHeight) {
	const dx = abs(px) - halfWidth;
	const dy = abs(py) - halfHeight;
	if (dx <= 0 && dy <= 0) return max(dx, dy); // punto interno, ensure r1 is negative
	const ox = max(dx, 0);
	const oy = max(dy, 0);
	return sqrt(ox * ox + oy * oy); // distanza esterna
  }

  
  function cerchio(x, y, r) {
    return sqrt(x ** 2 + y ** 2) - r;
  }
  