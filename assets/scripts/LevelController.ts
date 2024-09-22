import {  _decorator, CCInteger, Component, instantiate, UITransform, Vec3, resources, JsonAsset } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('LevelController')
export class LevelController extends Component {
    @property(CCInteger)
    levelNumber: number = 1;

    protected onEnable(): void {
        this._subscribeEvents(true);

        this.loadLevelResouces(this.levelNumber);
    }

	protected onDisable() {
		this._subscribeEvents(false);
	}

    private _processLvlData(lvlData: object) {
        const words = lvlData['words'];
        words.forEach((word: string, i: number) => words[i] = word.toUpperCase());
        
        return words;
    }

    private _loadJson(level: number): Promise<object> {
        return new Promise(resolve => {
            resources.load(`levels/${level}`, JsonAsset, (err, jsonAsset) => {
                if (err) {
                    console.error('Error loading JSON file:', err);
                    return;
                }
                const data = jsonAsset.json;
                resolve(data);
            });
        })
    }

	private _subscribeEvents(isOn: boolean) {
		const func = isOn ? 'on' : 'off';

		gameEventTarget[func](GameEvent.LEVEL_NEXT, this.onNextLevel, this);
	}

    onNextLevel() {
        this.levelNumber++;
        this.loadLevelResouces(this.levelNumber);
    }

    private async loadLevelResouces(level: number): Promise<void> {
        const lvlData = await this._loadJson(level);
        const words = this._processLvlData(lvlData);
        
        gameEventTarget.emit(GameEvent.LEVEL_RESOURCES_PREPARED, words);
    }
}

