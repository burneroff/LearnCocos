export interface GameConfig {
  M: number;
  N: number;
  X: number;
  Y: number;
}

export class GameModel {
  private static _instance: GameModel;

  private _config: GameConfig = {
    M: 5,
    N: 5,
    X: 4,
    Y: 3,
  };

  private constructor() {}

  public static get instance(): GameModel {
    if (!this._instance) {
      this._instance = new GameModel();
    }
    return this._instance;
  }

  get config(): GameConfig {
    return this._config;
  }

  updateConfig(newConfig: Partial<GameConfig>): void {
    this._config = { ...this._config, ...newConfig };
    console.log(this._config);
  }
}
