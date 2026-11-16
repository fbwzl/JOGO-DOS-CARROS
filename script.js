const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Elementos da Interface (UI)
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('highScore');
const finalScoreEl = document.getElementById('finalScore');
const menuEl = document.getElementById('menu');
const restartBtn = document.getElementById('restartBtn');

// Variáveis de Estado do Jogo
let score = 0;
let highScore = 0;
let isPlaying = true;
let gameSpeed = 4;
let frameCount = 0;

// Jogador
const player = {
    x: 100,
    y: canvas.height / 2 - 20,
    width: 35,
    height: 35,
    color: '#38bdf8',
    speed: 6
};

// Array de obstáculos
let obstacles = [];

// Controle de Teclado
const keys = {};
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

// Botão de Reiniciar
restartBtn.addEventListener('click', resetGame);

// Gerador de Obstáculos
function spawnObstacle() {
    const size = Math.floor(Math.random() * 30) + 20; 
    const yPos = Math.random() * (canvas.height - size);
    
    obstacles.push({
        x: canvas.width,
        y: yPos,
        width: size,
        height: size,
        color: '#f43f5e'
    });
}

// Atualiza a lógica do jogo a cada frame
function update() {
    if (!isPlaying) return;

    // Movimentação do Jogador (Setas ou W, A, S, D)
    if ((keys['ArrowUp'] || keys['KeyW']) && player.y > 0) {
        player.y -= player.speed;
    }
    if ((keys['ArrowDown'] || keys['KeyS']) && player.y + player.height < canvas.height) {
        player.y += player.speed;
    }
    if ((keys['ArrowLeft'] || keys['KeyA']) && player.x > 0) {
        player.x -= player.speed;
    }
    if ((keys['ArrowRight'] || keys['KeyD']) && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }

    // Gerar novos obstáculos
    frameCount++;
    if (frameCount % 60 === 0) {
        spawnObstacle();
        gameSpeed += 0.1;
    }

    // Atualizar posição dos obstáculos
    for (let i = obstacles.length - 1; i >= 0; i--) {
        let obs = obstacles[i];
        obs.x -= gameSpeed;

        // Detecção de Colisão
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            gameOver();
        }

        // Remover obstáculos que saíram da tela e somar pontos
        if (obs.x + obs.width < 0) {
            obstacles.splice(i, 1);
            score += 10;
            scoreEl.textContent = score;
        }
    }
}

// Renderiza os gráficos na tela
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha o Jogador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Desenha os Obstáculos
    for (let i = 0; i < obstacles.length; i++) {
        let obs = obstacles[i];
        ctx.fillStyle = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    }
}

// Condição de Fim de Jogo
function gameOver() {
    isPlaying = false;
    finalScoreEl.textContent = score;
    
    if (score > highScore) {
        highScore = score;
        highScoreEl.textContent = highScore;
    }
    
    menuEl.classList.remove('hidden');
}

// Reiniciar a partida
function resetGame() {
    obstacles = [];
    score = 0;
    gameSpeed = 4;
    frameCount = 0;
    scoreEl.textContent = score;
    player.x = 100;
    player.y = canvas.height / 2 - 20;
    menuEl.classList.add('hidden');
    isPlaying = true;
    gameLoop();
}

// O Loop Principal do Jogo
function gameLoop() {
    update();
    draw();
    if (isPlaying) {
        requestAnimationFrame(gameLoop);
    }
}

// Iniciar o jogo
gameLoop();