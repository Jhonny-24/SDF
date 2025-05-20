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
        const c1 = cerchio(v, u, 0.8); 

        const onde = 80;
        
        if (abs(c1) < soglia) {
          fill(255);
        } else {
          const valoreOnde = sin(c1 * onde + frameCount * 0.05) * 0.5 + 0.5; 
          if (c1 < 0) { 
            if (valoreOnde > 0.5) {
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

function cerchio(x, y, r) {
    return sqrt(x ** 2 + y ** 2) - r;
  }
  
