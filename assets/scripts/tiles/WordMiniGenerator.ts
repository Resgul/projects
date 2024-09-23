import { _decorator, Component, instantiate, Prefab, UITransform, Node, Animation, v3, tween } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
import { LetterCircleController } from '../letterCircle/LetterCircleController';
import { MiniTileController } from './MiniTileController';
import { WordTileController } from './WordTileController';
const { ccclass, property } = _decorator;

@ccclass('WordMiniGenerator')
export class WordMiniGenerator extends Component {
    @property(Prefab)
    tilePrefab: Prefab;

    private _tilesSet: Set<Node> = new Set();
    private _wordsGuesed: Set<Node> = new Set();
    private _tilesMap: Map<Node, Node> = new Map();
    private _tileSize: number;

    protected async onEnable(): Promise<void> {
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.LETTER_ACTIVATE, this._onLetterActivate, this);
        gameEventTarget[func](GameEvent.LETTER_DEACTIVATE, this._onLetterDeactivate, this);
        gameEventTarget[func](GameEvent.LETTER_DEACTIVATE_ALL, this._onLetterDeactivateAll, this);
        gameEventTarget[func](GameEvent.WORD_CORRECT, this._onWordCorrect, this);
        gameEventTarget[func](GameEvent.WORD_WRONG, this._onWordWrong, this);
    }

    private _onLetterActivate(circle: Node): void {
        this._generateTile(circle);
        this._updateTilePositon();
    }

    private _onLetterDeactivate(circle: Node): void {
        const tile = this._tilesMap.get(circle);

        this._tilesSet.delete(tile);
        this._tilesMap.delete(circle);
        this._updateTilePositon();
        tile.destroy();
    }

    private _onLetterDeactivateAll(): void {
        const word = this._collectWord();
        gameEventTarget.emit(GameEvent.WORD_CHECK, word);
    }

    private _onWordCorrect(word: Node): void {
        const wordController = word.getComponent(WordTileController);
        const { wordSet } = wordController;

        if (this._wordsGuesed.has(word)) {
            this._onWordDublicate();
        } else {
            [...this._tilesSet].forEach((tile, i) => {
                const animation = tile.getComponent(Animation);
                animation.play('correctLetter');

                const wordUITransform = [...wordSet][i].getComponent(UITransform);
                const tileUITransform = tile.getComponent(UITransform);
                const scaleCorrection = (wordUITransform.width * [...wordSet][i].worldScale.x) / tileUITransform.width;
                const finalPos = [...wordSet][i].worldPosition;
                const finalScale = v3(scaleCorrection, scaleCorrection, 1);

                tween(tile)
                    .to(
                        0.3, {
                        scale: finalScale,
                        worldPosition: finalPos,
                    },
                        { easing: "cubicOut" })
                    .by(0.2, { scale: v3(0.25, 0.25, 0.25) },
                        { easing: "cubicIn" })
                    .by(0.2, { scale: v3(-0.25, -0.25, -0.25) },
                        { easing: "cubicOut" })
                    .start();
            });
        }

        this._wordsGuesed.add(word);
        this._tilesSet.clear();
    }

    private _onWordWrong(): void {
        [...this._tilesSet].forEach(tile => {
            const animation = tile.getComponent(Animation);
            animation.play('wrongLetter');
            animation.on(Animation.EventType.FINISHED, () => tile.destroy(), this);
        })

        this._tilesSet.clear();
        this._tilesMap.clear();
    }

    private _onWordDublicate(): void {
        [...this._tilesSet].forEach(tile => {
            const animation = tile.getComponent(Animation);
            animation.play('wrongLetter');
            animation.on(Animation.EventType.FINISHED, () => tile.destroy(), this);
        })

        this._tilesSet.clear();
        this._tilesMap.clear();
    }

    private _collectWord(): string {
        let word = '';

        [...this._tilesSet].forEach(tile => {
            const letterController = tile.getComponent(MiniTileController);
            word += letterController.letter;
        });

        return word;
    }

    private _generateTile(circle: Node): void {
        const circleController = circle.getComponent(LetterCircleController);
        const { letter } = circleController;
        const instance = instantiate(this.tilePrefab);
        const uiTransform = instance.getComponent(UITransform);
        const letterController = instance.getComponent(MiniTileController);

        letterController.letter = letter;
        this._tileSize = uiTransform.width;
        this.node.addChild(instance);

        this._tilesSet.add(instance);
        this._tilesMap.set(circle, instance);
    }

    private _updateTilePositon(): void {
        [...this._tilesSet].forEach((tile, i) => {
            const spacing = this._tileSize * 0.1;
            const totalWidth = this._tilesSet.size * this._tileSize + (this._tilesSet.size - 1) * spacing;
            const startX = -totalWidth * 0.5 + this._tileSize * 0.5;
            const posX = startX + i * (this._tileSize + spacing);
            tile.setPosition(posX, 0);
        })
    }

}

