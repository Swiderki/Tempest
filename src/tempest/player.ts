import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Player extends PhysicalGameObject {
  game: MyGame;
  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super("obj/player.obj", options);
    this.game = game;
    this.autoupdateBoxCollider = true;
  }
  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "yellow");
    }
    this.showBoxcollider = true;
  }

  setPlayerPosition() {
    const levelShift = Math.floor((this.game.currentLevelSide % 1) * 10) / 10;
    this.vertecies[0].x = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x * 1.2 * (1 - levelShift) + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].x * 1.2 * levelShift;
    this.vertecies[0].y = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y * 1.2 * (1 - levelShift) + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].y * 1.2 * levelShift;
    this.vertecies[0].z = 0;
    this.vertecies[1].x = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x * 1.1 * (1 - levelShift) + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].x * 1.1 * levelShift;
    this.vertecies[1].y = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y * 1.1 * (1 - levelShift) + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].y * 1.1 * levelShift;
    this.vertecies[1].z = 0;
    this.vertecies[2].x = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x;
    this.vertecies[2].y = this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y;
    this.vertecies[2].z = 0;
    this.vertecies[3].x = this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].x;
    this.vertecies[3].y = this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].y;
    this.vertecies[3].z = 0;
    this.vertecies[4].x = (this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x * 0.7 + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].x * 0.3) * 0.9;
    this.vertecies[4].y = (this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y * 0.7 + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].y * 0.3) * 0.9;
    this.vertecies[4].z = 0;
    this.vertecies[5].x = (this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].x * 0.3 + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].x * 0.7) * 0.9;
    this.vertecies[5].y = (this.game.level.vertecies[Math.floor(this.game.currentLevelSide)].y * 0.3 + this.game.level.vertecies[(Math.floor(this.game.currentLevelSide) + 1) % this.game.numberOfSides].y * 0.7) * 0.9;
    this.vertecies[5].z = 0;
    this.game.level.updateColorOnPlayer();
  }
}
