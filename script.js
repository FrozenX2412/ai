// Navigation toggle for mobile
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Navigation smooth scroll and section switch
const navLinkElements = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

navLinkElements.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);

        sections.forEach(section => {
            if (section.id === targetId) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });

        navLinkElements.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    });
});

// Contact form simple submission
const contactForm = document.getElementById('contact-form');
const contactMsg = document.getElementById('contact-msg');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    contactMsg.textContent = "Thank you for reaching out! We'll get back to you soon.";
    contactForm.reset();
});

// Game loading infrastructure
const gameButtons = document.querySelectorAll('.game-btn');
const gameContainer = document.getElementById('game-container');
const gamePlaceholder = document.getElementById('game-placeholder');

gameButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const game = btn.dataset.game;

        loadGame(game);
    });
});

// Clear game container + load selected game
function loadGame(name) {
    gamePlaceholder.style.display = 'none';
    gameContainer.innerHTML = '';

    switch(name) {
        case 'tetris':
            loadTetris();
            break;
        case 'snake':
            loadSnake();
            break;
        case 'rps':
            loadRPS();
            break;
        default:
            gameContainer.innerHTML = `<p style="color:#888">Game "${name}" is coming soon!</p>`;
    }
}

// --------- TETRIS ---------

function loadTetris() {
    const width = 10;
    const height = 20;
    const blockSize = 30;

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = width * blockSize;
    canvas.height = height * blockSize;
    canvas.style.backgroundColor = '#111';
    gameContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Tetris variables
    const colors = ['cyan','blue','orange','yellow','green','purple','red'];

    const tetrominoes = [
        [[1,1,1,1]], // I
        [[1,0,0],[1,1,1]], // J
        [[0,0,1],[1,1,1]], // L
        [[1,1],[1,1]], // O
        [[0,1,1],[1,1,0]], // S
        [[0,1,0],[1,1,1]], // T
        [[1,1,0],[0,1,1]]  // Z
    ];

    let board = Array(height).fill(null).map(()=>Array(width).fill(0));
    let current = {
        pos: {x: 3, y: 0},
        shape: tetrominoes[Math.floor(Math.random() * tetrominoes.length)],
        color: ''
    };
    current.color = colors[tetrominoes.indexOf(current.shape)];

    let dropCounter = 0;
    let dropInterval = 800;
    let lastTime = 0;
    let gameOver = false;
    let score = 0;

    // Draw one square
    function drawSquare(x, y, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 1;
        ctx.strokeRect(x * blockSize, y * blockSize, blockSize, blockSize);
    }

    function drawBoard() {
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for(let y = 0; y<height; y++){
            for(let x=0; x<width; x++){
                if(board[y][x]){
                    drawSquare(x, y, board[y][x]);
                }
            }
        }
    }

    function drawTetromino(tetro, pos, color){
        for(let y=0; y<tetro.length; y++){
            for(let x=0; x<tetro[y].length; x++){
                if(tetro[y][x]){
                    drawSquare(pos.x + x, pos.y + y, color);
                }
            }
        }
    }

    function collide(board, tetro, pos) {
        for(let y=0; y<tetro.length; y++){
            for(let x=0; x<tetro[y].length; x++){
                if(tetro[y][x]){
                    if(board[pos.y + y] == undefined || 
                       board[pos.y + y][pos.x + x] === undefined ||
                       board[pos.y + y][pos.x + x] !== 0){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function merge(board, tetro, pos, color){
        for(let y=0; y<tetro.length; y++){
            for(let x=0; x<tetro[y].length; x++){
                if(tetro[y][x]){
                    board[pos.y + y][pos.x + x] = color;
                }
            }
        }
    }

    function rotate(tetro) {
        const N = tetro.length;
        let result = [];
        for(let y=0; y<N; y++){
            result[y] = [];
            for(let x=0; x<N; x++){
                result[y][x] = tetro[N-1-x][y] || 0;
            }
        }
        return result;
    }

    // Clear full rows
    function clearRows(){
        let rowCount = 0;
        outer: for(let y=height-1; y>=0; y--){
            for(let x=0; x<width; x++){
                if(!board[y][x]){
                    continue outer;
                }
            }
            // Row full, clear it
            const row = board.splice(y,1)[0].fill(0);
            board.unshift(row);
            rowCount++;
            y++;
        }
        if(rowCount > 0) {
            score += rowCount * 10;
        }
    }

    function resetGame() {
        board = Array(height).fill(null).map(()=>Array(width).fill(0));
        current = {
            pos: {x: 3, y: 0},
            shape: tetrominoes[Math.floor(Math.random() * tetrominoes.length)],
            color: ''
        };
        current.color = colors[tetrominoes.indexOf(current.shape)];
        dropCounter = 0;
        score = 0;
        gameOver = false;
        drawGame();
    }

    // Controls
    document.onkeydown = e => {
        if(gameOver) return;
        if(e.key === 'ArrowLeft') {
            const pos = {...current.pos};
            pos.x--;
            if(!collide(board, current.shape, pos)) {
                current.pos = pos;
            }
        } else if(e.key === 'ArrowRight'){
            const pos = {...current.pos};
            pos.x++;
            if(!collide(board, current.shape, pos)) {
                current.pos = pos;
            }
        } else if(e.key === 'ArrowDown'){
            const pos = {...current.pos};
            pos.y++;
            if(!collide(board, current.shape, pos)) {
                current.pos = pos;
                dropCounter = 0;
            }
        } else if(e.key === 'ArrowUp'){
            const rotated = rotate(current.shape);
            if(!collide(board, rotated, current.pos)) {
                current.shape = rotated;
            }
        }
    };

    function drawGame() {
        drawBoard();
        drawTetromino(current.shape, current.pos, current.color);
        ctx.fillStyle = '#eee';
        ctx.font = '20px monospace';
        ctx.fillText(`Score: ${score}`, 10, 25);
    }

    function update(time = 0){
        if(gameOver) {
            ctx.fillStyle = 'red';
            ctx.font = '40px monospace';
            ctx.fillText('Game Over', canvas.width/4, canvas.height/2);
            return;
        }
        const deltaTime = time - lastTime;
