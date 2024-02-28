import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import Fuseball from "../tempest/fuseball";
import Particle from "../tempest/particle";
const enemyExplosionSound = new Audio("sounds/enemyExplosion.mp3");

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
    if (this.collised) return;
    this.collised = true;
    this.fuseball.killedPlayer = true;
    if (this.fuseball.position.z > 30) {
      this.game.updateScore(250);
    } else if (this.fuseball.position.z > 10) {
      this.game.updateScore(500);
    } else {
      this.game.updateScore(750);
    }

    const particle = new Particle(
      {
        position: [this.bullet.position.x, this.bullet.position.y, this.bullet.position.z],
        size: [0.1, 0.1, 0.1],
      },
      this.game
    );
    this.game.currentScene.addGameObject(particle);
    this.game.particles.push(particle);
    this.game.currentScene.removeGameObject(this.bullet.id);
    this.game.bullets = this.game.bullets.filter((bullet) => bullet.id !== this.bullet.id);
    this.game.currentScene.removeGameObject(this.fuseball.id);
    this.game.fuseballs = this.game.fuseballs.filter((fuseball) => fuseball.id !== this.fuseball.id);
    enemyExplosionSound.play();
    // this.game.currentScene.removeOverlap(this.id);
    this.game.enemiesInGame--;
  }
}
