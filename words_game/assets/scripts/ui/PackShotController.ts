import { _decorator, Component, Label, Node, ParticleSystem2D, Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PackShotController')
export class PackShotController extends Component {
    @property(Component)
    lvlText: Component;

    @property(Component)
    btnText: Component;
    
    @property(Node)
    particles: Node;

    protected onEnable(): void {
        this._playAnimation();
        this._playParticle();
    }

    private _playParticle(): void {
        this.particles.children.forEach(node => {
            const particle = node.getComponent(ParticleSystem2D);
            particle.resetSystem();
        })
    }

    private _playAnimation(): void {
        const animation = this.node.getComponent(Animation);
        animation.play('showPackShot');
    }

    public setText(lvlNumber: number): void {
        const lvlLabel = this.lvlText.getComponent(Label);
        const btnLabel = this.btnText.getComponent(Label);

        lvlLabel.string = `Уровень ${lvlNumber + 1} пройден`;
        btnLabel.string = `Уровень ${lvlNumber + 2}`;
    }
}

