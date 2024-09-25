import { _decorator, Component, Label, Animation, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MiniTileController')
export class MiniTileController extends Component {
    private label: Component;
    private animation: Component;
    public isActive: boolean = false;

    protected onEnable(): void {
        this.label = this.node.getComponentInChildren(Label);
        this.animation = this.node.getComponent(Animation);
    }

    private onTileIsAlreadyActive(tile: Node): void {
        if (tile !== this.node) return;
        this.animation.play('activateTile');
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

