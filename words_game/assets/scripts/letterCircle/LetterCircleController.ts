import { _decorator, Component, Label, Animation, Node } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('LetterCircleController')
export class LetterCircleController extends Component {
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

        gameEventTarget[func](GameEvent.LETTER_ACTIVATE, this.onLetterActivate, this);
        gameEventTarget[func](GameEvent.LETTER_DEACTIVATE, this.onLetterDeactivate, this);
        gameEventTarget[func](GameEvent.LETTER_DEACTIVATE_ALL, this.onLetterDeActivateAll, this);
    }

    private onLetterActivate(circle: Node): void {
        if (circle !== this.node) return;
        this._toggleLetter(true);
    }

    private onLetterDeactivate(circle: Node): void {
        if (circle !== this.node) return;
        this._toggleLetter(false);
    }

    private onLetterDeActivateAll(): void {
        if (!this.isActive) return;
        this._toggleLetter(false);
    }

    private _toggleLetter(toggle: boolean): void {
        this.isActive = toggle;
        this.animation.play(toggle ? 'activateLetter' : 'deactivateLetter');

    }

    public get letter(): string {
        return this.label['string'];
    }

    public set letter(str: string) {
        this.label['string'] = str;
    }
}

