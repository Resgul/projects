import { _decorator, Component, UITransform, v2, Vec2 } from 'cc';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('PointerDetector')
export class PointerDetector extends Component {
    private radius: number;

    protected onEnable(): void {
        const uiTransform = this.node.getComponent(UITransform);
        const { width, height } = uiTransform;

        this.radius = Math.max(width, height) * 0.5;
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.LETTER_POINTER_MOVE, this._onPointerMove, this);
    }

    private _onPointerMove(pointerPosition: Vec2) {
        if (!pointerPosition) return;
        const { x, y } = this.node.worldPosition;
        const pointerDistance = Vec2.distance(pointerPosition, v2(x, y));

        if (pointerDistance <= this.radius) {
            gameEventTarget.emit(GameEvent.LETTER_UNDER_POINTER, pointerPosition, this.node);
        }
    }
}

