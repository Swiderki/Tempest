import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame, debugMode } from "../main";
import { TankerBulletOverlap } from "../overlaps/tankerBulletOverlap";
import EnemyBullet from "./enemyBullet";
import Flipper from "./flipper";
const enemyBulletSound = new Audio("sounds/enemyBullet.mp3");
enemyBulletSound.volume = 0.7;

export default class Tanker extends PhysicalGameObject {
  game: MyGame;
  lastShootTime: number = 900;
  colors: Array<string> = ["#A020F0", "blue", "cyan", "purle", "#A020F0", "#A020F0", "#A020F0", "#A020F0"];
  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/tanker.obj`, options);
    this.game = game;
    if (!options.position) {
      this.setPosition(0, 0, 0);
    }
    this.velocity.z = -10;
    this.autoupdateBoxCollider = true;
  }

  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, this.colors[Math.floor((this.game.currentLevel - 1) / 16)]);
    }
    this.generateBoxCollider();
    this.showBoxcollider = debugMode;

    // Random position
    if (this.position.x == 0 && this.position.y == 0 && this.position.z == 0) {
      const randomRange = this.game.level.vertecies.length / 2 - 1;
      const randomIndex = Math.floor(Math.random() * randomRange);
      const randomVertex1 = this.game.level.vertecies[randomIndex];
      const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
      const middle = {
        x: (randomVertex1.x + randomVertex2.x) / 2,
        y: (randomVertex1.y + randomVertex2.y) / 2,
        z: 80,
      };
      this.move(middle.x, middle.y, 80);
    }

    // Adding overlaps
    this.game.bullets.forEach((bullet) => {
      const ov = new TankerBulletOverlap(bullet, this, this.game);
      this.game.currentScene.addOverlap(ov);
    });
  }

  override updatePhysics(deltaTime: number): void {
    if (this.game.lifeLost) {
      this.lastShootTime = Date.now() + 1000;
      return;
    }

    super.updatePhysics(deltaTime);

    // Fixing box collider
    this.boxCollider![0].z = this.position.z - 2;

    // Creating bullets
    const time = Date.now();
    if (this.lastShootTime < time - 2000) {
      this.lastShootTime = time;
      enemyBulletSound.play();
      EnemyBullet.createEnemyBullet(this.game, this.position);
    }
    if (this.position.z < 10) {
      this.deployFlippers();
      this.game.enemiesInGame--;
    }
  }
  deployFlippers() {
    let closestVertexId = -1;
    let minDistance = Infinity;

    this.game.level.vertecies.forEach((vertex, index) => {
      const distance = Math.sqrt(
        (vertex.x - this.position.x) ** 2 +
          (vertex.y - this.position.y) ** 2 +
          (vertex.z - this.position.z) ** 2
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestVertexId = index;
      }
    });

    this.game.currentScene.removeGameObject(this.id);
    this.game.tankers = this.game.tankers.filter((el) => el.id !== this.id);
    Flipper.createFlipper(this.game, this.position, closestVertexId);
    Flipper.createFlipper(this.game, this.position, (closestVertexId + 1) % 16);
    this.game.enemiesInGame++;
    this.game.enemiesInGame++;
  }
  static createTanker(game: MyGame) {
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }
    const tanker = new Tanker({ position: [0, 0, 0], size: [0.7, 0.7, 0.7] }, game);
    game.currentScene.addGameObject(tanker);
    game.tankers.push(tanker);
  }
}
