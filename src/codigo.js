let currentPlayer = 'X'; 
let machinePlayer = 'O';  
let board = ['', '', '', '', '', '', '', '', ''];  
let gameActive = true;  

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('mensaje');


function handleCellClick(event) {
  const index = Array.from(cells).indexOf(event.target);

  
  if (board[index] !== '' || !gameActive || currentPlayer === machinePlayer) {
    return;
  }

  
  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;

  if (checkWinner()) {
    message.textContent = '¡Has ganado!';
    gameActive = false;
  } else if (board.every(cell => cell !== '')) {
    message.textContent = '¡Es un empate!';
    gameActive = false;
  } else {
    currentPlayer = machinePlayer;
    machineMove();  
  }
}


function machineMove() {
  const bestMove = minimax(board, machinePlayer);
  board[bestMove.index] = machinePlayer;
  cells[bestMove.index].textContent = machinePlayer;

  if (checkWinner()) {
    message.textContent = 'La máquina ha ganado!';
    gameActive = false;
  } else if (board.every(cell => cell !== '')) {
    message.textContent = '¡Es un empate!';
    gameActive = false;
  } else {
    currentPlayer = 'X';  
  }
}

// Algoritmo Minimax para que la máquina haga su jugada óptima
function minimax(board, player) {
  const availableMoves = getAvailableMoves(board);
  
  if (checkWinnerForPlayer(board, 'X')) return { score: -10 };
  if (checkWinnerForPlayer(board, 'O')) return { score: 10 };
  if (availableMoves.length === 0) return { score: 0 };

  const moves = [];
  
  for (const move of availableMoves) {
    const newBoard = board.slice();
    newBoard[move] = player;

    const result = minimax(newBoard, player === 'O' ? 'X' : 'O');
    moves.push({ index: move, score: result.score });
  }

  if (player === 'O') {
    return moves.reduce((bestMove, move) => {
      return move.score > bestMove.score ? move : bestMove;
    });
  } else {
    return moves.reduce((bestMove, move) => {
      return move.score < bestMove.score ? move : bestMove;
    });
  }
}


function getAvailableMoves(board) {
  return board.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
}


function checkWinner() {
  if (checkWinnerForPlayer(board, 'X')) {
    return true;
  } else if (checkWinnerForPlayer(board, 'O')) {
    return true;
  }
  return false;
}


function checkWinnerForPlayer(board, player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columnas
    [0, 4, 8], [2, 4, 6]  // diagonales
  ];

  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return board[a] === player && board[a] === board[b] && board[a] === board[c];
  });
}

function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  message.textContent = '';
  cells.forEach(cell => {
    cell.textContent = ''; 
  });
}


cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

// Agregar evento al botón de reiniciar
resetButton.addEventListener('click', resetGame);
