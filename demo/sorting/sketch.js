let nums = []
let sorted_nums = []
let total = 100
// bars
let bars = []
let bar_w = 0
let bar_h = 0
let anim_speed = 5
let ground = 0
let slider
//mergesort variables
let queue = []
let current_arr1 = []
let current_arr2 = []
//quicksort variables
let stack = []
let pivot
let small
let equal
let large
//bubblesort variables
let the_num_left_to_sort = total
//the elem that will be swapped to the end
let bubble1
//the next elem that will be swapped to the end
let bubble2
let cur_index
//selection sort
let the_current_largest

//utility
let stop = true
let min_anim_speed = 1
let max_anim_speed = 11
let curr_sort = 'mergesort'

function setup(){
  createCanvas(800, 600)
  highest_bar = height - 100
  bar_h = Math.max(1, highest_bar/total)
  bar_w = Math.max(1, (width-100)/total)
  ground = height - 30 
  
  let p = createP('anim_speed');
  p.style('font-size', '14px');
  p.position(110, 15);
  
  slider = createSlider(min_anim_speed, max_anim_speed-1, anim_speed, 1);
  slider.position(110, 10);
  slider.style('width', '80px');
  
  
  sel = createSelect();
  sel.position(10, 10);
  sel.option('mergesort');
  sel.option('quicksort');
  sel.option('bubblesort');
  sel.option('selectionsort');
  sel.selected('mergesort');
  sel.changed(mySelectEvent);
  
  button = createButton('auto')
  button.mousePressed(autoRun)
	button = createButton('restart')
  button.mousePressed(() => restart(curr_sort))

	let p2 = createP('press "Space" to pause');
	p2.style('font-size', '16px');
	p2.position(610, 0);

  merge_sort_setup()
  
}

function restart(item){
	if (item == 'mergesort') {
    merge_sort_setup()
  }else if (item == 'quicksort') {
    quick_sort_setup()
  }else if(item == 'bubblesort'){
    bubble_sort_setup()
  }else if (item == 'selectionsort') {
    selection_sort_setup()
  }
}

function autoRun() {
  if(stop){
    stop = false
    loop()
  }else{
    stop = true
  }
}

function draw(){
  background(220)
  anim_speed = slider.value();
	anim_speed = max_anim_speed - anim_speed
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
  for(i = 0; i < bars.length; i++){
      bars[i].show()
  }
}

/*utility*/
function array_equal(arr1, arr2) {
  if (arr1.toString() == arr2.toString()) {
    return true
  }
  return false
}

function flatten_2d_array(array) {
  arr = []
  for(i=0; i < array.length; i++){
    for(j=0; j < array[i].length; j++){
      arr.push(array[i][j])
    }
  }
  return arr
}

/*draw bars*/
function createBars(){
  bars = []
  for(i = 0; i < nums.length; i++){
    bars.push(new Bar(50 + i*bar_w, ground-nums[i]*bar_h, bar_w, nums[i]*bar_h))
  }
  return bars
}

function createBars_quick_sort() {
  bars = []
  for(i = 0; i < nums.length; i++){
    if (small.includes(nums[i])){
      this_color = 'red'

    } else if(large.includes(nums[i])) {
      this_color = 'green'
    } else if(pivot == nums[i]){
      this_color = 'blue'
    }
    else{
      this_color = 'gray'
    }
    bars.push(new Bar(50 + i*bar_w, ground-nums[i]*bar_h, bar_w, nums[i]*bar_h, this_color))
  }
  return bars
}

function createBars_merge_sort(){
  bars = []
  for(i = 0; i < nums.length; i++){
    if (current_arr1.includes(nums[i])){
      this_color = 'green'

    } else if(current_arr2.includes(nums[i])) {
      this_color = 'red'
    } else{
      this_color = 'gray'
    }
    bars.push(new Bar(50 + i*bar_w, ground-nums[i]*bar_h, bar_w, nums[i]*bar_h, this_color))
  }
  return bars
}

function createBars_bubble_sort(){
  bars = []
  for(i = 0; i < nums.length; i++){
    if (bubble1 == nums[i]){
      this_color = 'green'
    }else if (bubble2 == nums[i]) {
      this_color = 'red'
    }
    else{
      this_color = 'gray'
    }
    bars.push(new Bar(50 + i*bar_w, ground-nums[i]*bar_h, bar_w, nums[i]*bar_h, this_color))
  }
  return bars
}

function createBars_selection_sort(){
  bars = []
  for(i = 0; i < nums.length; i++){
    if (the_current_largest == nums[i]){
      this_color = 'green'
    }
    else{
      this_color = 'gray'
    }
    bars.push(new Bar(50 + i*bar_w, ground-nums[i]*bar_h, bar_w, nums[i]*bar_h, this_color))
  }
  return bars
}

class Bar{
  constructor(x, y, w, h, color='gray'){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color
  }

  show(){
    fill(this.color)
    rect(this.x, this.y, this.w, this.h)
  }
}

//quick sort
function quick_sort_setup(){
  nums = []
  stack = []
  for(i = 1; i < total+1; i++){
    nums.push(i)
  }
  sorted_nums = nums.slice()
  nums = shuffle(nums)
  bars = createBars()
  stack.push([nums.slice(), 0, nums.length-1])
}

