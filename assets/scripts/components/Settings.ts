import { _decorator, Button, Component } from "cc";
import { EventBus, GameEvents } from "../EventBus";
const { ccclass, property } = _decorator;

@ccclass("Settings")
export class Settings extends Button {
  onClick(): void {
    EventBus.emit(GameEvents.GAME_STOP);
  }
}
