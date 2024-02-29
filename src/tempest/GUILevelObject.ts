import { PhysicalGameObject, QuaternionUtils } from "drake-engine";

export class GUILevelObject extends PhysicalGameObject {
  guiDecorationQuaternion: QuaternionUtils.Quaternion = { x: 0, y: 0, z: 0, w: 1 };
  lastChangeTime: number = Date.now();
  i: number = 15;
  switch: boolean = true;

  constructor(num: number) {
    super(`obj/level${num}.obj`, {});
    this.position.z = -80;
  }

  override Start() {
    this.getMesh().forEach((_, i) => {
      this.setLineColor(i, "red");
    });
  }

  override updatePhysics(): void {
    if (Date.now() - this.lastChangeTime > 40) {
      this.lastChangeTime = Date.now();
      if (this.switch) this.setLineColor(this.i, "yellow");
      else this.setLineColor(this.i, "red");
      this.i++;
      if (this.i >= 31) {
        this.i = 15;
        this.switch = !this.switch;
      }
    }
  }
}
