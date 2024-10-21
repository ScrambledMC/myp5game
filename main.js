try {
    var keys = {};

    var player = new Player(20, 10);
    var walls = [
        new Wall(6, 2, 4, 10, 0),
        new Wall(24, 15, 10, 6, 0.8)
    ]
    var coins = [
        new Coin(8, 16),
        new Coin(12, 16),
        new Coin(17, 19),
        new Coin(29, 10),
        new Coin(32, 8)
    ];


    function drawThings(showDebug) {
        background(0);

        for (var i of walls)
            i.render();

        for (var i of coins)
            i.render();

        player.render();

        fill(255, 255, 255);
        textSize(20);
        text(`Coins: ${player.coins}`, 20, height - 20);

        if (showDebug) {
            fill(12, 255, 128);
            textSize(12);
            text(`frameCount: ${frameCount}\nkeys: ${JSON.stringify(keys)}\nx: ${player.x}, y: ${player.y}\nvelX: ${player.velX}, targetVelX: ${player.targetVelX}\nvelY: ${player.velY}, targetVelY: ${player.targetVelY}`, 20, 25);
        }
    }


    function keyPressed() {
        keys[keyCode] = true;
    }

    function keyReleased() {
        keys[keyCode] = false;
    }

    function setup() {
        createCanvas(2000, 1200);
    }


    function draw() {
        player.update(keys, walls, coins);

        drawThings(true);
    }

} catch (e) {
    alert(e);
}
