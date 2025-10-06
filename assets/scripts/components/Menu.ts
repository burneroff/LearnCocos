import { _decorator, Component, EditBox } from "cc";
import { EventBus, GameEvents } from "../EventBus";
import { GameConfig } from "../data/GameModel";
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

  onEditingDidEnd(editBox: EditBox, customEventData: string): void {
    const value = parseInt(editBox.string) || 0;
    
    let update: Partial<GameConfig> = {};
    update[customEventData as keyof GameConfig] = value;

    EventBus.emit(GameEvents.CONFIG_REQUEST_UPDATE, update);
  }

  onStartButtonClicked(): void {
    EventBus.emit(GameEvents.GAME_START);
  }

  private _show(): void {
    this.node.active = true;
  }

  private _hide(): void {
    this.node.active = false;
  }

  onLoad(): void {
    EventBus.on(GameEvents.GAME_START, this._hide, this);
    EventBus.on(GameEvents.GAME_STOP, this._show, this);
  }

  onDestroy(): void {
    EventBus.off(GameEvents.GAME_START, this._show, this);
    EventBus.off(GameEvents.GAME_STOP, this._hide, this);
  }
}
