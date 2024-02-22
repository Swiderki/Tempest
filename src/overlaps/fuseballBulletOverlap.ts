import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import Fuseball from "../tempest/fuseball";

export class FuseballBulletOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private bullet: Bullet;
  private fuseball: Fuseball;
  constructor(obj1: Bullet, obj2: Fuseball, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.bullet = obj1;
    this.fuseball = obj2;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    console.log("ASDASD")
    this.game.currentScene.removeGameObject(this.bullet.id);
    this.game.bullets = this.game.bullets.filter((bullet) => bullet.id !== this.bullet.id);
    this.game.currentScene.removeGameObject(this.fuseball.id);
    this.game.fuseballs = this.game.fuseballs.filter((fuseball) => fuseball.id !== this.fuseball.id);
    // this.game.currentScene.removeOverlap(this.id);

  }
}