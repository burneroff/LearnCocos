import { _decorator, Button } from "cc";
import { EventBus, GameEvents } from "../EventBus";
const { ccclass, property } = _decorator;

@ccclass("Spin")
export class Spin extends Button {
  onClick(): void {
    EventBus.emit(GameEvents.SPIN_STARTED);
  }
}
