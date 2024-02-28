import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame, debugMode } from "../main";
import { PlayerFuseballOverlap } from "../overlaps/playerFuseballOverlap";
import { FuseballBulletOverlap } from "../overlaps/fuseballBulletOverlap";
import Flipper from "./flipper";

export default class Fuseball extends PhysicalGameObject {
  game: MyGame;
  targetVertex: { x: number; y: number; z: number } | null = null;
  actualIndex: number = 0;
  isMoving: boolean = false;
  moveInterval: number = 50;
  lastMoveTime: number = Date.now();
  moveVectorReturn: number = 1;
  killedPlayer: boolean = false;
  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/fuseball.obj`, options);
    this.game = game;
    if (!options.position) {
      this.setPosition(0, 0, 0);
    }
    this.velocity.z = -40;
    this.autoupdateBoxCollider = true;
    this.showBoxcollider = debugMode;
  }

  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
      if (i < 5) {
        this.setLineColor(i, "red");
      } else if (i < 10) {
        this.setLineColor(i, "green");
      } else if (i < 15) {
        this.setLineColor(i, "blue");
      } else if (i < 20) {
        this.setLineColor(i, "yellow");
      } else {
        this.setLineColor(i, "white");
      }
    }
    const randomRange = this.game.level.vertecies.length / 2 - 1;
    const randomIndex = Math.floor(Math.random() * randomRange);
    this.actualIndex = randomIndex;
    const randomVertex1 = this.game.level.vertecies[randomIndex];
    const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
    const middle = { x: (randomVertex1.x + randomVertex2.x) / 2, y: (randomVertex1.y + randomVertex2.y) / 2, z: 80 };
    this.move(middle.x, middle.y, 80);

    this.game.bullets.forEach((bullet) => {
      const ov = new FuseballBulletOverlap(bullet, this, this.game);
      this.game.currentScene!.addOverlap(ov);
    });
    const ov = new PlayerFuseballOverlap(this, this.game.player, this.game);
    this.game.currentScene!.addOverlap(ov);
  }

  override updatePhysics(deltaTime: number): void {
    if (this.game.lifeLost) return

    super.updatePhysics(deltaTime);

    if (Date.now() - this.lastMoveTime > this.moveInterval) {
      this.move(0.2 * this.moveVectorReturn, 0.2*this.moveVectorReturn, 0)
      this.moveVectorReturn *= -1;
      this.lastMoveTime = Date.now();
    }


    // Aktualizacja pozycji dolnej krawędzi boxCollidera
    this.boxCollider![0].z = this.position.z - 2;

    let targetSide = this.game.currentLevelSide;
    let direction = 0;
    if (this.actualIndex != targetSide) {
      let clockwiseDistance = (targetSide - this.actualIndex + this.game.level.numberOfPoints) % this.game.level.numberOfPoints;
      let counterClockwiseDistance = (this.actualIndex - targetSide + this.game.level.numberOfPoints) % this.game.level.numberOfPoints;

      direction = clockwiseDistance <= counterClockwiseDistance ? 1 : -1;
    }

    if (this.position.z <= 0) {
      if (this.game.level.lopped) {
        if (!this.targetVertex) {
          if (direction == -1) direction = 0;
          this.actualIndex = (this.actualIndex + direction) % this.game.level.vertecies.length;
          if (this.actualIndex == 0) {
            this.actualIndex = this.game.level.vertecies.length;
          }
          this.targetVertex = this.game.level.vertecies[this.actualIndex];
          this.moveToTarget();
        } else if (this.isAtTarget()) {
          this.actualIndex = (this.actualIndex + direction) % this.game.level.vertecies.length;
          if (this.actualIndex == 0) {
            this.actualIndex = this.game.level.vertecies.length;
          }
          this.targetVertex = this.game.level.vertecies[this.actualIndex];
          this.moveToTarget();
        }
      } else {
        if (!this.targetVertex) {
          this.actualIndex = this.actualIndex < targetSide ? this.actualIndex + 1 : this.actualIndex - 1;
          if (this.actualIndex > 0 && this.actualIndex < this.game.level.vertecies.length) {
            this.targetVertex = this.game.level.vertecies[this.actualIndex];
            this.moveToTarget();
          }
        } else if (this.isAtTarget()) {
          this.actualIndex = this.actualIndex < targetSide ? this.actualIndex + 1 : this.actualIndex - 1;
          if (this.actualIndex > 0 && this.actualIndex < this.game.level.vertecies.length) {
            this.targetVertex = this.game.level.vertecies[this.actualIndex];
            this.moveToTarget();
          }
        }
      }
    }
  }

  moveToTarget() {
    if (this.targetVertex) {
      const direction = { x: this.targetVertex.x - this.position.x, y: this.targetVertex.y - this.position.y, z: 0 };
      const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
      this.velocity.x = (direction.x / magnitude) * 2;
      this.velocity.y = (direction.y / magnitude) * 2;
      this.velocity.z = 0;
    }
  }
  isAtTarget() {
    if (!this.targetVertex) return false;
    const distance = Math.hypot(this.targetVertex.x - this.position.x, this.targetVertex.y - this.position.y);
    return distance < 0.1;
  }

  static createFuseball(game: MyGame) {
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }
    const fuseball = new Fuseball({ position: [0, 0, 0], size: [1.8, 1.8, 1.8] }, game);
    game.currentScene.addGameObject(fuseball);
    game.fuseballs.push(fuseball);
  }
}
