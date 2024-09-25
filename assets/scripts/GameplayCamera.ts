import { _decorator, Camera, Component, Node, view, View, screen, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameplayCamera')
export class GameplayCamera extends Component {

    private _camera: Camera;
    private _isOnChange: boolean = false;

    protected onEnable(): void {
        this._camera = this.node.getComponent(Camera)
        this._onCanvasResize();
        this._subscribeEvents(true);
    }
    protected onDisable(): void {
        this._subscribeEvents(false);
    }

    private _subscribeEvents(isOn: boolean): void {
        const func: string = isOn ? 'on' : 'off';


		View.instance[func]('design-resolution-changed', this._onCanvasResize, this);
		window.addEventListener('fullscreenchange', this._onCanvasResize.bind(this));
		view[func]('canvas-resize', this._onCanvasResize, this);

		// view[func]('canvas-resize', this._onCanvasResize, this);
    }

    private _onCanvasResize(): void {
// if (this._isOnChange) return;
        this._isOnChange = true;

        const { height, width } = screen.windowSize
        const aspect = width / height;
        const landscape = aspect > 1;

        // this._camera.orthoHeight = landscape ? 1568 : 568

        this.scheduleOnce(() => {
            this._camera.orthoHeight = landscape ? 520 : 568;
            this._camera.node.position = v3(0, landscape ? 50 : 0, 0);
            this._isOnChange = false;
        }, 0.2);
    }

}


