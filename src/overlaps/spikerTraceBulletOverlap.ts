import { Overlap } from "drake-engine";
import { MyGame } from "../main";
import Bullet from "../tempest/bullet";
import SpikerTrace from "../tempest/spikerTrace";
import Particle from "../tempest/particle";
const enemyExplosionSound = new Audio("sounds/enemyExplosion.mp3");

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
    if(this.collised) return
    this.collised = true
    const particle = new Particle({ position: [this.bullet.position.x, this.bullet.position.y, this.bullet.position.z], size: [0.1, 0.1, 0.1] }, this.game);
    this.game.currentScene.addGameObject(particle);
    this.game.particles.push(particle);
    if(this.spikerTrace.vertecies[1].z + 10> 80){
      this.game.currentScene.removeGameObject(this.spikerTrace.id);
      this.game.spikerTraces = this.game.spikerTraces.filter((spiker) => spiker.id !== this.spikerTrace.id);
    }
    this.spikerTrace.vertecies[1].z = this.spikerTrace.vertecies[1].z + 10
    this.game.currentScene.removeGameObject(this.bullet.id);
    this.game.bullets = this.game.bullets.filter((bullet) => bullet.id !== this.bullet.id);
    enemyExplosionSound.play();
  }
}