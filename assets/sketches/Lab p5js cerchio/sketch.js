
function setup() {
  createCanvas(min(1200,windowWidth),min(windowHeight,600));
}
function draw() {   

  background(0); 

  stroke(255)
  noFill();
  strokeWeight(2);

  const DimStatic = min(400,windowHeight/1.8) ;
  const raggStatic = DimStatic / 2;
  const centroStaticX = min(1200/2, windowWidth / 2);
  const centroStaticY = min(1200/2, windowHeight / 2);

  ellipse(centroStaticX, centroStaticY, DimStatic);
  
  const distanza = dist(mouseX, mouseY, centroStaticX, centroStaticY);
  
  const centroDinamic = (mouseX, mouseY)
  const raggDinamic = abs(distanza - raggStatic);
  const DimDinamic = raggDinamic * 2;
  
  //da rivdere da qui in poi 
  const CentroX = centroStaticX - mouseX
  const CentroY = centroStaticY - mouseY
  
  const linea = sqrt ( CentroX*CentroX + CentroY * CentroY)

  let normcentroX = 0
  let normcentroY = 0

  if (linea > 0) {
    normcentroX = CentroX / linea 
    normcentroY = CentroY / linea
  }
 let distfinaleX = normcentroX
 let distfinaleY = normcentroY

  if(linea < raggStatic && linea > 0) {
    distfinaleX = -normcentroX
    distfinaleY = -normcentroY
  }

  const lineEndX = mouseX + distfinaleX* raggDinamic
  const lineEndY = mouseY + distfinaleY* raggDinamic


  if (distanza < raggStatic) {
    stroke(255, 0, 0); 
  } else {
    stroke(0, 255, 0); 
  }
  line (mouseX, mouseY, lineEndX, lineEndY)


  stroke(255,255, 0)
  ellipse(mouseX, mouseY, DimDinamic);

  noStroke()
  fill(255, 255, 0)
  ellipse(mouseX, mouseY, raggStatic*0.1)

  fill(255); 
  textSize(14);
  textAlign(CENTER, CENTER);


  const greenLineMidX = (mouseX + lineEndX) / 2;
  const greenLineMidY = (mouseY + lineEndY) / 2;
  text(raggDinamic.toFixed(0), greenLineMidX, greenLineMidY);
}

