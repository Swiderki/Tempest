import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Spiker extends PhysicalGameObject {
  game: MyGame;
  randomRange: number = Math.floor(Math.random() * 79) + 1;
  constructor( options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/spiker.obj`, options);
    this.game = game;
    this.setPosition(0,0,0)
    this.velocity.z = -40
  }
  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "green");
    }
    const randomRange = this.game.level.vertecies.length / 2 - 1;
    const randomIndex = Math.floor(Math.random() * randomRange);
    const randomVertex1 = this.game.level.vertecies[randomIndex];
    const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
    const middle = { x: (randomVertex1.x + randomVertex2.x) / 2, y: (randomVertex1.y + randomVertex2.y) / 2, z: 80 };
    this.move(middle.x, middle.y, 80);
  }

  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
    if (this.position.z < this.randomRange) {
      this.game.currentScene.removeGameObject(this.id);
      this.game.spikers.pop();
    }
  }

  static createSpiker(game: MyGame){
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }
    const spiker = new Spiker({ position: [0, 0, 0], size: [0.7, 0.7, 0.7] }, game);
    console.log(spiker);
    game.currentScene.addGameObject(spiker);
    game.tankers.push(spiker);
  }
}
