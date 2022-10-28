

let board1 = [
  [-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1],
  [-1,-1,-1,-1,-1,-1],
  [-1,35,-1,-1,13,-1],
  [-1,-1,-1,-1,-1,-1],
  [-1,15,-1,-1,-1,-1]]

let board = [[-1,-1,-1,30,-1,144,124,135,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,167,93,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,77,-1,-1,90,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,122,-1],[-1,-1,-1,23,-1,-1,-1,-1,-1,155,-1,-1,-1],[-1,-1,140,29,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,115,-1,-1,-1,109,-1,-1,5],[-1,57,-1,99,121,-1,-1,132,-1,-1,-1,-1,-1],[-1,48,-1,-1,-1,68,-1,-1,-1,-1,31,-1,-1],[-1,163,147,-1,77,-1,-1,114,-1,-1,80,-1,-1],[-1,-1,-1,-1,-1,57,28,-1,-1,129,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,87,-1,-1,-1]]


let width = 600
let n = board.length
let w = width/n
let highlight = false
let coordinates = {}
let map_ij_to_x = {}
let map_x_to_ij = {}
let inpt
let result_div
let result_div2
let path 


function setup() {
  createCanvas(width, width);
  set_coordinates()
  path = solve()
  button = createButton('submit')
  button.mousePressed(submit)
  inpt = createElement("textarea" , JSON.stringify(board1));
  inpt.elt.rows = 20;
  inpt.elt.cols = 50;
  inpt.position(width+100, 200)

  result_div = createElement('pre', "optimal path is : " + JSON.stringify(path));
  result_div.style('font-size', '16px');
  result_div.position(width+20, 80);
  
  result_div2 = createElement('pre', "and the minimum steps are "+(path.length-1));
  result_div2.style('font-size', '16px');
  result_div2.position(width+20, 80+20);
}



function submit(){
  board = JSON.parse(inpt.value())
  board_copy = JSON.parse(JSON.stringify(board))
  reset_everything()
}

function reset_everything(){
  n = board.length
  w = width/n
  highlight = false
  coordinates = {}
  map_ij_to_x = {}
  map_x_to_ij = {}
  set_coordinates()
  path = solve()
  loop()
}

function draw() {
  background(220);
  draw_grid()
  
  result_div.elt.innerHTML = "optimal path is : " + JSON.stringify(path)
  result_div2.elt.innerHTML = "and the minimum steps are "+(path.length-1)
  noLoop()
}

function set_coordinates(){
  let x = 1
    let change_lane = false
    for(let i=n-1; i>=0; i--){
      if(!change_lane){
        for(let j=0; j<n; j++){
        
        coordinates[x] = [j*w+w/2, i*w+w/2]
        map_ij_to_x[[i, j]] = x
        map_x_to_ij[x] = [i, j]
        x += 1
        }
      }else{
        for(let j=n-1; j >= 0; j--){
        
        coordinates[x] = [j*w+w/2, i*w+w/2]
        map_ij_to_x[[i, j]] = x
        map_x_to_ij[x] = [i, j]
        x += 1
        }
      }
      change_lane = !change_lane
    }
}

function draw_ladder(line_color="red"){
  for(let i=0; i<n; i++){
      for(let j=0; j<n; j++){
        let x = map_ij_to_x[[i, j]]  
        let y = board[i][j]
        let x1 = coordinates[x][0]
        let y1 = coordinates[x][1]
        
        if(board[i][j] != -1){
          let x2 = coordinates[y][0]
          let y2 = coordinates[y][1]
          push()
          strokeWeight(3)
          stroke(line_color)
          line(x1, y1, x2, y2)
          // triangle(x1-w/4, y1+w/4,
          //          x1+w/4, y1+w/4,
          //          x1, y1-w/4)
          pop()
          push()
          fill('cyan')
          circle(x2, y2, w/4)
          pop()
        }
      }
    }
}

function draw_grid(){
   background(220);
    for(let i=0; i<=n; i++){
      line(0, i*w, w*n, i*w)
      line(i*w, 0, i*w, w*n)
    }
    draw_ladder()
    for(let i=0; i<n; i++){
        for(let j=0; j<n; j++){
          let x = map_ij_to_x[[i, j]]  
          let y = board[i][j]
          let x1 = coordinates[x][0]
          let y1 = coordinates[x][1]
          textSize(w/4)
          textAlign(CENTER, CENTER)
          text(x, x1, y1)
        }
      }
  }

function draw_highlight(){
  // if(!highlight){return}
  for(let i=0; i<n; i++){
    for(let j=0; j<n; j++){
      let x = map_ij_to_x[[i, j]]
      let y = board[i][j]
      let x1 = coordinates[x][0]
      let y1 = coordinates[x][1]
      let x_left = x1-w/2
      let x_right = x1+w/2
      let y_top = y1-w/2
      let y_bot = y1+w/2
      
      if(mouseX >= x_left && mouseX <= x_right && mouseY >= y_top && mouseY <= y_bot){
        
        if(board[i][j] != -1){
          let x2 = coordinates[y][0]
          let y2 = coordinates[y][1]
          push()
          strokeWeight(3)
          stroke("black")
          line(x1, y1, x2, y2)
          // triangle(x1-w/4, y1+w/4,
          //          x1+w/4, y1+w/4,
          //          x1, y1-w/4)
          pop()
        }
        push()
        stroke('green')
        strokeWeight(3)
        line(x_left, y_top, x_right, y_top)
        line(x_left, y_bot, x_right, y_bot)
        line(x_left, y_top, x_left, y_bot)
        line(x_right, y_top, x_right, y_bot)
        pop()
      }
    }
  }
}

function mouseClicked() {
  clear()
  draw_grid()
  draw_highlight()
  
}


function solve(){
  q = [[1, [1]]]
  visited = {}
  steps = 0
  while(q.length > 0){
    let size = q.length
    for(let i=0; i<size; i++){
      let [cur, path] = q.pop()
      if(cur == n*n){
        return path
      }
      for(let j=1; j<=6; j++){
        let nx = cur+j
        if(nx <= n*n && visited[nx] === undefined){
          visited[nx] = true
          let indices = map_x_to_ij[nx]
          let y = board[indices[0]][indices[1]]
          if(y != -1){
            let new_path = path.concat([[nx, y]])
            q.unshift([y, new_path])
          }else{
            let new_path = path.concat([nx])
            q.unshift([nx, new_path])
          }
          
        }
      }
    }
    steps += 1
  }
  return []
}