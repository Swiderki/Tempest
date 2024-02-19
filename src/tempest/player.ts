import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
export default class Player extends PhysicalGameObject {
  constructor(options: PhysicalObjectInitialConfig) {
    super("obj/player.obj", options);
    // Inicjalizacja specyficznych dla Playera właściwości
    this.loadMesh().then(() => {
      console.log(this.vertecies);
      console.log(this.getMesh());
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "yellow");
      }
    });
  }
  override Start(): void {
    console.log(this.getMesh());
  }
}
