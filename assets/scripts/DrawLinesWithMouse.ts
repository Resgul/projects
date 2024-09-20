import { _decorator, Component, Graphics, Vec2, v2, Node } from 'cc';
import { gameEventTarget } from './GameEventTarget';
import { catmullRomSpline } from './utils/SplineFunction';
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
    private mousePosition: Vec2;
    private connectedCircles: Set<Node> = new Set();

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
        if (!circle) return;


        this.isDrawing = true;
        this.startCircle = circle;
        this.points = [];

        this.addPoint(position);
    }

    onMouseMove(position: Vec2, circle: Node) {
        if (this.isDrawing) {
            if (circle) this.connectedCircles.add(circle);

            this.addPoint(position);
        }
    }

    onMouseUp(position: Vec2) {
        this.isDrawing = false;
        this.updateGraphics();
        this.startPoint = null;
        this.connectedCircles.clear();
    }

    public addPoint(position: Vec2) {
        if (!position) return;
        const pointsPositions = [];

        if (this.connectedCircles.size < 2) {
            this.connectedCircles.forEach(circle => {
                const { x, y } = circle.worldPosition;

                this.points.push(v2(x, y));
            });

            this.points.push(position);

        } else {
            this.connectedCircles.forEach(circle => {
                const { x, y } = circle.worldPosition;

                pointsPositions.push(v2(x, y));
            });
            pointsPositions.push(position);
            const splinePoints = catmullRomSpline(pointsPositions, 10);
            this.points = splinePoints;
        }

        this.updateGraphics();
    }


    updateGraphics() {
        const g = this.graphics;
        g.clear();

        if (this.points.length > 0) {
            g.moveTo(this.points[0].x, this.points[0].y);

            for (let i = 1; i < this.points.length; i++) {
                g.lineTo(this.points[i].x, this.points[i].y);
            }
            g.stroke();

            this.points = [];

        }
    }
}
