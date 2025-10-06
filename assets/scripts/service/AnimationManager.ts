import { EventBus, GameEvents } from "../EventBus";
import { Node } from "cc";
import { Symbol } from "../components/Symbol";

export class AnimationTask {
  constructor(
    public symbol: Node,
    public animation: string,
    public loop: boolean = false
  ) {}

  run(): Promise<void> {
    if (this.symbol.getComponent(Symbol)) {
      return this.symbol
        .getComponent(Symbol)
        ?.playAnimation(this.animation, this.loop);
    }
  }
}

export class AnimationManager {
  private static _instance: AnimationManager;
  private queue: AnimationTask[] = [];

  private constructor() {
    EventBus.on(GameEvents.START_ANIMATION, this.runAll, this);
  }

  public static get instance(): AnimationManager {
    if (!this._instance) {
      this._instance = new AnimationManager();
    }
    return this._instance;
  }

  addTask(task: AnimationTask) {
    this.queue.push(task);
  }

  addTaskQueue(tasks: AnimationTask[]) {
    this.queue.push(...tasks);
  }

  async runAll(): Promise<void> {
    if (this.queue.length === 0) return;

    console.log("Animation started!");
    const promises = this.queue.map((task) => task.run());
    await Promise.all(promises);

    console.log("Animation finished!");
    this.queue = [];
  }
}
