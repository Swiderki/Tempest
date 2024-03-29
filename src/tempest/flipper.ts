import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame, debugMode } from "../main";
import { FlipperBulletOverlap } from "../overlaps/flipperBulletOverlap";
import { PlayerFlipperOverlap } from "../overlaps/playerFlipperOverlap";
import EnemyBullet from "./enemyBullet";
const enemyBulletSound = new Audio("sounds/enemyBullet.mp3");
enemyBulletSound.volume = 0.7;
const blasterExplosionSound = new Audio("sounds/blasterExplosion.mp3");
blasterExplosionSound.volume = 0.7;

export default class Fipper extends PhysicalGameObject {
  game: MyGame;
  depth: number = 0;
  lastShootTime: number = Date.now();
  animationSpeed: number = 30;
  timeBetweenMovement: number = 1000;
  isMoving: boolean = false;
  side: number = 0;
  lastTimeMoved = Date.now();
  canBeCollided = true;
  killedPlayer = false;
  colors: Array<string> = ["red", "#A020F0", "lime", "lime", "red", "yeelow", "yellow", "black"];
  constructor(options: PhysicalObjectInitialConfig, game: MyGame, closestVertexId?: number) {
    super(`obj/flipper.obj`, options);
    this.game = game;
    this.autoupdateBoxCollider = true;
    this.side = closestVertexId || -1;
    this.boxColliderScale = 0.9;
    if (this.side == -1) {
      this.side = Math.round(Math.random() * this.game.level.numberOfSides);
    }
    this.loadMesh().then(() => {
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, this.colors[Math.floor((this.game.currentLevel - 1) / 16)]);
      }
      if (this.position.z == 0) this.depth = 80;
      else this.depth = this.position.z;
      this.setFlipperPosition();
    });
  }

  override Start(): void {
    this.showBoxcollider = debugMode;
    this.game.bullets.forEach((bullet) => {
      const ov = new FlipperBulletOverlap(bullet, this, this.game);
      this.game.currentScene.addOverlap(ov);
    });
    const ov = new PlayerFlipperOverlap(this, this.game.player, this.game);
    this.game.currentScene.addOverlap(ov);
  }

  override updatePhysics(deltaTime: number): void {
    if (this.game.lifeLost) {
      this.lastShootTime = Date.now() + 1000;
      return;
    }
    const time = Date.now();
    // console.table([time, this.lastShootTime])

    if (
      (this.position.z <= 0 && time - this.lastTimeMoved > this.timeBetweenMovement) ||
      (this.game.currentLevel > 1 && time - this.lastTimeMoved > this.timeBetweenMovement)
    ) {
      this.moveTowardsPlayer();
      this.lastTimeMoved = time;
    } else if (this.position.z > 0) {
      this.depth += -15 * deltaTime;
      if (!this.isMoving) {
        this.setFlipperPosition();
      }
    }
    this.updateFlipperPosition();

    if (this.lastShootTime < time - 1500 && this.position.z > 20) {
      this.lastShootTime = time;
      enemyBulletSound.play();
      EnemyBullet.createEnemyBullet(this.game, this.position);
    }
  }

  updateFlipperPosition() {
    this.generateBoxCollider();
    this.boxCollider![1].z = this.position.z + 2;
    this.position.x = (this.boxCollider![0].x + this.boxCollider![1].x) / 2;
    this.position.y = (this.boxCollider![0].y + this.boxCollider![1].y) / 2;
    this.position.z = this.depth;
  }

  moveTowardsPlayer(): void {
    let targetSide = Math.round(this.game.currentLevelSide) - 1;
    let currSide = Math.round(this.side);
    let clockwiseDistance = 0;
    let counterClockwiseDistance = 0;
    if (this.game.level.lopped) {
      clockwiseDistance = targetSide - currSide;
      if (clockwiseDistance < 0) {
        clockwiseDistance += this.game.level.numberOfSides;
      }
      counterClockwiseDistance = this.game.level.numberOfSides - targetSide + currSide;
      if (counterClockwiseDistance > this.game.level.numberOfSides) {
        counterClockwiseDistance -= this.game.level.numberOfSides;
      }
    } else {
      clockwiseDistance = currSide;
      counterClockwiseDistance = targetSide;
    }
    if (currSide != targetSide) {
      if (counterClockwiseDistance > clockwiseDistance) {
        this.moveRight();
      } else {
        this.moveLeft();
      }
    }
  }

  static createFlipper(game: MyGame, position: { x: number; y: number; z: number }, closestVertexId: number) {
    if (game.currentScene == null) {
      throw new Error("Main scene must be set first.");
    }
    const flipper = new Fipper(
      { position: [position.x, position.y, position.z], size: [1, 1, 1] },
      game,
      closestVertexId
    );
    game.currentScene.addGameObject(flipper);
    game.flippers.push(flipper);
  }
  setFlipperPosition() {
    const side = Math.floor(this.side);
    this.vertecies[0].x =
      this.game.level.vertecies[side].x * 0.95 * 0.5 +
      this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.95 * 0.5;
    this.vertecies[0].y =
      this.game.level.vertecies[side].y * 0.95 * 0.5 +
      this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.95 * 0.5;
    this.vertecies[0].z = this.depth;
    this.vertecies[5].x = this.game.level.vertecies[side].x;
    this.vertecies[5].y = this.game.level.vertecies[side].y;
    this.vertecies[5].z = this.depth;
    this.vertecies[6].x = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x;
    this.vertecies[6].y = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y;
    this.vertecies[6].z = this.depth;
    this.vertecies[1].x =
      (this.game.level.vertecies[side].x * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.1) *
      0.9;
    this.vertecies[1].y =
      (this.game.level.vertecies[side].y * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.1) *
      0.9;
    this.vertecies[1].z = this.depth;
    this.vertecies[2].x =
      (this.game.level.vertecies[side].x * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.9) *
      0.9;
    this.vertecies[2].y =
      (this.game.level.vertecies[side].y * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.9) *
      0.9;
    this.vertecies[2].z = this.depth;
    this.vertecies[3].x =
      (this.game.level.vertecies[side].x * 0.8 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.2) *
      0.95;
    this.vertecies[3].y =
      (this.game.level.vertecies[side].y * 0.8 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.2) *
      0.95;
    this.vertecies[3].z = this.depth;
    this.vertecies[4].x =
      (this.game.level.vertecies[side].x * 0.2 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.8) *
      0.95;
    this.vertecies[4].y =
      (this.game.level.vertecies[side].y * 0.2 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.8) *
      0.95;
    this.vertecies[4].z = this.depth;
  }
  moveRight() {
    this.isMoving = true;
    setTimeout(() => {
      this.canBeCollided = false;
      this.setToHalfTheRight();
      setTimeout(() => {
        this.setToTheRight();
        this.side++;
        this.side = this.side % this.game.level.numberOfPoints;
        setTimeout(() => {
          this.setToTheLeft();
          setTimeout(() => {
            this.setToHalfTheLeft();
            setTimeout(() => {
              this.isMoving = false;
              this.setFlipperPosition();
            }, this.animationSpeed);
          }, this.animationSpeed);
        }, this.animationSpeed);
      }, this.animationSpeed);
    }, this.animationSpeed);
  }

  moveLeft() {
    this.isMoving = true;
    setTimeout(() => {
      this.setToHalfTheLeft();
      this.canBeCollided = false;

      setTimeout(() => {
        this.setToTheLeft();
        this.side--;
        this.side = this.side % this.game.level.numberOfPoints;
        if (this.side < 0) {
          this.side += this.game.level.numberOfSides;
        }
        setTimeout(() => {
          this.setToTheRight();
          setTimeout(() => {
            this.setToHalfTheRight();
            setTimeout(() => {
              this.isMoving = false;
              this.setFlipperPosition();
            }, this.animationSpeed);
          }, this.animationSpeed);
        }, this.animationSpeed);
      }, this.animationSpeed);
    }, this.animationSpeed);
  }

  setToTheRight() {
    const side = Math.floor(this.side);
    this.vertecies[0].x =
      (this.game.level.vertecies[side].x * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.9) *
      0.8;
    this.vertecies[0].y =
      (this.game.level.vertecies[side].y * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.9) *
      0.8;
    this.vertecies[5].x = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.6;
    this.vertecies[5].y = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.6;
    this.vertecies[6].x = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x;
    this.vertecies[6].y = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y;
    this.vertecies[1].x =
      (this.game.level.vertecies[side].x * 0.2 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.8) *
      0.65;
    this.vertecies[1].y =
      (this.game.level.vertecies[side].y * 0.2 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.8) *
      0.65;
    this.vertecies[2].x =
      (this.game.level.vertecies[side].x * 0.2 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.8) *
      0.95;
    this.vertecies[2].y =
      (this.game.level.vertecies[side].y * 0.2 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.8) *
      0.95;
    this.vertecies[3].x =
      (this.game.level.vertecies[side].x * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.9) *
      0.7;
    this.vertecies[3].y =
      (this.game.level.vertecies[side].y * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.9) *
      0.7;
    this.vertecies[4].x =
      (this.game.level.vertecies[side].x * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.9) *
      0.9;
    this.vertecies[4].y =
      (this.game.level.vertecies[side].y * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.9) *
      0.9;
    this.updateFlipperPosition();
  }
  setToHalfTheRight() {
    const side = Math.floor(this.side);
    this.vertecies[0].x =
      (this.game.level.vertecies[side].x * 0.35 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.65) *
      0.85;
    this.vertecies[0].y =
      (this.game.level.vertecies[side].y * 0.35 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.65) *
      0.85;
    this.vertecies[5].x =
      (this.game.level.vertecies[side].x * 0.8 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.2) *
      0.85;
    this.vertecies[5].y =
      (this.game.level.vertecies[side].y * 0.8 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.2) *
      0.85;
    this.vertecies[6].x = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x;
    this.vertecies[6].y = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y;
    this.vertecies[1].x =
      (this.game.level.vertecies[side].x * 0.7 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.3) *
      0.75;
    this.vertecies[1].y =
      (this.game.level.vertecies[side].y * 0.7 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.3) *
      0.75;
    this.vertecies[2].x = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.85;
    this.vertecies[2].y = this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.85;
    this.vertecies[3].x =
      (this.game.level.vertecies[side].x * 0.6 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.4) *
      0.82;
    this.vertecies[3].y =
      (this.game.level.vertecies[side].y * 0.6 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.4) *
      0.82;
    this.vertecies[4].x =
      (this.game.level.vertecies[side].x * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.9) *
      0.9;
    this.vertecies[4].y =
      (this.game.level.vertecies[side].y * 0.1 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.9) *
      0.9;
    this.updateFlipperPosition();
  }
  setToTheLeft() {
    const side = Math.floor(this.side);
    this.vertecies[0].x =
      (this.game.level.vertecies[side].x * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.1) *
      0.8;
    this.vertecies[0].y =
      (this.game.level.vertecies[side].y * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.1) *
      0.8;
    this.vertecies[5].x = this.game.level.vertecies[side].x * 0.6;
    this.vertecies[5].y = this.game.level.vertecies[side].y * 0.6;
    this.vertecies[6].x = this.game.level.vertecies[side].x;
    this.vertecies[6].y = this.game.level.vertecies[side].y;
    this.vertecies[1].x =
      (this.game.level.vertecies[side].x * 0.8 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.2) *
      0.65;
    this.vertecies[1].y =
      (this.game.level.vertecies[side].y * 0.8 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.2) *
      0.65;
    this.vertecies[2].x =
      (this.game.level.vertecies[side].x * 0.8 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.2) *
      0.95;
    this.vertecies[2].y =
      (this.game.level.vertecies[side].y * 0.8 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.2) *
      0.95;
    this.vertecies[3].x =
      (this.game.level.vertecies[side].x * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.1) *
      0.7;
    this.vertecies[3].y =
      (this.game.level.vertecies[side].y * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.1) *
      0.7;
    this.vertecies[4].x =
      (this.game.level.vertecies[side].x * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.1) *
      0.9;
    this.vertecies[4].y =
      (this.game.level.vertecies[side].y * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.1) *
      0.9;
    this.updateFlipperPosition();
  }
  setToHalfTheLeft() {
    const side = Math.floor(this.side);
    this.vertecies[0].x =
      (this.game.level.vertecies[side].x * 0.65 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.35) *
      0.85;
    this.vertecies[0].y =
      (this.game.level.vertecies[side].y * 0.65 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.35) *
      0.85;
    this.vertecies[5].x =
      (this.game.level.vertecies[side].x * 0.2 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.8) *
      0.85;
    this.vertecies[5].y =
      (this.game.level.vertecies[side].y * 0.2 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.8) *
      0.85;
    this.vertecies[6].x = this.game.level.vertecies[side].x;
    this.vertecies[6].y = this.game.level.vertecies[side].y;
    this.vertecies[1].x =
      (this.game.level.vertecies[side].x * 0.3 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.7) *
      0.75;
    this.vertecies[1].y =
      (this.game.level.vertecies[side].y * 0.3 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.7) *
      0.75;
    this.vertecies[2].x = this.game.level.vertecies[side].x * 0.85;
    this.vertecies[2].y = this.game.level.vertecies[side].y * 0.85;
    this.vertecies[3].x =
      (this.game.level.vertecies[side].x * 0.4 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.6) *
      0.82;
    this.vertecies[3].y =
      (this.game.level.vertecies[side].y * 0.4 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.6) *
      0.82;
    this.vertecies[4].x =
      (this.game.level.vertecies[side].x * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].x * 0.1) *
      0.9;
    this.vertecies[4].y =
      (this.game.level.vertecies[side].y * 0.9 +
        this.game.level.vertecies[(side + 1) % this.game.level.numberOfPoints].y * 0.1) *
      0.9;
    this.updateFlipperPosition();
  }
}
