import { _decorator, Button, Component, Label, Node, sp } from "cc";
import { GameState } from "../types";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

@ccclass("Spin")
export class Spin extends Component {
  @property(GameManager)
  gameManager: GameManager = null!;

  @property(Button)
  buttonSpin: Button = null!;

  @property(Button)
  buttonSettings: Button = null!;

  private anyWin: boolean = false;

  playAnimation(block: Node, animationName: string) {
    const skeleton = block.getComponentInChildren("sp.Skeleton") as sp.Skeleton;
    if (!skeleton) return;

    if (animationName == "win" || (animationName == "WIN" && !this.anyWin)) {
      this.anyWin = true;
      this.blockUI();
      setTimeout(() => {
        this.unblockUI();
      }, 1200);
    }

    skeleton.setAnimation(0, animationName, false);
    skeleton.setCompleteListener(() => {
      skeleton.setAnimation(0, "idle", true);
      skeleton.setAnimation(0, "IDLE", true);
    });
  }

  onSpinButtonClicked() {
    this.gameManager.state = GameState.GS_PLAYING;
  }

  onSettingsClicked() {
    this.gameManager.state = GameState.GS_END;
  }

  blockUI() {
    this.buttonSpin.enabled = false;
    this.buttonSettings.enabled = false;
    const label = this.buttonSpin.node.getComponentInChildren(Label);
    if (label) {
      label.string = "Spinning...";
    }
  }

  unblockUI() {
    this.buttonSpin.enabled = true;
    this.buttonSettings.enabled = true;
    const label = this.buttonSpin.node.getComponentInChildren(Label);
    if (label) {
      label.string = "Spin";
    }
  }

  on() {
    this.buttonSpin.node.active = true;
    this.buttonSettings.node.active = true;
  }

  off() {
    this.buttonSpin.node.active = false;
    this.buttonSettings.node.active = false;
  }

  start() {
    this.off();
  }

  update(deltaTime: number) {}
}
