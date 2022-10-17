let board = [
  ["5", "3", ".", ".", "7", ".", ".", ".", "."],
  ["6", ".", ".", "1", "9", "5", ".", ".", "."],
  [".", "9", "8", ".", ".", ".", ".", "6", "."],
  ["8", ".", ".", ".", "6", ".", ".", ".", "3"],
  ["4", ".", ".", "8", ".", "3", ".", ".", "1"],
  ["7", ".", ".", ".", "2", ".", ".", ".", "6"],
  [".", "6", ".", ".", ".", ".", "2", "8", "."],
  [".", ".", ".", "4", "1", "9", ".", ".", "5"],
  [".", ".", ".", ".", "8", ".", ".", "7", "9"]
]


let board1 = [
  [".", ".", "9", "7", "4", "8", ".", ".", "."],
  ["7", ".", ".", ".", ".", ".", ".", ".", "."],
  [".", "2", ".", "1", ".", "9", ".", ".", "."],
  [".", ".", "7", ".", ".", ".", "2", "4", "."],
  [".", "6", "4", ".", "1", ".", "5", "9", "."],
  [".", "9", "8", ".", ".", ".", "3", ".", "."],
  [".", ".", ".", "8", ".", "3", ".", "2", "."],
  [".", ".", ".", ".", ".", ".", ".", ".", "6"],
  [".", ".", ".", "2", "7", "5", "9", ".", "."],
];

let board_copy = JSON.parse(JSON.stringify(board))

let n = 9
let width = 600
let w = 600/n
let empty = []
let all_states = [JSON.parse(JSON.stringify(board))]
let state_index = 0
let stop = true
let anim_speed = 60
let finished = false
let user_input = []
let inpt


function setup() {
createCanvas(width, width);
get_empty()
solve()
button = createButton('auto')
button.mousePressed(autoRun)
button = createButton('instant')
button.mousePressed(instant)
button = createButton('restart')
button.mousePressed(restart)
button = createButton('submit')
button.mousePressed(submit)
inpt = createElement("textarea" , JSON.stringify(board1));
inpt.elt.rows = 20;
inpt.elt.cols = 50;
inpt.position(width+100, 100)
}

function restart(){
  reset_everything()
}

function get_empty(){
  empty = []
  for(let i=0; i<9; i++){
    for(let j=0; j<9; j++){
      if(board[i][j] == "."){
        empty.push([i, j])
      }
    }
  }
}
function reset_everything(){
  board = JSON.parse(JSON.stringify(board_copy))
  all_states = [JSON.parse(JSON.stringify(board))]
  state_index = 0
  stop = true
  finished = false
  get_empty()
  solve()
  redraw()
  loop()
}

function submit(){
  board = JSON.parse(inpt.value())
  board_copy = JSON.parse(JSON.stringify(board))
  console.log('input board', board)
  reset_everything()
}


function instant(){
state_index = all_states.length-1
finished = true
loop()
}

function autoRun() {
if(finished){
  return
}
if(stop){
  stop = false
  loop()
}else{
  stop = true
}
}

function draw() {
  background(220);
  if(state_index >= all_states.length-1){
    noLoop()
  }
  let cur_state = all_states[state_index]
  if(!stop){
    state_index += 1
  }
  draw_grid(cur_state)
}

function keyPressed() {
if (keyCode === LEFT_ARROW) {
  state_index -= 1
} else if (keyCode === RIGHT_ARROW) {
  state_index += 1
}
}

function draw_grid(board){
 background(220);
  for(let i=0; i<=n; i++){
    if(i % 3 == 0){
      push()
      strokeWeight(3)
      line(0, i*w, w*n, i*w)
      line(i*w, 0, i*w, w*n)
      pop()
    }
    line(0, i*w, w*n, i*w)
    line(i*w, 0, i*w, w*n)
  }

  for(let i=0; i<n; i++){
      for(let j=0; j<n; j++){
        if(board[i][j] != "."){
          textSize(w/2)
          textAlign(CENTER, CENTER)
          text(board[i][j], i*w+w/2, j*w+w/2)
        }
        
      }
  }
}

function isValid(i, j, num){
//check row
for(let k=0; k<9; k++){
  if(num == board[i][k]){
    return false
  }
}
//check col
for(let k=0; k<9; k++){
  if(num == board[k][j]){
    return false
  }
}
//check 3*3
bx = Math.floor(i/3)*3
by = Math.floor(j/3)*3
for(let k=bx; k<bx+3; k++){
  for(let w=by; w<by+3; w++){
    if(board[k][w] == num){
      return false
    }
  }
}
return true
}

function solve(k=0){

if(k == empty.length){
  console.log("Total states explored by program:", all_states.length)
  console.log(all_states)
  return true
}
let [i, j] = empty[k]
for(let x=1; x<10; x++){
  
  x = x.toString()
  board[i][j] = x
  all_states.push(JSON.parse(JSON.stringify(board)))
  board[i][j] = "."
  if(isValid(i, j, x)){
    board[i][j] = x
    
    if(solve(k+1)){
      return true
    }else{
      board[i][j] = "."
    }
  }
}
return false
}
      
