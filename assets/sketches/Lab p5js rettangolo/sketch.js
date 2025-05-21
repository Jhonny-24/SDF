function setup() {
  createCanvas(min(1200, windowWidth), windowHeight);
  // Aggiungi console.log come nel codice del cerchio per monitorare il valore responsivo
  
}
function draw() {
  background(0);

  // Dimensioni e caratteristiche responsive, come nel codice del cerchio
  const dimStatic = min(400, windowHeight / 1.5);
  const DimStaticX = min(400, windowHeight / 3);
  const DimStaticY = min(400, windowHeight / 1.5);
  const raggStatic = dimStatic / 2;
  const raggStaticX = DimStaticX / 2;
  const raggStaticY = DimStaticY / 2;
  const centroStaticX = min(1200 / 2, windowWidth / 2);
  const centroStaticY = min(1200 / 2, windowHeight / 2);
  
  // Valore responsivo prelevato dal codice del cerchio, esattamente come definito lì
  const ValoreResponsivo = raggStatic * 0.07;
  
  // Implementazione dello strokeWeight responsivo dal codice del cerchio
  stroke(255);
  noFill();
  if (ValoreResponsivo > 2) {
    strokeWeight(ValoreResponsivo * 0.15);
  } else {
    strokeWeight(ValoreResponsivo * 0.20);
  }

  // Disegno del rettangolo
  rectMode(CENTER);
  rect(centroStaticX, centroStaticY, DimStaticX, DimStaticY);

  // Calcolo della distanza dal bordo del rettangolo (SDF)
  const distToRectBorder = distanceToRectangle(
    mouseX, mouseY,
    centroStaticX, centroStaticY,
    DimStaticX, DimStaticY
  );

  const distanza = dist(mouseX, mouseY, centroStaticX, centroStaticY);

  // Verifica se il punto è dentro o fuori il rettangolo
  const isInside = isPointInsideRectangle(
    mouseX, mouseY,
    centroStaticX, centroStaticY,
    raggStaticX, raggStaticY
  );

  // Trova il punto più vicino sul bordo del rettangolo
  const closestPoint = closestPointOnRectangle(
    mouseX, mouseY,
    centroStaticX, centroStaticY,
    raggStaticX, raggStaticY
  );

  // Colorazione della linea in base alla posizione
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
  // Usa la distanza al bordo come raggio del cerchio, garantendo che sia sempre positiva
  ellipse(mouseX, mouseY, abs(distToRectBorder) * 2);

  // Pallino giallo al centro con dimensione responsiva, esattamente come nel codice del cerchio
  noStroke();
  fill(255, 255, 0);
  let b;
  if (ValoreResponsivo > 2) {
    b = ValoreResponsivo * 1.8;
  } else if (ValoreResponsivo > 10) {
    b = ValoreResponsivo * 0.5;
  } else {
    b = ValoreResponsivo * 2; // Valore di default per casi non specificati
  }
  ellipse(mouseX, mouseY, b);

  // Visualizza la distanza dal bordo con dimensione del testo responsiva
  fill(255);
  textAlign(CENTER, CENTER);
  
  // Calcola il punto medio per il testo
  const midPointX = (mouseX + closestPoint.x) / 2;
  const midPointY = (mouseY + closestPoint.y) / 2;

  // Mostra il testo con dimensione responsiva e segno negativo se all'interno, esattamente come nel codice del cerchio
  if (isInside) {
    textSize(ValoreResponsivo * 2.5);
    text(-abs(distToRectBorder).toFixed(0), mouseX, mouseY - ValoreResponsivo * 3);
  } else {
    textSize(ValoreResponsivo * 2.5);
    text(abs(distToRectBorder).toFixed(0), mouseX, mouseY - ValoreResponsivo*3);
  }
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