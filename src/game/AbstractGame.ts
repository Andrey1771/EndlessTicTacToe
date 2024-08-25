import {GameValueTypes, IGame} from "../interfaces/game/i-game";
import {GameData, IGameState} from "../interfaces/game/i-game-state";
import {injectable} from "inversify";

@injectable()
export abstract class AbstractGame implements IGame, IGameState {
    protected _currentPlayer: GameValueTypes = GameValueTypes.Cross;
    public get turnOfCurrentPlayer(): GameValueTypes {
        return this._currentPlayer;
    }

    abstract get state(): GameData

    protected _isGameStarted = false;
    get isGameStarted(): boolean {
        return this._isGameStarted;
    }
    protected _isGameOver: boolean = false;
    get isGameOver(): boolean {
        return this._isGameOver;
    }

    public start() {
        this._currentPlayer = GameValueTypes.Cross;
        this._isGameOver = false;
        this._isGameStarted = true;
    }

    public makeMoveByCurrentPlayerAndCheckWin(x: number, y: number): boolean {
        if (this._isGameOver) {
            throw new Error("Game Over!");
        }

        switch (this._currentPlayer) {
            case GameValueTypes.Cross:
                this._currentPlayer = GameValueTypes.Zero
                return this.addCrossToAndCheckVictory(x, y);
            case GameValueTypes.Zero:
                this._currentPlayer = GameValueTypes.Cross
                return this.addZeroToAndCheckVictory(x, y);
            default:
                throw new Error("Unknown current player value type")
        }
    }

    protected abstract addCrossToAndCheckVictory(x: number, y: number): boolean;

    protected abstract addZeroToAndCheckVictory(x: number, y: number): boolean;

    public hasValue(row: number, col: number, type?: GameValueTypes): boolean {
        switch (type) {
            case GameValueTypes.Cross:
                return !!this.hasCrossValue(row, col);
            case GameValueTypes.Zero:
                return !!this.hasZeroValue(row, col);
            case undefined:
                return !!this.hasCrossValue(row, col) || !!this.hasZeroValue(row, col);
            default:
                throw new Error("Unknown game value type");
        }
    }

    protected abstract hasCrossValue(row: number, col: number): boolean;
    protected abstract hasZeroValue(row: number, col: number): boolean;
}
