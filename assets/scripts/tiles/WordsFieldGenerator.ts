import { _decorator, Component, instantiate, Prefab, UITransform, Node } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
import { WordTileController } from '../tiles/WordTileController';
const { ccclass, property } = _decorator;

@ccclass('WordsFieldGenerator')
export class WordsFieldGenerator extends Component {
    @property(Prefab)
    wordPrefab: Prefab;

    private _totalWordsHeight: number;
    private _wordsMap: Map<string, Node> = new Map();

    protected async onEnable(): Promise<void> {
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.LEVEL_RESOURCES_PREPARED, this._onLevelResourcesPrepared, this);
        gameEventTarget[func](GameEvent.WORD_CHECK, this._onWordCheck, this);
    }

    private _onLevelResourcesPrepared(words: Array<string>): void {
        const sortedWords = words.sort((a, b) => a.length - b.length);
        this._generateWords(sortedWords);
    }

    private _generateWords(words: Array<string>): void {
        const fieldHeight = this.node.getComponent(UITransform).height;
        words.forEach((word, i) => this._spawnWordPrefab(word, i, words));

        const scaleCorrection = fieldHeight / this._totalWordsHeight;
        // ресайз слов под границы, чтобы они не заслоняли другие элементы
        this.node.scale.set(scaleCorrection, scaleCorrection);
    }

    private _spawnWordPrefab(word: string, i: number, words: Array<string>): void {
        const instance = instantiate(this.wordPrefab);
        const uiTransform = instance.getComponent(UITransform);
        const wordController = instance.getComponent(WordTileController);

        const lineHeight = uiTransform.height;
        const spacing = lineHeight * 0.1;
        this._totalWordsHeight = words.length * lineHeight + (words.length - 1) * spacing;

        const startY = this._totalWordsHeight * 0.5 - lineHeight * 0.5;
        const posY = startY - i * (lineHeight + spacing);

        wordController.generateWord(word);

        instance.setPosition(0, posY);
        this.node.addChild(instance);

        this._wordsMap.set(word, instance);
    }

    private _onWordCheck(word: string): void {
        this._wordsMap.has(word) 
        ? gameEventTarget.emit(GameEvent.WORD_CORRECT, this._wordsMap.get(word))
        : gameEventTarget.emit(GameEvent.WORD_WRONG)
    }
}

