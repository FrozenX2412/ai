const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.getElementById('score');
const newGameBtn = document.getElementById('newGameBtn');

let score = 0;
let grid = [];

// Initialize the game grid
function init() {
    score = 0;
    scoreDisplay.textContent = score;
    grid = Array.from({ length: 4 }, () => Array(4).fill(0));
    addNewTile();
    addNewTile();
    drawGrid();
}

// Draw the grid on the screen
function drawGrid() {
    gridContainer.innerHTML = '';
    grid.forEach(row => {
        row.forEach(value => {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.value = value;
            cell.textContent = value ? value : '';
            gridContainer.appendChild(cell);
        });
    });
}

// Add a new tile (2 or 4) to the grid
function addNewTile() {
    let emptyCells = [];
    grid.forEach((row, i) => {
        row.forEach((value, j) => {
            if (value === 0) emptyCells.push({ i, j });
        });
    });
    if (emptyCells.length) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Move tiles based on the arrow keys
function move(direction) {
    let moved = false;

    const slide = (row) => {
        let newRow = row.filter(value => value); // Remove zeros
        for (let i = 0; i < newRow.length - 1; i++) {
            if (newRow[i] === newRow[i + 1]) {
                newRow[i] *= 2;
                score += newRow[i];
                newRow.splice(i + 1, 1);
            }
        }
        return [...newRow, ...Array(4 - newRow.length).fill(0)];
    };

    // Handle moving in each direction
    if (direction === 'left') {
        grid = grid.map(slide);
    } else if (direction === 'right') {
        grid = grid.map(row => slide(row.reverse())).map(row => row.reverse());
    } else if (direction === 'up') {
        grid = rotateGrid(grid);
        grid = grid.map(slide);
        grid = rotateGrid(grid, true);
    } else if (direction === 'down') {
        grid = rotateGrid(grid);
        grid = grid.map(row => slide(row.reverse())).map(row => row.reverse());
        grid = rotateGrid(grid, true);
    }

    if (JSON.stringify(grid) !== JSON.stringify(grid)) {
        addNewTile();
        drawGrid();
        scoreDisplay.textContent = score;
    }
}

// Rotate the grid for up/down movements
function rotateGrid(grid, reverse = false) {
    const newGrid = grid[0].map((_, i) => grid.map(row => row[i]));
    return reverse ? newGrid.reverse() : newGrid;
}

// Handle keyboard events for tile movement
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            move('left');
            break;
        case 'ArrowRight':
            move('right');
            break;
        case 'ArrowUp':
            move('up');
            break;
        case 'ArrowDown':
            move('down');
            break;
    }
});

// Start a new game
newGameBtn.addEventListener('click', init);

// Start the game
init();
