import './styles.scss';
import { Game } from "./game";

// init
const cellSize = 40;
const loadDistance = 10; // Количество клеток для предзагрузки
const gameBoard = document.getElementById('game-board') as HTMLElement;
const gameContainer = document.getElementById('game-container') as HTMLElement;
const currentPlayer = { value: 'x' };

// Игра и старт, хардкод
const game = new Game(3);
game.start();
// Храним отображаемые ячейки
const visibleCells: Map<string, string> = new Map();

function createCell(row: number, col: number): void {
  const crossValue = game.crossBinaryTree?.search(row)?.tree.search(col);
  const zeroValue = game.zeroBinaryTree?.search(row)?.tree.search(col);
  if (!(crossValue || zeroValue)) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = row.toString();
    cell.dataset.col = col.toString();
    gameBoard.appendChild(cell);
  }

  // Восстановление состояния ячейки
  if (crossValue || zeroValue) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.row = row.toString();
    cell.dataset.col = col.toString();
    cell.classList.add(crossValue ? 'x' : 'o');
    gameBoard.appendChild(cell);
  }
}

function updateBoard(): void {
  const containerScrollTop = gameContainer.scrollTop;
  const containerScrollLeft = gameContainer.scrollLeft;
  const containerHeight = gameContainer.clientHeight;
  const containerWidth = gameContainer.clientWidth;

  const minVisibleRow = Math.floor(containerScrollTop / cellSize) - loadDistance;
  const maxVisibleRow = Math.ceil((containerScrollTop + containerHeight) / cellSize) + loadDistance;
  const minVisibleCol = Math.floor(containerScrollLeft / cellSize) - loadDistance;
  const maxVisibleCol = Math.ceil((containerScrollLeft + containerWidth) / cellSize) + loadDistance;

  // Обновляем отображаемые ячейки
  for (let row = minVisibleRow; row <= maxVisibleRow; row++) {
    for (let col = minVisibleCol; col <= maxVisibleCol; col++) {
      const cellKey = `${row},${col}`;
      if (!visibleCells.has(cellKey)) {
        // Если ячейка новая, добавляем её
        createCell(row, col);
        visibleCells.set(cellKey, currentPlayer.value);
      }
    }
  }

  // Удаляем не видимые ячейки
  visibleCells.forEach((value, cellKey) => {
    const [rowStr, colStr] = cellKey.split(',');
    const row = parseInt(rowStr, 10);
    const col = parseInt(colStr, 10);

    if (row < minVisibleRow || row > maxVisibleRow || col < minVisibleCol || col > maxVisibleCol) {
      visibleCells.delete(cellKey);
    }
  });

  // Обновляем стили сетки
  gameBoard.style.gridTemplateColumns = `repeat(${maxVisibleCol - minVisibleCol + 1}, ${cellSize}px)`;
  gameBoard.style.gridTemplateRows = `repeat(${maxVisibleRow - minVisibleRow + 1}, ${cellSize}px)`;
}

function onScroll(): void {
  updateBoard();
}

function resizeHandler(): void {
  updateBoard(); // Перерасчитываем и добавляем ячейки при изменении размера окна
}

function handleClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (target.classList.contains('cell')) {
    const row = parseInt(target.dataset.row!, 10);
    const col = parseInt(target.dataset.col!, 10);

    const crossValue = game.crossBinaryTree?.search(row)?.tree.search(col);
    const cellData = crossValue != undefined ? crossValue : game.zeroBinaryTree?.search(row)?.tree.search(col)?.value;
    if (cellData == undefined) {
      const currentValue = currentPlayer.value;

      if (currentPlayer.value === 'x') {
        if (game.addCrossTo(row, col)) {
            alert(`${currentValue.toUpperCase()} wins!`);
        }
      } else {
        if (game.addZeroTo(row, col)) {
          alert(`${currentValue.toUpperCase()} wins!`);
        }
      }

      target.textContent = currentValue;
      target.classList.remove('x', 'o');
      target.classList.add(currentValue.toLowerCase());
      currentPlayer.value = currentPlayer.value === 'x' ? 'o' : 'x';
    }
  }
}

//События
gameContainer.addEventListener('scroll', onScroll);
window.addEventListener('resize', resizeHandler);
updateBoard();
gameBoard.addEventListener('click', handleClick);

document.getElementById('save-button')?.addEventListener('click', () => {
  game.saveToFile('gameSaveFile.json');
});

document.getElementById('load-button')?.addEventListener('click', () => {
  const fileInput = document.getElementById('file-input') as HTMLInputElement;
  fileInput.click();
});

document.getElementById('file-input')?.addEventListener('click', (event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    game.loadFromFile(input.files[0])
        .then(() => console.log("Данные загружены"))
        .catch(err => console.error("Ошибка загрузки данных:", err));
  }
});
