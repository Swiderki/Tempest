import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Fipper extends PhysicalGameObject {
  game: MyGame;
  currentLevelSide: number = 0.5;
  depth: number = 0;
  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/flipper.obj`, options);
    this.game = game;
    this.loadMesh().then(() => {
      for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "red");
      }
      this.currentLevelSide = Math.round(Math.random() * this.game.numberOfSides * 10) / 10;
      this.depth = Math.round(Math.random() * 80);
      //this.depth = 0;
      this.setFlipperPosition();
      this.moveRight();
    });
  }
  override Start(): void {}

  static createFlipper(game: MyGame) {
    if (game.currentScene == null) {
      throw new Error("Main scene must be set first.");
    }
    const flipper = new Fipper({ position: [0, 0, 0], size: [1, 1, 1] }, game);
    game.currentScene.addGameObject(flipper);
    game.flippers.push(flipper);

  }
  setFlipperPosition() {
    const side = Math.floor(this.currentLevelSide);
    this.vertecies[0].x = this.game.level.vertecies[side].x * 0.95 * 0.5 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.95 * 0.5;
    this.vertecies[0].y = this.game.level.vertecies[side].y * 0.95 * 0.5 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.95 * 0.5;
    this.vertecies[0].z = this.depth;
    this.vertecies[5].x = this.game.level.vertecies[side].x;
    this.vertecies[5].y = this.game.level.vertecies[side].y;
    this.vertecies[5].z = this.depth;
    this.vertecies[6].x = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x;
    this.vertecies[6].y = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y;
    this.vertecies[6].z = this.depth;
    this.vertecies[1].x = (this.game.level.vertecies[side].x * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.1) * 0.9;
    this.vertecies[1].y = (this.game.level.vertecies[side].y * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.1) * 0.9;
    this.vertecies[1].z = this.depth;
    this.vertecies[2].x = (this.game.level.vertecies[side].x * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.9) * 0.9;
    this.vertecies[2].y = (this.game.level.vertecies[side].y * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.9) * 0.9;
    this.vertecies[2].z = this.depth;
    this.vertecies[3].x = (this.game.level.vertecies[side].x * 0.8 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.2) * 0.95;
    this.vertecies[3].y = (this.game.level.vertecies[side].y * 0.8 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.2) * 0.95;
    this.vertecies[3].z = this.depth;
    this.vertecies[4].x = (this.game.level.vertecies[side].x * 0.2 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.8) * 0.95;
    this.vertecies[4].y = (this.game.level.vertecies[side].y * 0.2 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.8) * 0.95;
    this.vertecies[4].z = this.depth;
  }
  moveRight() {
    const side = Math.floor(this.currentLevelSide);
    const animationSpeed = 30;
    setTimeout(() => {
      this.setToHalfTheRight();
      setTimeout(() => {
        this.setToTheRight();
        this.currentLevelSide++;
        this.currentLevelSide = this.currentLevelSide % this.game.numberOfSides;
        setTimeout(() => {
          this.setToTheLeft();
          setTimeout(() => {
            this.setToHalfTheLeft();
            setTimeout(() => {
              this.setFlipperPosition();
              setTimeout(() => {
                this.moveRight();
              }, 300);
            }, animationSpeed);
          }, animationSpeed);
        }, animationSpeed);
      }, animationSpeed);
    }, animationSpeed);
  }
  setToTheRight() {
    const side = Math.floor(this.currentLevelSide);
    this.vertecies[0].x = (this.game.level.vertecies[side].x * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.9) * 0.8;
    this.vertecies[0].y = (this.game.level.vertecies[side].y * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.9) * 0.8;
    this.vertecies[5].x = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.6;
    this.vertecies[5].y = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.6;
    this.vertecies[6].x = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x;
    this.vertecies[6].y = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y;
    this.vertecies[1].x = (this.game.level.vertecies[side].x * 0.2 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.8) * 0.65;
    this.vertecies[1].y = (this.game.level.vertecies[side].y * 0.2 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.8) * 0.65;
    this.vertecies[2].x = (this.game.level.vertecies[side].x * 0.2 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.8) * 0.95;
    this.vertecies[2].y = (this.game.level.vertecies[side].y * 0.2 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.8) * 0.95;
    this.vertecies[3].x = (this.game.level.vertecies[side].x * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.9) * 0.7;
    this.vertecies[3].y = (this.game.level.vertecies[side].y * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.9) * 0.7;
    this.vertecies[4].x = (this.game.level.vertecies[side].x * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.9) * 0.9;
    this.vertecies[4].y = (this.game.level.vertecies[side].y * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.9) * 0.9;
  }
  setToHalfTheRight() {
    const side = Math.floor(this.currentLevelSide);
    this.vertecies[0].x = (this.game.level.vertecies[side].x * 0.35 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.65) * 0.85;
    this.vertecies[0].y = (this.game.level.vertecies[side].y * 0.35 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.65) * 0.85;
    this.vertecies[5].x = (this.game.level.vertecies[side].x * 0.8 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.2) * 0.85;
    this.vertecies[5].y = (this.game.level.vertecies[side].y * 0.8 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.2) * 0.85;
    this.vertecies[6].x = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x;
    this.vertecies[6].y = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y;
    this.vertecies[1].x = (this.game.level.vertecies[side].x * 0.7 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.3) * 0.75;
    this.vertecies[1].y = (this.game.level.vertecies[side].y * 0.7 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.3) * 0.75;
    this.vertecies[2].x = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.85;
    this.vertecies[2].y = this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.85;
    this.vertecies[3].x = (this.game.level.vertecies[side].x * 0.6 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.4) * 0.82;
    this.vertecies[3].y = (this.game.level.vertecies[side].y * 0.6 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.4) * 0.82;
    this.vertecies[4].x = (this.game.level.vertecies[side].x * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.9) * 0.9;
    this.vertecies[4].y = (this.game.level.vertecies[side].y * 0.1 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.9) * 0.9;
  }
  setToTheLeft() {
    const side = Math.floor(this.currentLevelSide);
    this.vertecies[0].x = (this.game.level.vertecies[side].x * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.1) * 0.8;
    this.vertecies[0].y = (this.game.level.vertecies[side].y * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.1) * 0.8;
    this.vertecies[5].x = this.game.level.vertecies[side].x * 0.6;
    this.vertecies[5].y = this.game.level.vertecies[side].y * 0.6;
    this.vertecies[6].x = this.game.level.vertecies[side].x;
    this.vertecies[6].y = this.game.level.vertecies[side].y;
    this.vertecies[1].x = (this.game.level.vertecies[side].x * 0.8 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.2) * 0.65;
    this.vertecies[1].y = (this.game.level.vertecies[side].y * 0.8 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.2) * 0.65;
    this.vertecies[2].x = (this.game.level.vertecies[side].x * 0.8 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.2) * 0.95;
    this.vertecies[2].y = (this.game.level.vertecies[side].y * 0.8 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.2) * 0.95;
    this.vertecies[3].x = (this.game.level.vertecies[side].x * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.1) * 0.7;
    this.vertecies[3].y = (this.game.level.vertecies[side].y * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.1) * 0.7;
    this.vertecies[4].x = (this.game.level.vertecies[side].x * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.1) * 0.9;
    this.vertecies[4].y = (this.game.level.vertecies[side].y * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.1) * 0.9;
  }
  setToHalfTheLeft() {
    const side = Math.floor(this.currentLevelSide);
    this.vertecies[0].x = (this.game.level.vertecies[side].x * 0.65 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.35) * 0.85;
    this.vertecies[0].y = (this.game.level.vertecies[side].y * 0.65 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.35) * 0.85;
    this.vertecies[5].x = (this.game.level.vertecies[side].x * 0.2 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.8) * 0.85;
    this.vertecies[5].y = (this.game.level.vertecies[side].y * 0.2 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.8) * 0.85;
    this.vertecies[6].x = this.game.level.vertecies[side].x;
    this.vertecies[6].y = this.game.level.vertecies[side].y;
    this.vertecies[1].x = (this.game.level.vertecies[side].x * 0.3 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.7) * 0.75;
    this.vertecies[1].y = (this.game.level.vertecies[side].y * 0.3 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.7) * 0.75;
    this.vertecies[2].x = this.game.level.vertecies[side].x * 0.85;
    this.vertecies[2].y = this.game.level.vertecies[side].y * 0.85;
    this.vertecies[3].x = (this.game.level.vertecies[side].x * 0.4 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.6) * 0.82;
    this.vertecies[3].y = (this.game.level.vertecies[side].y * 0.4 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.6) * 0.82;
    this.vertecies[4].x = (this.game.level.vertecies[side].x * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].x * 0.1) * 0.9;
    this.vertecies[4].y = (this.game.level.vertecies[side].y * 0.9 + this.game.level.vertecies[(side + 1) % this.game.numberOfSides].y * 0.1) * 0.9;
  }
}
``;
