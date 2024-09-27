import { _decorator, Component, instantiate, Prefab, UITransform, Node } from 'cc';
import { TileController } from './TileController';
const { ccclass, property } = _decorator;

@ccclass('BigWordGenerator')
export class BigWordGenerator extends Component {
    @property(Prefab)
    tilePrefab: Prefab;

    public wordSet: Set<Node> = new Set();
    public totalWidth: number = 0;

    public generateWord(word: string): void {
        this.node.name = word;

        word.split('').forEach((letter, i) => {
            this._spawnTilePrefab(letter, i, word);
        });
    }

    private _spawnTilePrefab(letter: string, i: number, word: string): void {
        const instance = instantiate(this.tilePrefab);
        const uiTransform = instance.getComponent(UITransform);
        const letterController = instance.getComponent(TileController);

        const letterSize = uiTransform.width;
        const spacing = letterSize * 0.1;
        this.totalWidth = word.length * letterSize + (word.length - 1) * spacing;
        const startX = -this.totalWidth * 0.5 + letterSize * 0.5;
        const posX = startX + i * (letterSize + spacing);

        instance.setPosition(posX, 0);
        instance.name = letter;
        letterController.letter = letter;

        this.node.addChild(instance);
        this.wordSet.add(instance);
    }
}

