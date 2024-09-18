import { _decorator, Component, Graphics, input, Input, EventMouse, Vec2, v2, v3, Node, UITransform, Vec3 } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { GameEvent } from './enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('DrawLinesWithMouse')
export class DrawLinesWithMouse extends Component {
    @property(Graphics)
    graphics: Graphics = null;

    public isDrawing = false;
    private points: Vec2[] = [];
    private startPoint: Vec2;
    private startCircle: Node;

    protected onEnable(): void {
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);

    }

    private _subscribeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.MOUSE_DOWN_LETTER, this.onMouseDown, this);
        gameEventTarget[func](GameEvent.MOUSE_UP_LETTER, this.onMouseUp, this);
        gameEventTarget[func](GameEvent.MOUSE_MOVE_LETTER, this.onMouseMove, this);
        gameEventTarget[func](GameEvent.MAIN_SCREEN_BUTTON_MOVE, this.onMouseMove, this);
    }

    onMouseDown(position: Vec2, circle: Node) {
        this.isDrawing = true;
        this.startCircle = circle;
        this.startPoint = position;
        this.points = [];
        this.addPoint(position);
    }

    onMouseMove(position: Vec2, circle: Node) {
        if (this.isDrawing) {
            circle && console.log(circle.name, circle.uuid);
            
            this.addPoint(position);
        }
    }

    onMouseUp(position: Vec2) {
        this.isDrawing = false;
        this.updateGraphics();
        this.startPoint = null;
    }

    public addPoint(position: Vec2) {
        if (!position) return;

        this.points.push(this.startPoint);
        this.points.push(position);
        
        this.updateGraphics();
    }

    drawDot(array: Array<Vec2>) {
        if (array[0].x === array[1].x) array[1].x += 0.001;
    }

    updateGraphics() {
        const g = this.graphics;
        g.clear();

        if (this.points.length > 0) {
            g.moveTo(this.points[0].x, this.points[0].y);

            // для рисования точки, даже если клик на месте
            this.drawDot(this.points);

            for (let i = 1; i < this.points.length; i++) {
                g.lineTo(this.points[i].x, this.points[i].y);
            }
            g.stroke();

            this.points = [];

        }
    }
}
