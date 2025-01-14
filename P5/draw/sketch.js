let height = 500;
let width = 900;
let all_strokes = [];
let drawing = [];
let start_drawing = false;
let x;
let y;
let path;
let state = -1;
function setup() {
  const canvas = createCanvas(width, height);
  canvas.parent("#box1");
}

function draw() {
  background(220);
  if (start_drawing) {
    let point = createVector(mouseX - width / 2, mouseY - height / 2);
    drawing.push(point);
    all_strokes.push(point);
    stroke(10);
    noFill();
    beginShape();
    for (let v of drawing) {
      vertex(v.x + width / 2, v.y + height / 2);
    }
    endShape();
  }
  stroke(0);
  noFill();
  beginShape();
  for (let v of all_strokes) {
    vertex(v.x + width / 2, v.y + height / 2);
  }
  endShape();
}
function mousePressed() {
  start_drawing = true;
  drawing = [];
  x = [];
  y = [];
  path = [];
}

function mouseReleased() {
  start_drawing = !start_drawing;
}
