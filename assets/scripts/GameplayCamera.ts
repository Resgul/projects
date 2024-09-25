import { _decorator, Camera, Component, Node, view, View, screen, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameplayCamera')
export class GameplayCamera extends Component {

    _camera: Camera;

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

        // view[func]('canvas-resize', this._onCanvasResize, this);
        View.instance[func]('design-resolution-changed', this._onCanvasResize, this);
		// window.addEventListener('fullscreenchange', this._onCanvasResize.bind(this));
		// view[func]('canvas-resize', this._onCanvasResize, this);
    }

    private _onCanvasResize(): void {

        const { height, width } = screen.windowSize
        const aspect = width / height;
        const landscape = aspect > 1;
        // console.log(this._camera);

        // this._camera.orthoHeight = landscape ? 568 : 568;
        // this._camera.node.position = v3(100,0,0)
        // console.log(this._camera.orthoHeight);
        // this._camera.orthoHeight = landscape ? 568 : 568
        // this.scheduleOnce(() => this._camera.orthoHeight = landscape ? 568 : 568);
        // this.scheduleOnce(() => this._camera.node.position = v3(100,0,0));
    }

}


