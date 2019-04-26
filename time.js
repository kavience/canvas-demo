const WIDTH = 1400 // 总宽度
const HEIGHT = 768 // 总高度
const X_WIDTH = 100 // 数字距离左边
const Y_HEIGHT = 150 // 数字距离顶部
const X_MARGIN = 20 // 小球之间的x向(横向)距离
const Y_MARGIN = 20 // 小球之间的y向(纵向)距离
const RADIUS = 10  // 小球的半径
const POSITION_MARGIN = 150 // 每个数字之间的距离
const COLOR = ["#FE4365", "#FC9D9A", "#F9CDAD", "#C8C8A9", "#83AF9B", "#1E90FF"] // 小球的颜色

window.onload = function () {
	let canvas = document.getElementById('canvas')
	canvas.width = WIDTH
	canvas.height = HEIGHT
	let context = canvas.getContext("2d")

	draw(context)
}

function draw(context) {
	// 记录当前数字
	let positionOne = 0;
	let positionTwo = 0;
	let positionThree = 10;
	let positionFour = 0;
	let positionFive = 0;
	let positionSix = 10;
	let positionSeven = 0;
	let positionEight = 0;

	// 记录之前数字
	let previousPositionOne = 0;
	let previousPositionTwo = 0;
	let previousPositionFour = 0;
	let previousPositionFive = 0;
	let previousPositionSeven = 0;
	let previousPositionEight = 0;
	let previousPositionsNum = []

	let timesFlag = false; // 记录是否是第一次渲染页面
	let positions = []	   // 初始化每个数字的位置
	let balls = [] //动态的小球数组

	for(var i = 0; i < 8; i++) {
		positions[i] = {
			x: X_WIDTH + POSITION_MARGIN * i,
			y: Y_HEIGHT,
			x_margin: X_MARGIN,
			y_margin: Y_MARGIN	
		}
	}

	// 定时刷新界面
	setInterval(function () {

		// 清空画布
		context.clearRect(0, 0, WIDTH, HEIGHT)

		// 根据时间提取每个数字
		let date = new Date()
		let hour = date.getHours()
		let minute = date.getMinutes()
		let second = date.getSeconds()
		positionOne = Math.floor(hour / 10)
		positionTwo = hour % 10
		positionFour = Math.floor(minute / 10)
		positionFive = minute % 10
		positionSeven = Math.floor(second / 10)
		positionEight = second % 10


		// 记录各个位置的数字
		let positionNum = [
			positionOne, positionTwo, positionThree, positionFour, 
			positionFive, positionSix, positionSeven, positionEight
		]

		// 循环输出每个位置
		for (var i = 0; i < positions.length; i++) {
			anPosition(context, positions[i], digit[positionNum[i]]);
		}

		// 循环输出彩色小球
		if (balls.length != 0) {
			for (var i = 0; i < balls.length; i++) {
				context.fillStyle = balls[i].color
				context.beginPath()
				context.arc(balls[i].x, balls[i].y, RADIUS, 0, 2*Math.PI)
				context.closePath()
				context.fill()

				balls[i].x += balls[i].vx
				balls[i].y += balls[i].vy
				balls[i].vy += balls[i].g
				if (balls[i].y > HEIGHT - balls[i].r) {
					if (Math.abs(balls[i].vy) < 10) {
						balls[i].vy = 0
					}
					balls[i].y = HEIGHT - balls[i].r
					balls[i].vy = -balls[i].vy * 0.5
				}
			}	
		}

		// 主要是监听现在的数字的变化，如果有变化，就渲染将要渲染的动态小球加入到balls数组中，等待下一次渲染
		let previousSum = previousPositionOne + previousPositionTwo + previousPositionFour + previousPositionFive + previousPositionSeven + previousPositionEight
		let nowSum = positionOne + positionTwo + positionFour + positionFive + positionSeven + positionEight
		if (timesFlag == true && previousSum != nowSum) {
			for (var m = 0; m < positions.length; m++) {
				if (positionNum[m] != previousPositionsNum[m]) {
					for (var i = 0; i < digit[previousPositionsNum[m]].length; i++) {
						for (var j = 0; j < digit[previousPositionsNum[m]][i].length; j++) {
						 	if (digit[previousPositionsNum[m]][i][j] == 1) {
						 		let ballNew = {
										x: X_WIDTH + POSITION_MARGIN * m + X_MARGIN * j, // 球心x位置
										y: Y_HEIGHT + Y_MARGIN * i,		// 球心y位置
										vx: -3 * Math.pow(-1, Math.ceil(Math.random()*10)),	// 横向速度
										vy: -5,	// 纵向速度
										g: 1.5+Math.random(), 	// 加速度
										f: 0.5, // 摩擦因素
										r: RADIUS, //半径
										color: COLOR[Math.floor(Math.random()*COLOR.length)], // 颜色
									}

									balls.push(ballNew)
						 		}
							 }
						}
					}
			}


			// 这里主要是因为执行完之后，需要把当下的时间给先前的时间，以便判断数字是否更新
			previousPositionOne = positionOne
			previousPositionTwo = positionTwo
			previousPositionThree = positionThree
			previousPositionFour = positionFour
			previousPositionFive = positionFive
			previousPositionSix	 = positionSix
			previousPositionSeven = positionSeven
			previousPositionEight = positionEight


		} else {
			// 这里主要是因为第一次初始化，当前数字和先前数字一致
			previousPositionOne = positionOne
			previousPositionTwo = positionTwo
			previousPositionThree = positionThree
			previousPositionFour = positionFour
			previousPositionFive = positionFive
			previousPositionSix	 = positionSix
			previousPositionSeven = positionSeven
			previousPositionEight = positionEight

			previousPositionsNum = [
				previousPositionOne, previousPositionTwo, previousPositionThree, previousPositionFour, 
				previousPositionFive, previousPositionSix, previousPositionSeven, previousPositionEight
			]

			// 设置为true，从此不再执行这条else
			timesFlag = true
		}

	}, 50)
}

function anPosition(context, position, digit) {
	context.fillStyle = "rgb(0 102 153)"

	let y_position = position.y
	for (var i = 0; i < digit.length; i++) {
		let x_position = position.x
		for (var j = 0; j < digit[i].length; j++) {

				context.beginPath()
				if (digit[i][j]) {
					context.arc(x_position, y_position, RADIUS, 0, 2*Math.PI)
				}
				x_position += position.x_margin 
				context.fill()
		}
		y_position += position.y_margin 
	}
}

function colorBallRender(context, balls) {
	
}
