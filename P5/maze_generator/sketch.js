/*
https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_depth-first_search
*/



let width = 600;
let cols, rows;
let w = 30;
let grid = [];
let current;
let stack;
let line_width = 1
let auto_run = false;

function setup() {
		createCanvas(width, width);
		initilize()
    button = createButton('instant result');
		button.position(width+50, 100);
		button.mousePressed(instant_finish);
		button = createButton('auto');
		button.position(width+50, 130);
		button.mousePressed(auto);

		inp = createInput('');
		inp.position(width+50, 150);
		inp.size(100);
		inp.input(myInputEvent);
}

function myInputEvent(){
	w = width/this.value()
	if(w == Infinity || w == NaN){
		return
	}
	initilize()
	loop()
}

function auto(){
	auto_run = !auto_run;
}


function initilize(){
	grid = []
	cols = floor(width / w);
	rows = floor(height / w);
	for (let j = 0; j < rows; j++) {
			for (let i = 0; i < cols; i++) {
					grid.push(new Cell(i, j));
			}
	}
	current = grid[0];
	stack = [current];
}

function instant_finish() {
    //STEP 1.1
    while (stack.length > 0) {
        //STEP 2.2
        current = stack.pop();
        current.highlight();
        let neighbors = current.getNeighbors();
				let next = neighbors[floor(random(0, neighbors.length))];
        if (next) {
            //STEP 2.2.1
            stack.push(current);
            //STEP 2.2.3
            removeWalls(current, next);
            //STEP 2.2.4
            next.visited = true;
            stack.push(next);
        }
    }
		line_width = 1
}

function run_once(){
	//STEP 1.1
	current.visited = true;
	current.highlight();


	//STEP 2.2
	let neighbors = current.getNeighbors();
	
	let next = neighbors[floor(random(0, neighbors.length))];
	if (next) {
			//STEP 2.2.1
			stack.push(next)
			//STEP 2.2.3
			removeWalls(current, next);
			//STEP 2.2.4
			next.visited = true;
			current = next;
	} else if (stack.length > 0) {
			current = stack.pop();
	}
}

function draw() {
    background(220);
		if(auto_run){
			run_once()
		}		
    for (let cell of grid) {
        cell.show();
    }
		draw_boundry()
		current.visited = true;
		current.highlight();
		if(stack.length == 0){
			noLoop()
		}
}

function draw_boundry(){
	line(0, 0, width, 0)
	line(0, 0, 0, width)
	line(width,0, width, width)
	line(0, width, width, width)
}

function keyPressed() {
	if (keyCode === RIGHT_ARROW) {
		run_once()
	}
	}

	
function index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1;
    }
    return i + j * cols;
}

class Cell {
	constructor(i, j) {
		this.i = i;
		this.j = j;
		this.visited = false;
		//top, right, bottom, left
		this.walls = [true, true, true, true];
		this.neighbors;

		this.getNeighbors = function () {
			let neighbors = [];
			let top = grid[index(i, j - 1)];
			let right = grid[index(i + 1, j)];
			let bottom = grid[index(i, j + 1)];
			let left = grid[index(i - 1, j)];

			if (top && !top.visited) {
				neighbors.push(top);
			}
			if (right && !right.visited) {
				neighbors.push(right);
			}
			if (bottom && !bottom.visited) {
				neighbors.push(bottom);
			}
			if (left && !left.visited) {
				neighbors.push(left);
			}
			return(neighbors)
		};
		this.highlight = function () {
			let x = this.i * w;
			let y = this.j * w;
			push();
			noStroke();
			fill('green');
			ellipseMode(CENTER);
			ellipse(x + w / 2, y + w / 2, w / 2, w / 2);
			pop();
		};

		this.show = function () {
			let x = this.i * w;
			let y = this.j * w;
			stroke('black');

			if (this.walls[0]) {
				strokeWeight(line_width)
				line(x, y, x + w, y);
			}
			if (this.walls[1]) {
				strokeWeight(line_width)
				line(x + w, y, x + w, y + w);
			}
			if (this.walls[2]) {
				strokeWeight(line_width)
				line(x + w, y + w, x, y + w);
			}
			if (this.walls[3]) {
				strokeWeight(line_width)
				line(x, y + w, x, y);
			}
			if (this.visited) {
				push();
				noStroke();
				fill(220);
				rect(x, y, w, w);
				pop();
			}
		};
	}
}

function removeWalls(a, b) {
    let x = a.i - b.i;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    let y = a.j - b.j;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}