import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import Flipper from "../tempest/flipper";
import Particle from "../tempest/particle";
const enemyExplosionSound = new Audio("sounds/enemyExplosion.mp3");

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
  }

  override onOverlap(): void {
    if (!this.game.currentScene) return;
    const particle = new Particle({ position: [this.bullet.position.x, this.bullet.position.y, this.bullet.position.z], size:[0.1, 0.1, 0.1] }, this.game);
    this.game.currentScene.addGameObject(particle);
    this.game.particles.push(particle);
    this.game.currentScene.removeGameObject(this.bullet.id);
    this.game.bullets = this.game.bullets.filter((bullet) => bullet.id !== this.bullet.id);
    this.game.currentScene.removeGameObject(this.flipper.id);
    this.game.flippers = this.game.flippers.filter((flipper) => flipper.id !== this.flipper.id);
    // this.game.currentScene.removeOverlap(this.id);
    this.game.updateScore(150)
    this.game.enemiesInGame--;
    enemyExplosionSound.play();
  }
  
}