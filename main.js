try {
    var showDebug = false;

    var keys = {};

    var player = new Player(20, 10);
    var walls = [
        new Wall(6, 2, 4, 10, 0),
        new Wall(24, 15, 10, 6, 0.8)
    ]
    var waters = [
        new Water(16, 2, 18, 10, 1)
    ];
    var coins = [
        new Coin(8, 16),
        new Coin(12, 16),
        new Coin(17, 19),
        new Coin(29, 10),
        new Coin(35, 8)
    ];


    function drawThings() {
        background(0);

        for (var i of walls)
            i.render();

        for (var i of waters)
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
            text(`frameCount: ${frameCount}\nkeys: ${JSON.stringify(keys)}\nx: ${player.x}, velX: ${player.velX}\ny: ${player.y}, velY: ${player.velY}`, 20, 25);
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
        player.update(keys, walls, waters, coins);

        drawThings();
    }

} catch (e) {
    alert(e);
}
