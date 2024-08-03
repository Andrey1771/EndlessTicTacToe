import { BinaryTreeOfGame } from "./binary-tree-of-game";

export class Game {
    public _crossBinaryTree: BinaryTreeOfGame | null = null;
    get crossBinaryTree(): BinaryTreeOfGame | null {
        return this._crossBinaryTree;
    }

    private _zeroBinaryTree: BinaryTreeOfGame | null = null;
    get zeroBinaryTree(): BinaryTreeOfGame | null {
        return this._zeroBinaryTree;
    }

    constructor(private readonly _victoryRowLength: number = 3) {
    }

    public start() {
        this._crossBinaryTree = new BinaryTreeOfGame(this._victoryRowLength);
        this._zeroBinaryTree = new BinaryTreeOfGame(this._victoryRowLength);
    }

    public addCrossTo(x: number, y: number): boolean {
        if (this._crossBinaryTree == null) throw new Error("_crossBinaryTree == null");
        return this._crossBinaryTree.insert(x, y);
    }

    public addZeroTo(x: number, y: number): boolean {
        if (this._zeroBinaryTree == null) throw new Error("_zeroBinaryTree == null");
        return this._zeroBinaryTree.insert(x, y);
    }

    // TODO разделить логику, получился какой-то менеджер
    public saveToFile(fileName: string): void {
        const dataStr = JSON.stringify(this._crossBinaryTree?.toJSON());
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    public loadFromFile(file: File): Promise<void> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const data = JSON.parse(reader.result as string);
                    this._crossBinaryTree?.fromJSON(data); // TODO данные нужно разделить на два в файле при сохранении и загрузки :)
                    resolve();
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }
}