import { _decorator, Button, Component } from "cc";
import { EventBus, GameEvents } from "../EventBus";
const { ccclass, property } = _decorator;

//View
@ccclass("UI")
export class UI extends Component {
  @property([Button])
  uiElements: Button[] = [];

  hideUI(): void {
    for (let element of this.uiElements) {
      element.node.active = false;
    }
  }

  showUI(): void {
    for (let element of this.uiElements) {
      element.node.active = true;
    }
  }

  blockUI(): void {
    for (let element of this.uiElements) {
      element.interactable = false;
    }
  }

  unBlockUI(): void {
    for (let element of this.uiElements) {
      element.interactable = true;
    }
  }

  protected onLoad(): void {
    this.hideUI();
    EventBus.on(GameEvents.GAME_START, this.showUI, this);
    EventBus.on(GameEvents.GAME_STOP, this.hideUI, this);
    EventBus.on(GameEvents.SPIN_STARTED, this.blockUI, this);
    EventBus.on(GameEvents.SPIN_FINISHED, this.unBlockUI, this);
  }

  protected onDestroy(): void {
    EventBus.off(GameEvents.GAME_START, this.showUI, this);
    EventBus.off(GameEvents.GAME_STOP, this.hideUI, this);
    EventBus.off(GameEvents.SPIN_STARTED, this.blockUI, this);
    EventBus.off(GameEvents.SPIN_FINISHED, this.unBlockUI, this);
  }
}
