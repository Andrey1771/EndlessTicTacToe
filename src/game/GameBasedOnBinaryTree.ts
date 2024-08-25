import {BinaryTreeOfGame} from "../binary-tree-of-game";
import {GameData} from "../interfaces/game/i-game-state";
import { injectable } from "inversify";
import {AbstractGame} from "./AbstractGame";

@injectable()
export class GameBasedOnBinaryTree extends AbstractGame { // TODO Раздели на два класса
    private _crossBinaryTree: BinaryTreeOfGame | null = null;
    private _zeroBinaryTree: BinaryTreeOfGame | null = null;
    private readonly _victoryRowLength: number = 3

    override get state(): GameData {
        return {
            currentPlayer: this._currentPlayer.toString(),
            crosses: this._crossBinaryTree?.toJSON(),
            zeros: this._zeroBinaryTree?.toJSON(),
        };
    }

    public override start() {
        super.start();
        this._crossBinaryTree = new BinaryTreeOfGame(this._victoryRowLength);
        this._zeroBinaryTree = new BinaryTreeOfGame(this._victoryRowLength);
    }

    override addCrossToAndCheckVictory(x: number, y: number): boolean {
        if (this._crossBinaryTree == null) throw new Error("_crossBinaryTree == null");
        return this._isGameOver = this._crossBinaryTree.insert(x, y);
    }

    override addZeroToAndCheckVictory(x: number, y: number): boolean {
        if (this._zeroBinaryTree == null) throw new Error("_zeroBinaryTree == null");
        return this._isGameOver = this._zeroBinaryTree.insert(x, y);
    }

    override hasCrossValue(row: number, col: number): boolean {
        return this._crossBinaryTree?.search(row)?.tree.search(col) != null;
    }
    override hasZeroValue(row: number, col: number): boolean {
        return this._zeroBinaryTree?.search(row)?.tree.search(col) != null;
    }
}