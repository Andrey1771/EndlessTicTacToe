export enum GameValueTypes {
    Cross= "x",
    Zero = "o"
}

export interface IGame {
    get turnOfCurrentPlayer(): GameValueTypes;
    get isGameStarted(): boolean;
    get isGameOver(): boolean;

    start(): void;
    makeMoveByCurrentPlayerAndCheckWin(x: number, y: number): boolean;
    hasValue(row: number, col: number, type?: GameValueTypes): boolean;
}