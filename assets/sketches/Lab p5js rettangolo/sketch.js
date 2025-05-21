function setup() {
  createCanvas(min(1200, windowWidth), min(windowHeight, 600));
}

function draw() {
  background(0);

  stroke(255);
  noFill();
  strokeWeight(2);

  const dimStatic  = min(400, windowHeight / 1.5)
  const DimStaticX = min(400, windowHeight / 1.5) + 100;
  const DimStaticY = min(400, windowHeight / 1.5);
  const raggStatic = dimStatic / 2;
  const raggStaticX = DimStaticX / 2;
  const raggStaticY = DimStaticY / 2;
  const centroStatic = min(600 / 2, windowHeight / 2) + 50;
  //const DimDinamic = raggDinamic * 2;

  // Calcola la distanza dal punto (mouseX, mouseY) al bordo del rettangolo
  // Questo è il calcolo chiave per la SDF del rettangolo
  const distToRectBorder = distanceToRectangle(
    mouseX, mouseY,
    centroStatic, centroStatic,
    DimStaticX, DimStaticY
  );

  rectMode(CENTER);
  rect(centroStatic, centroStatic, DimStaticX, DimStaticY);

  const distanza = dist(mouseX, mouseY, centroStatic, centroStatic);

  // Determina se il punto è dentro o fuori il rettangolo
  const isInside = isPointInsideRectangle(
    mouseX, mouseY,
    centroStatic, centroStatic,
    raggStaticX, raggStaticY
  );

  // Calcola il vettore direzione dal mouse al punto più vicino sul rettangolo
  const closestPoint = closestPointOnRectangle(
    mouseX, mouseY,
    centroStatic, centroStatic,
    raggStaticX, raggStaticY
  );

  // Colore della linea in base alla posizione (dentro o fuori)
  if (isInside) {
    stroke(255, 0, 0);
  } else {
    stroke(0, 255, 0);
  }

  // Disegna la linea dal mouse al punto più vicino sul rettangolo
  line(mouseX, mouseY, closestPoint.x, closestPoint.y);

  // Cerchio giallo tangente al rettangolo
  stroke(255, 255, 0);
  noFill();
  // Usa la distanza al bordo come raggio del cerchio
  ellipse(mouseX, mouseY, distToRectBorder * 2);

  // Punto al centro del cerchio giallo
  noStroke();
  fill(255, 255, 0);
  ellipse(mouseX, mouseY, raggStatic*0.1);// AHIOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

  // Visualizza la distanza dal bordo
  fill(255);
  textSize(14);
  textAlign(CENTER, CENTER);
  const midPointX = (mouseX + closestPoint.x) / 2;
  const midPointY = (mouseY + closestPoint.y) / 2;
  text(distToRectBorder.toFixed(0), midPointX, midPointY);

  
  
  // Visualizza la distanza dal centro
  //fill(255);
  //textSize(14);
  //textAlign(CENTER, CENTER);
  //text(distanza.toFixed(0), mouseX + 10, mouseY - 10);
}

// Funzione per calcolare la distanza minima da un punto a un rettangolo (SDF del rettangolo)
function distanceToRectangle(px, py, rectCenterX, rectCenterY, rectWidth, rectHeight) {
  // Calcola la distanza dal centro al bordo nelle direzioni x e y
  const halfWidth = rectWidth / 2;
  const halfHeight = rectHeight / 2;
  
  // Determina le coordinate relative al centro del rettangolo
  const dx = abs(px - rectCenterX) - halfWidth;
  const dy = abs(py - rectCenterY) - halfHeight;
  
  if (dx < 0 && dy < 0) {
    // Dentro il rettangolo: calcola la distanza minima a un bordo
    return -min(abs(dx), abs(dy));
  } else {
    // Fuori dal rettangolo
    const outsideX = max(0, dx);
    const outsideY = max(0, dy);
    return sqrt(outsideX * outsideX + outsideY * outsideY);
  }
}

// Funzione per verificare se un punto è dentro il rettangolo
function isPointInsideRectangle(px, py, rectCenterX, rectCenterY, halfWidth, halfHeight) {
  return (
    px >= rectCenterX - halfWidth &&
    px <= rectCenterX + halfWidth &&
    py >= rectCenterY - halfHeight &&
    py <= rectCenterY + halfHeight
  );
}

// Funzione per trovare il punto più vicino sul rettangolo a partire da un punto dato
function closestPointOnRectangle(px, py, rectCenterX, rectCenterY, halfWidth, halfHeight) {
  let closestX, closestY;
  
  // Calcola i limiti del rettangolo
  const left = rectCenterX - halfWidth;
  const right = rectCenterX + halfWidth;
  const top = rectCenterY - halfHeight;
  const bottom = rectCenterY + halfHeight;
  
  // Trova il punto più vicino
  if (px < left) {
    closestX = left;
  } else if (px > right) {
    closestX = right;
  } else {
    closestX = px;
  }
  
  if (py < top) {
    closestY = top;
  } else if (py > bottom) {
    closestY = bottom;
  } else {
    closestY = py;
  }
  
  // Se il punto è dentro il rettangolo, troviamo il bordo più vicino
  if (isPointInsideRectangle(px, py, rectCenterX, rectCenterY, halfWidth, halfHeight)) {
    // Calcola la distanza a ciascun bordo
    const distToLeft = px - left;
    const distToRight = right - px;
    const distToTop = py - top;
    const distToBottom = bottom - py;
    
    // Trova la distanza minima
    const minDist = min(distToLeft, distToRight, distToTop, distToBottom);
    
    if (minDist === distToLeft) {
      closestX = left;
      closestY = py;
    } else if (minDist === distToRight) {
      closestX = right;
      closestY = py;
    } else if (minDist === distToTop) {
      closestX = px;
      closestY = top;
    } else {
      closestX = px;
      closestY = bottom;
    }
  }
  
  return { x: closestX, y: closestY };
}