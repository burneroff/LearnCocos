import { _decorator, Button, Component } from "cc";
import { EventBus, GameEvents } from "../EventBus";
import { GameConfig, GameModel } from "../data/GameModel";
const { ccclass, property } = _decorator;

@ccclass("MenuController")
export class MenuController extends Component {
  private _configUpdate(config: Partial<GameConfig>): void {
    GameModel.instance.updateConfig(config);
  }

  protected start(): void {
    EventBus.on(GameEvents.CONFIG_REQUEST_UPDATE, this._configUpdate);
  }

  protected onDestroy(): void {}
}
