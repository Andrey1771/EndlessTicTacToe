import './styles.scss';
import {Game} from "./game";

// init
const cellSize = 40;
const loadDistance = 10; // Количество клеток для предзагрузки
const gameBoard = document.getElementById('game-board') as HTMLElement;
const gameTable = document.getElementById('game-table') as HTMLElement;
const currentPlayer = {value: 'x'};

// Игра и старт, хардкод
const game = new Game(3);
game.start();
// Храним отображаемые ячейки
const visibleCells: Map<string, string> = new Map();

function createCell(row: number, col: number, cellKey: string, visibleCells: Map<string, string>): void {
    const crossValue = game.crossBinaryTree?.search(row)?.tree.search(col);
    const zeroValue = game.zeroBinaryTree?.search(row)?.tree.search(col);
    if (!(crossValue || zeroValue)) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row.toString();
        cell.dataset.col = col.toString();
        cell.classList.add(cellKey);
        //gameBoard.appendChild(cell);
        //gameBoard.insertAdjacentElement(, cell);
        insertCellInGameBoard(row, col, cell);
        visibleCells.set(cellKey, "");
        return;
    } else if (crossValue || zeroValue) {// Восстановление состояния ячейки
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row.toString();
        cell.dataset.col = col.toString();
        const value = crossValue ? 'x' : 'o';
        cell.classList.add(value);
        //cell.classList.add(cellKey);
        cell.textContent = value;
        //gameBoard.appendChild(cell);
        insertCellInGameBoard(row, col, cell);
        visibleCells.set(cellKey, value);
        return;
    }

    throw new Error("Почему");
}

function insertCellInGameBoard(row: number, col: number, cell: HTMLDivElement): void {
    const nearestCell = getNearestCell(row, col);
    if (!nearestCell) {
        gameBoard.appendChild(cell);
        return;
    }

    const nearestRowString = nearestCell.getAttribute('data-row');
    const nearestColumnString = nearestCell.getAttribute('data-col');
    if (nearestRowString === null || nearestColumnString === null) {
        throw new Error("при попытке insertCellInGameBoard выявлено dataRow === null или dataColumn === null");
    }
    let nearestRow = parseInt(nearestRowString);
    let nearestColumn = parseInt(nearestColumnString);

    // Проверяем, что новая ячейка не совпадает по координатам с ближайшей ячейкой
    if (row === nearestRow && col === nearestColumn) {
        throw new Error(`Ячейка (${row}:${col}) с такими координатами уже существует.`);
    }

    // Если новая ячейка должна быть вставлена перед ближайшей ячейкой
    if ((row < nearestRow && col === nearestColumn) || (row === nearestRow && col < nearestColumn)) {
        gameBoard.insertBefore(cell, nearestCell);
        return;
    }

    // Если новая ячейка должна быть вставлена после ближайшей ячейки
    if ((row > nearestRow && col === nearestColumn) || (row === nearestRow && col > nearestColumn)) {
        nearestCell.insertAdjacentElement("afterend", cell);
        return;
    }

    // Если новая ячейка должна быть вставлена в середину между ячейками (новая строка и колонка отличаются)
    if (row !== nearestRow && col !== nearestColumn) {
        const nextSibling = nearestCell.nextSibling;
        if (nextSibling) {
            gameBoard.insertBefore(cell, nextSibling);
        } else {
            gameBoard.appendChild(cell);
        }
        return;
    }

    // Если случай, который не должен возникать
    throw new Error("Как я тут оказался?");
}


/*
position – A string representing the position relative to the element. Must be one of the following strings:
"beforebegin"
Before the element. Only valid if the element is in the DOM tree and has a parent element.
"afterbegin"
Just inside the element, before its first child.
"beforeend"
Just inside the element, after its last child.
"afterend"
After the element. Only valid if the element is in the DOM tree and has a parent element.
 */

// Function to highlight a path from start to end cell
function getNearestCell(currentRow: number, currentCol: number): Element | null {
    // Получение всех ячеек
    let cells = gameBoard.querySelectorAll('.cell');

    // Переменные для хранения ближайшей ячейки и минимального расстояния
    let closestCell = null;
    let minRowDistance = Infinity;
    let minColDistance = Infinity;

    // Поиск ближайшей ячейки
    cells.forEach(cell => {
        const dataRow = cell.getAttribute('data-row');
        const dataColumn = cell.getAttribute('data-col');
        if (dataRow === null || dataColumn === null) {
            throw new Error("при попытке getNearestCell выявлено dataRow === null || dataColumn === null");
        }

        let cellRow = parseInt(dataRow);
        let cellCol = parseInt(dataColumn);

        // Расчет расстояния по строке и колонке
        let rowDistance = Math.abs(currentRow - cellRow);
        let colDistance = Math.abs(currentCol - cellCol);

        // Сначала проверяем строку, затем колонку
        if (rowDistance < minRowDistance || (rowDistance === minRowDistance && colDistance < minColDistance)) {
            minRowDistance = rowDistance;
            minColDistance = colDistance;
            closestCell = cell;
        }
    });

    return closestCell;
}

function updateBoard(): void {
    const containerScrollTop = gameTable.scrollTop;
    const containerScrollLeft = gameTable.scrollLeft;
    const containerHeight = gameTable.clientHeight;
    const containerWidth = gameTable.clientWidth;

    const minVisibleRow = Math.floor(containerScrollTop / cellSize) - loadDistance;
    const maxVisibleRow = Math.ceil((containerScrollTop + containerHeight) / cellSize) + loadDistance;
    const minVisibleCol = Math.floor(containerScrollLeft / cellSize) - loadDistance;
    const maxVisibleCol = Math.ceil((containerScrollLeft + containerWidth) / cellSize) + loadDistance;


    for (let col = minVisibleCol; col <= maxVisibleCol; col++) {
        for (let row = minVisibleRow; row <= maxVisibleRow; row++) {
            const cellKey = `${row},${col}`;
            if (!visibleCells.has(cellKey)) {
                // Если ячейка новая, добавляем её
                createCell(row, col, cellKey, visibleCells);
            }
        }
    }

    // Удаляем не видимые ячейки
    visibleCells.forEach((value, cellKey) => {
        const [rowStr, colStr] = cellKey.split(',');
        const row = parseInt(rowStr, 10);
        const col = parseInt(colStr, 10);

        if (row < minVisibleRow || row > maxVisibleRow || col < minVisibleCol || col > maxVisibleCol) {
            const cellToRemove = gameBoard.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
            if (cellToRemove) {
                gameBoard.removeChild(cellToRemove);
                visibleCells.delete(cellKey);
            } else {
                throw new Error("Почему-то ячейка не найдена")
            }
        }
    });

    // Обновляем стили сетки
    gameBoard.style.gridTemplateColumns = `repeat(${maxVisibleCol - minVisibleCol + 1}, ${cellSize}px)`;
    gameBoard.style.gridTemplateRows = `repeat(${maxVisibleRow - minVisibleRow + 1}, ${cellSize}px)`;

    const horizontalSizeOfRemovedColumns = Math.abs(Math.abs(minVisibleCol) - loadDistance) * cellSize;
    const verticalSizeOfRemovedRows = Math.abs(Math.abs(minVisibleRow) - loadDistance) * cellSize;
    gameBoard.style.paddingLeft = `${horizontalSizeOfRemovedColumns}px`;
    gameBoard.style.paddingTop = `${verticalSizeOfRemovedRows}px`;
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

updateBoard();

// События
gameTable.addEventListener('scroll', onScroll);
window.addEventListener('resize', resizeHandler);
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
