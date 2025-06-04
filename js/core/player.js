/**************************************************
** GAME PLAYER CLASS
**************************************************/

var FACING_TO_UP = 1,
    FACING_TO_DOWN = 2,
    FACING_TO_LEFT = 3,
    FACING_TO_RIGHT = 4,
    FACING_TO_UP_LEFT = 5,
    FACING_TO_UP_RIGHT = 6,
    FACING_TO_DOWN_LEFT = 7,
    FACING_TO_DOWN_RIGHT = 8;

var Player = function(env, x, y) {

    this.x = x;
  	this.y = y;
    this.env = env;
    this.speed = this.env.height;
    this.direction = FACING_TO_DOWN;
    this.score = 0;
    this.arrow = 10;
    this.lastGrab = null;
    this.lastShoot = null;

    this.markAsVisible = function(){
        this.env.visible[this.getPosI()][this.getPosJ()] = 1;
    }

    this.kill = function(keys) {

        var deadWumpus = null;

        if (keys.space) {

			if (this.arrow == 0) {
				return false;
			}

			this.arrow--;

            keys.space= false;

            var pos = null;

            if(this.direction == FACING_TO_UP) pos = {i:this.getPosI(), j:this.getPosJ()-1};
            if(this.direction == FACING_TO_DOWN) pos = {i:this.getPosI(), j:this.getPosJ()+1};
            if(this.direction == FACING_TO_LEFT) pos = {i:this.getPosI()-1, j:this.getPosJ()};
            if(this.direction == FACING_TO_RIGHT) pos = {i:this.getPosI()+1, j:this.getPosJ()};

            if(this.direction == FACING_TO_UP_RIGHT) pos = {i:this.getPosI() + 1, j:this.getPosJ() + 1};
            if(this.direction == FACING_TO_UP_LEFT) pos = {i:this.getPosI() + 1, j:this.getPosJ() - 1};
            if(this.direction == FACING_TO_DOWN_RIGHT) pos = {i:this.getPosI() - 1, j:this.getPosJ() + 1};
            if(this.direction == FACING_TO_DOWN_LEFT) pos = {i:this.getPosI() - 1, j:this.getPosJ() - 1};

            deadWumpus = this.env.get(this.env.wumpus, pos.i, pos.j);

            if (deadWumpus) {
                resources.play("arrow");
            }else{
                resources.play("error");
            }
        }

        return deadWumpus;
    };

    this.capture = function(keys) {

        var capturedGold = null;

        if (keys.enter) {

            keys.enter = false;

            this.lastGrab = [this.getPosJ(), this.getPosI()];
            console.log('last grab')
            console.log(this.lastGrab)
            capturedGold = this.env.get(this.env.golds, this.getPosI(), this.getPosJ());
        }

        return capturedGold;
    };

    this.update = function(keys) {

		// Previous position
		var prevX = this.x,
			prevY = this.y;

		// Up key takes priority over down
		if (keys.up) {
            if(this.direction == FACING_TO_UP && this.y > 0){
                this.y -= this.speed;
                resources.play("move");
            }else{
                this.direction = FACING_TO_UP;
            }
		} else if (keys.down) {
            if(this.direction == FACING_TO_DOWN && this.y+this.speed < this.env.j*this.env.height){
      		    this.y += this.speed;
                  resources.play("move");
            }else{
                this.direction = FACING_TO_DOWN;
            }
		} else if (keys.left) {
            if(this.direction == FACING_TO_LEFT && this.x > 0){
      		    this.x -= this.speed;
                  resources.play("move");
            }else{
                this.direction = FACING_TO_LEFT;
            }
		} else if (keys.right) {
            if(this.direction == FACING_TO_RIGHT && this.x+this.speed < this.env.i*this.env.width){
                this.x += this.speed;
                resources.play("move");
            }else{
                this.direction = FACING_TO_RIGHT;
            }
		} else if (keys.upLeft) {
            if(this.direction == FACING_TO_UP_LEFT && this.x > 0 && this.y > 0){
      		    this.x -= this.speed;
                this.y -= this.speed;
                resources.play("move");
            }else{
                this.direction = FACING_TO_UP_LEFT;
            }
		} else if (keys.upRight) {
            if(this.direction == FACING_TO_UP_RIGHT && this.x+this.speed < this.env.i*this.env.width && this.y > 0){
                this.x += this.speed;
                this.y -= this.speed;
                resources.play("move");
            }else{
                this.direction = FACING_TO_UP_RIGHT;
            }
		} else if (keys.downLeft) {
            if(this.direction == FACING_TO_DOWN_LEFT && this.x > 0  && this.y+this.speed < this.env.j*this.env.height){
      		    this.x -= this.speed;
      		    this.y += this.speed;
                resources.play("move");
            }else{
                this.direction = FACING_TO_DOWN_LEFT;
            }
		} else if (keys.downRight) {
            if(this.direction == FACING_TO_DOWN_RIGHT && this.x+this.speed < this.env.i*this.env.width  && this.y+this.speed < this.env.j*this.env.height){
                this.x += this.speed;
      		    this.y += this.speed;
                resources.play("move");
            }else{
                this.direction = FACING_TO_DOWN_RIGHT;
            }
		} 

        this.markAsVisible();

        keys.up = keys.down = keys.left = keys.right = false;
        keys.upLeft = keys.upRight = keys.downLeft = keys.downRight = false;

		return (prevX != this.x || prevY != this.y) ? true : false;
	};

    this.evaluate = function(){

    };

    this.getPosI = function(){
		return Math.floor(this.x / this.env.width);
	};

	this.getPosJ = function(y){
		return Math.floor(this.y / this.env.height);
	};

	this.draw = function(ctx) {
        if(this.direction == FACING_TO_DOWN){
            ctx.drawImage(resources.images['facing_to_down'], this.x, this.y, this.env.width, this.env.height);
        }else if(this.direction == FACING_TO_UP){
            ctx.drawImage(resources.images['facing_to_up'], this.x, this.y, this.env.width, this.env.height);
        }else if(this.direction == FACING_TO_LEFT){
            ctx.drawImage(resources.images['facing_to_left'], this.x, this.y, this.env.width, this.env.height);
        }else if(this.direction == FACING_TO_RIGHT){
            ctx.drawImage(resources.images['facing_to_right'], this.x, this.y, this.env.width, this.env.height);
        } else if (this.direction == FACING_TO_UP_LEFT) {
            ctx.drawImage(resources.images['facing_to_up_left'], this.x, this.y, this.env.width, this.env.height);
        } else if (this.direction == FACING_TO_UP_RIGHT) {
            ctx.drawImage(resources.images['facing_to_up_right'], this.x, this.y, this.env.width, this.env.height);
        } else if (this.direction == FACING_TO_DOWN_LEFT) {
            ctx.drawImage(resources.images['facing_to_down_left'], this.x, this.y, this.env.width, this.env.height);
        } else if (this.direction == FACING_TO_DOWN_RIGHT) {
            ctx.drawImage(resources.images['facing_to_down_right'], this.x, this.y, this.env.width, this.env.height);
        }
	};
};
