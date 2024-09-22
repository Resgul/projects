import { _decorator, CCFloat, CCInteger, Component, instantiate, Node, Prefab, UITransform, Vec3, resources, JsonAsset, path } from 'cc';
import { LetterCircleController } from '../letterCircle/LetterCircleController';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
import { ScreenButton } from '../input/ScreenButton';
const { ccclass, property } = _decorator;

@ccclass('GenerateLetterCircles')
export class GenerateLetterCircles extends Component {
    @property(CCFloat)
    radiusScaleCorrection: number = 0.95;

    @property(Prefab)
    letterPrefab: Prefab;

    protected async onEnable(): Promise<void> {
        this._subscribeEvents(true);
    }

	protected onDisable(): void {
		this._subscribeEvents(false);
	}
        
	private _subscribeEvents(isOn: boolean): void {
		const func = isOn ? 'on' : 'off';

		gameEventTarget[func](GameEvent.LEVEL_RESOURCES_PREPARED, this._onLevelResourcesPrepared, this);
	}

    private _onLevelResourcesPrepared(words: Array<string>): void {
        const letters = this._getMinLetterSet(words);
        const radius = this._calculateRadius();
        const posArr = this._calculatePointsOnCircle(radius, letters);
        this._spawnLetterPrefab(posArr, letters);
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

    private _spawnLetterPrefab(posArr: Array<Vec3>, letters: Array<string>, ): void {
        posArr.forEach((position, i) => {
            const instance = instantiate(this.letterPrefab);
            const letterController = instance.getComponent(LetterCircleController);
            const letterScreenButton = instance.getComponent(ScreenButton);

            letterScreenButton.buttonName = instance.name = 'LetterCircle' + i;
            
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

    private _calculatePointsOnCircle(radius: number, letters: Array<string>): Array<Vec3> {
        const lettersCount = letters.length;
        const points = [];

        for (let i = 0; i < lettersCount; i++) {
            const angle = (2 * Math.PI * i) / lettersCount;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            points.push(new Vec3(x, y, 0));
        }
        return points;
    }
}

