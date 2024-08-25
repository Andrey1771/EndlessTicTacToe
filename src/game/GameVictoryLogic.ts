import { IGameVictoryLogic } from "../interfaces/game/i-game-victory-logic";
import {injectable} from "inversify";
// TODO Чужое :)
@injectable()
export class GameVictoryLogic implements IGameVictoryLogic {
    public calc(matrix: Array<Array<string>>, rowsNum: number, colsNum: number, numToWin: number, lastRow: number, lastCol: number): string {
        let winner: string = '';
        let match: number = 0;
        const lastValue: string = matrix[lastRow][lastCol];

        //check Horizontal
        for (let c = 0; c < colsNum; c++) {
            const currentValue = matrix[lastRow][c];
            if (currentValue === lastValue)
                match++;
            else match = 0;
            if (match === numToWin) {
                winner = lastValue;
                break;
            }
        }
        if (winner !== '')
            return winner;

        match = 0;
        //check Vertical
        for (let r = 0; r < rowsNum; r++) {
            const currentValue = matrix[r][lastCol];
            if (currentValue === lastValue)
                match++;
            else match = 0;
            if (match === numToWin) {
                winner = lastValue;
                break;
            }
        }
        if (winner !== '')
            return winner;

        //check diagonal top-left to bottom-right - include middle
        match = 0;
        for (let r = 0; r <= rowsNum - numToWin; r++)
        {
            let rowPosition = r;
            for (let column = 0; column < colsNum && rowPosition < rowsNum; column++)
            {
                const currentValue = matrix[rowPosition][column];
                if (currentValue === lastValue)
                    match++;
                else match = 0;
                if (match === numToWin)
                {
                    winner = lastValue;
                    break;
                }
                rowPosition++;
            }
            if (winner !== '') break;
        }
        if (winner !== '')
            return winner;

        //check diagonal top-left to bottom-right - after middle
        match = 0;
        for (let c = 1; c <= colsNum - numToWin; c++)
        {
            let columnPosition = c;
            for (let row = 0; row < rowsNum && columnPosition < colsNum; row++)
            {
                const currentValue = matrix[row][columnPosition];
                if (currentValue === lastValue)
                    match++;
                else match = 0;
                if (match === numToWin)
                {
                    winner = lastValue;
                    break;
                }
                columnPosition++;
            }
            if (winner !== '') break;
        }
        if (winner !== '')
            return winner;

        //check diagonal bottom-left to top-right - include middle
        match = 0;
        for (let r = rowsNum - 1; r >= rowsNum - numToWin - 1; r--)
        {
            let rowPosition = r;
            for (let column = 0; column < colsNum && rowPosition < rowsNum && rowPosition >= 0; column++)
            {
                const currentValue = matrix[rowPosition][column];
                if (currentValue === lastValue)
                    match++;
                else match = 0;
                if (match === numToWin)
                {
                    winner = lastValue;
                    break;
                }
                rowPosition--;
            }
            if (winner !== '') break;
        }
        if (winner !== '')
            return winner;

        //check diagonal bottom-left to top-right - after middle
        match = 0;
        for (let c = 1; c < colsNum; c++)
        {
            let columnPosition = c;
            for (let row = rowsNum - 1; row < rowsNum && row >= 0 && columnPosition < colsNum && columnPosition >= 1; row--)
            {
                console.log(`[${row}][${columnPosition}]`);
                const currentValue = matrix[row][columnPosition];
                if (currentValue === lastValue)
                    match++;
                else match = 0;
                if (match === numToWin)
                {
                    winner = lastValue;
                    break;
                }
                columnPosition++;
            }
            if (winner !== '') break;
        }
        if (winner !== '')
            return winner;

        if(this.haveEmptyCell(matrix, rowsNum, colsNum) === false) {
            winner = '-1';
        }

        return winner;
    }

    private haveEmptyCell(matrix: Array<Array<string>>, rowsNum: number, colsNum: number): boolean {
        let empty: boolean = false;
        for (let x = 0; x < rowsNum; x++) {
            for (let y = 0; y < colsNum; y++) {
                const element: string = matrix[x][y];
                if (!element) {
                    empty = true;
                    break;
                }
            }
            if (empty)
                break;
        }
        return empty;
    }
}

