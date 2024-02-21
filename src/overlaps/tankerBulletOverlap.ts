import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import Tanker from "../tempest/tanker";

export class TankerBulletOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private bullet: Bullet;
  private tanker: Tanker;
  constructor(obj1: Bullet, obj2: Tanker, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.bullet = obj1;
    this.tanker = obj2;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    console.log("ASDASD")
    this.game.currentScene.removeGameObject(this.bullet.id);
    this.game.bullets = this.game.bullets.filter((bullet) => bullet.id !== this.bullet.id);
    this.game.currentScene.removeGameObject(this.tanker.id);
    this.game.tankers = this.game.spikers.filter((spiker) => spiker.id !== this.tanker.id);

  }
}