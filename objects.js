class Player {
    WALK_SPEED = 0.25;
    ACCEL_SPEED = 0.025;
    BOUNCINESS = 1;
    MIN_BOUNCE = 0.065;
    SWIM_SPEED = 0.7;

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;

        this.velX = 0;
        this.velY = 0;
        
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
        // does not detect touching top side maybe, probably floating point error
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

        if (moveX === 0) {
            this.velX = this.velX * -bounceX * this.BOUNCINESS;

            if (bounceX && Math.abs(this.velX) < Math.abs(this.MIN_BOUNCE))
                this.velX = 0;
        }

        this.x = deFloat(this.x + moveX);
    }

    moveY(dist, walls) {
        var yMove = this.getYMovement(dist, walls);
        var moveY = yMove[0], bounceY = yMove[1];

        if (moveY === 0) {
            this.velY = this.velY * -bounceY * this.BOUNCINESS;

            if (bounceY && Math.abs(this.velY) < Math.abs(this.MIN_BOUNCE))
                this.velY = 0;
        }

        this.y = deFloat(this.y + moveY);
    }


    getTargetVelX(keys, relSpeed) {
        var output = 0;

        if (keys[37] || keys[65]) // left
            output -= this.WALK_SPEED;
        if (keys[39] || keys[68]) // right
            output += this.WALK_SPEED;

        return deFloat(output * relSpeed);
    }

    getTargetVelY(keys, relSpeed) {
        var output = 0;

        if (keys[38] || keys[87]) // up
            output += this.WALK_SPEED;
        if (keys[40] || keys[83]) // down
            output -= this.WALK_SPEED;

        return deFloat(output * relSpeed);
    }


    getSpeedMultiplier(waters) {
        var slowdown = 1;
        var isInWater = false;

        for (var water of waters)
            if (this.isTouching(water)) {
                isInWater = true;

                if (water.thickness > slowdown)
                    slowdown = water.thickness;
            }

        return 1/slowdown * (isInWater ? this.SWIM_SPEED : 1);
    }


    updateMovement(keys, walls, waters) {
        var relSpeed = this.getSpeedMultiplier(waters);

        var targetVelX = this.getTargetVelX(keys, relSpeed);
        var targetVelY = this.getTargetVelY(keys, relSpeed);

        if (this.velX < targetVelX)
            this.velX = Math.min(this.velX + this.ACCEL_SPEED * relSpeed, targetVelX);
        else if (this.velX > targetVelX)
            this.velX = Math.max(this.velX - this.ACCEL_SPEED * relSpeed, targetVelX);

        if (this.velY < targetVelY)
            this.velY = Math.min(this.velY + this.ACCEL_SPEED, targetVelY);
        else if (this.velY > targetVelY)
            this.velY = Math.max(this.velY - this.ACCEL_SPEED, targetVelY);

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


    update(keys, walls, waters, coins) {
        this.updateMovement(keys, walls, waters);

        for (var i in coins)
            if (this.isTouching(coins[i])) {
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



class Water {
    constructor(x, y, w, h, thickness) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.thickness = thickness;
    }

    render() {
        noStroke();
        fill(10, 10, 100);
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
