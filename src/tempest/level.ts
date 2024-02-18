import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
export default class Level extends PhysicalGameObject {
  constructor(levelId: number, options: PhysicalObjectInitialConfig) {
    super(`src/tempest/obj/level${levelId}.obj`, options);
    // Inicjalizacja specyficznych dla Playera właściwości
    this.loadMesh().then(() => {
      console.log(this.vertecies);
      console.log(this.getMesh());
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "blue");
      }
    });
  }
  override Start(): void {}
}
