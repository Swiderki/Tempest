import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import Flipper from "../tempest/flipper";

export class FlipperBulletOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private bullet: Bullet;
  private flipper: Flipper;
  constructor(obj1: Bullet, obj2: Flipper, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.bullet = obj1;
    this.flipper = obj2;
    console.log("added")
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    console.log("ASDASD")
    this.game.currentScene.removeGameObject(this.bullet.id);
    this.game.bullets = this.game.bullets.filter((bullet) => bullet.id !== this.bullet.id);
    this.game.currentScene.removeGameObject(this.flipper.id);
    this.game.flippers = this.game.flippers.filter((flipper) => flipper.id !== this.flipper.id);
    // this.game.currentScene.removeOverlap(this.id);

  }
  
}