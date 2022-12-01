const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function () {
    if (this.x + this.size >= width) {
        this.velX = -this.velX;
    }

    if (this.x - this.size <= 0) {
        this.velX = -this.velX;
    }

    if (this.y + this.size >= height) {
        this.velY = -this.velY;
    }

    if (this.y - this.size <= 0) {
        this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
    for (const elem of balls) {
        if (!(this === elem)) {
            var dx = this.x - elem.x;
            var dy = this.y - elem.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + elem.size) {
                elem.color = this.color =
                    "rgb(" +
                    random(0, 255) +
                    "," +
                    random(0, 255) +
                    "," +
                    random(0, 255) +
                    ")";
            }
        }
    }
};

const balls = [];

function lopp() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    while (balls.length < 20) {
        let ball = new Ball(
            random(0, width),
            random(0, height),
            random(-7, 7),
            random(-7, 7),
            "rgb(" +
                random(0, 255) +
                "," +
                random(0, 255) +
                "," +
                random(0, 255) +
                ")",
            random(10, 20)
        );
        balls.push(ball);
    }

    for (const elem of balls) {
        elem.draw();
        elem.update();
        elem.collisionDetect();
    }

    requestAnimationFrame(lopp);
}

lopp();