import { Node, Prefab } from "cc";

export interface Field {
  x: number;
  y: number;
  node?: Node;
  prefab?: Prefab;
}

export enum GameState {
  GS_INIT,
  GS_PLAYING,
  GS_END,
}
export enum SpinState{
  SS_Playing,
  SS_END
}