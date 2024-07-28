import { BinaryTreeOfGame } from './binary-tree-of-game';
import './styles.scss';

const gameContainer = document.getElementById('game-container')!;
const gameBoard = document.getElementById('game-board')!;

const CELL_SIZE = 30;
const board: Map<string, string> = new Map();

gameBoard.addEventListener('click', (event: MouseEvent) => {
  const rect = gameBoard.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) / CELL_SIZE);
  const y = Math.floor((event.clientY - rect.top) / CELL_SIZE);
  const key = `${x},${y}`;

  if (!board.has(key)) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.style.gridColumnStart = (x + 1).toString();
    cell.style.gridRowStart = (y + 1).toString();
    cell.textContent = board.size % 2 === 0 ? 'X' : 'O';
    gameBoard.appendChild(cell);
    board.set(key, cell.textContent);
  }
});

// Center the view on the initial load
const centerView = () => {
  gameContainer.scrollLeft = (gameBoard.clientWidth - gameContainer.clientWidth) / 2;
  gameContainer.scrollTop = (gameBoard.clientHeight - gameContainer.clientHeight) / 2;
};

window.addEventListener('load', centerView);
window.addEventListener('resize', centerView);


// Пример использования
const outerBST = new BinaryTreeOfGame<number, number>(3);

const innerBST = new BinaryTreeOfGame<number, number>(3);

// Вставка данных
outerBST.insert(10, 1);
outerBST.insert(20, 2);
outerBST.insert(10, 3);
outerBST.insert(20, 4);
outerBST.insert(15, 5);

// Обход и вывод данных
outerBST.inOrderTraverse((key, tree) => {
  console.log(`Key: ${key}`);
  tree.inOrderTraverse(value => console.log(`  Value: ${value}`));
});
