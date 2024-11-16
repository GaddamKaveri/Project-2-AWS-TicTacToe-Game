document.addEventListener("DOMContentLoaded", () => {
    // URL of your API Gateway endpoint
    const apiUrl = 'https://ik9wh4uj17.execute-api.us-east-1.amazonaws.com/prod/game';

    // Get elements from the DOM
    const board = document.getElementById('board');
    const result = document.getElementById('result');
    const resetButton = document.getElementById('resetButton');

    // Initial game state
    let gameState = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    let currentPlayer = 'X'; // 'X' starts the game
    let gameOver = false;

    // Handle player move
    function playerMove(row, col) {
        if (gameState[row][col] || gameOver) return; // Ignore if cell is already filled or game is over

        // Update game state
        gameState[row][col] = currentPlayer;

        // Update the UI
        updateBoard();

        // Check for win or draw
        if (checkWin()) {
            gameOver = true;
            result.textContent = `${currentPlayer} wins!`;
        } else if (checkDraw()) {
            gameOver = true;
            result.textContent = 'It\'s a draw!';
        } else {
            // Switch player
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            // Play computer move if it's the computer's turn
            if (currentPlayer === 'O' && !gameOver) {
                setTimeout(() => computerMove(), 500); // Delay to simulate AI thinking
            }
        }
    }

    // Computer move (AI logic)
    function computerMove() {
        if (gameOver) return; // Stop if the game is over

        // Simple AI: pick the first available spot
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!gameState[row][col]) {
                    gameState[row][col] = 'O';
                    updateBoard();
                    if (checkWin()) {
                        gameOver = true;
                        result.textContent = 'Computer wins!';
                    } else if (checkDraw()) {
                        gameOver = true;
                        result.textContent = 'It\'s a draw!';
                    } else {
                        currentPlayer = 'X'; // Switch back to player after computer's move
                    }
                    return;
                }
            }
        }
    }

    // Update the board UI
    function updateBoard() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.getElementById(`cell-${row}-${col}`);
                if (cell) {
                    cell.textContent = gameState[row][col];
                }
            }
        }
    }

    // Check for win condition
    function checkWin() {
        // Check rows, columns, and diagonals
        for (let i = 0; i < 3; i++) {
            if (gameState[i][0] && gameState[i][0] === gameState[i][1] && gameState[i][0] === gameState[i][2]) return true; // Row check
            if (gameState[0][i] && gameState[0][i] === gameState[1][i] && gameState[0][i] === gameState[2][i]) return true; // Column check
        }
        if (gameState[0][0] && gameState[0][0] === gameState[1][1] && gameState[0][0] === gameState[2][2]) return true; // Diagonal check
        if (gameState[0][2] && gameState[0][2] === gameState[1][1] && gameState[0][2] === gameState[2][0]) return true; // Reverse diagonal check
        return false;
    }

    // Check for draw condition
    function checkDraw() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (!gameState[row][col]) return false; // If there is any empty spot, it's not a draw
            }
        }
        return true; // If no empty spots, it's a draw
    }

    // Reset the game state
    function resetGame() {
        gameState = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        currentPlayer = 'X';
        gameOver = false;
        result.textContent = '';
        updateBoard();
    }

    // Handle API call for playing the game (optional integration for multiplayer)
    async function playGame() {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ gameState, currentPlayer })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data from the server');
            }

            const data = await response.json();
            // Handle the response from the API (e.g., updating game state)
            console.log(data);
        } catch (error) {
            console.error('Error occurred while playing the game:', error);
        }
    }

    // Add event listeners to cells for player moves
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.getElementById(`cell-${row}-${col}`);
            if (cell) {
                cell.addEventListener('click', () => playerMove(row, col));
            }
        }
    }

    // Reset the game when the reset button is clicked
    if (resetButton) {
        resetButton.addEventListener('click', resetGame);
    }

    // Initialize the board on page load
    updateBoard();
});
