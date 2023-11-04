let radii;
let colorsList = []; // 合并后的颜色列表

function setup() {
  let canvas = createCanvas(800, 800); // 将画布大小固定为800x800像素
  canvas.style('display', 'block');
  canvas.position((windowWidth - 800) / 2, (windowHeight - 800) / 2); // 将画布移动到网页的中心

  gridWidth = 800;
  gridHeight = 800;
  hexagonSize = 300;
  background(4, 81, 123);
  angleMode(DEGREES);

  radii = [110, 60, 35];
}
function getColorsForPosition(row, col) {
  if (!colorsList[row]) colorsList[row] = [];

  if (!colorsList[row][col]) {
    let colorsForThisSet = [];

    // 为TwistedHexagon添加颜色
    colorsForThisSet.push(color(random(255), random(255), random(255)));

    // 为同心圆添加颜色
    for (let r of radii) {
      colorsForThisSet.push(color(random(255), random(255), random(255)));
    }

    // 为小圆点添加颜色
    colorsForThisSet.push(color(random(255), random(255), random(255)));
    colorsForThisSet.push(color(random(255), random(255), random(255)));
    colorsForThisSet.push(color(random(255), random(255), random(255)));

    colorsList[row][col] = colorsForThisSet;
  }

  return colorsList[row][col];
}

function drawTwistedHexagon(cX, cY, r, col, row) {
  let colors = getColorsForPosition(row, col);
  fill(colors[0]);

  for (let a = 0; a < 360; a += 60) {
    let x1 = cX + r * cos(a);
    let y1 = cY + r * sin(a);

    //为每个顶点绘制深褐色同心圆和白色圆点
    push();
    strokeWeight(4); // 设置描边的宽度为2
    stroke(255, 100, 0); // 描边为橘色
    fill(101, 67, 33); // 填充为深褐色
    ellipse(x1, y1, 30, 30); // 绘制深褐色的同心圆
    pop();

    push();
    noStroke(); // 移除描边
    fill(255); // 填充为白色
    ellipse(x1, y1, 15, 15); // 绘制白色的小圆点
    pop();


    let x2 = cX + r * cos(a + 60);
    let y2 = cY + r * sin(a + 60);

    let segments = 2; // 分成2段
    for (let i = 0; i < segments; i++) {
      let startX = lerp(x1, x2, i / segments);
      let startY = lerp(y1, y2, i / segments);

      let endX = lerp(x1, x2, (i + 1) / segments);
      let endY = lerp(y1, y2, (i + 1) / segments);

      let midX = (startX + endX) / 2;
      let midY = (startY + endY) / 2;

      let cp1x = midX + (startY - endY) * 0.3; // 控制点1，调整0.1来改变控制点的距离
      let cp1y = midY + (endX - startX) * 0.3;

      let cp2x = midX - (startY - endY) * 0.3; // 控制点2
      let cp2y = midY - (endX - startX) * 0.3;


      // 绘制两条贝塞尔曲线
      beginShape();
      vertex(startX, startY);
      bezierVertex(cp1x, cp1y, cp2x, cp2y, endX, endY);
      endShape();

      beginShape();
      vertex(startX, startY);
      bezierVertex(cp2x, cp2y, cp1x, cp1y, endX, endY);
      endShape();
    }
  }
}




function drawDottedCircle(cX, cY, r, dotRadius, color) {
  push();
  stroke(color);
  for (let a = 0; a < 360; a += 15) {
    let x = cX + r * cos(a);
    let y = cY + r * sin(a);
    ellipse(x, y, dotRadius, dotRadius);
  }
  pop();
}

function drawConcentricCircles(cX, cY, radii, col, row) {
  push();
  
  let colors = getColorsForPosition(row, col);

  // 使用存储的颜色绘制同心圆
  for (let i = 0; i < radii.length; i++) {
    fill(colors[i + 1]);
    ellipse(cX, cY, radii[i] * 2, radii[i] * 2);
  }

  // 使用存储的颜色绘制小圆点
  let r1 = (radii[0] + radii[1]) / 2 - 15;
  let r2 = r1 + 15;
  let r3 = r2 + 15;
  drawDottedCircle(cX, cY, r1, 10, colors[4]);
  drawDottedCircle(cX, cY, r2, 11, colors[5]);
  drawDottedCircle(cX, cY, r3, 11, colors[6]);

  pop();
}




function makeGrid() {
  let count = 0;
  
  // 调整整个网格的开始位置，使其能完全显示在画布上
  let offsetX = -gridWidth / 2;
  let offsetY = -gridHeight / 2;

  for (let y = offsetY - 100, row = 0; y < gridHeight; y += hexagonSize / 2.3, row++) {
    for (let x = offsetX + 40, col = 0; x < gridWidth; x += hexagonSize * 1.5, col++) {
      let hexCenterX = x + hexagonSize * (count % 2 == 0) * 0.75;
      let hexCenterY = y;

      drawTwistedHexagon(hexCenterX, hexCenterY, hexagonSize / 2, col, row);
      drawConcentricCircles(hexCenterX, hexCenterY, radii, col, row);
    }
    count++;
  }
}


function draw() {
  background(4, 81, 123);
  translate(width / 2, height / 2); // 将坐标系移动到画布的中心
  rotate(15);
  stroke(255);
  noFill();
  makeGrid();
}