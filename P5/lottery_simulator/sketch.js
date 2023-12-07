/*
reference: https://www.cwl.gov.cn/c/2018/10/12/417937.shtml
http://www.cwl.gov.cn/ygkj/wqkjgg/ssq/
there are 6 red balls and 1 blue ball
red number is from 1 to 33
blue is 1 to 16
each lottery is $2
1st prize: all nums match, suppose it's $6,000,000
2nd prize: 6 red nums match, suppose it's $200,000
3rd prize: 5 red, 1 blue, get fixed $3000
4th：all 5 red or 4 red and 1 blue, get fixed $200
5th: 4 red or 3 red and 1 blue, get fixed $10
6th: 1 blue, get fixed $5
*/
const text_size = "18px"

const red_numbers = [...Array(33)].map((_, i) => i + 1);
const blue_numbers = [...Array(16)].map((_, i) => i + 1);
let this_red_result = []
let this_blue_result = []
let my_red_numbers = []
let my_blue_numbers = []
let red_matches = []
let blue_matches = []
let spendings = 0
let earnings = 0
let keep_buying_loop = false
let intervalID = 0

// 1st prize to 6 prize
let statistics = [0, 0, 0, 0, 0, 0]

function setup() {
	createCanvas(450, 450);
	button = createButton('buy one lottery');
	button.style('font-size', 16);
	button.position(0, 400);
	button.mousePressed(buy_one_lottery);

	button2 = createButton('keep buying');
	button2.id('keep_buying')
	button2.style('font-size', 16);
	button2.position(105, 400);
	button2.mousePressed(keep_buying);

	button3 = createButton('get lottery result');
	button3.style('font-size', 16);
	button3.position(195, 400);
	button3.mousePressed(get_lottery_result);

	p = createP('my spendings: 0');
	p.id("spendings")
	p.style('font-size', text_size);
	p.style('color', '#0d0d0c');
	p.position(10, 200);

	p5 = createP('my earnings: 0');
	p5.id("earnings")
	p5.style('font-size', text_size);
	p5.style('color', '#0d0d0c');
	p5.position(10, 220);

	p51 = createP('net gain: 0');
	p51.id("net_gain")
	p51.style('font-size', text_size);
	p51.style('color', '#0d0d0c');
	p51.position(10, 240);

	p11 = createP('my selection red: ');
	p11.style('font-size', text_size);
	p11.style('color', '#0d0d0c');
	p11.position(10, 20);

	p111 = createP('');
	p111.id("my_selection_red")
	p111.style('font-size', text_size);
	p111.style('color', '#ff0000');
	p111.position(160, 20);

	p12 = createP('my selection blue: ');
	p12.style('font-size', text_size);
	p12.style('color', '#0d0d0c');
	p12.position(10, 40);

	p112 = createP('');
	p112.id("my_selection_blue")
	p112.style('font-size', text_size);
	p112.style('color', '#1c2deb');
	p112.position(160, 40);

	p2 = createP('red balls: ');
	p2.id("red_balls")
	p2.style('font-size', text_size);
	p2.style('color', '#ff0000');
	p2.position(10, 60);

	p3 = createP('blue ball: ');
	p3.id("blue_balls")
	p3.style('font-size', text_size);
	p3.style('color', '#1c2deb');
	p3.position(10, 80);

	p41 = createP('my red balls matched: ');
	p41.style('font-size', text_size);
	p41.style('color', '#0d0d0c');
	p41.position(10, 120);

	p42 = createP('my blue balls matched: ');
	p42.style('font-size', text_size);
	p42.style('color', '#0d0d0c');
	p42.position(10, 140);

	p411 = createP('');
	p411.id("red_balls_matched")
	p411.style('font-size', text_size);
	p411.style('color', '#ff0000');
	p411.position(200, 120);

	p421 = createP('');
	p421.id("blue_balls_matched")
	p421.style('font-size', text_size);
	p421.style('color', '#1c2deb');
	p421.position(200, 140);

	get_lottery_result()

}

function keep_buying() {
	keep_buying_loop = !keep_buying_loop
	if (keep_buying_loop) {
		intervalID = setInterval(buy_one_lottery, 4);
	} else {
		clearInterval(intervalID)
		intervalID = 0
	}
	if (keep_buying_loop) {
		document.getElementById('keep_buying').innerHTML = 'stop buying'
	} else {
		document.getElementById('keep_buying').innerHTML = 'keep buying'

	}

}

function buy_one_lottery() {

	my_red_numbers = shuffle(red_numbers).slice(0, 6)
	my_blue_numbers = shuffle(blue_numbers).slice(0, 1)
	document.getElementById('my_selection_red').innerHTML = JSON.stringify(my_red_numbers)
	document.getElementById('my_selection_blue').innerHTML = JSON.stringify(my_blue_numbers)
	compare_result()
	document.getElementById('red_balls_matched').innerHTML = JSON.stringify(red_matches)
	document.getElementById('blue_balls_matched').innerHTML = JSON.stringify(blue_matches)

	spendings -= 2
	document.getElementById('spendings').innerHTML = 'my spendings: ' + spendings
	document.getElementById('earnings').innerHTML = 'my earnings: ' + earnings
	document.getElementById('net_gain').innerHTML = 'net gain: ' + (spendings + earnings)

}

function get_lottery_result() {
	this_red_result = shuffle(red_numbers).slice(0, 6)
	this_blue_result = shuffle(blue_numbers).slice(0, 1)
	document.getElementById('red_balls').innerHTML = 'red balls: ' + JSON.stringify(this_red_result)
	document.getElementById('blue_balls').innerHTML = 'blue balls: ' + JSON.stringify(this_blue_result)
}

function compare_result() {
	red_matches = this_red_result.filter(x => my_red_numbers.includes(x));
	blue_matches = this_blue_result.filter(x => my_blue_numbers.includes(x))
	win = false
	win_amount = 0
	if (red_matches.length === 6 && blue_matches.length === 1) {
		earnings += 6000000
		win_amount = 6000000
		win = true
		statistics[0] += 1
	} else if (red_matches.length === 6 && blue_matches.length === 0) {
		earnings += 200000
		win_amount = 200000
		win = true
		statistics[1] += 1
	} else if (red_matches.length === 5 && blue_matches.length === 1) {
		earnings += 3000
		win_amount = 3000
		win = true
		statistics[2] += 1
	} else if ((red_matches.length === 4 && blue_matches.length === 1) || (red_matches.length === 5 && blue_matches.length === 0)) {
		earnings += 200
		win_amount = 200
		win = true
		statistics[3] += 1
	} else if ((red_matches.length === 3 && blue_matches.length === 1) || (red_matches.length === 4 && blue_matches.length === 0)) {
		earnings += 10
		win_amount = 10
		win = true
		statistics[4] += 1
	} else if (blue_matches.length === 1) {
		earnings += 5
		win_amount = 5
		win = true
		statistics[5] += 1
	}
	if (win_amount >= 3000) {
		alert('you won ' + win_amount + " !!!")
	}
}

function draw() {
	background(220);
	// textSize(16)
	// textAlign(CENTER, CENTER);
	// text('net value: ' + (spendings + earnings), 360, 22)
	// fill(0);
}
