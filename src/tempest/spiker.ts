import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Spiker extends PhysicalGameObject {
  game: MyGame;
  constructor( options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/spiker.obj`, options);
    this.game = game;
    this.loadMesh().then(() => {
      console.log(this.vertecies);
      console.log(this.getMesh());
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "green");
      }
    });
  }
  override Start(): void {

  }

  static createSpiker(game: MyGame){

  }
}
