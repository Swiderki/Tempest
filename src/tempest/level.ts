import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Level extends PhysicalGameObject {
  game: MyGame;
  constructor(levelId: number, options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/level${levelId}.obj`, options);
    this.game = game;
    this.loadMesh().then(() => {

      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "blue");
      }
    });
  }
  override Start(): void {
    this.game.numberOfSides = this.game.level.vertecies.length / 2;
    this.game.player.setPlayerPosition();
  }
}
