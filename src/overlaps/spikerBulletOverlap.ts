import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import Spiker from "../tempest/spiker";

export class SpikerBulletOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private bullet: Bullet;
  private spikerTrace: Spiker;
  constructor(obj1: Bullet, obj2: Spiker, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.bullet = obj1;
    this.spikerTrace = obj2;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    console.log("SpikerBulletOverlap");
  }
}