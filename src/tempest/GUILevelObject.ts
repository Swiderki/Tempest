import { PhysicalGameObject, QuaternionUtils } from "drake-engine";

export class GUILevelObject extends PhysicalGameObject {
  guiDecorationQuaternion: QuaternionUtils.Quaternion = { x: 0, y: 0, z: 0, w: 1 };

  constructor(num: number) {
    super(`obj/level${num}.obj`, {});
    this.position.z = -80;
  }

  override Start() {
    this.getMesh().forEach((line, i) => {
      this.setLineColor(i, "red");
    });
  }
}