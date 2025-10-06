import { Node } from "cc";
import { EventBus, GameEvents } from "../EventBus";

export type FieldCell = {
  symbolIndex: number;
  node?: Node;
};

export type Field = FieldCell[][];

export class FieldModel {
  private static _instance: FieldModel;

  private _field: Field = [];
  get field(): Field {
    return this._field;
  }

  private _rows: number = 0;
  private _cols: number = 0;
  private _symbolCount: number = 0;

  private constructor() {
    EventBus.on(GameEvents.GAME_STOP, this._reset, this);
  }

  public static get instance(): FieldModel {
    if (!this._instance) {
      this._instance = new FieldModel();
    }
    return this._instance;
  }

  public init(rows: number, cols: number, symbolCount: number): void {
    this._rows = rows;
    this._cols = cols;
    this._symbolCount = symbolCount;

    if (this._field.length === 0) {
      this._field = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => ({
          symbolIndex: this._randomIndex(),
          node: undefined,
        }))
      );
    } else {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          this._field[r][c] = {
            symbolIndex: this._randomIndex(),
            node: undefined,
          };
        }
      }
    }
  }

  public regenerate(): void {
    for (let r = 0; r < this._rows; r++) {
      for (let c = 0; c < this._cols; c++) {
        this._field[r][c].symbolIndex = this._randomIndex();
        this._field[r][c].node = undefined;
      }
    }
  }

  private _reset(): void {
    this._field = [];
  }

  private _randomIndex(): number {
    return Math.floor(Math.random() * this._symbolCount);
  }
}
