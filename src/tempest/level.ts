import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
export default class Level extends PhysicalGameObject {
  constructor(levelId: number, options: PhysicalObjectInitialConfig) {
    super(`obj/level${levelId}.obj`, options);
    // Inicjalizacja specyficznych dla Playera właściwości
    this.loadMesh().then(() => {

      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "blue");
      }
    });
  }
  override Start(): void {}
}