function quickSort(){
  if(stack.length == 0){
    return []
  }
  popped = stack.pop()
  whole_arr = popped[0]
  index_i = popped[1]
  index_j = popped[2]
  arr = whole_arr.slice(index_i, index_j+1)
  if(arr.length == 0){
    return []
  }
  let sm = []
  let eq = []
  let la = []
  let piv = random(arr)
  for(i = 0; i < arr.length; i++){
    elem = arr[i]
    if (elem < piv){
      sm.push(elem)
    }else if(elem > piv){
      la.push(elem)
    }else{
      eq.push(elem)
    }
  }
  combined = sm.concat(eq).concat(la)
  for(i=index_i; i <= index_j; i++){
    whole_arr[i] = combined[i-index_i]
  }
  let piv_index = whole_arr.indexOf(piv)

  small = sm;
  large = la;
  pivot = piv;
  if(sm.length > 1){
    stack.push([whole_arr, piv_index-sm.length, piv_index-1])
  }
  if(la.length > 1){
    stack.push([whole_arr, piv_index+1, piv_index+1+la.length-1])
  }
  nums = whole_arr
  bars = createBars_quick_sort()
  return whole_arr
}


//merge sort

function merge_sort_setup() {
  nums = []
  queue = []
  for(i = 1; i < total+1; i++){
    nums.push(i)
  }
  nums = shuffle(nums)
  for(i=0;i<nums.length;i++){
    queue.push([nums[i]])
  }
  bars = createBars()
}

function merge(arr1, arr2){
  if(arr1.length == 0){
    return arr2
  }
  if(arr2.length == 0){
    return arr1
  }
  if(arr1[0] > arr2[0]){
    tmp = arr2[0]
    arr2.shift()
    return [tmp].concat(merge(arr1, arr2))
  }else{
    tmp = arr1[0]
    arr1.shift()
    return [tmp].concat(merge(arr1, arr2))
  }
}

function mergeSort() {
  if (queue.length == 1) {
    return []
  }
  current_arr1 = queue.pop()
  current_arr2 = queue.pop()

  queue.unshift(merge(current_arr1.slice(), current_arr2.slice()))
  nums = flatten_2d_array(queue)
  bars = createBars_merge_sort()
  return 
}

//Bubble sort
function bubble_sort_setup(){
  nums = []
  cur_index = 1
  the_num_left_to_sort = total
  for(i=1; i<total+1;i++){
    nums.push(i)
  }
  nums = shuffle(nums)
  bars = createBars()
}
function bubbleSort(){
  if (the_num_left_to_sort == 1) {
    return
  }
  //step by step
  // if (cur_index == the_num_left_to_sort) {
  //   the_num_left_to_sort -= 1
  //   cur_index = 1
  // }
  // if (nums[cur_index-1] > nums[cur_index]) {
  //   tmp = nums[cur_index]
  //   nums[cur_index] = nums[cur_index-1]
  //   nums[cur_index-1] = tmp
  // }
  // cur_index += 1
  //batch by batch
  for(i=1; i<the_num_left_to_sort; i++){
    if (nums[i-1] > nums[i]) {
      tmp = nums[i]
      nums[i] = nums[i-1]
      nums[i-1] = tmp
    } 
  }
  bubble1 = nums[the_num_left_to_sort-1]
  bubble2 = max(nums.slice(0, the_num_left_to_sort-1))

  the_num_left_to_sort -= 1
  bars = createBars_bubble_sort()
}

//

function selection_sort_setup(){
  nums = []
  the_num_left_to_sort = total
  for(i=1; i<total+1;i++){
    nums.push(i)
  }
  nums = shuffle(nums)
  bars = createBars()
}

function selectionSort(){
  if (the_num_left_to_sort == 1) {
    return
  }
  tmp_arr = nums.slice(0, the_num_left_to_sort)
  the_current_largest = max(tmp_arr)
  index = tmp_arr.indexOf(the_current_largest)
  //swap
  tmp = nums[the_num_left_to_sort-1]
  nums[the_num_left_to_sort-1] = the_current_largest
  nums[index] = tmp

  
  bubble1 = nums[the_num_left_to_sort-2]
  bubble2 = max(nums.slice(0, the_num_left_to_sort-1))
  the_num_left_to_sort -= 1
  bars = createBars_bubble_sort()
}

//utility

function mySelectEvent() {
  stop = true
  let item = sel.value();
	curr_sort = item;
  if (item == 'mergesort') {
    merge_sort_setup()
  }else if (item == 'quicksort') {
    quick_sort_setup()
  }else if(item == 'bubblesort'){
    bubble_sort_setup()
  }else if (item == 'selectionsort') {
    selection_sort_setup()
  }
}

function run_once(){
  let item = sel.value()
  if (item == 'quicksort') {
      quickSort()
      redraw()
  }else if(item == 'mergesort'){
      mergeSort()
      redraw()
  }else if(item == 'bubblesort'){
      bubbleSort()
      redraw()
  }else if(item == 'selectionsort'){
      selectionSort()
      redraw()
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
      run_once()
  }
}
