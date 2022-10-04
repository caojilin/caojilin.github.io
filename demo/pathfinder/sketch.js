let row = 30
let col = 30
let w = 15
let walls = []
let walls_seed
let grid = []
let stack = []
let start
let end
let cur_cell = new Cell(0, 0)

//for draw founded path
let total_nodes_visited = 0
let found_path = []
let found_path_length = 0
let saved_path = []
//found exit
let found = false
//set search algorithms to dfs, bfs ...
let curr_algo = 'dfs'
let wall_function = generate_random_walls
let stop = true
let anim_speed = 1
let wall_ratio = 0.25
let min_anim_speed = 1
let max_anim_speed = 11


function setup()
{
    createCanvas(row * w, col * w);
    sel = createSelect();
    sel.position(width+10, 10);
    sel.option('dfs');
    sel.option('bfs');
    sel.selected('dfs');
    sel.changed(mySelectEvent);
  
  
    p = createP('speed');
    p.style('font-size', '14px');
    p.position(width+10, 30);

    slider = createSlider(min_anim_speed, max_anim_speed-1, anim_speed, 1);
    slider.position(width+10, 60);
    slider.style('width', '180px');

		p2 = createP('wall ratio');
		p2.id('wall_ratio')
    p2.style('font-size', '14px');
    p2.position(width+10, 90);

		slider2 = createSlider(0, 0.5, wall_ratio, 0.01);
    slider2.position(width+10, 120);
    slider2.style('width', '180px');
		
		p3 = createP('total nodes discovered:');
		p3.id('total_nodes')
    p3.style('font-size', '14px');
    p3.position(width+10, 150);

		p4 = createP('path length:');
		p4.id('path_nodes')
    p4.style('font-size', '14px');
    p4.position(width+10, 180);

    button = createButton('run/pause')
    button.mousePressed(pause_event)
		button = createButton('restart')
  	button.mousePressed(() => initialize())
    initialize()
}

function myInputEvent(){
	wall_ratio = this.value();
	initialize()
}

function pause_event(){
  if(stop){
    stop = false
    loop()
  }else{
    stop = true
  }
}

function draw()
{
	// console.log(frameRate())
	background(220)
  anim_speed = slider.value();
	anim_speed = max_anim_speed - anim_speed
	wall_ratio = slider2.value();

	draw_grid()
	draw_cell()
	draw_stack()
  draw_curr_cell(cur_cell.i, cur_cell.j)
  if(!stop){
    if(frameCount % anim_speed == 0){
      run_once()
    }
  }
  //32 is keycode for Space
  if(keyIsDown(32)){
    if(frameCount % anim_speed == 0){
      run_once()
    }
  }
	
	if(found){
		draw_path()
		console.log('total nodes discovered', total_nodes_visited)
		console.log('path length', found_path_length)
		document.getElementById('path_nodes').innerHTML = 'path length:' + found_path_length
		noLoop()
	}
	document.getElementById('wall_ratio').innerHTML = 'wall ratio:' + wall_ratio
	document.getElementById('total_nodes').innerHTML = 'total nodes discovered:' + total_nodes_visited
}

function initialize(reuse=false){
    total_nodes_visited = 0
    found_path = []
    found_path_length = 0
    saved_path = []
    //control program to run or not
		stop = false
    //found exit
    found = false

    stack = []
		grid = []
		walls = []
		for (var i = 0; i < row; i++) {
					grid.push([])
					for( var j =0; j<col; j++){
							grid[i].push(new Cell(i, j))
					}
		}
		start = grid[0][0]
		end = grid[row-1][col-1]
		wall_function()
		end.wall = 0
    path = [[0, 0]]
    stack.push([start, path])
		loop()
}



function mySelectEvent() {
  curr_algo = sel.value();
  initialize()
}


function print_walls(){
	res = "["
	for( var i =0; i < walls.length; i++){
		x = walls[i][0]
		y = walls[i][1]
		if(i == walls.length - 1){
			res = res + "[" + x + ',' + y + "]"+ "]"
		}else{
			res = res + "[" + x + ',' + y + "]" + ","
		}
	}
	return res 
}

function draw_cell(){
	for (var i = 0; i < row; i++) {
    	for( var j =0; j<col; j++){
    		if (grid[i][j].wall == 1) {
    			fill(55, 59, 56)
    			rect(j*w, i*w, w, w)
    		}
    		if (grid[i][j].visited) {
    			fill(73, 186, 101)
    			rect(j*w, i*w, w, w)
    		}
    	}
    }
}

