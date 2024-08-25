export interface IGameVictoryLogic {
    calc(matrix: Array<Array<string>>, rowsNum: number, colsNum: number, numToWin: number, lastRow: number, lastCol: number): string
}