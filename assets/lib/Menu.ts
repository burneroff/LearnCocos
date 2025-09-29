import { _decorator, Component, EditBox } from "cc";
import { GameManager } from "./GameManager";
import { GameState } from "../types";
const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
  @property(EditBox)
  inputM: EditBox = null!;

  @property(EditBox)
  inputN: EditBox = null!;

  @property(EditBox)
  inputX: EditBox = null!;

  @property(EditBox)
  inputY: EditBox = null!;

  @property(GameManager)
  gameManager: GameManager = null!;

  onEditingDidEnd(editBox: EditBox, customEventData: string) {
    const value = parseInt(editBox.string) || 0;

    switch (customEventData) {
      case "M":
        this.gameManager.M = value;
        break;
      case "N":
        this.gameManager.N = value;
        break;
      case "X":
        this.gameManager.X = value;
        break;
      case "Y":
        this.gameManager.Y = value;
        break;
    }
  }

  onStartButtonClicked(){
    this.gameManager.state = GameState.GS_INIT;
  }

  start() {}

  update(deltaTime: number) {}
}
