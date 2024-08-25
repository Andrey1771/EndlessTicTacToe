import {BinaryTreeOfGame} from "../binary-tree-of-game";
import {GameValueTypes, IGame} from "../interfaces/game/i-game";
import {InnerTreeNode} from "../binary-tree/inner-tree-node";
import {GameData, IGameState} from "../interfaces/game/i-game-state";
import { injectable } from "inversify";

@injectable()
export class GameBasedOnBinaryTree implements IGame, IGameState { // TODO Раздели на два класса
    private _currentPlayer: GameValueTypes = GameValueTypes.Cross;
    public get turnOfCurrentPlayer(): GameValueTypes {
        return this._currentPlayer;
    }

    private _crossBinaryTree: BinaryTreeOfGame | null = null;
    private _zeroBinaryTree: BinaryTreeOfGame | null = null;
    private readonly _victoryRowLength: number = 3

    constructor() {
    }

    private _isGameStarted = false;
    get isGameStarted(): boolean {
        return this._isGameStarted;
    }
    private _isGameOver: boolean = false;
    get isGameOver(): boolean {
        return this._isGameOver;
    }

    get state(): GameData {
        return {
            currentPlayer: this._currentPlayer.toString(),
            crosses: this._crossBinaryTree?.toJSON(),
            zeros: this._zeroBinaryTree?.toJSON(),
        };
    }

    public start() {
        this._crossBinaryTree = new BinaryTreeOfGame(this._victoryRowLength);
        this._zeroBinaryTree = new BinaryTreeOfGame(this._victoryRowLength);
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

    private addCrossToAndCheckVictory(x: number, y: number): boolean {
        if (this._crossBinaryTree == null) throw new Error("_crossBinaryTree == null");
        return this._isGameOver = this._crossBinaryTree.insert(x, y);
    }

    private addZeroToAndCheckVictory(x: number, y: number): boolean {
        if (this._zeroBinaryTree == null) throw new Error("_zeroBinaryTree == null");
        return this._isGameOver = this._zeroBinaryTree.insert(x, y);
    }

    public hasValue(row: number, col: number, type?: GameValueTypes): boolean {
        switch (type) {
            case GameValueTypes.Cross:
                return !!this.getCrossValue(row, col);
            case GameValueTypes.Zero:
                return !!this.getZeroValue(row, col);
            case undefined:
                return !!this.getCrossValue(row, col) || !!this.getZeroValue(row, col);
            default:
                throw new Error("Unknown game value type");
        }
    }

    private getCrossValue(row: number, col: number): InnerTreeNode<number> | null | undefined {
        return this._crossBinaryTree?.search(row)?.tree.search(col);
    }

    private getZeroValue(row: number, col: number): InnerTreeNode<number> | null | undefined {
        return this._zeroBinaryTree?.search(row)?.tree.search(col);
    }
}