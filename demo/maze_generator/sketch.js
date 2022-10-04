/*
https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_depth-first_search
*/
//width of a cell
let w = 10
let cols = 50
let rows = 50
let grid = []
let stack = []
let fps = 60

function setup(){
	createCanvas(w*cols, w*rows)
	for (var i = 0; i < rows; i++) {
		grid.push([])
		for (var j = 0; j < cols; j++){
			grid[i].push(new Cell(i, j))
		}
	}
	frameRate(fps)
	start_x = 0
	start_y = 0
	cur_cell = grid[start_x][start_y]
    stack.push(cur_cell)
}

function draw(){
	background(220)
	for (var i = 0; i < rows; i++){
		for (var j = 0; j < cols; j++){
			grid[i][j].show()
		}
	}
	// dfs()
    dfs_instant()
}

function dfs() {
	cur_cell.visited = true
	cur_cell.highlight()
	next_cell = cur_cell.checkNeighbors()
	if(next_cell){
		stack.push(next_cell)
		removeWalls(cur_cell, next_cell)
		next_cell.visited = true
		cur_cell = next_cell
	}else if (stack.length > 0) {
		cur_cell = stack.pop()
	}
}

function dfs_instant(){
    while(stack.length > 0){
      cur_cell.visited = true
      cur_cell.highlight()
      next_cell = cur_cell.checkNeighbors()
      if(next_cell){
          stack.push(next_cell)
          removeWalls(cur_cell, next_cell)
          next_cell.visited = true
          cur_cell = next_cell
      }else if (stack.length > 0) {
          cur_cell = stack.pop()
      }
    }
}

function Cell(i, j) {
	this.i = i
	this.j = j
	this.visited = false
	this.walls = [true, true, true, true]
	directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]

	this.checkNeighbors = function(){
		neighbors = []
		for (let dire of directions){
			x = dire[0]
			y =  dire[1]
			n_x = this.i + x
			n_y = this.j + y
			can_visit = n_x >= 0 && n_x < rows && n_y >= 0 && n_y < cols
			if (can_visit && !grid[n_x][n_y].visited){
				neighbors.push(grid[n_x][n_y])
			}
		}
		if (neighbors.length > 0) {
			r = floor(random(0, neighbors.length))
			return neighbors[r]
		}else{
			return undefined
		}
	}
	this.show = function(){
		x = this.j * w
		y = this.i * w
		stroke('black')
		if (this.walls[0]) {
			line(x, y, x+w, y)
		}
		if (this.walls[1]) {
			line(x, y+w, x+w, y+w)
		}
		if (this.walls[2]) {
			line(x, y, x, y+w)
		}
		if (this.walls[3]) {
			line(x+w, y, x+w, y+w)
		}
	}
	this.highlight = function (){
		x = this.j * w
		y = this.i * w
		noStroke()
		fill('green')
		ellipseMode(CENTER)
		ellipse(x + w/2, y + w/2, w/2, w/2)
	}
}

function removeWalls(a, b){
	x = a.j - b.j
	if (x == 1) {
		a.walls[2] = false
		b.walls[3] = false
	}else if (x == -1){
		a.walls[3] = false
		b.walls[2] = false
	}
	y = a.i - b.i
	if (y == 1) {
		a.walls[0] = false
		b.walls[1] = false
	}else if (y == -1){
		a.walls[1] = false
		b.walls[0] = false
	}
}