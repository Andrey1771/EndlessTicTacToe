import {Component, createRef} from 'react';
import styles from './gameboard.module.scss';
import IDENTIFIERS from "../../constants/identifiers";
import {GameValueTypes, IGame} from "../../interfaces/game/i-game";
import FileButtons from "../file-buttons-component/FileButtons";
import {resolve} from 'inversify-react';

export default class GameBoard extends Component {
    private readonly cellSize = 40;
    private readonly loadDistance = 10; // Количество клеток для предзагрузки
    private visibleCells: Map<string, string> = new Map();

    private _gameTableRef = createRef<HTMLDivElement>();
    private get gameTableElement(): HTMLDivElement {
        if (!this._gameTableRef.current) {
            throw new Error("No game table in the game board component");
        }
        return this._gameTableRef.current;
    }
    private _gameBoardRef = createRef<HTMLDivElement>();
    private get gameBoardElement(): HTMLDivElement {
        if (!this._gameBoardRef.current) {
            throw new Error("No game board in the game board component");
        }
        return this._gameBoardRef.current;
    }

    @resolve(IDENTIFIERS.IGame) private readonly _game!: IGame;

    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <div className={styles.gameContainer}>
                <div></div>
                <div id="game-table" onScroll={this.onScroll.bind(this)} ref={this._gameTableRef} className={`${styles.centeredElement} ${styles.gameTable}`}>
                    <div id="game-board" onClick={event => this.handleClick(event.target)} ref={this._gameBoardRef} className={styles.gameBoard}></div>
                </div>
                <FileButtons/>
            </div>
        );
    }

    componentDidMount() {
        this.updateBoard();
        window.addEventListener('resize', this.resizeHandler.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler.bind(this));
    }

    createCell(row: number, col: number, cellKey: string, visibleCells: Map<string, string>): void {
        const hasCrossValue = this._game.hasValue(row, col, GameValueTypes.Cross);
        const hasZeroValue = this._game.hasValue(row, col, GameValueTypes.Zero);
        if (!(hasCrossValue || hasZeroValue)) {
            const cell = document.createElement('div');
            cell.classList.add(styles.cell);
            cell.dataset.row = row.toString();
            cell.dataset.col = col.toString();
            cell.classList.add(cellKey);
            this.insertCellInGameBoard(row, col, cell);
            visibleCells.set(cellKey, "");
            return;
        } else if (hasCrossValue || hasZeroValue) {// Восстановление состояния ячейки
            const cell = document.createElement('div');
            cell.classList.add(styles.cell);
            cell.dataset.row = row.toString();
            cell.dataset.col = col.toString();
            const value = hasCrossValue ? styles.x : styles.o;
            cell.classList.add(value);
            cell.textContent = hasCrossValue ? GameValueTypes.Cross : GameValueTypes.Zero;
            this.insertCellInGameBoard(row, col, cell);
            visibleCells.set(cellKey, value);
            return;
        }

        throw new Error("Impossible state of the create cell function");//
    }

    insertCellInGameBoard(row: number, col: number, cell: HTMLDivElement): void {
        // Получение всех ячеек
        const cells = this.gameBoardElement.querySelectorAll(`.${styles.cell}`);

        const nearestCell = this.getNearestCell(row, col, cells);
        if (!nearestCell) {
            this.gameBoardElement.prepend(cell);
            return;
        }

        const nearestRowString = nearestCell.getAttribute('data-row');
        const nearestColumnString = nearestCell.getAttribute('data-col');
        if (nearestRowString === null || nearestColumnString === null) {
            throw new Error("при попытке insertCellInGameBoard выявлено dataRow === null или dataColumn === null");
        }
        const nearestRow = parseInt(nearestRowString);
        const nearestColumn = parseInt(nearestColumnString);

        // Проверяем, что новая ячейка не совпадает по координатам с ближайшей ячейкой
        if (row === nearestRow && col === nearestColumn) {
            throw new Error(`Ячейка (${row}:${col}) с такими координатами уже существует.`);
        }

        if (row < nearestRow && col === nearestColumn) {
            const firstCellOfRow = this.getFirstCellOfRow(nearestRow, cells);
            if (firstCellOfRow === null) {
                throw new Error("Первая ячейка строки не была найдена");
            }

            firstCellOfRow.insertAdjacentElement("beforebegin", cell);
            return;
        }

        // Если новая ячейка должна быть вставлена перед ближайшей ячейкой
        if ((row === nearestRow && col < nearestColumn)) {
            nearestCell.insertAdjacentElement("beforebegin", cell);
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
                this.gameBoardElement.insertAdjacentElement("afterbegin", cell);
            } else {
                console.log(`Не найден nextSibling для (${row}, ${col})`);
            }
            return;
        }

        // Если случай, который не должен возникать
        throw new Error("Получены не поддерживаемые условия вставки");
    }

    getNearestCell(currentRow: number, currentCol: number, cells: NodeListOf<Element>): Element | null {
        // Переменные для хранения ближайшей ячейки и минимального расстояния
        let closestCell = null;

        let minRowDistance: number | null = null;
        let minColDistance: number | null = null;

        if (cells.length > 0) {
            const firstRowAndCol = this.getRowAndColFromDOM(cells[0]);
            const firstCellRow = firstRowAndCol.row;
            const firstCellCol = firstRowAndCol.col;

            minRowDistance = Math.abs(currentRow - firstCellRow);
            minColDistance = Math.abs(currentCol - firstCellCol);
        } else if (cells.length === 1) {
            return cells[0];
        } else {
            return null;
        }

        // Поиск ближайшей ячейки
        cells.forEach(cell => {
            if (minRowDistance === null || minColDistance === null) {
                throw new Error('Произошла ошибка при поиске ближайшей ячейки (minRowDistance === null || minColDistance === null)');
            }

            const rowAndCol = this.getRowAndColFromDOM(cell);

            const cellRow = rowAndCol.row;
            const cellCol = rowAndCol.col;

            // Расчет расстояния по строке и колонке
            const rowDistance = Math.abs(currentRow - cellRow);
            const colDistance = Math.abs(currentCol - cellCol);

            // Сначала проверяем строку, затем колонку
            if (rowDistance < minRowDistance || (rowDistance === minRowDistance && colDistance < minColDistance)) {
                minRowDistance = rowDistance;
                minColDistance = colDistance;
                closestCell = cell;
            }
        });

        return closestCell;
    }

    getFirstCellOfRow(currentRow: number, cells: NodeListOf<Element>): Element | null {
        const cellsOfRow: Element[] = [];
        cells.forEach(cell => {
            const rowAndCol = this.getRowAndColFromDOM(cell);
            if (rowAndCol.row === currentRow) {
                cellsOfRow.push(cell);
            }
        });

        return cellsOfRow.reduce((prev, curr) => {
            const prevCol = this.getRowAndColFromDOM(prev).col;
            const currCol = this.getRowAndColFromDOM(prev).col;

            return currCol < prevCol ? curr : prev;
        });
    }

    getRowAndColFromDOM(cell: Element): {row: number, col: number} {
        const dataRow = cell.getAttribute('data-row');
        const dataColumn = cell.getAttribute('data-col');
        if (dataRow === null || dataColumn === null) {
            throw new Error("при попытке getNearestCell выявлено dataRow === null || dataColumn === null");
        }

        const cellRow = parseInt(dataRow);
        const cellCol = parseInt(dataColumn);
        return { row: cellRow, col: cellCol };
    }

    updateBoard(): void {
        const containerScrollTop = this.gameTableElement.scrollTop;
        const containerScrollLeft = this.gameTableElement.scrollLeft;
        const containerHeight = this.gameTableElement.clientHeight;
        const containerWidth = this.gameTableElement.clientWidth;

        const minVisibleRow = Math.floor(containerScrollTop / this.cellSize) - this.loadDistance;
        const maxVisibleRow = Math.ceil((containerScrollTop + containerHeight) / this.cellSize) + this.loadDistance;
        const minVisibleCol = Math.floor(containerScrollLeft / this.cellSize) - this.loadDistance;
        const maxVisibleCol = Math.ceil((containerScrollLeft + containerWidth) / this.cellSize) + this.loadDistance;

        // Удаляем не видимые ячейки
        this.visibleCells.forEach((value, cellKey) => {
            const [rowStr, colStr] = cellKey.split(',');
            const row = parseInt(rowStr, 10);
            const col = parseInt(colStr, 10);
            if (row < minVisibleRow || row > maxVisibleRow || col < minVisibleCol || col > maxVisibleCol) {
                const cellToRemove = this.gameBoardElement.querySelector(`.${styles.cell}[data-row="${row}"][data-col="${col}"]`);
                if (cellToRemove) {
                    this.gameBoardElement.removeChild(cellToRemove);
                    this.visibleCells.delete(cellKey);
                } else {
                    throw new Error("При удалении видимой ячейки в таблице ячейка не была найдена")
                }
            }
        });

        for (let row = minVisibleRow; row <= maxVisibleRow; row++) {
            for (let col = maxVisibleCol; col >= minVisibleCol; col--) {
                const cellKey = `${row},${col}`;
                if (!this.visibleCells.has(cellKey)) {
                    // Если ячейка новая, добавляем её
                    this.createCell(row, col, cellKey, this.visibleCells);
                }
            }
        }

        // Обновляем стили сетки
        this.gameBoardElement.style.gridTemplateColumns = `repeat(${maxVisibleCol - minVisibleCol + 1}, ${this.cellSize}px)`;
        this.gameBoardElement.style.gridTemplateRows = `repeat(${maxVisibleRow - minVisibleRow + 1}, ${this.cellSize}px)`;

        const horizontalSizeOfRemovedColumns = Math.abs(-minVisibleCol - this.loadDistance) * this.cellSize;
        const verticalSizeOfRemovedRows = Math.abs(-minVisibleRow - this.loadDistance) * this.cellSize;
        this.gameBoardElement.style.marginLeft = `${horizontalSizeOfRemovedColumns}px`;
        this.gameBoardElement.style.marginTop = `${verticalSizeOfRemovedRows}px`;
    }

    onScroll(): void {
        this.updateBoard();
    }

    resizeHandler(): void {
        this.updateBoard(); // Перерасчитываем и добавляем ячейки при изменении размера окна
    }

    handleClick(eventTarget:  EventTarget): void {
        if (!this._game.isGameStarted) { // TODO Необходимо вынести в другое место, это временное решение
            this._game.start();
        }

        if (this._game.isGameOver) { // TODO Временное решение
            return;
        }

        const target = eventTarget as HTMLElement;
        if (target.classList.contains(styles.cell)) {
            const row = parseInt(target.dataset.row!, 10);
            const col = parseInt(target.dataset.col!, 10);

            const isOccupiedCell = this._game.hasValue(row, col)
            if (!isOccupiedCell) {
                const turnOfCurrentPlayer = this._game.turnOfCurrentPlayer;
                if (this._game.makeMoveByCurrentPlayerAndCheckWin(row, col)) {
                    this.handleWin(turnOfCurrentPlayer);// TODO Остановить игру
                }

                target.textContent = turnOfCurrentPlayer;
                target.classList.remove(styles.x, styles.o);// TODO Лишнее
                const classValue = turnOfCurrentPlayer === GameValueTypes.Cross ? styles.x : styles.o;
                target.classList.add(classValue);
            }
        }
    }

   private handleWin(turnOfCurrentPlayer: GameValueTypes) {
       alert(`${turnOfCurrentPlayer.toUpperCase()} wins!`);
    }
}