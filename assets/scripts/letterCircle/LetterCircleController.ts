import { _decorator, director, Component, Input, input, Label, log, Node, EventMouse } from 'cc';
import { DrawLinesWithMouse } from '../DrawLinesWithMouse';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('LetterCircleController')
export class LetterCircleController extends Component {
    // @property(Prefab)
    // letterPrefab: Prefab;
    private _label: Component;
    private _drawLines: Component;
    public isActive: boolean = false;

    protected onEnable(): void {
        this._label = this.node.getComponentInChildren(Label);
        this._drawLines = director.getScene().getComponentInChildren(DrawLinesWithMouse);

        // this.node.on(Input.EventType.MOUSE_MOVE, this.toggleLetter, this);
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);

    }

    private _subscribeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.LETTER_POINTER_DOWN, this.onPointerDown, this);
        gameEventTarget[func](GameEvent.LETTER_POINTER_UP, this.onPointerUp, this);
        gameEventTarget[func](GameEvent.LETTER_POINTER_MOVE, this.onPointerMove, this);
    }

    private onPointerDown() {

    }

    private onPointerUp() {

    }

    private onPointerMove() {

    }

    private toggleLetter(event: EventMouse) {
        // console.log(this._drawLines);

        // this._drawLines['addPoint'](event);

        // console.log(this.node.worldPosition);

    }

    public get letter(): string {
        return this._label['string'];
    }

    public set letter(str: string) {
        this._label['string'] = str;
    }
}

