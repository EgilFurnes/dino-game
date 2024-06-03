const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const jumpButton = document.getElementById('jumpButton');

function resizeCanvas() {
    if (window.innerWidth < window.innerHeight) {
        // Portrait mode
        canvas.width = window.innerWidth * 0.9;
        canvas.height = canvas.width * 0.5;
    } else {
        // Landscape mode
        canvas.width = 800;
        canvas.height = 200;
    }
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const dinoRunningImg = new Image();
dinoRunningImg.src = 'images/dino_running.png';

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

let dinoFrame = 0;
const dinoFrameWidth = 50;
const dinoFrameHeight = 50;
const totalDinoFrames = 4;
let dinoAnimationSpeed = 5;

function drawDino() {
    ctx.drawImage(
        dinoRunningImg,
        dinoFrame * dinoFrameWidth, 0, // Source X and Y (top-left corner of each frame)
        dinoFrameWidth, dinoFrameHeight, // Source width and height (size of each frame)
        dino.x, dino.y, // Destination X and Y
        dino.width, dino.height // Destination width and height
    );

    // Update the frame
    if (frame % dinoAnimationSpeed === 0) {
        dinoFrame = (dinoFrame + 1) % totalDinoFrames;
    }
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
        const hitboxPaddingX = 25;
        const hitboxPaddingY = 25;

        if (dino.x < obstacles[i].x + obstacles[i].width - hitboxPaddingX &&
            dino.x + dino.width > obstacles[i].x + hitboxPaddingX &&
            dino.y < obstacles[i].y + obstacles[i].height - hitboxPaddingY &&
            dino.y + dino.height > obstacles[i].y + hitboxPaddingY) {
            gameOver = true;
            displayGameOverMessage(); // New function to display game over message
            return;
        }
    }
}

function displayGameOverMessage() {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'gameOverMessage';
    gameOverMessage.innerText = 'Game Over! Press R to Restart';
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.padding = '20px';
    gameOverMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    gameOverMessage.style.color = 'white';
    gameOverMessage.style.fontSize = '24px';
    gameOverMessage.style.textAlign = 'center';
    document.body.appendChild(gameOverMessage);
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
    } else if (e.code === 'KeyP') {
        if (gamePaused) {
            playGame();
        } else {
            pauseGame();
        }
    } else if (e.code === 'KeyR') {
        restartGame();
    } else if (e.code === 'KeyM') {
        showMenu();
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
    removeGameOverMessage();
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

function showMenu() {
    gameOver = true; // Stop the game loop
    menu.style.display = 'flex';
    game.style.display = 'none';
    removeGameOverMessage();
}

function removeGameOverMessage() {
    const gameOverMessage = document.getElementById('gameOverMessage');
    if (gameOverMessage) {
        gameOverMessage.remove();
    }
}


// Initial call to show the menu
showMenu();
