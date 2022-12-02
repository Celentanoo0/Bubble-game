"use strict";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const timeCounter = document.querySelector('h1 span');
const ballCounter = document.querySelector('p span');

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);
    this.color = color;
    this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Object.defineProperty(Ball.prototype, "constructor", {
    value: Ball,
    enumerable: false,
    writable: true,
});

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

function EvilCircle(x, y, exist) {
    Shape.call(this, x, y, 20, 20, exist);
    this.color = "white";
    this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
Object.defineProperty(EvilCircle.prototype, "constructor", {
    value: EvilCircle,
    enumerable: false,
    writable: true,
});

EvilCircle.prototype.draw = function () {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};

EvilCircle.prototype.checkBounds = function () {
    if (this.x + this.size >= width) {
        this.x = width - this.size;
    }

    if (this.x - this.size <= 0) {
        this.x = 0 + this.size;
    }

    if (this.y + this.size >= height) {
        this.y = height - this.size;
    }

    if (this.y - this.size <= 0) {
        this.y = 0 + this.size;
    }
};

EvilCircle.prototype.setControls = function () {
    const _this = this;
    window.onkeydown = function (e) {
        if (e.code === "KeyA") {
            _this.x -= _this.velX;
        } else if (e.code === "KeyD") {
            _this.x += _this.velX;
        } else if (e.code === "KeyW") {
            _this.y -= _this.velY;
        } else if (e.code === "KeyS") {
            _this.y += _this.velY;
        }
    };
    if(Number(timeCounter.innerHTML) === 0){
        window.onkeydown = null;
    }
};

EvilCircle.prototype.collisionDetect = function () {
    for (const elem of balls) {
        if (elem.exists === true) {
            var dx = this.x - elem.x;
            var dy = this.y - elem.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + elem.size) {
                elem.exists = false;
                ballCounter.innerHTML -= 1;
            }
        }
    }
};

const balls = [];
const evilCircle = new EvilCircle(random(0, width), random(0, height), true);
evilCircle.setControls();

setTimeout(changeTimer, 1000)

function changeTimer(){
    let temp = Number(timeCounter.innerHTML);
    if(temp > 0){
        temp -= 1;
        timeCounter.innerHTML = temp;
        setTimeout(changeTimer, 1000)
    }
    if(temp === 0){
        const fail = document.createElement('h2');
        const body = document.querySelector('body');
        console.log(body)
        fail.innerHTML = 'You lose!'
        body.append(fail);
    }
}

function lopp() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
    ctx.fillRect(0, 0, width, height);

    while (balls.length < 20) {
        let ball = new Ball(
            random(0, width),
            random(0, height),
            random(-7, 7),
            random(-7, 7),
            true,
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

    ballCounter.innerHTML = balls.filter(item => item.exists === true).reduce(sum => sum += 1, 0);

    if(Number(timeCounter.innerHTML) === 0){
        for(const elem of balls){
            elem.exists = false;
        }
        evilCircle.setControls();
    }

    for (const elem of balls) {
        if (elem.exists === true) {
            elem.draw();
            elem.update();
            elem.collisionDetect();
        }
    }

    evilCircle.draw();
    evilCircle.checkBounds();
    evilCircle.collisionDetect();

    requestAnimationFrame(lopp);
}

lopp();