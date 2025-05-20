const Csize =1200;

function setup() {
  createCanvas(Csize,Csize);
}
function draw() {   
  const pix = 20;
  const soglia = pix * 0.5 / width * 2; 
  
  background(0); 

  stroke(255); 
  strokeWeight(2);
  
  const numPixX = floor(Csize / pix);
  const numPixY = floor(Csize / pix); 

  for (let j = 0; j < numPixX; j++) {    
    for (let i = 0; i < numPixY; i++) {   

        const u = i / (numPixX - 1) * 2 - 1;
        const v = j / (numPixY - 1) * 2 - 1;
      

        const r1 = rettangolo(u, v, 0.6, 0.35); 
        const c1 = cerchio(u, v, 0.7)

      const bordor1 = abs(r1) < soglia ; 
      const bordoc1 = abs(c1) < soglia  ; 


      //if (c1 <= 0) {
      //  fill(255)
      //} else {
      //  fill (0)
      //}
      if ((abs(c1) < soglia) || (r1 < 0)) {
        fill(255);
      } else {
        fill(0);   
      }

      rect(j * pix, i * pix, pix, pix); 
    }
  }
}

function rettangolo(px, py, halfWidth, halfHeight) {
	const dx = abs(px) - halfWidth;
	const dy = abs(py) - halfHeight;
	if (dx <= 0 && dy <= 0) return min(-dx, -dy); // punto interno
	const ox = max(dx, 0);
	const oy = max(dy, 0);
	return sqrt(ox * ox + oy * oy); // distanza esterna
  }
  
  function cerchio(x, y, r) {
    return sqrt(x ** 2 + y ** 2) - r;
  }
  