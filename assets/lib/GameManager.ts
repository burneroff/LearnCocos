import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  Sprite,
  Color,
  Label,
  EditBox,
} from "cc";
const { ccclass, property } = _decorator;

interface Field {
  color: string;
  x: number;
  y: number;
  node?: Node; 
}

@ccclass("GameMenager")
export class GameMenager extends Component {
  @property(Prefab)
  curPrefab: Prefab = null!;

  @property(EditBox)
  inputM: EditBox = null!;

  @property(EditBox)
  inputN: EditBox = null!;

  @property(EditBox)
  inputX: EditBox = null!;

  @property(EditBox)
  inputY: EditBox = null!;

  private fieldWidthM = 5;
  private fieldLengthN = 5;
  private fieldColorsX = 0;
  private fieldMinClasterSizeY = 0;

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

  // DFS обход
  private dfs(i: number, j: number, color: string, cluster: Field[]) {
    if (
      i < 0 ||
      j < 0 ||
      i >= this.fieldWidthM ||
      j >= this.fieldLengthN ||
      this._visited[i][j] ||
      this._field[i][j].color !== color
    ) {
      return;
    }

    this._visited[i][j] = true;
    cluster.push(this._field[i][j]);

    // рекурсивно в 4 стороны
    this.dfs(i + 1, j, color, cluster);
    this.dfs(i - 1, j, color, cluster);
    this.dfs(i, j + 1, color, cluster);
    this.dfs(i, j - 1, color, cluster);
  }

  generateField() {
    this._field = [];

    for (let i = 0; i < this.fieldWidthM; i++) {
      let row: Field[] = [];
      for (let j = 0; j < this.fieldLengthN; j++) {
        row.push({
          color: this._colorArr[Math.floor(Math.random() * this.fieldColorsX)],
          x: 50 * j,
          y: 50 * i,
        });
      }
      this._field.push(row);
    }

    console.log("Field generated");
  }

  spawnBlocks() {
    if (!this.curPrefab) {
      console.warn("Prefab is not assigned!");
      return;
    }

    for (let i = 0; i < this.fieldWidthM; i++) {
      for (let j = 0; j < this.fieldLengthN; j++) {
        let block = instantiate(this.curPrefab);
        this.node.addChild(block);
        block.setPosition(this._field[i][j].x, this._field[i][j].y);

        // Запоминаем узел внутри field
        this._field[i][j].node = block;

        // Задаём цвет спрайта
        let sprite = block.getComponentInChildren(Sprite);

        if (sprite) {
          sprite.color = Color.fromHEX(new Color(), this._field[i][j].color);
        }

        // Выключаем Label по умолчанию
        let label = block.getComponentInChildren(Label);
        if (label) {
          label.enabled = false;
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
          this.dfs(i, j, this._field[i][j].color, cluster);

          // если кластер достаточно большой — включаем Label у всех блоков
          if (cluster.length >= this.fieldMinClasterSizeY) {
            for (let cell of cluster) {
              let label = cell.node?.getComponentInChildren(Label);
              if (label) {
                label.enabled = true;
              }
            }
          }
        }
      }
    }
  }

  onInputChange() {
    this.fieldWidthM = parseInt(this.inputM.string) || this.fieldWidthM;
    this.fieldLengthN = parseInt(this.inputN.string) || this.fieldLengthN;
    this.fieldColorsX = parseInt(this.inputX.string) || this.fieldColorsX;
    this.fieldMinClasterSizeY =
      parseInt(this.inputY.string) || this.fieldMinClasterSizeY;
  }

  onStartButtonClicked() {
    this.node.removeAllChildren();
    this._field = [];

    this.generateField();
    this.spawnBlocks();
    this.findClusters();
  }

  start() {}
  update(deltaTime: number) {}
}
