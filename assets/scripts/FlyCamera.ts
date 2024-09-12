import {
  _decorator,
  Component,
  EventKeyboard,
  EventTouch,
  Input,
  input,
  KeyCode,
  math,
  Node,
  Vec3,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("FlyCamera")
export class FlyCamera extends Component {
  ex: number = 0;
  ey: number = 0;
  moved: boolean = false;
  lmbDown: boolean = false;
  speed: number = 1;
  keyCode: KeyCode;

  start() {
    var eulers = this.node.eulerAngles;
    this.ex = eulers.x;
    this.ey = eulers.y;
    this.moved = false;
    this.lmbDown = false;

    input.on(Input.EventType.TOUCH_MOVE, this.onMouseMove, this);
    input.on(Input.EventType.TOUCH_END, this.onMouseUp, this);
    input.on(Input.EventType.TOUCH_START, this.onMouseDown, this);

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
  }
  onKeyDown(event: EventKeyboard) {
    this.keyCode = event.keyCode;
  }
  onKeyUp(event: EventKeyboard) {
    this.keyCode = 0;
  }
  onMouseMove(event: EventTouch) {
    if (!this.lmbDown) return;

    if (!this.moved) {
      this.moved = true;
      return;
    }

    this.ex += event.getDeltaY() / 10;
    this.ey -= event.getDeltaX() / 10;
  }
  onMouseDown() {
    this.lmbDown = true;
  }
  onMouseUp() {
    this.lmbDown = false;
  }
  update(deltaTime: number) {
    this.node.setRotationFromEuler(this.ex, this.ey, 0);

    switch (this.keyCode) {
      case KeyCode.KEY_W:
        this.node.translate(new Vec3(0, 0, -this.speed));

        break;
      case KeyCode.KEY_S:
        this.node.translate(new Vec3(0, 0, this.speed));
        break;
      case KeyCode.KEY_D:
        this.node.translate(new Vec3(this.speed, 0, 0));
        break;
      case KeyCode.KEY_A:
        this.node.translate(new Vec3(-this.speed, 0, 0));
        break;
    }


  }
}
