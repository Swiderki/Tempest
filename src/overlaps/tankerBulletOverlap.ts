import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import Tanker from "../tempest/tanker";
import Particle from "../tempest/particle";
const enemyExplosionSound = new Audio("sounds/enemyExplosion.mp3");
enemyExplosionSound.volume = 0.7;

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
    if (this.collised) return;
    this.collised = true;
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
    this.game.updateScore(100);
    enemyExplosionSound.play();
    this.tanker.deployFlippers();
    this.game.enemiesInGame--;
  }
}
