import {  _decorator, CCInteger, Component, resources, JsonAsset, Node, Label, math, Prefab } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {
    @property(CCInteger)
    levelNumber: number = 1;

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

    // private _loadJson(level: number): Promise<object> {
    //     return new Promise(resolve => {
    //         resources.load(`levels/${level}`, JsonAsset, (err, jsonAsset) => {
    //             if (err) {
    //                 console.error('Error loading JSON file:', err);
    //                 return;
    //             }
    //             const data = jsonAsset.json;
    //             resolve(data);
    //         });
    //     })
    // }

    private _loadLevels(): Promise<Array<Object>> {
        return new Promise(resolve => {
            resources.loadDir('./levels', (err, assets) => {
                if (err) {
                    console.error("Error loading directory:", err);
                    return;
                }
            
                const levels = assets.map(asset => asset['json']);
                resolve(levels);
            });
        })
    }

	private _subscribeEvents(isOn: boolean) {
		const func = isOn ? 'on' : 'off';

		gameEventTarget[func](GameEvent.LEVEL_NEXT, this.onNextLevel, this);
		gameEventTarget[func](GameEvent.SHOW_ENDCARD, this._onShowEndcard, this);
	}

    onNextLevel() {
        this.levelNumber++;

        const currentLvlIndex = math.clamp(this.levelNumber % this._lvlList.length, 0, this._lvlList.length);
        console.log(currentLvlIndex);

        this._prepareLevelResouces(currentLvlIndex);
        this.packShot.active = false;
    }

    private _onShowEndcard() {
        this.packShot.active = true;
    }

    private _prepareLevelResouces(levelNum: number): void {
        const lvlData = this._lvlList[levelNum - 1];
        console.log(lvlData);
        
        const words = this._processLvlData(lvlData);

        this.levelLabel.getComponent(Label).string = `Уровень ${this.levelNumber}`;
        
        
        gameEventTarget.emit(GameEvent.LEVEL_RESOURCES_PREPARED, words);
    }
}

