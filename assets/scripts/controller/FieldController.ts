import { _decorator, Component, instantiate, Prefab } from "cc";
import { GameConfig, GameModel } from "../data/GameModel";
import { FieldModel } from "../data/FIeldModel";
import { EventBus, GameEvents } from "../EventBus";

const { ccclass, property } = _decorator;

@ccclass("FieldController")
export class FieldController extends Component {
  @property([Prefab])
  prefabs: Prefab[] = [];

  private _spawnField(): void {
    const field = FieldModel.instance.field;

    if (!this.prefabs || this.prefabs.length === 0) {
      console.warn("Prefabs are not assigned!");
      return;
    }
    console.log("SPAWN FIELD");

    for (let i = 0; i < field.length; i++) {
      for (let j = 0; j < field[i].length; j++) {
        const symbolIndex = field[i][j].symbolIndex;
        const prefab = this.prefabs[symbolIndex];

        if (!prefab) {
          console.error(`Prefab for symbol ${symbolIndex} not found`);
          continue;
        }

        const block = instantiate(prefab);
        block.setPosition(125 * i, 125 * j, 0);
        this.node.addChild(block);
        field[i][j].node = block;
      }
    }
    console.log("FIELD SPAWNED");
  }

  private _clearField(): void {
    this.node.removeAllChildren();
  }

  private _regenerateField(): void {
    FieldModel.instance.regenerate();
  }

  protected _initField(): void {
    FieldModel.instance.init(
      GameModel.instance.config.M,
      GameModel.instance.config.N,
      GameModel.instance.config.X
    );
  }

  private onSpinStarted(): void {
    this._clearField();
    this._regenerateField();
    this._spawnField();
    EventBus.emit(GameEvents.CHECK_RESULT);
  }

  private onGameStart(): void {
    this._initField();
    this._spawnField();
  }

  protected start(): void {
    EventBus.on(GameEvents.GAME_START, this.onGameStart, this);
    EventBus.on(GameEvents.GAME_STOP, this._clearField, this);
    EventBus.on(GameEvents.SPIN_STARTED, this.onSpinStarted, this);
  }

  protected onDestroy(): void {
    EventBus.off(GameEvents.GAME_START, this.onGameStart, this);
    EventBus.off(GameEvents.GAME_STOP, this._clearField, this);
    EventBus.off(GameEvents.SPIN_STARTED, this.onSpinStarted, this);
  }
}
