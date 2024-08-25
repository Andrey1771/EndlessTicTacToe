import {inject, injectable} from "inversify";
import {AbstractGame} from "./AbstractGame";
import {GameData, GameStateChanged} from "../interfaces/game/i-game-state";
import {GameValueTypes} from "../interfaces/game/i-game";
import IDENTIFIERS from "../constants/identifiers";
import {IGameVictoryLogic} from "../interfaces/game/i-game-victory-logic";
import {Observable, Subject} from "rxjs";

@injectable()
export class GameBasedOnMap extends AbstractGame {
    protected _gameStateChangedSubject: Subject<GameStateChanged> = new Subject<GameStateChanged>();
    get gameStateChanges(): Observable<GameStateChanged> {
        return this._gameStateChangedSubject.asObservable();
    }

    private _gameMap = new Map<number, Map<number, GameValueTypes>>();

    constructor(@inject(IDENTIFIERS.IGameVictoryLogic) private readonly _gameVictoryLogic: IGameVictoryLogic) {
        super();
    }

    get state(): GameData {
        return {
            currentPlayer: this._currentPlayer,
            values: Array.from(this._gameMap.entries(), ([key, value]) => [key, Array.from(value.entries())]),
        }
    }

    protected addCrossToAndCheckVictory(x: number, y: number): boolean {
        const type = GameValueTypes.Cross;
        this.addGameValue(x, y, type);
        return this._isGameOver = this.checkWin(x, y, type);
    }

    private addGameValue(x: number, y: number, type: GameValueTypes): void {
        const row = this._gameMap.get(x);
        if (row?.get(y) !== undefined) {
            throw new Error("Ошибка добавление в ячейку, где уже есть элемент");
        }

        if (!row) {
            this._gameMap.set(x, new Map<number, GameValueTypes>());
        }
        this._gameMap.get(x)?.set(y, type);
    }

    private checkWin(x: number, y: number, type: GameValueTypes): boolean {
        const matrix = this.convertGameMapToGameLogicMatrix(x, y);

        const rowsNum = matrix.length;
        let columnsNum = 0;
        if (rowsNum > 0) {
            columnsNum = matrix[0].length;
        }

        const lastRow = Math.floor(matrix.length / 2);
        let lastColumn = 0;
        if (matrix.length > 0) {
            lastColumn = Math.floor(matrix[0].length / 2);
        }
        return this._gameVictoryLogic.calc(matrix, rowsNum, columnsNum, this._victoryRowLength, lastRow, lastColumn) === type.toString();
    }

    private convertGameMapToGameLogicMatrix(row: number, column: number): string[][] {
        const matrix: string[][] = [];
        const halfSize = Math.floor(this._victoryRowLength);

        // Проходим по строкам и столбцам вокруг указанной точки
        for (let i = row - halfSize; i <= row + halfSize; i++) {
            const matrixRow: string[] = [];
            for (let j = column - halfSize; j <= column + halfSize; j++) {
                const rowMap = this._gameMap.get(i);
                if (rowMap) {
                    const value = rowMap.get(j);
                    matrixRow.push(value !== undefined ? value : '');
                } else {
                    matrixRow.push('');
                }
            }
            matrix.push(matrixRow);
        }
        return matrix;
    }

    protected addZeroToAndCheckVictory(x: number, y: number): boolean {
        const type = GameValueTypes.Zero;
        this.addGameValue(x, y, type);
        return this._isGameOver = this.checkWin(x, y, type);
    }
    protected hasCrossValue(row: number, col: number): boolean {
        const value = this._gameMap.get(row)?.get(col);
        return (value !== undefined && value === GameValueTypes.Cross);
    }
    protected hasZeroValue(row: number, col: number): boolean {
        const value = this._gameMap.get(row)?.get(col);
        return (value !== undefined && value === GameValueTypes.Zero);
    }

    public override load(gameData: GameData): void {
        this.start();
        const gameMap = new Map<number, Map<number, GameValueTypes>>(
            gameData.values.map(([key, value]: [number, [number, GameValueTypes][]]) =>
                [key, new Map<number, GameValueTypes>(value)]
            )
        );
        this._gameMap = gameMap;
        this._currentPlayer = gameData.currentPlayer as GameValueTypes;

        this._gameStateChangedSubject.next({});
    }
}