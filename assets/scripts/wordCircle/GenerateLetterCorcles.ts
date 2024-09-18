import { _decorator, CCFloat, CCInteger, Component, instantiate, Node, Prefab, UITransform, Vec3, resources, JsonAsset, path } from 'cc';
import { LetterCircleController } from '../letterCircle/LetterCircleController';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
import { ScreenButton } from '../input/ScreenButton';
const { ccclass, property } = _decorator;

@ccclass('GenerateLetterCorcles')
export class GenerateLetterCorcles extends Component {
    @property(CCFloat)
    radiusScaleCorrection: number = 0.95;

    @property(Prefab)
    letterPrefab: Prefab;

    protected async onEnable(): Promise<void> {
        const radius = this._calculateRadius();
        const posArr = this._calculatePointsOnCircle(radius);

        this._subscribeEvents(true);
        
        const lvlData = await this._loadJson();
        const words = this._processLvlData(lvlData);
        const letters = this._getMinLetterSet(words);

        this._spawnLetterPrefab(posArr, letters);
    }

	onDisable() {
		this._subscribeEvents(false);
	}

    private _processLvlData(lvlData: object) {
        const words = lvlData['words'];
        
        words.forEach((word: string, i: number) => words[i] = word.toUpperCase());
        console.log(words);
        
        return words;
    }

    private _getMinLetterSet(wordsArray: Array<string>): Array<string> {
        const letterCounts = {};

        wordsArray.forEach(word => {
            const wordLetterCounts = {};

            word.split('').forEach(letter => {
                wordLetterCounts[letter] = (wordLetterCounts[letter] || 0) + 1;
            });

            Object.keys(wordLetterCounts).forEach(letter => {
                letterCounts[letter] = Math.max(letterCounts[letter] || 0, wordLetterCounts[letter]);
            });
        });

        const result = [];
        Object.keys(letterCounts).forEach(letter => {
            for (let i = 0; i < letterCounts[letter]; i++) {
                result.push(letter);
            }
        });

        return result;
    }

    private _loadJson(): Promise<object> {
        return new Promise(resolve => {
            resources.load('levels/1', JsonAsset, (err, jsonAsset) => {
                if (err) {
                    console.error('Error loading JSON file:', err);
                    return;
                }
                const data = jsonAsset.json;
                resolve(data);
            });
        })
    }

    private _spawnLetterPrefab(posArr: Array<Vec3>, letters: Array<string>, ): void {
        posArr.forEach((position, i) => {
            const instance = instantiate(this.letterPrefab);
            const letterController = instance.getComponent(LetterCircleController);
            const letterScreenButton = instance.getComponent(ScreenButton);

            letterScreenButton.buttonName = 'LetterCircle' + i;

            this.node.addChild(instance);
            instance.position.add(position);
            
            letterController.letter = letters[i];
        })
    }

    private _calculateRadius(): number {
        const uiTransform = this.node.getComponent(UITransform);
        const { width, height } = uiTransform;
        const radius = Math.min(width, height) / 2;

        return radius;
    }

    private _calculatePointsOnCircle(radius: number): Array<Vec3> {
        const { lettersCount } = this;
        const points = [];

        for (let i = 0; i < lettersCount; i++) {
            const angle = (2 * Math.PI * i) / lettersCount;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            points.push(new Vec3(x, y, 0));
        }
        return points;
    }

    protected update(dt: number): void {

    }
    
	private _subscribeEvents(isOn: boolean) {
		// const func = isOn ? 'on' : 'off';

		// gameEventTarget[func](GameEvent.JOYSTICK_MOVE_START, this.onJoystickMoveStart, this);
		// gameEventTarget[func](GameEvent.JOYSTICK_MOVE_END, this.onJoystickMoveEnd, this);
		// gameEventTarget[func](GameEvent.JOYSTICK_MOVE, this.onJoystickMove, this);
	}

    onJoystickMoveStart() {

    }

    onJoystickMoveEnd() {

    }

    onJoystickMove() {

    }








}

