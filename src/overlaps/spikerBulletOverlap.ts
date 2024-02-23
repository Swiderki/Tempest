import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import Spiker from "../tempest/spiker";
import Particle from "../tempest/particle";

export class SpikerBulletOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private bullet: Bullet;
  private spiker: Spiker;
  constructor(obj1: Bullet, obj2: Spiker, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.bullet = obj1;
    this.spiker = obj2;
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    const particle = new Particle({ position: [this.bullet.position.x, this.bullet.position.y, this.bullet.position.z], size:[0.1, 0.1, 0.1] }, this.game);
    this.game.currentScene.addGameObject(particle);
    this.game.particles.push(particle);
    this.game.currentScene.removeGameObject(this.bullet.id);
    this.game.bullets = this.game.bullets.filter((bullet) => bullet.id !== this.bullet.id);
    this.game.currentScene.removeGameObject(this.spiker.id);
    this.game.spikers = this.game.spikers.filter((spiker) => spiker.id !== this.spiker.id);

    // this.game.currentScene.removeOverlap(this.id);
    this.game.updateScore(50)

  }
}