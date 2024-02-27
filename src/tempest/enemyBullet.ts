import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame, debugMode } from "../main";
import { PlayerEnemyBulletOverlap } from "../overlaps/playerEnemyBullet.Overlap";
import { BulletEnemyBulletOverlap } from "../overlaps/bulletEnemyBulletOverlap";

export default class EnemyBullet extends PhysicalGameObject {
  game: MyGame;
  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/enemybullet.obj`, options);
    this.game = game;
    this.velocity.z = -60;
    this.boxCollider = [
      { x: this.position.x - 0.5, y: this.position.y - 0.5, z: this.position.z - 0.5 },
      { x: this.position.x + 0.5, y: this.position.y + 0.5, z: this.position.z - 8 },
    ];
  }
  override updatePhysics(deltaTime: number): void {
    if (this.game.lifeLost) return

    super.updatePhysics(deltaTime);

    this.boxCollider = [
      { x: this.position.x - 0.5, y: this.position.y - 0.5, z: this.position.z - 0.5 },
      { x: this.position.x + 0.5, y: this.position.y + 0.5, z: this.position.z + 2 },
    ];

    if (this.position.z < -125) {
      this.game.currentScene.removeGameObject(this.id);
      this.game.enemyBullets = this.game.enemyBullets.filter((bullet) => bullet.id !== this.id);
    }
  }

  override Start(): void {
    this.showBoxcollider = debugMode;

    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "white");
    }
    for (let i = 0; i < this.getMesh().length / 2; i++) {
      this.setLineColor(i, "red");
    }
    this.game.bullets.forEach((bullet) => {
      const ov = new BulletEnemyBulletOverlap(bullet, this, this.game);
      this.game.currentScene?.addOverlap(ov);
    });
  }

  static createEnemyBullet(game: MyGame, position: { x: number; y: number; z: number }) {
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }

    const bullet = new EnemyBullet({ position: [position.x, position.y, position.z], size: [0.7, 0.7, 0.7] }, game);
    game.currentScene.addGameObject(bullet);
    game.enemyBullets.push(bullet);
    const ov = new PlayerEnemyBulletOverlap(bullet, game.player, game);
    game.currentScene.addOverlap(ov);
  }
}
