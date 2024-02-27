import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame, debugMode } from "../main";
import SpikerTrace from "./spikerTrace";
import Tanker from "./tanker";
import { QuaternionUtils } from "drake-engine";
import EnemyBullet from "./enemyBullet";
const enemyBulletSound = new Audio("sounds/enemyBullet.mp3");

export default class Spiker extends PhysicalGameObject {
  game: MyGame;
  randomRange: number = Math.floor(Math.random() * 79) + 1;
  rotationQuaternion: QuaternionUtils.Quaternion = { x: 0, y: 0, z: 0, w: 1 };
  trace: SpikerTrace;
  isAddingTrace: boolean = true;
  lastShootTime: number = 900;
  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/spiker.obj`, options);
    this.game = game;
    this.setPosition(0, 0, 0);

    this.isShining = true;
    this.autoupdateBoxCollider = true;
    this.velocity.z = -20;
    this.trace = new SpikerTrace({ position: [this.position.x, this.position.y, this.position.z], size: [1, 1, 1] }, this.game, this);
  }
  override Start(): void {
    this.generateBoxCollider();
    this.showBoxcollider = debugMode;

    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "lime");
    }

    // Random position
    const randomRange = this.game.level.vertecies.length / 2 - 1;
    const randomIndex = Math.floor(Math.random() * randomRange);
    const randomVertex1 = this.game.level.vertecies[randomIndex];
    const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
    const middle = { x: (randomVertex1.x + randomVertex2.x) / 2, y: (randomVertex1.y + randomVertex2.y) / 2, z: 80 };
    this.move(middle.x, middle.y, 80);

    this.game.currentScene.addGameObject(this.trace);
    this.game.spikerTraces.push(this.trace);
    // this.trace.setPosition(this.position.x, this.position.y, this.position.z)
    // this.trace.vertecies[0] = {x:middle.x, y: middle.y,z: 80}
  }

  override updatePhysics(deltaTime: number): void {
    if (this.game.lifeLost) return

    const time = Date.now();
    super.updatePhysics(deltaTime);
    // console.log("spiker" + this.position.z)
    // Fixing box collider
    this.boxCollider![0].z = this.position.z - 5;

    // Rotation
    QuaternionUtils.setFromAxisAngle(this.rotationQuaternion, { x: 0, y: 0, z: 1 }, (Math.PI / 2) * deltaTime);
    QuaternionUtils.normalize(this.rotationQuaternion);
    this.applyQuaternion(this.rotationQuaternion);

    if (this.lastShootTime < time - 2000) {
      this.lastShootTime = time;
      enemyBulletSound.play();
      EnemyBullet.createEnemyBullet(this.game, this.position);
    }
    // Trace
    if (this.isAddingTrace) {
      this.trace.vertecies[1] = { x: this.position.x, y: this.position.y, z: this.position.z + 0.1 };
    }
    if (this.position.z < 5) {
      this.isAddingTrace = false;
      this.velocity.z = 20;
    }

    // Changing into tanker
    if (this.position.z > 80) {
      const tanker = new Tanker({ position: [this.position.x, this.position.y, this.position.z], size: [0.7, 0.7, 0.7] }, this.game);
      this.game.tankers.push(tanker);
      this.game.currentScene.addGameObject(tanker);
      this.game.currentScene.removeGameObject(this.id);
      this.game.spikers = this.game.spikers.filter((spiker) => spiker.id !== this.id);
    }
  }

  static createSpiker(game: MyGame) {
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }
    const spiker = new Spiker({ position: [0, 0, 0], size: [0.7, 0.7, 0.7] }, game);
    game.currentScene.addGameObject(spiker);
    game.spikers.push(spiker);
  }
}
