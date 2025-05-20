const Csize =600;

function setup() {
  createCanvas(Csize,Csize);
}
function draw() {   
  const pix = 10;
  const soglia = pix * 0.5 / width * 2;
  
  background(0); 

  stroke(255); 
  strokeWeight(0.5);
  
  const numPixX = floor(Csize / pix);
  const numPixY = floor(Csize / pix); 

  for (let j = 0; j < numPixX; j++) {    
    for (let i = 0; i < numPixY; i++) {   

        const u = (numPixY <= 1) ? 0 : map(i, 0, numPixY - 1, -1, 1);
        const v = (numPixX <= 1) ? 0 : map(j, 0, numPixX - 1, -1, 1); 
        const r1 = rettangolo(v, u, 0.4, 0.6); 

        const onde = 80;
        
        if (abs(r1) < soglia) {
          fill(255);
        } else {
          const valoreOnde = sin(r1 * onde + frameCount * 0.05) * 0.5 + 0.5; 
          if (r1 < 0) { 
            if (valoreOnde <
               0.5) {
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
