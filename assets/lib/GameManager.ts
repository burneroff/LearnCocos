import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  Sprite,
  Color,
  Label,
} from "cc";
const { ccclass, property } = _decorator;


interface Field {
  color: string,
  x: number,
  y: number
}

@ccclass("GameMenager")
export class GameMenager extends Component {
  @property(Prefab)
  curPrefab: Prefab = null!;

  @property
  fieldWidthM = 5;

  @property
  fieldLengthN = 5;

  @property
  fieldColorsX = 0;

  @property
  fieldMinClasterSizeY = 3;

  private _field: Field[][] = [];
  private _colorArr = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF",
    "#FFA500",
    "#800080",
  ];

  start() {
    this.generateField();
  }
  
  generateField() {
    this._field = [];

    for (let i = 0; i < this.fieldWidthM; i++) {
      let row = [];
      for (let j = 0; j < this.fieldLengthN; j++) {
        row.push({
          color:
            this._colorArr[Math.floor(Math.random() * this._colorArr.length)],
          x: 50 * j,
          y: 50 * i,
        });
      }
      this._field.push(row);
    }

    console.log("Field generated");
    this.spawnBlocks();
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

        // Задаём цвет спрайта, если он есть
        let sprite = block.getComponentInChildren(Sprite);
        if (sprite) {
          sprite.color = Color.fromHEX(new Color(), this._field[i][j].color);
        }
        let label = block.getComponentInChildren(Label);
        if (label) {
          label.enabled = false; // выключить отображение
          // label.enabled = true;  // включить отображение
        }
      }
    }

    console.log("Blocks spawned");
  }

  findCluster() {
    
     for (let i = 0; i < this.fieldWidthM; i++) {
      for (let j = 0; j < this.fieldLengthN; j++) {
        this._field
      }
    }
  }
  update(deltaTime: number) {}
}
