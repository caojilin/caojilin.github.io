let x = [];
let fourierX;
let time = 0;
let path = [];
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function setup() {
  const canvas1 = createCanvas(800, 600);
  canvas1.parent("#box1");
  for (let i = 0; i < drawing.length; i++) {
    x.push(new Complex(1.3 * drawing[i].x, -1.3 * drawing[i].y));
  }
  fourierX = dft(x);
  fourierX.sort((a, b) => b.amp - a.amp);
}

function epicycles(x, y, rotation, fourier) {
  for (let i = 0; i < fourier.length; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let amp = fourier[i].amp;
    let phase = fourier[i].phase;
    x += amp * cos(freq * time + phase + rotation);
    y += amp * sin(freq * time + phase + rotation);
    push();
    strokeWeight(1);
    stroke(colors[i % 7]);
    noFill();
    ellipse(prevx, prevy, 2 * amp);
    stroke(colors[i % 7]);
    line(prevx, prevy, x, y);
    pop();
  }
  return createVector(x, y);
}

function draw() {
  background(255);
  let v = epicycles(width / 2, height / 2, 0, fourierX);
  path.unshift(v);

  beginShape();
  noFill();
  strokeWeight(2);
  stroke(0);
  for (let i = 0; i < path.length; i++) {
    vertex(path[i].x, path[i].y);
  }
  endShape();
  const dt = TWO_PI / fourierX.length;
  time += dt;

  // if (time > TWO_PI) {
  //   time = 0;
  //   path = [];
  // }
}
