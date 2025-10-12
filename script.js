let move_speed = 3;
let gravity = 0.45;
let bird = document.querySelector('.superman');
let img = document.getElementById('superman-1');
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

let game_state = 'Start';
let birdDy = 0;
let pipeSeparation = 0;
const pipeGap = 44;
const pipeWidth = 79;

let bird_props = bird.getBoundingClientRect();

img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && game_state != 'Play'){
        startGame();
    }
    if ((e.key === ' ' || e.key === 'ArrowUp') && game_state === 'Play') {
        flap();
    }
});

function startGame() {
    document.querySelectorAll('.pipe_sprite').forEach(pipe => {
        pipe.remove();
    });
    
    img.style.display = 'block';
    bird.style.top = '40vh';
    game_state = 'Play';
    birdDy = 0;
    pipeSeparation = 0;
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    
    bird_props = bird.getBoundingClientRect();
    play();
}

function flap() {
    birdDy = -7.6;
}

function play() {
    movePipes();
    applyGravity();
    createPipes();
}

function movePipes() {
    if (game_state !== 'Play') return;

    const pipes = document.querySelectorAll('.pipe_sprite');
    let scored = false;

    pipes.forEach((pipe) => {
        const pipeRect = pipe.getBoundingClientRect();
        bird_props = bird.getBoundingClientRect();

        if (pipeRect.right <= 0) {
            pipe.remove();
            return;
        }

        if (checkCollision(bird_props, pipeRect)) {
            endGame();
            return;
        }

        if (pipeRect.right < bird_props.left && !pipe.scored) {
            if (pipe.increase_score === '1') {
                scored = true;
                pipe.scored = true;
            }
        }

        pipe.style.left = (pipeRect.left - move_speed) + 'px';
    });

    if (scored) {
        score_val.innerHTML = parseInt(score_val.innerHTML) + 1;
    }

    requestAnimationFrame(movePipes);
}

function checkCollision(birdRect, pipeRect) {
    return birdRect.left < pipeRect.left + pipeRect.width &&
           birdRect.left + birdRect.width > pipeRect.left &&
           birdRect.top < pipeRect.top + pipeRect.height &&
           birdRect.top + birdRect.height > pipeRect.top;
}

function applyGravity() {
    if (game_state !== 'Play') return;

    birdDy += gravity;
    
    bird_props = bird.getBoundingClientRect();
    const newTop = bird_props.top + birdDy;
    bird.style.top = newTop + 'px';
    bird_props = bird.getBoundingClientRect();
    
    bird_props = bird.getBoundingClientRect();

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
        endGame();
        return;
    }

    requestAnimationFrame(applyGravity);
}

function createPipes() {
    if (game_state !== 'Play') return;

    if (pipeSeparation > 115) {
        pipeSeparation = 0;
        
        const pipePosition = Math.floor(Math.random() * 43) + 8;
        
        const topPipe = document.createElement('div');
        topPipe.className = 'pipe_sprite';
        topPipe.style.top = '0px';
        topPipe.style.left = '100vw';
        topPipe.style.height = pipePosition + 'vh';
        topPipe.style.width = pipeWidth + 'px';
        document.body.appendChild(topPipe);

        const bottomPipe = document.createElement('div');
        bottomPipe.className = 'pipe_sprite';
        bottomPipe.style.top = (pipePosition + pipeGap) + 'vh';
        bottomPipe.style.left = '100vw';
        bottomPipe.style.height = (100 - pipePosition - pipeGap) + 'vh';
        bottomPipe.style.width = pipeWidth + 'px';
        bottomPipe.increase_score = '1';
        document.body.appendChild(bottomPipe);

        console.log('Pipe created at position:', pipePosition);
    }
    
    pipeSeparation++;
    requestAnimationFrame(createPipes);
}

function endGame() {
    game_state = 'End';
    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
    message.classList.add('messageStyle');
    img.style.display = 'none';
}