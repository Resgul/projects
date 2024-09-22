import { _decorator, CCFloat, Component, instantiate, Prefab, UITransform, Vec3 } from 'cc';
import { LetterCircleController } from './letterCircle/LetterCircleController';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
import { WordTileController } from './tiles/WordTileController';
const { ccclass, property } = _decorator;

@ccclass('GenerateWordsField')
export class GenerateWordsField extends Component {
    @property(Prefab)
    wordPrefab: Prefab;

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
        const sortedWords = words.sort((a, b) => a.length - b.length);
        this._generateWords(sortedWords);
    }

    private _generateWords(words: Array<string>): void {

        words.forEach((word, i) => {
            const instance = instantiate(this.wordPrefab);
            const uiTransform = instance.getComponent(UITransform);
            const wordController = instance.getComponent(WordTileController);

            const lineHeight = uiTransform.height;
            const spacing = lineHeight * 0.1;
            const totalHeight = words.length * lineHeight + (words.length - 1) * spacing;
            const startY = totalHeight * 0.5 - lineHeight * 0.5;
            const posY = startY - i * (lineHeight + spacing);

            wordController.generateWord(word);
            instance.setPosition(0, posY);
            this.node.addChild(instance);
        })
    }

    private _spawnWordPrefab(word: string): void {
        const instance = instantiate(this.wordPrefab);
        const wordController = instance.getComponent(WordTileController);
        wordController.generateWord(word);
        // instance.name = letters;

        this.node.addChild(instance);
        // // instance.position.add(position);

        // letterController.letter = letters[i];
    }


}

