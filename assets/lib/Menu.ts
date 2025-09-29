import { _decorator, Component, EditBox, Node } from "cc";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("Menu")
export class Menu extends Component {
  @property(Node)
  startMenu: Node = null!; //нужен если сразу конекчу к меню?

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
        this.gameManager.setM(value);
        break;
      case "N":
        this.gameManager.setN(value);
        break;
      case "X":
        this.gameManager.setX(value);
        break;
      case "Y":
        this.gameManager.setY(value);
        break;
    }

    console.log(`Изменено поле ${customEventData}: ${value}`);
  }

  onStartButtonClicked(){
    this.gameManager.gameStart()
    this.startMenu.active = false;
  }

  start() {}

  update(deltaTime: number) {}
}
