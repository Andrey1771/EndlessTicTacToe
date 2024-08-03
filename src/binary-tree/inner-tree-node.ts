export class InnerTreeNode<T> {
    value: T;
    left: InnerTreeNode<T> | null = null;
    right: InnerTreeNode<T> | null = null;

    constructor(value: T) {
        this.value = value;
    }
}

export class InnerBinarySearchTree<T> {
    protected _victoryRowLength: T | undefined;
    public root: InnerTreeNode<T> | null = null;

    constructor(victoryRowLength: T | undefined = undefined) {
        this._victoryRowLength = victoryRowLength;
    }

    public insert(value: T): void {
        const newNode = new InnerTreeNode(value);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    private insertNode(node: InnerTreeNode<T>, newNode: InnerTreeNode<T>): void {
        if (newNode.value < node.value) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    // Поиск значений в диапазоне
    rangeSearch(value: T): T[] {
        const result: T[] = [];
        this.rangeSearchNode(this.root, value, result);
        return result;
    }

    private rangeSearchNode(node: InnerTreeNode<T> | null, value: T, result: T[]): void {
        if (node === null) {
            return;
        }

        const lowerBound = (value as unknown as number) - (this._victoryRowLength as unknown as number);
        const upperBound = (value as unknown as number) + (this._victoryRowLength as unknown as number);

        if ((node.value as unknown as number) >= lowerBound && (node.value as unknown as number) <= upperBound) {
            result.push(node.value);
        }

        if ((node.value as unknown as number) > lowerBound) {
            this.rangeSearchNode(node.left, value, result);
        }

        if ((node.value as unknown as number) < upperBound) {
            this.rangeSearchNode(node.right, value, result);
        }
    }

    public search(value: T): InnerTreeNode<T> | null {
        return this.searchNode(this.root, value);
    }

    private searchNode(node: InnerTreeNode<T> | null, value: T): InnerTreeNode<T> | null {
        if (node === null) {
            return null;
        }

        if (value < node.value) {
            return this.searchNode(node.left, value);
        } else if (value > node.value) {
            return this.searchNode(node.right, value);
        } else {
            return node;
        }
    }


    // TODO Разделить логику
    public toJSON(): any {
        return this.serializeNode(this.root);
    }

    private serializeNode(node: InnerTreeNode<T> | null): any {
        if (node === null) {
            return null;
        }
        return {
            value: node.value,
            left: this.serializeNode(node.left),
            right: this.serializeNode(node.right),
        };
    }

    public fromJSON(data: any): void {
        this.root = this.deserializeNode(data);
    }

    private deserializeNode(data: any): InnerTreeNode<T> | null {
        if (data === null) {
            return null;
        }
        const node = new InnerTreeNode(data.value);
        node.left = this.deserializeNode(data.left);
        node.right = this.deserializeNode(data.right);
        return node;
    }
}