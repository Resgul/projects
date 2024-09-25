import { _decorator, CCInteger, Component, resources, Node, Label, math, Prefab, instantiate } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
import { PackShotController } from './PackShotController';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {
    @property(CCInteger)
    levelNumber: number = 1;

    @property(Node)
    elementsContainer: Node;

    @property(Node)
    levelLabel: Node;

    @property(Node)
    packShot: Node;

    @property(Node)
    wordMini: Node;

    @property(Prefab)
    wordsFieldPrefab: Prefab;

    @property(Prefab)
    wordCirclePrefab: Prefab;

    private _wordsField: Node;
    private _wordCircle: Node;
    private _lvlList: Array<Object>;

    protected async onEnable(): Promise<void> {
        this._subscribeEvents(true);
        this._lvlList = await this._loadLevels();
        this._prepareLevelResouces(this.levelNumber);
    }

    protected onDisable() {
        this._subscribeEvents(false);
    }

    private _processLvlData(lvlData: object) {
        const words = lvlData['words'];
        words.forEach((word: string, i: number) => words[i] = word.toUpperCase());

        return words;
    }

    private _loadLevels(): Promise<Array<Object>> {
        return new Promise(resolve => {
            resources.loadDir('./levels', (err, assets) => {
                if (err) {
                    console.error("Error loading directory:", err);
                    return;
                }

                const levels = assets
                    .sort((a: object, b: object) => a.name - b.name)
                    .map((asset: object) => asset['json']);
                    
                resolve(levels);
            });
        })
    }

    private _subscribeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.LEVEL_NEXT, this.onNextLevel, this);
        gameEventTarget[func](GameEvent.SHOW_ENDCARD, this._onShowEndcard, this);
    }

    onNextLevel(): void {
        this.levelNumber++;
        this._prepareLevelResouces(this.levelNumber);
        this.packShot.active = false;
    }

    private _onShowEndcard(): void {
        const packShotController = this.packShot.getComponent(PackShotController);

        this.packShot.active = true;
        packShotController.setText(this.levelNumber);
    }

    private _prepareLevelResouces(levelNum: number): void {
        const currentLvlIndex = math.clamp(this.levelNumber % this._lvlList.length, 0, this._lvlList.length);
        const lvlData = this._lvlList[currentLvlIndex];
        const words = this._processLvlData(lvlData);
        console.log('cheat:', words);

        this.elementsContainer.destroyAllChildren();
        this.levelLabel.getComponent(Label).string = `Уровень ${this.levelNumber + 1}`;
        this._wordsField = this._createNode(this.wordsFieldPrefab, 260);
        this._wordCircle = this._createNode(this.wordCirclePrefab, -224);

        gameEventTarget.emit(GameEvent.LEVEL_RESOURCES_PREPARED, words);
    }

    private _createNode(prefab: Prefab, yPos: number): Node {
        const instance = instantiate(prefab);

        this.elementsContainer.addChild(instance);
        instance.setPosition(0, yPos);

        return instance;
    }
}

