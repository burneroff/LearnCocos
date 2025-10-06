// EventBus.ts
import { EventTarget } from "cc";

export const EventBus = new EventTarget();

// список событий
export enum GameEvents {
  GAME_START = "GAME_START",
  GAME_STOP = "GAME_STOP",
  SPIN_STARTED = "SPIN_STARTED",
  SPIN_FINISHED = "SPIN_FINISHED",
  CHECK_RESULT = "CHECK_RESULT",
  WIN = "WIN",
  LOSE = "LOSE",
  CONFIG_REQUEST_UPDATE = "CONFIG_REQUEST_UPDATE",
  START_ANIMATION = "START_ANIMATION",
}
