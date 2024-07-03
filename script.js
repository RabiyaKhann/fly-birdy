let move_speed = 3;
let gravity = 0.5;
let bird = document.querySelector('.bird');
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let game_state = 'Start';
let score = 0;
let bird_dy = 0; // Bird's vertical velocity

// Preload sounds
let sound_point = new Audio('sounds effect/sound effect_point.mp3');
let sound_die = new Audio('sounds effect/sounds effect_die.mp3');

// Function to handle key events
document.addEventListener('keydown', handleKeyDown);

// Start game loop on Enter key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && game_state !== 'Play') {
        startGame();
    }
});

function startGame() {
    game_state = 'Play';
    score = 0;
    score_val.innerHTML = score;
    message.innerHTML = '';
    createPipes();
    animate();
}

function animate() {
    if (game_state !== 'Play') return;

    movePipes();
    applyGravity();
    checkCollision();

    // Update bird's position
    let birdRect = bird.getBoundingClientRect();
    bird.style.top = birdRect.top + bird_dy + 'px';

    requestAnimationFrame(animate);
}

function movePipes() {
    let pipes = document.querySelectorAll('.pipe_sprite');
    pipes.forEach((pipe) => {
        let pipeRect = pipe.getBoundingClientRect();
        if (pipeRect.right <= 0) {
            pipe.remove();
        } else {
            pipe.style.left = pipeRect.left - move_speed + 'px';
        }
    });
}

function applyGravity() {
    if (game_state !== 'Play') return;

    bird_dy += gravity; // Apply gravity continuously

    let birdRect = bird.getBoundingClientRect();
    if (birdRect.bottom >= background.bottom) {
        endGame();
        return;
    }
}

function checkCollision() {
    let birdRect = bird.getBoundingClientRect();
    let pipes = document.querySelectorAll('.pipe_sprite');
    pipes.forEach((pipe) => {
        let pipeRect = pipe.getBoundingClientRect();
        if (
            birdRect.left < pipeRect.left + pipeRect.width &&
            birdRect.left + birdRect.width > pipeRect.left &&
            birdRect.top < pipeRect.top + pipeRect.height &&
            birdRect.top + birdRect.height > pipeRect.top
        ) {
            endGame();
        } else if (pipeRect.right < birdRect.left && pipe.increase_score === '1') {
            score++;
            score_val.innerHTML = score;
            pipe.increase_score = '0';
            sound_point.play();
        }
    });
}

function endGame() {
    game_state = 'End';
    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
    message.classList.add('messageStyle');
    sound_die.play();
    // Optionally reset game state or perform other actions
}

function createPipes() {
    setInterval(() => {
        if (game_state === 'Play') {
            let pipePosition = Math.floor(Math.random() * 43) + 8;
            createPipe(pipePosition);
        }
    }, 1500); // Adjust pipe creation interval as needed
}

function createPipe(position) {
    let pipeTop = document.createElement('div');
    pipeTop.className = 'pipe_sprite';
    pipeTop.style.top = position - 70 + 'vh';
    pipeTop.style.left = '100vw';
    pipeTop.increase_score = '1';
    document.body.appendChild(pipeTop);

    let pipeBottom = document.createElement('div');
    pipeBottom.className = 'pipe_sprite';
    pipeBottom.style.top = position + 35 + 'vh';
    pipeBottom.style.left = '100vw';
    pipeBottom.increase_score = '1';
    document.body.appendChild(pipeBottom);
}

function handleKeyDown(e) {
    if (game_state === 'Play') {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            bird_dy = -7.6; // Adjust upward velocity when key is pressed
        }
    } else if (e.key === 'Enter') {
        startGame();
    }
}
