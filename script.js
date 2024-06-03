const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const jumpButton = document.getElementById('jumpButton');

function resizeCanvas() {
    canvas.width = window.innerWidth < 800 ? window.innerWidth - 20 : 800;
    canvas.height = window.innerHeight < 400 ? window.innerHeight - 150 : 200;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const dinoImg = new Image();
dinoImg.src = 'images/dino.png';

const cactusImg = new Image();
cactusImg.src = 'images/cactus.png';

let dino = {
    x: 50,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    dy: 0,
    gravity: 0.6,
    jumpPower: -15,
    grounded: false
};

let obstacles = [];
let frame = 0;
let gameSpeed = 3;
let score = 0;
let gameOver = false;
let gamePaused = false;
let backgroundColor = 'lightgreen';

function drawDino() {
    ctx.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
}

function drawObstacle() {
    for (let i = 0; i < obstacles.length; i++) {
        ctx.drawImage(cactusImg, obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    }
}

function updateDino() {
    dino.dy += dino.gravity;
    dino.y += dino.dy;

    if (dino.y + dino.height > canvas.height) {
        dino.y = canvas.height - dino.height;
        dino.dy = 0;
        dino.grounded = true;
    } else {
        dino.grounded = false;
    }
}

function updateObstacles() {
    if (frame % 150 === 0) {
        let obstacle = {
            x: canvas.width,
            y: canvas.height - 50,
            width: 50,
            height: 50
        };
        obstacles.push(obstacle);
    }

    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].x -= gameSpeed;

        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            scoreDisplay.innerText = 'Score: ' + score;

            if (score % 10 === 0) {
                gameSpeed += 0.2;
            }
        }
    }
}

function detectCollision() {
    for (let i = 0; i < obstacles.length; i++) {
        if (dino.x < obstacles[i].x + obstacles[i].width &&
            dino.x + dino.width > obstacles[i].x &&
            dino.y < obstacles[i].y + obstacles[i].height &&
            dino.y + dino.height > obstacles[i].y) {
            gameOver = true;
            alert('Game Over! Score: ' + score);
            return;
        }
    }
}

function jump() {
    if (dino.grounded && !gameOver) {
        dino.dy = dino.jumpPower;
    }
}

function gameLoop() {
    if (gameOver || gamePaused) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawDino();
    drawObstacle();

    updateDino();
    updateObstacles();

    detectCollision();

    frame++;
    requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        jump();
    }
});

jumpButton.addEventListener('touchstart', jump);

function startGame(bgColor) {
    backgroundColor = bgColor;
    menu.style.display = 'none';
    game.style.display = 'flex';
    gameOver = false;
    gamePaused = false;
    score = 0;
    frame = 0;
    gameSpeed = 3;
    dino.y = canvas.height - 50;
    dino.dy = 0;
    obstacles = [];
    scoreDisplay.innerText = 'Score: 0';
    gameLoop();
}

function pauseGame() {
    gamePaused = true;
    document.getElementById('pauseButton').style.display = 'none';
    document.getElementById('playButton').style.display = 'block';
}

function playGame() {
    gamePaused = false;
    document.getElementById('pauseButton').style.display = 'block';
    document.getElementById('playButton').style.display = 'none';
    gameLoop();
}

function restartGame() {
    gameOver = false;
    gamePaused = false;
    score = 0;
    frame = 0;
    gameSpeed = 3;
    dino.y = canvas.height - 50;
    dino.dy = 0;
    obstacles = [];
    scoreDisplay.innerText = 'Score: 0';
    gameLoop();
}

function showMenu() {
    gameOver = true; // Stop the game loop
    menu.style.display = 'flex';
    game.style.display = 'none';
}

// Initial call to show the menu
showMenu();
