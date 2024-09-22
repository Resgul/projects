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
    private connectedCircles: Set<Node> = new Set();
    private connectedCirclesArray: Array<Node> = [];

    protected onEnable(): void {
        this._subscribeEvents(true);
    }

    protected onDisable(): void {
        this._subscribeEvents(false);

    }

    private _subscribeEvents(isOn: boolean) {
        const func = isOn ? 'on' : 'off';

        gameEventTarget[func](GameEvent.LETTER_POINTER_DOWN, this.onPointerDown, this);
        gameEventTarget[func](GameEvent.LETTER_POINTER_UP, this.onPointerUp, this);
        // благодаря POINTER_MOVE ивенту, можно рисовать вне буквы
        gameEventTarget[func](GameEvent.LETTER_POINTER_MOVE, this.onPointerMove, this);
        // благодаря UNDER_POINTER ивенту, можно определить, что буква под курсором, 
        // т.к. MOUSE ивент не работает на телефонах
        gameEventTarget[func](GameEvent.LETTER_UNDER_POINTER, this.onLetterUnderPointer, this);
    }

    onPointerDown(position: Vec2, circle: Node) {
        if (!circle) return;
        else this.connectedCircles.add(circle);

        this.isDrawing = true;
        this.points = [];

        this.addPoint(position);
    }

    onPointerMove(position: Vec2, circle: Node) {
        if (this.isDrawing) {
            this.addPoint(position);
        }
    }

    onLetterUnderPointer(position: Vec2, circle: Node) {
        if (this.isDrawing) {
            if (circle) this.connectedCircles.add(circle);

            this.addPoint(position);
            this.deleteLastIfTouchPrev(circle);
            // ...визуальная активация круга 
            // ...добавление буквы во временную таблицу
        }
    }

    private deleteLastIfTouchPrev(circle: Node): void {
        if (this.connectedCirclesArray.length > 1) {
            const lastCircle = this.connectedCirclesArray[this.connectedCirclesArray.length - 1];
            const preLastCircle = this.connectedCirclesArray[this.connectedCirclesArray.length - 2];

            if (circle === preLastCircle) {
                // удаление линии ведущей к кругу
                this.connectedCircles.delete(lastCircle);
                // ...визуальная деактивация круга 
                // ...удаление буквы из временной таблицы
            }
        }
    }

    private onPointerUp(position: Vec2): void {
        this.isDrawing = false;
        this.updateGraphics();
        this.connectedCircles.clear();
        this.connectedCirclesArray = [];
    }

    private fillPositionsArr(array: Array<Vec2>, mousePos: Vec2): void {
        // массив наполняется позициями кругов, а затем курсора
        this.connectedCircles.forEach(circle => {
            const { x, y } = circle.worldPosition;
            array.push(v2(x, y));
        });

        array.push(mousePos);
    }

    private addPoint(position: Vec2) {
        if (!position) return;
        const pointsPositions = [];
        this.connectedCirclesArray = [];

        if (this.connectedCircles.size < 2) {
            this.fillPositionsArr(this.points, position);
        } else {
            this.connectedCirclesArray = [...this.connectedCircles];
            this.fillPositionsArr(pointsPositions, position);

            const splinePoints = catmullRomSpline(pointsPositions, 10);
            this.points = splinePoints;
        }


        this.updateGraphics();
    }

    private updateGraphics(): void {
        const { graphics } = this;
        graphics.clear();

        if (this.points.length > 0) {
            graphics.moveTo(this.points[0].x, this.points[0].y);

            for (let i = 1; i < this.points.length; i++) {
                graphics.lineTo(this.points[i].x, this.points[i].y);
            }
            graphics.stroke();

            this.points = [];
        }
    }
}
