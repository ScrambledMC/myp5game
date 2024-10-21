Array.prototype.remove = function(index) {
    for (var i = index; i < this.length; i ++)
        this[i] = this[i + 1];
    this.pop();
};


const BLOCK_SIZE = 50;

function rectangle(x, y, w, h) {
    rect(x * BLOCK_SIZE, height - y * BLOCK_SIZE, w * BLOCK_SIZE, -h * BLOCK_SIZE);
}


const MAX_PRECISION = 1000000;

function deFloat(num) {
    return round(num * MAX_PRECISION) / MAX_PRECISION;
}
