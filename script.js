const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const menu = document.getElementById('menu');
const game = document.getElementById('game');
const jumpButton = document.getElementById('jumpButton');
const topScoresList = document.querySelector('#topScores ul');
const usernameContainer = document.getElementById('usernameContainer');
const usernameInput = document.getElementById('usernameInput');

let username = '';
let score = 0;
let gameOver = false;
let gamePaused = false;
let frame = 0;
let gameSpeed = 3;

function resizeCanvas() {
    if (window.innerWidth < window.innerHeight) {
        canvas.width = window.innerWidth * 0.9;
        canvas.height = canvas.width * 0.5;
    } else {
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

const dinoFrameWidth = 50;
const dinoFrameHeight = 50;
const totalDinoFrames = 8; // Update to the number of frames in your new sprite sheet
let dinoFrame = 0;
let dinoAnimationSpeed = 5;

function drawDino() {
    ctx.drawImage(
        dinoRunningImg,
        dinoFrame * dinoFrameWidth, 0,
        dinoFrameWidth, dinoFrameHeight,
        dino.x, dino.y,
        dino.width, dino.height
    );

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
        const hitboxPaddingX = 10;
        const hitboxPaddingY = 10;

        if (dino.x < obstacles[i].x + obstacles[i].width - hitboxPaddingX &&
            dino.x + dino.width > obstacles[i].x + hitboxPaddingX &&
            dino.y < obstacles[i].y + obstacles[i].height - hitboxPaddingY &&
            dino.y + dino.height > obstacles[i].y + hitboxPaddingY) {
            gameOver = true;
            displayGameOverMessage();
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

function setUsername() {
    username = usernameInput.value.trim();
    if (username) {
        usernameContainer.style.display = 'none';
        menu.style.display = 'flex';
        loadLeaderboard();
    } else {
        alert('Please enter a username.');
    }
}

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
    saveScore(score);
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

function showMenu() {
    gameOver = true;
    menu.style.display = 'flex';
    game.style.display = 'none';
    removeGameOverMessage();
}

function backToLevelSelector() {
    gameOver = true;
    menu.style.display = 'flex';
    game.style.display = 'none';
    removeGameOverMessage();
}

function backToUsername() {
    usernameContainer.style.display = 'flex';
    menu.style.display = 'none';
}

function removeGameOverMessage() {
    const gameOverMessage = document.getElementById('gameOverMessage');
    if (gameOverMessage) {
        gameOverMessage.remove();
    }
}

function displayGameOverMessage() {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.id = 'gameOverMessage';
    gameOverMessage.innerText = 'Game Over! Press R to Restart';

    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '10px';
    gameOverMessage.style.left = '10px';
    gameOverMessage.style.padding = '5px';
    gameOverMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    gameOverMessage.style.color = 'white';
    gameOverMessage.style.fontSize = '12px';
    gameOverMessage.style.fontFamily = '"Press Start 2P", cursive';
    gameOverMessage.style.textAlign = 'left';
    gameOverMessage.style.whiteSpace = 'nowrap';

    document.body.appendChild(gameOverMessage);
}

function saveScore(newScore) {
    let scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(newScore);
    scores.sort((a, b) => b - a); // Sort descending
    if (scores.length > 5) scores = scores.slice(0, 5); // Keep only top 5
    localStorage.setItem('scores', JSON.stringify(scores));
    loadLeaderboard();
}

function loadLeaderboard() {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    topScoresList.innerHTML = '';
    scores.forEach(score => {
        const li = document.createElement('li');
        li.textContent = score;
        topScoresList.appendChild(li);
    });
}

// Initial call to show the menu
showMenu();
