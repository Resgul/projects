import { _decorator, CCFloat, CCInteger, Component, instantiate, Node, Prefab, UITransform, Vec3, resources, JsonAsset, path  } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GenerateLetterCorcles')
export class GenerateLetterCorcles extends Component {
    @property(CCInteger)
    lettersCount: number = 4;
    
    @property(CCFloat)
    radiusScaleCorrection: number = 0.95;

    @property(Prefab)
    letterPrefab: Prefab;

    protected onEnable(): void {
        const radius = this._calculateRadius();
        const positions = this._calculatePointsOnCircle(radius);

        this._spawnLetterPrefab(positions);
        this._loadJson();
    }

    private _loadJson() {
        resources.load('levels/1', JsonAsset, (err, jsonAsset) => {
            if (err) {
                console.error('Error loading JSON file:', err);
                return;
            }
            const data = jsonAsset.json;
            console.log(data);
        });
    }

    private _spawnLetterPrefab(posArr: Array<Vec3>): void {
        posArr.forEach(position => {
            const instance = instantiate(this.letterPrefab);

            this.node.addChild(instance);
            instance.position.add(position);
        })
    }

    private _calculateRadius(): number {
        const uiTransform = this.node.getComponent(UITransform);
        const { width, height } = uiTransform;
        const radius = Math.min(width, height) / 2;

        return radius;
    }

    private _calculatePointsOnCircle(radius: number): Array<Vec3> {
        const { lettersCount } = this;
        const points = [];

        for (let i = 0; i < lettersCount; i++) {
            const angle = (2 * Math.PI * i) / lettersCount;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            points.push(new Vec3(x, y, 0));
        }
        return points;
    }

    protected update(dt: number): void {
        
    }
}

