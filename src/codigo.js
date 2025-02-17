let currentPlayer = 'X'; 
let machinePlayer = 'O';  
let tablero = ['', '', '', '', '', '', '', '', ''];  
let gameActive = true;  

const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('mensaje');
//llamo elementos

function handleCellClick(event) {
  const index = Array.from(cells).indexOf(event.target);

  
  if (tablero[index] !== '' || !gameActive || currentPlayer === machinePlayer) {
    return;
  }

  
  tablero[index] = currentPlayer;
  event.target.textContent = currentPlayer;

  if (checkWinner()) {
    message.textContent = '¡Has ganado!';
    gameActive = false;
  } else if (tablero.every(cell => cell !== '')) {
    message.textContent = '¡Es un empate!';
    gameActive = false;
  } else {
    currentPlayer = machinePlayer;
    machineMove();  
  }
}
//verifico elementos

function machineMove() {
  const bestMove = minimax(tablero, machinePlayer);
  tablero[bestMove.index] = machinePlayer;
  cells[bestMove.index].textContent = machinePlayer;

  if (checkWinner()) {
    message.textContent = 'La máquina ha ganado!';
    gameActive = false;
  } else if (tablero.every(cell => cell !== '')) {
    message.textContent = '¡Es un empate!';
    gameActive = false;
  } else {
    currentPlayer = 'X';  
  }
}
//machinemove para mover la maquina

function minimax(tablero, player) {
  const availableMoves = getAvailableMoves(tablero);
  
  if (checkWinnerForPlayer(tablero, 'X')) return { score: -10 };
  if (checkWinnerForPlayer(tablero, 'O')) return { score: 10 };
  if (availableMoves.length === 0) return { score: 0 };

  const moves = [];
  
  for (const move of availableMoves) {
    const nuevoTablero = tablero.slice();
    nuevoTablero[move] = tablero;

    const result = minimax(nuevoTablero, player === 'O' ? 'X' : 'O');
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

//algoritmo para que la maquina gane
function getAvailableMoves(tablero) {
  return tablero.map((cell, index) => cell === '' ? index : null).filter(index => index !== null);
}


function checkWinner() {
  if (checkWinnerForPlayer(tablero, 'X')) {
    return true;
  } else if (checkWinnerForPlayer(tablero, 'O')) {
    return true;
  }
  return false;
}


function checkWinnerForPlayer(tablero, player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]  
  ];

  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    return tablero[a] === player && tablero[a] === tablero[b] && tablero[a] === tablero[c];
  });
}
//verifica si gana
function resetGame() {
  tablero = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  message.textContent = '';
  cells.forEach(cell => {
    cell.textContent = ''; 
  });
  
}
//reset game para resetear el juego

cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

resetButton.addEventListener('click', resetGame);


