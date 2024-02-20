import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Fipper extends PhysicalGameObject {
  game: MyGame;
  constructor( options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/flipper.obj`, options);
    this.game = game;
    this.loadMesh().then(() => {
      console.log(this.vertecies);
      console.log(this.getMesh());
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "red");
      }
    });
  }
  override Start(): void {
    console.log(this.vertecies)

  }

  static initialize(game: MyGame){
    if (game.currentScene == null) {
        throw new Error("Main scene must be set first.");
      }
    const flipper = new Fipper({ position: [0, 0, 0], size: [1, 1, 1] }, game);
    game.currentScene.addGameObject(flipper);
    // console.log(flipper.vertecies)
    // flipper.vertecies[2] = game.level.vertecies[Math.floor(game.currentLevelSide)];
    // flipper.vertecies[2].z = 50;
    // flipper.vertecies[3] = game.level.vertecies[(Math.floor(game.currentLevelSide) + 1) % game.numberOfSides] ;
    // flipper.vertecies[3].z = 50;
  }
}
