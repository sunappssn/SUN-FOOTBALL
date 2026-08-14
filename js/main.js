const menu = document.getElementById("menu");
const game = document.getElementById("game");
const playButton = document.getElementById("playButton");
const backButton = document.getElementById("backButton");

const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");

let gameRunning = false;

const player = {
    x: 250,
    y: 300,
    radius: 18,
    speed: 5
};

const ball = {
    x: 285,
    y: 300,
    radius: 9,
    vx: 0,
    vy: 0
};

const keys = {};

document.addEventListener("keydown", function(event) {
    keys[event.key.toLowerCase()] = true;

    if (event.code === "Space") {
        shoot();
        event.preventDefault();
    }
});

document.addEventListener("keyup", function(event) {
    keys[event.key.toLowerCase()] = false;
});

playButton.addEventListener("click", function() {
    menu.classList.add("hidden");
    game.classList.remove("hidden");

    gameRunning = true;
    gameLoop();
});

backButton.addEventListener("click", function() {
    gameRunning = false;
    game.classList.add("hidden");
    menu.classList.remove("hidden");
});

function update() {

    let dx = 0;
    let dy = 0;

    if (keys["arrowup"] || keys["w"]) {
        dy -= 1;
    }

    if (keys["arrowdown"] || keys["s"]) {
        dy += 1;
    }

    if (keys["arrowleft"] || keys["a"]) {
        dx -= 1;
    }

    if (keys["arrowright"] || keys["d"]) {
        dx += 1;
    }

    if (dx !== 0 || dy !== 0) {

        const length = Math.sqrt(dx * dx + dy * dy);

        player.x += (dx / length) * player.speed;
        player.y += (dy / length) * player.speed;
    }

    // Empêcher le joueur de sortir du terrain
    player.x = Math.max(35, Math.min(965, player.x));
    player.y = Math.max(35, Math.min(565, player.y));

    // Ballon
    ball.x += ball.vx;
    ball.y += ball.vy;

    ball.vx *= 0.96;
    ball.vy *= 0.96;

    // Collision joueur / ballon
    const distance = Math.hypot(
        ball.x - player.x,
        ball.y - player.y
    );

    if (distance < 40) {

        const angle = Math.atan2(
            ball.y - player.y,
            ball.x - player.x
        );

        ball.x = player.x + Math.cos(angle) * 35;
        ball.y = player.y + Math.sin(angle) * 35;
    }

    // Rebonds sur les côtés
    if (ball.y < 25 || ball.y > 575) {
        ball.vy *= -1;
    }

    if (ball.x < 25 || ball.x > 975) {
        ball.vx *= -1;
    }
}

function shoot() {

    const distance = Math.hypot(
        ball.x - player.x,
        ball.y - player.y
    );

    if (distance < 55) {

        ball.vx = 12;
        ball.vy = (ball.y - player.y) * 0.2;
    }
}

function drawField() {

    // Terrain
    ctx.fillStyle = "#168f42";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 4;

    // Bordure
    ctx.strokeRect(20, 20, 960, 560);

    // Ligne centrale
    ctx.beginPath();
    ctx.moveTo(500, 20);
    ctx.lineTo(500, 580);
    ctx.stroke();

    // Cercle central
    ctx.beginPath();
    ctx.arc(500, 300, 80, 0, Math.PI * 2);
    ctx.stroke();

    // Surface gauche
    ctx.strokeRect(20, 180, 150, 240);

    // Surface droite
    ctx.strokeRect(830, 180, 150, 240);

    // Petites surfaces
    ctx.strokeRect(20, 245, 60, 110);
    ctx.strokeRect(920, 245, 60, 110);

    // Point central
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(500, 300, 5, 0, Math.PI * 2);
    ctx.fill();

    // Buts
    ctx.fillStyle = "#eeeeee";
    ctx.fillRect(0, 245, 20, 110);
    ctx.fillRect(980, 245, 20, 110);
}

function drawPlayer() {

    // Ombre
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.beginPath();
    ctx.ellipse(
        player.x,
        player.y + 18,
        20,
        7,
        0,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Joueur
    ctx.fillStyle = "#ffd43b";
    ctx.beginPath();
    ctx.arc(
        player.x,
        player.y,
        player.radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    // Maillot
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(
        player.x - 10,
        player.y - 5,
        20,
        18
    );

    // Tête
    ctx.fillStyle = "#f0b27a";
    ctx.beginPath();
    ctx.arc(
        player.x,
        player.y - 12,
        8,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function drawBall() {

    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(
        ball.x,
        ball.y,
        ball.radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = "#111";
    ctx.stroke();
}

function draw() {

    drawField();
    drawPlayer();
    drawBall();
}

function gameLoop() {

    if (!gameRunning) {
        return;
    }

    update();
    draw();

    requestAnimationFrame(gameLoop);
}
