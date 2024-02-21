import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import SpikerTrace from "../tempest/spikerTrace";

export class SpikerTraceBulletOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private bullet: Bullet;
  private spikerTrace: SpikerTrace;
  constructor(obj1: Bullet, obj2: SpikerTrace, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.bullet = obj1;
    this.spikerTrace = obj2;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;

    // TODO: KOLIZJA SIE PSUJE
    // console.table([this.bullet.boxCollider![0], this.bullet.boxCollider![1]])
    // console.table([this.spikerTrace.boxCollider![0], this.spikerTrace.boxCollider![1]])

    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
  }
}