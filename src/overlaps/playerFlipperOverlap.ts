import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Player from "../tempest/player";
import Flipper from "../tempest/flipper";

export class PlayerFlipperOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private flipper: Flipper;

  constructor(obj1: Flipper, obj2: Player, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.flipper = obj1;
  }

  override onOverlap(): void {
    if (Math.floor(this.flipper.side) == Math.floor(this.game.currentLevelSide)) {
      if (!this.game.currentScene) return;
      if (this.collised) return;
      this.collised = true;
      this.game.lifeLostType = "flipper";
      this.flipper.killedPlayer = true;

      this.game.deleteLife();
    }
  }
}
