import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import PowerUp from "../tempest/powerUp";
import Particle from "../tempest/particle";

export class PowerUpBulletOverlap extends Overlap {
  private game: MyGame;
  private collised: boolean = false;
  private powerUp: PowerUp;
  private bullet: Bullet;
  constructor(obj1: PowerUp, obj2: Bullet, game: MyGame) {
    super(obj1, obj2);
    this.game = game;
    this.powerUp = obj1;
    this.bullet = obj2;
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
    Particle.createParticle(this.game, {
      x: this.bullet.position.x,
      y: this.bullet.position.y,
      z: this.bullet.position.z,
    });
  }
}
