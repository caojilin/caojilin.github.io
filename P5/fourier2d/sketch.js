const USER = 0;
const FOURIER = 1;
let canvas1;
let x = [];
let fourierX;
let time = 0;
let path = [];
let drawing = [];
let state = -1;
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];

function mousePressed() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    state = USER;
    drawing = [];
    x = [];
    time = 0;
    path = [];
  }
}

function mouseReleased() {
  if (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height) {
    state = FOURIER;
    let skip = 1;
    for (let i = 0; i < drawing.length; i += skip) {
      x.push(new Complex(drawing[i].x, drawing[i].y));
    }
    fourierX = dft(x);
    fourierX.sort((a, b) => b.amp - a.amp);
    console.log("number of cycles", fourierX.length);
  }
}

function setup() {
  canvas1 = createCanvas(600, 600);
  canvas1.parent("#box1");
  background(220);
  slider1 = createSlider(1, 1000, 1000, 1);
  slider1.parent("#box3-col1");
  para = createP("number of circles: " + slider1.value()); // Display initial value
  para.parent("#box3-col1");
  para.style("color", "blue"); // Set text color to blue
  para.style("font-size", "16px"); // Set font size
  para.style("marginRight", "16px"); // Set font size

  slider2 = createSlider(1, 61, 60, 1);
  slider2.parent("#box3-col2");
  para2 = createP("anime speed: " + slider2.value());
  para2.parent("#box3-col2");
  para2.style("color", "green");
  para2.style("font-size", "16px");
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
  background(220);
  para.html("number of circles: " + slider1.value());
  para2.html("anime speed: " + round(slider2.value(), 4));
  if (state == USER) {
    let point = createVector(mouseX - width / 2, mouseY - height / 2);
    drawing.push(point);
    stroke(0);
    strokeWeight(2);
    noFill();
    beginShape();
    for (let v of drawing) {
      vertex(v.x + width / 2, v.y + height / 2);
    }
    endShape();
  } else if (state == FOURIER) {
    background(220);
    let v = epicycles(
      width / 2,
      height / 2,
      0,
      fourierX.slice(0, slider1.value())
    );
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
    if (slider2.value() == 61) {
      time += 2 * dt;
    } else if (frameCount % (61 - slider2.value()) == 0) {
      time += dt;
    }

    if (time > TWO_PI) {
      time = 0;
      path = [];
    }
  }
}
