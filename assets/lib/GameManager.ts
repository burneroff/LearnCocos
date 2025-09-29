import { _decorator, Component, instantiate, Node, Prefab } from "cc";
import { Spin } from "./Spin";
import { Field, GameState } from "../types";

const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property([Prefab])
  prefabs: Prefab[] = [];

  @property(Spin)
  spin: Spin = null!;

  @property(Node)
  startMenu: Node = null!;

  set state(value: GameState) {
    switch (value) {
      case GameState.GS_PLAYING:
        this.makeSpin();
        break;
      case GameState.GS_END:
        this.stopGame();
        this.spin.off();
        break;
      default:
        this.spin.on();
        this.initGame();
    }
  }

  private fieldWidthM = 0; // ширина (строки)
  set M(value: number) {
    this.fieldWidthM = value;
  }

  private fieldLengthN = 0; // длина (столбцы)
  set N(value: number) {
    this.fieldLengthN = value;
  }

  private fieldColorsX = 0; // количество цветов
  set X(value: number) {
    this.fieldColorsX = value;
  }

  private fieldMinClusterSizeY = 0; // минимальный размер кластера
  set Y(value: number) {
    this.fieldMinClusterSizeY = value;
  }

  private _field: Field[][] = [];
  get field() {
    return this._field;
  }
  private _visited: boolean[][] = [];
  private dfs(i: number, j: number, prefab: Prefab, cluster: Field[]) {
    if (
      i < 0 ||
      j < 0 ||
      i >= this.fieldWidthM ||
      j >= this.fieldLengthN ||
      this._visited[i][j] ||
      this._field[i][j].prefab !== prefab
    ) {
      return;
    }

    this._visited[i][j] = true;
    cluster.push(this._field[i][j]);

    this.dfs(i + 1, j, prefab, cluster);
    this.dfs(i - 1, j, prefab, cluster);
    this.dfs(i, j + 1, prefab, cluster);
    this.dfs(i, j - 1, prefab, cluster);
  }

  start() {}

  generateField() {
    this._field = [];

    for (let i = 0; i < this.fieldWidthM; i++) {
      let row: Field[] = [];
      for (let j = 0; j < this.fieldLengthN; j++) {
        const prefab =
          this.prefabs[Math.floor(Math.random() * this.fieldColorsX)];
        row.push({
          prefab,
          x: 125 * j,
          y: 125 * i,
        });
      }
      this._field.push(row);
    }

    console.log("Field generated");
  }

  spawnField() {
    if (!this.prefabs || this.prefabs.length === 0) {
      console.warn("Prefabs are not assigned!");
      return;
    }

    for (let i = 0; i < this.fieldWidthM; i++) {
      for (let j = 0; j < this.fieldLengthN; j++) {
        const block = instantiate(this._field[i][j].prefab!);
        this.node.addChild(block);
        block.setPosition(this._field[i][j].x, this._field[i][j].y);

        // сохраняем ссылку
        this._field[i][j].node = block;

        this.spin.playAnimation(block, "in");
        this.spin.playAnimation(block, "IN");
      }
    }

    console.log("Blocks spawned");
  }

  findClusters() {
    this._visited = Array.from({ length: this.fieldWidthM }, () =>
      Array(this.fieldLengthN).fill(false)
    );

    for (let i = 0; i < this.fieldWidthM; i++) {
      for (let j = 0; j < this.fieldLengthN; j++) {
        if (!this._visited[i][j]) {
          let cluster: Field[] = [];
          this.dfs(i, j, this._field[i][j].prefab!, cluster);

          if (cluster.length >= this.fieldMinClusterSizeY) {
            for (let cell of cluster) {
              this.spin.playAnimation(cell.node, "win");
              this.spin.playAnimation(cell.node, "WIN");
            }
          }
        }
      }
    }
  }

  initGame() {
    this.startMenu.active = false;
    this.generateField();
    this.spawnField();
  }

  makeSpin() {
    this.node.removeAllChildren();
    this._field = [];
    this.generateField();
    this.spawnField();
    this.findClusters();
  }

  stopGame() {
    this.node.removeAllChildren();
    this._field = [];
    this.startMenu.active = true;
  }
}
