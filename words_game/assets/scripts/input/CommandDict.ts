import { gameEventTarget } from "../GameEventTarget"
import { GameEvent } from "../enums/GameEvent"
import { ScreenButton } from "./ScreenButton";

export const CommandDict = {
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

