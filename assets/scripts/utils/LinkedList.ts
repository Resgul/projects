import { Node } from 'cc';

class NodeContainer {
    value: Node;
    next: NodeContainer;
    prev: NodeContainer;

    constructor(value: Node) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }
}

class LindekList {
    root: NodeContainer;
    size: number;

    constructor(value? : Node) {
        this.root = null;
        this.size = 0;

        value && this.add(value);
    }

    add(value: Node) {
        const node = new NodeContainer(value);
    }
}