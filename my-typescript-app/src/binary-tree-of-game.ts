import { OuterBinarySearchTree } from "./binary-tree/outer-tree-node";

export class BinaryTreeOfGame extends OuterBinarySearchTree<number,number> {
    _C: number;

    constructor(C: number) {
        super();
        this._C = C;
    }

    public override insert(key: number, value: number): void {
        super.insert(key, value);
        this.checkWin(key, value);
    }

    private checkWin(key: number, value: number): boolean {
        return this.checkHorizontal(key, value) || this.checkVertical(key, value) || this.checkDiagonals(key, value);
    }

    private checkHorizontal(key: number, value: number): boolean {

        const range = this.search(key)?.tree.rangeSearch(value);
        if (!range) throw new Error("Не найден ключ при checkHorizontal");

        return this.isEveryElementLessByOne(range);
    }

    private isEveryElementLessByOne(arr: number[]): boolean {
        let count = 1;

        return arr.some((value, index) => {
            // Последний элемент не имеет правого соседа, поэтому условие всегда false
            if (index === arr.length - 1) {
                return false;
            }

            // Проверяем, что текущий элемент меньше следующего на 1
            if (value + 1 === arr[index + 1]) {
                count++;
                if (count >= this._C) {
                    return true;
                }
            }
            else {
                count = 1;
            }
            return false;
        });
    }

    private checkVertical(key: number, value: number): boolean {
        const keysOfRange = this.rangeSearch(key);
        let count = 1;
        return keysOfRange?.some(key => {
            if (!!this.search(key)?.tree.search(value)?.value) {
                count++;
                if (count >= this._C) {
                    return true;
                }
            }
            else {
                count = 1;
            }
            return false;
        });
    }

    private checkDiagonals(key: number, value: number): boolean {
        const keysOfRange = this.rangeSearch(key);

        const matrix = keysOfRange.map(key => this.search(key)?.tree.rangeSearch(value));
        const checkedMatrix = matrix.map(el => {
            if (!el) throw new Error("Не найдена matrix при checkDiagonals");
            return el;
        });

        const n = matrix.length;

        // Проверка главной диагонали
        let mainDiagonalCount = 0;
        for (let i = 0; i < n; i++) {
            if (checkedMatrix[i][i] === value) {
                mainDiagonalCount++;
                if (mainDiagonalCount >= this._C) {
                    return true;
                }
            } else {
                mainDiagonalCount = 0;
            }
        }

        // Проверка побочной диагонали
        let antiDiagonalCount = 0;
        for (let i = 0; i < n; i++) {
            if (checkedMatrix[i][n - i - 1] === value) {
                antiDiagonalCount++;
                if (antiDiagonalCount >= this._C) {
                    return true;
                }
            } else {
                antiDiagonalCount = 0;
            }
        }

        return false;
    }
}