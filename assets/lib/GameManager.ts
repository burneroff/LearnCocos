import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  EditBox,
  sp,
} from "cc";
import { Spin } from "./Spin";

const { ccclass, property } = _decorator;

interface Field {
  color?: string;
  x: number;
  y: number;
  node?: Node;
  prefab?: Prefab;
}

enum GameState {
  GS_INIT,
  GS_PLAYING,
  GS_END,
}

@ccclass("GameManager")
export class GameManager extends Component {
  @property([Prefab])
  prefabs: Prefab[] = [];

  // DFS обход
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

  private fieldWidthM = 5; // ширина (строки)
  private fieldLengthN = 5; // длина (столбцы)
  private fieldColorsX = 3; // количество цветов
  private fieldMinClusterSizeY = 3; // минимальный размер кластера

  public setM(value: number) {
    this.fieldWidthM = value;
  }

  public setN(value: number) {
    this.fieldLengthN = value;
  }

  public setX(value: number) {
    this.fieldColorsX = value;
  }

  public setY(value: number) {
    this.fieldMinClusterSizeY = value;
  }

  private _field: Field[][] = [];
  private _visited: boolean[][] = [];
  private _colorArr = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF",
    "#FFA500",
    "#800080",
    "#FFFFFF",
  ];

  @property(Spin)
  spin: Spin = null!;

  @property(Node)
  startMenu: Node = null!;

  private _curstate: GameState = GameState.GS_INIT;
  set curState(value) {
    switch (value) {
      case GameState.GS_PLAYING:
        this.startMenu.active = false;
      case GameState.GS_END:
        break;
      default:
        this.generateField();
        this.spawnField();
    }
  }

  start(){
    this.curState = GameState.GS_INIT;
    
  }

  generateField() {
    this._field = [];

    for (let i = 0; i < this.fieldWidthM; i++) {
      let row: Field[] = [];
      for (let j = 0; j < this.fieldLengthN; j++) {
        const prefab =
          this.prefabs[Math.floor(Math.random() * this.fieldColorsX)];
        const color =
          this._colorArr[Math.floor(Math.random() * this.fieldColorsX)];

        row.push({
          prefab,
          color,
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

        // красим спрайт, если есть
        const skeleton = block.getComponentInChildren(
          "sp.Skeleton"
        ) as sp.Skeleton;
        if (skeleton) {
          skeleton.setAnimation(0, "in", false);
        }
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
              const skeleton = cell.node?.getComponentInChildren(
                "sp.Skeleton"
              ) as sp.Skeleton;

              if (skeleton) {
                skeleton.setAnimation(0, "win", false);

                // возвращаем idle после win
                skeleton.setCompleteListener(() => {
                  skeleton.setAnimation(0, "idle", true);
                });
              }
            }
          }
        }
      }
    }
  }

  gameStart() {
    this.curState = GameState.GS_PLAYING;
    this.node.removeAllChildren();
    this._field = [];

    this.generateField();
    this.spawnField();
    this.findClusters();
  }
}
