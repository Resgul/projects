import { _decorator, Component, Label, Animation } from 'cc';
const { ccclass } = _decorator;

@ccclass('TileController')
export class TileController extends Component {
    private label: Component;
    private animation: Component;
    public isActive: boolean = false;

    protected onEnable(): void {
        this.label = this.node.getComponentInChildren(Label);
        this.animation = this.node.getComponent(Animation);
    }

    public animate(animName: string): Promise<void> {
        return new Promise(resolve => {
            this.animation.play(animName);
            this.animation.on(Animation.EventType.FINISHED, () => resolve(), this);
        });
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