function draw_stack(){
	for(var i = 0; i < stack.length; i++){
		cell = stack[i][0]
		x = cell.i
		y = cell.j
		fill(214, 95, 69)
		rect(y*w, x*w, w, w)
	}
}

function draw_path() {
	if (found_path.length > 0) {
		// saved_path.push(found_path.shift())
		saved_path = found_path.slice();
	}
	for(var i = 0; i < saved_path.length; i++){
		cell = saved_path[i]
		x = cell[0]
		y = cell[1]
		fill(187, 113, 227)
		rect(y*w, x*w, w, w)
	}
	
}

function draw_grid(){
		function draw_row()
	{
	    stroke('black')
	    for (var i = 0; i < row+1; i++)
	    {
	        x1 = 0
	        x2 = col * w
	        y = i * w
	        line(x1, y, x2, y)
	    }
	}
	function draw_col()
	{
	    stroke('black')
	    for (var j = 0; j < col+1; j++)
	    {
	        x = j * w
	        y1 = 0
	        y2 = col * w
	        line(x, y1, x, y2)
	    }
	}
	draw_row()
	draw_col()
}

function Cell(i, j)
{
    this.i = i
    this.j = j
    this.visited = false
    this.wall = 0
    directions = [[-1, 0], [0, -1], [1, 0], [0, 1]]

	this.getNeighbor = function(){
		neighbors = []
		for (let dire of directions){
			x = dire[0]
			y =  dire[1]
			n_x = this.i + x
			n_y = this.j + y
			can_visit = n_x >= 0 && n_x < row && n_y >= 0 && n_y < col
			if (can_visit && !grid[n_x][n_y].visited && grid[n_x][n_y].wall == 0){
				neighbors.push(grid[n_x][n_y])
			}
		}
		if (neighbors.length > 0) {
			return neighbors
		}
		return undefined
	}
}

function arraysEqual(a1,a2) {
    /* WARNING: arrays must not contain {objects} or behavior may be undefined */
    return JSON.stringify(a1)==JSON.stringify(a2);
}

function generate_random_walls(){
	for (var i = 0; i < row; i++) {
    	for( var j =0; j<col; j++){
    		if (random() < wall_ratio) {
    			grid[i][j].wall = 1
    			walls.push([i, j])
    		}
    	}
    }
}


function run_once(){
	if(curr_algo === 'dfs'){
		dfs()
		redraw()
	}else if(curr_algo === 'bfs'){
		bfs()
		redraw()
	}
}

function draw_curr_cell(i, j){
		let x = j*w
		let y = i*w
		push()
		noStroke()
		fill('red')
		ellipseMode(CENTER)
		ellipse(x + w/2, y + w/2, w/2, w/2)
		pop()
}

function dfs(){
  total_nodes_visited += 1
	if (stack.length == 0) {
		console.log('not found exit')
		noLoop()
		return false
	}
	node = stack.pop()
	cur_cell = node[0]
	path = node[1]
	cur_cell.visited = true
	
	if (arraysEqual(cur_cell, end)) {
		console.log('found exit')
		found_path = path
		found_path_length = found_path.length
		draw_path()
		found = true
		return true
	}
	next_cells = cur_cell.getNeighbor()
	if (next_cells) {
		for(var i = 0; i < next_cells.length; i++){
			new_path = path.slice()
			new_path.push([next_cells[i].i, next_cells[i].j])
			stack.push([next_cells[i], new_path])
			next_cells[i].visited = true
		}
	}
}

function bfs(){
    total_nodes_visited += 1
	queue = stack
	if (queue.length == 0) {
		console.log('not found exit')
		noLoop()
		return false
	}
	node = queue.shift()
	cur_cell = node[0]
	path = node[1]
	cur_cell.visited = true
	
	if (arraysEqual(cur_cell, end)) {
		console.log('found exit')
		found_path = path
		found_path_length = found_path.length
		draw_path()
		found = true
		return true
	}
	next_cells = cur_cell.getNeighbor()
	if (next_cells) {
		for(var i = 0; i < next_cells.length; i++){
			new_path = path.slice()
			new_path.push([next_cells[i].i, next_cells[i].j])
			queue.push([next_cells[i], new_path])
			next_cells[i].visited = true

		}
	}
}