import { _decorator, Component, instantiate, Prefab, UITransform } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
import { LetterTileController } from './LetterTileController';
const { ccclass, property } = _decorator;

@ccclass('WordTileController')
export class WordTileController extends Component {
    @property(Prefab)
    tilePrefab: Prefab;

    protected async onEnable(): Promise<void> {
        this._subscribeEvents(true);
    }

	protected onDisable(): void {
		this._subscribeEvents(false);
	}
        
	private _subscribeEvents(isOn: boolean): void {
		const func = isOn ? 'on' : 'off';

		// gameEventTarget[func](GameEvent.LEVEL_RESOURCES_PREPARED, this._onLevelResourcesPrepared, this);
	}

    public generateWord(word: string): void {
        this.node.name = word;

        word.split('').forEach((letter, i) => {
            const instance = instantiate(this.tilePrefab);
            const uiTransform = instance.getComponent(UITransform);
            const letterController = instance.getComponent(LetterTileController);

            const letterSize = uiTransform.width;
            const spacing = letterSize * 0.1;
            const totalWidth = word.length * letterSize + (word.length - 1) * spacing;
            const startX = -totalWidth * 0.5 + letterSize * 0.5;
            const posX = startX + i * (letterSize + spacing);
        
            instance.setPosition(posX, 0);
            letterController.letter = letter;
            
            this.node.addChild(instance);
        })
    }


    private _spawnTilePrefab(letter: string, index: number): void {

            
    }
}

