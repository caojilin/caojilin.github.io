// module aliases
let Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Composite = Matter.Composite;

let engine
let runner 

let boxes = []
let box_width = 10
let box_height = box_width
let ground

let circles = []
let circle_radius = 8
let triangles = []
let bars = []


function setup(){
    createCanvas(600, 600)
    engine = Engine.create()
    runner = Runner.create()
    Runner.run(runner, engine)
    ground = new Box(width/2, height-10, width, 20, true)
    generate_pascal_triangle()
}

function draw() {
    background(51)
    if (frameCount == 5000){
        noLoop()
        }
    if (frameCount % 30 == 0){
        circles.push(new Circle(300, 0, circle_radius/2, false))
    }

    for(let i =0; i < boxes.length; i++){
        boxes[i].show()
    }
    for(let i =0; i < circles.length; i++){
        circles[i].show()
    }
    for(let i =0; i < triangles.length; i++){
        triangles[i].show()
    }
     for(let i =0; i < bars.length; i++){
        bars[i].show()
    }
    ground.show()
}


function generate_pascal_triangle(){
    let row = 8
    let start_x = 300
    let start_y = 200
    let offset_x = 40
    let offset_y = 30
    let line = [[[start_x, start_y]]]

    for(let i = 2; i < row+1; i++){
        start_x = line[line.length-1][0][0] - offset_x/2
        start_y = line[line.length-1][0][1] + offset_y
        new_line = [[start_x, start_y]]
        for(let j = 1; j < i; j++){
            new_line.push([new_line[j-1][0] + offset_x, start_y])
        }
        line.push(new_line)
    }
    //triangles
    for(let i = 0; i < line.length; i++){
        cur_line = line[i]
        for(j = 0; j < cur_line.length; j++){
            triangles.push(new Circle(cur_line[j][0], cur_line[j][1], circle_radius, true))
        }
    }
    //bars
    last_line = line[line.length-1]
    start_x = start_x-offset_x
    start_y = start_y + 150
    bar_height = 300
    bar_width = 3
    bars.push(new Box(start_x, start_y, bar_width, bar_height, true))
    for(i = 0; i < row+1; i++){
        start_x += offset_x
        bars.push(new Box(start_x, start_y, bar_width, bar_height, true))
    }
    return line
}



function mouseDragged(){
    circles.push(new Circle(mouseX, mouseY, circle_radius/2))
}

function mouseClicked(){
    // boxes.push(new Box(mouseX, mouseY, box_width, box_height))
    circles.push(new Circle(mouseX, mouseY, circle_radius/2))
}

function Box(x, y, w, h, static=false, density=0.001){
    this.w = w  
    this.h = h
    this.options = {
        isStatic: static,
    }
    this.body = Bodies.rectangle(x, y, w, h, this.options)
    Composite.add(engine.world, this.body)
    this.show = function(){
        let pos = this.body.position
        let angle = this.body.angle
        push()
        translate(pos.x, pos.y)
        rotate(angle)
        rectMode(CENTER)
        fill(200)
        rect(0, 0, this.w, this.h)
        pop()
    }
}

function Circle(x, y, r, static=false, density=0.001){
    this.r = r
    this.options = {
        isStatic : static,
        density: density,
    }
    this.body = Bodies.circle(x, y, r, this.options)
    Body.setVelocity(this.body, {x: random(-0.015, 0.015), y: 0})
    Composite.add(engine.world, this.body)
    this.show = function(){
        let pos = this.body.position
        let angle = this.body.angle
        push()
        fill(200)
        circle(pos.x, pos.y, this.r*2)
        pop()
    }
}