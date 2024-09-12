import { _decorator, Component, Graphics, input, Input, EventMouse, Vec2, v2, Node, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DrawLinesWithMouse')
export class DrawLinesWithMouse extends Component {
    @property(Graphics)
    graphics: Graphics = null;

    private isDrawing = false;
    private points: Vec2[] = [];
    private startPoint: Vec2 = null;

    start() {
        input.on(Input.EventType.MOUSE_DOWN, this.onMouseDown, this);
        input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    onMouseDown(event: EventMouse) {
        this.isDrawing = true;
        this.points = [];
        this.addPoint(event);
    }

    onMouseMove(event: EventMouse) {
        if (this.isDrawing) {
            this.addPoint(event);
        }
    }

    onMouseUp(event: EventMouse) {
        this.isDrawing = false;
        this.updateGraphics();
        this.startPoint = null;
    }

    addPoint(event: EventMouse) {
        const uiTransform = this.node.getComponent(UITransform);
        const { x, y } = event.getUILocation();

        if (!this.startPoint) {
            this.startPoint = v2(x, y);
        }

        this.points.push(this.startPoint);

        this.points.push(v2(x, y));
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
