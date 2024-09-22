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
		gameEventTarget.emit(GameEvent.LETTER_POINTER_UP);
	},
	
	letterDownCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.LETTER_POINTER_DOWN, button.touchStartPos, button.node);
	},

	letterMoveCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.LETTER_POINTER_MOVE, button.touchCurrPos, button.node);
	},

	redirectCommand(button: ScreenButton) {
		gameEventTarget.emit(GameEvent.REDIRECT_PROCESSING);
	}
}

