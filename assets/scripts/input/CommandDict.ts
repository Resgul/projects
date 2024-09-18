import { Vec2 } from "cc";
import { gameEventTarget } from "../GameEventTarget"
import { GameEvent } from "../enums/GameEvent"
import { ScreenButton } from "./ScreenButton";

export const CommandDict = {
	mainScreenButtonMoveCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.MAIN_SCREEN_BUTTON_MOVE, button.touchCurrPos);
		// if (button.touchCurrPos && button.touchStartPos) {
		// 	let delta = new Vec2();
		// 	Vec2.subtract(delta, button.touchCurrPos, button.touchStartPos);
		// 	gameEventTarget.emit(GameEvent.MAIN_SCREEN_BUTTON_MOVE, delta);
		// }		
	},

	letterUpCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.MOUSE_UP_LETTER);
	},
	
	letterDownCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.MOUSE_DOWN_LETTER, button.touchStartPos, button.node);
	},

	letterMoveCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.MOUSE_MOVE_LETTER, button.touchCurrPos, button.node);
	},

	redirectCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.JOYSTICK_MOVE_END);
		gameEventTarget.emit(GameEvent.REDIRECT_PROCESSING);
	}
}

