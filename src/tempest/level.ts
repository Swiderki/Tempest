import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
export default class Level extends PhysicalGameObject {
  constructor(levelId: number, options: PhysicalObjectInitialConfig) {
    super(`src/tempest/obj/level${levelId}.obj`, options);
    // Inicjalizacja specyficznych dla Playera właściwości
    this.loadMesh().then(() => {
      console.log(this.vertecies);
    });
  }
  override Start(): void {}
}
