class Player {
    WALK_SPEED = 0.2;
    ACCEL_SPEED = 0.02;
    BOUNCINESS = 1;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;

        this.velX = 0;
        this.targetVelX = 0;
        this.velY = 0;
        this.targetVelY = 0;
        
        this.coins = 0;
    }


    render() {
        noStroke();
        fill(12, 128, 255);
        rectangle(this.x, this.y, this.w, this.h);
        fill(12, 255, 128);
        rectangle(this.x + 1/6, this.y + 2/3, 1/6, 1/6);
        rectangle(this.x + 2/3, this.y + 2/3, 1/6, 1/6);
        rectangle(this.x + 1/6, this.y + 1/6, 2/3, 1/6);
    }



    isColliding(other) {
        return this.x < other.x + other.w && this.x + this.w > other.x && this.y < other.y + other.h && this.y + this.h > other.y;
    }
    
    isTouching(other) {
        // does not detect touching top side, probably floating point error
        return this.x <= other.x + other.w && this.x + this.w >= other.x && this.y <= other.y + other.h && this.y + this.h >= other.y;
    }


    getXMovement(changeX, walls) {
        var moveX = changeX;
        var bounciness = 0;
    
        for (var wall of walls) {
            if (changeX && wall.y < this.y + this.h && wall.y + wall.h > this.y) {
                var distance = changeX < 0 ? (this.x - (wall.x + wall.w)) : ((this.x + this.w) - wall.x);
    
                if (Math.abs(distance) < Math.abs(moveX)) {
                    moveX = -distance;
                    bounciness = wall.bounciness;
                }
            }
        }
    
        return [moveX, bounciness];
    }

    getYMovement(changeY, walls) {
        var moveY = changeY;
        var bounciness = 0;
    
        for (var wall of walls) {
            if (changeY && wall.x < this.x + this.w && wall.x + wall.w > this.x) {
                var distance = changeY < 0 ? (distance = this.y - (wall.y + wall.h)) : (distance = (this.y + this.h) - wall.y);
    
                if (Math.abs(distance) < Math.abs(moveY)) {
                    moveY = -distance;
                    bounciness = wall.bounciness;
                }
            }
        }
    
        return [moveY, bounciness];
    }


    moveX(dist, walls) {
        var xMove = this.getXMovement(dist, walls);
        var moveX = xMove[0], bounceX = xMove[1];

        if (moveX === 0)
            this.velX = this.velX * -bounceX * this.BOUNCINESS;

        this.x = deFloat(this.x + moveX);
    }

    moveY(dist, walls) {
        var yMove = this.getYMovement(dist, walls);
        var moveY = yMove[0], bounceY = yMove[1];

        if (moveY === 0)
            this.velY = this.velY * -bounceY * this.BOUNCINESS;

        this.y = deFloat(this.y + moveY);
    }


    updateMovement(keys, walls) {
        this.targetVelX = 0;
        this.targetVelY = 0;

        if (keys[37] || keys[65]) // left
            this.targetVelX -= this.WALK_SPEED;
        if (keys[39] || keys[68]) // right
            this.targetVelX += this.WALK_SPEED;
        if (keys[38] || keys[87]) // up
            this.targetVelY += this.WALK_SPEED;
        if (keys[40] || keys[83]) // down
            this.targetVelY -= this.WALK_SPEED;

        if (this.velX < this.targetVelX)
            this.velX = Math.min(this.velX + this.ACCEL_SPEED, this.targetVelX)
        else if (this.velX > this.targetVelX)
            this.velX = Math.max(this.velX - this.ACCEL_SPEED, this.targetVelX)

        if (this.velY < this.targetVelY)
            this.velY = Math.min(this.velY + this.ACCEL_SPEED, this.targetVelY)
        else if (this.velY > this.targetVelY)
            this.velY = Math.max(this.velY - this.ACCEL_SPEED, this.targetVelY)

        // corner collision gives priority to X
        this.moveX(this.velX, walls);
        this.moveY(this.velY, walls);

        this.velX = deFloat(this.velX);
        this.velY = deFloat(this.velY);
    }

    

    teleport(x, y) {
        this.x = x;
        this.y = y;
    }


    update(keys, walls, coins) {
        this.updateMovement(keys, walls);

        for (var i in coins)
            if (this.isColliding(coins[i])) {
                coins.remove(parseInt(i));
                this.coins ++;
            }
    }
}



class Wall {
    constructor(x, y, w, h, bounciness) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.bounciness = bounciness;
    }

    render() {
        noStroke();
        fill(100, 100, 100);
        rectangle(this.x, this.y, this.w, this.h);
    }
}



class Coin {
    constructor(x, y) {
        this.x = x + 0.3;
        this.y = y + 0.3;
        this.w = 0.4;
        this.h = 0.4;
    }

    render() {
        noStroke();
        fill(160, 160, 0);
        rectangle(this.x, this.y, this.w, this.h);
    }
}
