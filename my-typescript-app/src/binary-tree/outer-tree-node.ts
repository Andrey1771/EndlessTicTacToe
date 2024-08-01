import { InnerBinarySearchTree } from "./inner-tree-node";

export class OuterTreeNode<K, V> {
    key: K;
    tree: InnerBinarySearchTree<V>;
    left: OuterTreeNode<K, V> | null = null;
    right: OuterTreeNode<K, V> | null = null;

    constructor(key: K, tree: InnerBinarySearchTree<V>) {
        this.key = key;
        this.tree = tree;
    }
}

export class OuterBinarySearchTree<K, V> {
    protected _victoryRowLength: K | undefined;
    protected root: OuterTreeNode<K, V> | null = null;

    constructor(victoryRowLength: K | undefined = undefined) {
        this._victoryRowLength = victoryRowLength;
    }

    // O(log(K) * log(V))
    public insert(key: K, value: V): void {
        const newTree = new InnerBinarySearchTree<V>(this._victoryRowLength as V);
        newTree.insert(value);
        const newNode = new OuterTreeNode(key, newTree);
        if (this.root === null) {
            this.root = newNode;
        } else {
            this.insertNode(this.root, newNode);
        }
    }

    private insertNode(node: OuterTreeNode<K, V>, newNode: OuterTreeNode<K, V>): void {
        if (newNode.key < node.key) {
            if (node.left === null) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else if (newNode.key > node.key) {
            if (node.right === null) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        } else {
            // Если ключи равны, добавляем значение во внутреннее дерево
            node.tree.insert(newNode.tree.root!.value);
        }
    }

    private inOrderTraverseNode(node: OuterTreeNode<K, V> | null, callback: (key: K, tree: InnerBinarySearchTree<V>) => void): void {
        if (node !== null) {
            this.inOrderTraverseNode(node.left, callback);
            callback(node.key, node.tree);
            this.inOrderTraverseNode(node.right, callback);
        }
    }

    // Метод для поиска ключей в диапазоне
    public rangeSearch(key: K): K[] {
        const result: K[] = [];
        this.rangeSearchNode(this.root, key, result);
        return result;
    }

    private rangeSearchNode(node: OuterTreeNode<K, V> | null, key: K, result: K[]): void {
        if (node === null) {
            return;
        }

        const lowerBound = (key as unknown as number) - (this._victoryRowLength as unknown as number);
        const upperBound = (key as unknown as number) + (this._victoryRowLength as unknown as number);

        if ((node.key as unknown as number) >= lowerBound && (node.key as unknown as number) <= upperBound) {
            result.push(node.key);
        }

        if ((node.key as unknown as number) > lowerBound) {
            this.rangeSearchNode(node.left, key, result);
        }

        if ((node.key as unknown as number) < upperBound) {
            this.rangeSearchNode(node.right, key, result);
        }
    }

    public search(key: K): OuterTreeNode<K, V> | null {
        return this.searchNode(this.root, key);
    }

    private searchNode(node: OuterTreeNode<K, V> | null, key: K): OuterTreeNode<K, V> | null {
        if (node === null) {
            return null;
        }

        if ((key as unknown as number) < (node.key as unknown as number)) {
            return this.searchNode(node.left, key);
        } else if ((key as unknown as number) > (node.key as unknown as number)) {
            return this.searchNode(node.right, key);
        } else {
            return node;
        }
    }


    // TODO Разделить логику
    public toJSON(): any {
        return this.serializeNode(this.root);
    }

    private serializeNode(node: OuterTreeNode<K, V> | null): any {
        if (node === null) {
            return null;
        }
        return {
            key: node.key,
            tree: node.tree.toJSON(),
            left: this.serializeNode(node.left),
            right: this.serializeNode(node.right),
        };
    }

    public fromJSON(data: any): void {
        this.root = this.deserializeNode(data);
    }

    private deserializeNode(data: any): OuterTreeNode<K, V> | null {
        if (data === null) {
            return null;
        }
        const tree = new InnerBinarySearchTree<V>();
        tree.fromJSON(data.tree);
        const node = new OuterTreeNode(data.key, tree);
        node.left = this.deserializeNode(data.left);
        node.right = this.deserializeNode(data.right);
        return node;
    }
}