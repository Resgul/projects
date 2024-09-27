import { _decorator, Camera, Component, director, Enum, EventTouch, Input, Node, v2, Vec2, Vec3 } from 'cc';
import { InteractionType } from './InteractionType';
import { CommandDict } from './CommandDict';
import { gameEventTarget } from '../GameEventTarget';
import { GameEvent } from '../enums/GameEvent';
const { ccclass, property } = _decorator;

@ccclass('InteractionCommandPair')
class InteractionCommandPair {
	@property({
		type: Enum(InteractionType)
	})
	interactionType = InteractionType.None;

	@property
	commandName = '';
}

@ccclass('CustomField')
class CustomField {
	@property
	key: string = '';

	@property
	value: string = '';
}

@ccclass('ScreenButton')
export class ScreenButton extends Component {
	@property({
		type: [InteractionCommandPair]
	})
	interCommandPairs: InteractionCommandPair[] = [];

	@property({
		type: [CustomField]
	})
	customFields: CustomField[] = [];

	@property
	buttonName = '';

	@property({
		visible: false
	})
	touchStartPos: Vec2 = null;

	@property({
		visible: false
	})
	touchCurrPos: Vec2 = null;

	commandMap: Map<InteractionType, Function> = new Map();
	statusMap: Map<InteractionType, boolean> = new Map();
	_customFields;


	private _camera: Camera = null;

	// из-за того, что для ресайза используется camera.orthoHeight, 
	// идея забирать просто из event.getUILocation() не работает
	private _screenToWorld(position: Vec2): Vec2 {
    const camera = this._camera;
    const screenPos = new Vec3(position.x, position.y, 0);
    const worldPos = new Vec3();
    
    camera.screenToWorld(screenPos, worldPos);
    
    return v2(worldPos.x, worldPos.y);
}

	onEnable() {
		this._camera = director.getScene().getComponentInChildren(Camera);

		this.interCommandPairs.forEach(interCommandPair => {
			const command = CommandDict[interCommandPair.commandName];
			this.commandMap.set(interCommandPair.interactionType, command);
		});

		this._customFields = {};
		this.customFields.forEach(field => this._customFields[field.key] = field.value);

		gameEventTarget.emit(GameEvent.REGISTER_BUTTON, this);

		this._subscribeEvents(true);		
	}

	onDisable() {
		this._subscribeEvents(true);

		gameEventTarget.emit(GameEvent.UNREGISTER_BUTTON, this);
	}

	private _subscribeEvents(isOn: boolean) {
		const func = isOn? 'on': 'off';

		this.node[func](Input.EventType.TOUCH_START, this.onTouchStart, this);
		this.node[func](Input.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node[func](Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
		this.node[func](Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
		// this.node[func](Input.EventType.MOUSE_MOVE, this.onTouchMove, this);
	}

	getCustomFields() {
		return this._customFields;
	}

	onTouchStart(event: EventTouch) {
		this.statusMap.set(InteractionType.Down, true);

		this.touchStartPos = this._screenToWorld(event.getLocation());
		this.touchCurrPos = this._screenToWorld(event.getLocation());
	}

	onTouchEnd(event: EventTouch) {
		this.statusMap.set(InteractionType.Up, true);

		this.touchStartPos = null;
		this.touchCurrPos = null;
	}

	onTouchCancel(event: EventTouch) {		
		this.statusMap.set(InteractionType.Cancel, true);

		this.touchStartPos = null;
		this.touchCurrPos = null;
	}

	onTouchMove(event: EventTouch) {
		this.statusMap.set(InteractionType.Move, true);

		this.touchCurrPos = this._screenToWorld(event.getLocation());
	}
}

