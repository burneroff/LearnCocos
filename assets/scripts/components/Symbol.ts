// Symbol.ts
import { _decorator, Component, sp } from "cc";
const { ccclass } = _decorator;

@ccclass("Symbol")
export class Symbol extends Component {
  private _skeleton: sp.Skeleton = null!;

  onLoad() {
    this._skeleton = this.getComponentInChildren(sp.Skeleton);
  }

  playAnimation(name: string, loop: boolean = false): Promise<void> {
    if (!this._skeleton)
      throw new Error("Skeleton not found: " + this.node.name);

    return new Promise((resolve) => {
      this._skeleton.setAnimation(0, name, loop);

      if (!loop) {
        this._skeleton.setCompleteListener(() => {
          resolve();
          this._skeleton.setAnimation(0, "idle", true);
        });
      } else {
        resolve();
      }
    });
  }
}
