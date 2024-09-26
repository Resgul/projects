import { _decorator, Component, instantiate, Prefab, UITransform, Node, Animation, v3, Vec3, tween } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
import { LetterCircleController } from '../letterCircle/LetterCircleController';
import { TileController } from './TileController';
import { BigWordGenerator } from './BigWordGenerator';
const { ccclass, property } = _decorator;

@ccclass('MiniWordGenerator')
export class MiniWordGenerator extends Component {
    @property(Prefab)
    tilePrefab: Prefab;

    private _tilesSet: Set<Node> = new Set();
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
        gameEventTarget[func](GameEvent.WORD_DUBLICATE, this._onWordDublicate, this);
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
        const wordController = word.getComponent(BigWordGenerator);
        const { wordSet } = wordController;
        const promises = [];

        Array.from(this._tilesSet).forEach((tile, i) => {
            const tileController = tile.getComponent(TileController);
            tileController.animate('correctLetter');

            const wordUITransform = Array.from(wordSet)[i].getComponent(UITransform);
            const tileUITransform = tile.getComponent(UITransform);
            const scaleCorrection = (wordUITransform.width * Array.from(wordSet)[i].worldScale.x) / tileUITransform.width;
            const finalPos = Array.from(wordSet)[i].worldPosition;
            const finalScale = v3(scaleCorrection, scaleCorrection, 1);

            this._tweenMiniTileGetPosition(tile, finalScale, finalPos);
            promises.push(this._tweenBigTileBounce(Array.from(wordSet)[i]));
        });

        this._tilesSet.clear();

        Promise.all(promises)
            .then(() => gameEventTarget.emit(GameEvent.CHECK_IF_FINISH));
    }

    private _onWordWrong(): void {
        Array.from(this._tilesSet).forEach(miniTile => {
            const tileController = miniTile.getComponent(TileController);
            tileController.animate('wrongLetter')
                .then(() => miniTile.destroy());
        })

        this._tilesSet.clear();
        this._tilesMap.clear();
    }

    private _onWordDublicate(greenTilesOnField: Node): void {
        const wordController = greenTilesOnField.getComponent(BigWordGenerator);
        const { wordSet } = wordController;

        wordSet.forEach(bigTile => {
            const tileController = bigTile.getComponent(TileController);
            tileController.animate('dublicateBigTile');
        });

        Array.from(this._tilesSet).forEach(miniTile => {
            const tileController = miniTile.getComponent(TileController);
            tileController.animate('dublicateLetterMini')
                .then(() => miniTile.destroy());
        })

        this._tilesSet.clear();
        this._tilesMap.clear();
    }

    private _collectWord(): string {
        let word = '';

        Array.from(this._tilesSet).forEach(tile => {
            const letterController = tile.getComponent(TileController);
            word += letterController.letter;
        });

        return word;
    }

    private _generateTile(circle: Node): void {
        const circleController = circle.getComponent(LetterCircleController);
        const { letter } = circleController;
        const instance = instantiate(this.tilePrefab);
        const uiTransform = instance.getComponent(UITransform);
        const letterController = instance.getComponent(TileController);

        letterController.letter = letter;
        this._tileSize = uiTransform.width;
        this.node.addChild(instance);

        this._tilesSet.add(instance);
        this._tilesMap.set(circle, instance);
    }

    private _updateTilePositon(): void {
        Array.from(this._tilesSet).forEach((tile, i) => {
            
            const spacing = this._tileSize * 0.1;
            const totalWidth = this._tilesSet.size * this._tileSize + (this._tilesSet.size - 1) * spacing;
            const startX = -totalWidth * 0.5 + this._tileSize * 0.5;
            const posX = startX + i * (this._tileSize + spacing);
            tile.setPosition(posX, 0);
        })
    }

    private _tweenMiniTileGetPosition(tile: Node, finalScale: Vec3, finalPos: Vec3): void {
        tween(tile)
            .to(
                0.2, {
                scale: finalScale,
                worldPosition: finalPos,
            },
                {
                    easing: "cubicOut",
                    onComplete: () => {
                        tile.destroy();
                    },
                })
            .start();
    }

    private _tweenBigTileBounce(tile: Node): Promise<void> {
        return new Promise(resolve => {
            tween(tile)
                .delay(0.2)
                .by(0.2, { scale: v3(0.15, 0.15, 0.15) },
                    {
                        easing: "cubicIn",
                        onStart: (bigTile: Node) => {
                            const tileController = bigTile.getComponent(TileController);
                            tileController.animate('correctBigTile')
                        },
                    })
                .by(0.2, { scale: v3(-0.15, -0.15, -0.15) },
                    {
                        easing: "cubicOut",
                        onComplete: () => resolve(),
                    })
                .start();
        });
    }
}

