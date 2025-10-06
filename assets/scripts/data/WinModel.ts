import { Node } from "cc";
import { EventBus, GameEvents } from "../EventBus";
import { FieldCell } from "./FIeldModel";

export class WinModel {
  private static _instance: WinModel;

  private _winCluster: FieldCell[] = [];

  get winCluster(): FieldCell[] {
    return this._winCluster;
  }
  set winCluster(value: FieldCell[]) {
    this._winCluster.push(...value);
  }

  private constructor() {
    EventBus.on(GameEvents.SPIN_FINISHED, this._reset, this);
  }

  public static get instance(): WinModel {
    if (!this._instance) {
      this._instance = new WinModel();
    }
    return this._instance;
  }

  private _reset() {
    this._winCluster = [];
  }
}
