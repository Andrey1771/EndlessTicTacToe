export interface IGameVictoryLogic {
    /**
     * @description
     * check winner horizontal, vertical and diagonal
     * @param {Array.<string[]>} matrix 2d array with X and O
     * @param {number} rowsNum number of rows
     * @param {number} colsNum number of columns
     * @param {number} numToWin the number of matching to win
     * @param {number} lastRow the row number of the square player click
     * @param {number} lastCol the column number of the square player click
     * @returns {string} return the winner, X or O or '' if no one win.
     * @example
     * import winnerCalc from '@bit/joshk.tic-tac-toe-game.utils.winner-calc';
     *
     * const matrix = [
     *   ['O', 'O', 'X'],
     *   ['O', 'X', ''],
     *   ['X', '', '']
     * ];
     * const result = winnerCalc(matrix, 3, 3, 3, 0, 2);
     *
     * export default result
     */
    calc(matrix: Array<Array<string>>, rowsNum: number, colsNum: number, numToWin: number, lastRow: number, lastCol: number): string
}