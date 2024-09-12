import { _decorator, Component, Input, input, Label, log, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LetterCircleController')
export class LetterCircleController extends Component {
    // @property(Prefab)
    // letterPrefab: Prefab;
    private _label: Component;

    protected onEnable(): void {
        this._label = this.node.getComponentInChildren(Label);


        // this.node.on(Input.EventType.MOUSE_MOVE, this.toggleLetter, this);
    }

    private toggleLetter() { 
        
        // console.log(this.node.worldPosition);

    }

    public get letter(): string {
        return this._label['string'];
    }

    public set letter(str: string) {
        this._label['string'] = str;
    }
}

