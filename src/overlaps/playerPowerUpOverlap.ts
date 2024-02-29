import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Player from "../tempest/player";
import PowerUp from "../tempest/powerUp";

export class PlayerPowerUpOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private powerUp: PowerUp;
  constructor(obj1: PowerUp, obj2: Player, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.powerUp = obj1;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    if (this.collised) return;
    this.collised = true;
    if (this.powerUp.type === "powerAmmo" && this.game.shootingTime > 50) {
      this.game.shootingTime -= 10;
    } else if (this.powerUp.type === "powerLife" && this.game.lifes < 5) {
      this.game.addLife();
    } else if (this.powerUp.type === "powerZapper") {
      this.game.availableAdditionalZapper = true;
    }
    this.game.currentScene.removeGameObject(this.powerUp.id);
    this.game.powerUps = this.game.powerUps.filter((el) => el.id !== this.powerUp.id);
  }
}
