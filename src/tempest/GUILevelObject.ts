import { PhysicalGameObject, QuaternionUtils } from "drake-engine";

export class GUILevelObject extends PhysicalGameObject {
  guiDecorationQuaternion: QuaternionUtils.Quaternion = { x: 0, y: 0, z: 0, w: 1 };

  constructor(num: number) {
    super(`obj/level${num}.obj`, {});
  }

  override Start() {
    this.getMesh().forEach((line, i) => {
      this.setLineColor(i, "red");
    });
  }

  override updatePhysics(deltaTime: number) {
    QuaternionUtils.setFromAxisAngle(this.guiDecorationQuaternion, { x: 1, y: 0, z: 0 }, (Math.PI / 4) * deltaTime);
    QuaternionUtils.normalize(this.guiDecorationQuaternion);
    this.applyQuaternion(this.guiDecorationQuaternion);
  }
}