import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame, debugMode } from "../main";

const moveSounds = new Audio("sounds/blasterMove.mp3");
const blasterExplosionSound = new Audio("sounds/blasterExplosion.mp3");

export default class Player extends PhysicalGameObject {
  private sound: HTMLAudioElement | null = null;
  game: MyGame;
  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super("obj/player.obj", options);
    this.game = game;
    this.autoupdateBoxCollider = true;
    this.isShining = true;

    this.sound = moveSounds;
  }
  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "yellow");
    }
    this.showBoxcollider = debugMode;
  }

  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
    this.position.x = (this.boxCollider![0].x + this.boxCollider![1].x) / 2;
    this.position.y = (this.boxCollider![0].y + this.boxCollider![1].y) / 2;
    this.position.z = this.boxCollider![0].z
    this.boxCollider![0].z += 1;
    this.boxCollider![1].z += -1;
  }

  setPlayerPosition() {
    this.sound!.play();
    const levelShift = Math.floor((this.game.currentLevelSide % 1) * 10) / 10;
    this.vertecies[0].x = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x * 1.2 * (1 - levelShift) + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].x * 1.2 * levelShift;
    this.vertecies[0].y = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y * 1.2 * (1 - levelShift) + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].y * 1.2 * levelShift;
    this.vertecies[0].z = this.position.z;
    this.vertecies[1].x = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x * 1.1 * (1 - levelShift) + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].x * 1.1 * levelShift;
    this.vertecies[1].y = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y * 1.1 * (1 - levelShift) + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].y * 1.1 * levelShift;
    this.vertecies[1].z = this.position.z;
    this.vertecies[2].x = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x;
    this.vertecies[2].y = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y;
    this.vertecies[2].z = this.position.z;
    this.vertecies[3].x = this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].x;
    this.vertecies[3].y = this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].y;
    this.vertecies[3].z = this.position.z;
    this.vertecies[4].x = (this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x * 0.7 + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].x * 0.3) * 0.96;
    this.vertecies[4].y = (this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y * 0.7 + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].y * 0.3) * 0.96;
    this.vertecies[4].z = this.position.z;
    this.vertecies[5].x = (this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x * 0.3 + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].x * 0.7) * 0.96;
    this.vertecies[5].y = (this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y * 0.3 + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.level.numberOfPoints].y * 0.7) * 0.96;
    this.vertecies[5].z = this.position.z;
    this.generateBoxCollider()
    this.game.level.updateColorOnPlayer();
  }
}
