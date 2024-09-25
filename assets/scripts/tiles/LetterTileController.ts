import { _decorator, Component, Label, Animation, Node } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('LetterTileController')
export class LetterTileController extends Component {
    private label: Component;
    private animation: Component;
    public isActive: boolean = false;

    protected onEnable(): void {
        this.label = this.node.getComponentInChildren(Label);
        this.animation = this.node.getComponent(Animation);

        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func = isOn ? 'on' : 'off';

        // gameEventTarget[func](GameEvent.LETTER_ACTIVATE, this.onTileIsAlreadyActive, this);
    }

    private onTileIsAlreadyActive(tile: Node): void {
        if (tile !== this.node) return;
        this.animation.play('activateTile');
    }

    public get letter(): string {
        this.label = this.node.getComponentInChildren(Label);
        return this.label['string'];
    }

    public set letter(str: string) {
        this.label = this.node.getComponentInChildren(Label);
        this.label['string'] = str;
    }
}