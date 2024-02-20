import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Tanker extends PhysicalGameObject {
  game: MyGame;
  constructor( options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/tanker.obj`, options);
    this.game = game;
    this.loadMesh().then(() => {
      console.log(this.vertecies);
      console.log(this.getMesh());
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "#A020F0");
      }
    });
  }
  override Start(): void {

  }

  static createTanker(game: MyGame){

  }
}
