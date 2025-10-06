import { _decorator, Component } from "cc";
import { AnimationManager, AnimationTask } from "../service/AnimationManager";
import { WinModel } from "../data/WinModel";
import { EventBus, GameEvents } from "../EventBus";
const { ccclass, property } = _decorator;

@ccclass("WinController")
export class WinController extends Component {
  private async _handleWin() {
    console.log("WIN!");
    const tasks: AnimationTask[] = WinModel.instance.winCluster.map(
      (cell) => new AnimationTask(cell.node, "win", false)
    );

    AnimationManager.instance.addTaskQueue(tasks);
    await AnimationManager.instance.runAll();
    EventBus.emit(GameEvents.SPIN_FINISHED);
  }

  private _handleLose() {
    EventBus.emit(GameEvents.SPIN_FINISHED);
    console.log("LOSE :(");
  }

  protected start(): void {
    EventBus.on(GameEvents.WIN, this._handleWin, this);
    EventBus.on(GameEvents.LOSE, this._handleLose, this);
  }

  protected onDestroy(): void {
    EventBus.off(GameEvents.WIN, this._handleWin, this);
    EventBus.off(GameEvents.LOSE, this._handleLose, this);
  }
}
