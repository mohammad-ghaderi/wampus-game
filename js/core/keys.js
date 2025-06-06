/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Keys = function(up, left, right, down, upLeft, upRight, downLeft, downRight, space, enter) {
	var up = up || false,
		left = left || false,
		right = right || false,
		down = down || false;
		upLeft = upLeft || false,
		upRight = upRight || false,
		downLeft = downLeft || false,
		downRight = downRight || false,
		space = space || false;
		enter = enter || false;

	var onKeyDown = function(e) {
		if(!isAlive || isFinished){
			return;
		}

		var that = this,
			c = e.keyCode;

		switch (c) {
			// Controls
			case 37: // Left
				that.left = true;
				break;
			case 38: // Up
				that.up = true;
				break;
			case 39: // Right
				that.right = true; // Will take priority over the left key
				break;
			case 40: // Down
				that.down = true;
				break;
			case 36: // upLeft
				that.upLeft = true;
				break;
			case 33: // upRight
				that.upRight = true;
				break;
			case 35: // downLeft
				that.downLeft = true;
				break;
			case 34: // downRight
				that.downRight = true;
				break;
			case 32: // Space
				that.space = true;
				break;
			case 13: // enter
				that.enter = true;
				break;
		};
	};

	var onKeyUp = function(e) {

		var that = this,
			c = e.keyCode;
		switch (c) {
			case 37: // Left
				that.left = true;
				break;
			case 38: // Up
				that.up = true;
				break;
			case 39: // Right
				that.right = true;
				break;
			case 40: // Down
				that.down = true;
				break;
			case 36: // upLeft
				that.upLeft = true;
				break;
			case 33: // upRight
				that.upRight = true;
				break;
			case 35: // downLeft
				that.downLeft = true;
				break;
			case 34: // downRight
				that.downRight = true;
				break;
			case 32: // Space
				that.space = true;
				break;
			case 13: // enter
				that.enter = true;
				break;
		};
	};

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		space: space,
		enter: enter,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
};
