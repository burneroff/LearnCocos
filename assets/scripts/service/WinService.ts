import { _decorator, Component } from "cc";
import { EventBus, GameEvents } from "../EventBus";
import { FieldCell, FieldModel } from "../data/FIeldModel";
import { GameModel } from "../data/GameModel";
import { WinModel } from "../data/WinModel";
const { ccclass } = _decorator;

@ccclass("WinService")
export class WinService extends Component {

  private _visited: boolean[][] = [];

  private _dfs(
    i: number,
    j: number,
    symbolIndex: number,
    cluster: FieldCell[]
  ): void {
    const field = FieldModel.instance.field;

    if (
      i < 0 ||
      j < 0 ||
      i >= field.length ||
      j >= field[0].length ||
      this._visited[i][j] ||
      field[i][j].symbolIndex !== symbolIndex
    )
      return;

    this._visited[i][j] = true;
    cluster.push(field[i][j]);

    this._dfs(i + 1, j, symbolIndex, cluster);
    this._dfs(i - 1, j, symbolIndex, cluster);
    this._dfs(i, j + 1, symbolIndex, cluster);
    this._dfs(i, j - 1, symbolIndex, cluster);
  }

  private _checkResult() {
    const field = FieldModel.instance.field;
    const minWin = GameModel.instance.config.Y;
    this._visited = Array.from({ length: field.length }, () =>
      Array(field[0].length).fill(false)
    );

    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        if (!this._visited[i][j]) {
          const cluster: FieldCell[] = [];
          this._dfs(i, j, field[i][j].symbolIndex, cluster);
          if (cluster.length >= minWin) {
            WinModel.instance.winCluster = cluster;
          }
        }
      }
    }

    if (WinModel.instance.winCluster.length > 0) {
      EventBus.emit(GameEvents.WIN);
    } else {
      EventBus.emit(GameEvents.LOSE);
    }
  }

  protected start(): void {
    EventBus.on(GameEvents.CHECK_RESULT, this._checkResult, this);
  }

  protected onDestroy(): void {
    EventBus.off(GameEvents.CHECK_RESULT, this._checkResult, this);
  }
}
