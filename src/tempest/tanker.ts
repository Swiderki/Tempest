import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { QuaternionUtils } from "drake-engine";

export default class Tanker extends PhysicalGameObject {
  game: MyGame;
  constructor( options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/tanker.obj`, options);
    this.game = game;
    this.setPosition(0,0,1)
    this.velocity.z = -40

    }
  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "#A020F0");
    }
    console.log("działa")
    const randomRange = this.game.level.vertecies.length / 2 - 1;
    const randomIndex = Math.floor(Math.random() * randomRange);
    const randomVertex1 = this.game.level.vertecies[randomIndex];
    const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
    const middle = { x: (randomVertex1.x + randomVertex2.x) / 2, y: (randomVertex1.y + randomVertex2.y) / 2, z: 80 };
    this.move(middle.x, middle.y, 80);
    console.log(this.position)
  }

  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
    console.log(this.position.z)
    if (this.position.z < 0) {
      console.log(this)
      this.game.currentScene.removeGameObject(this.id);
      this.game.tankers.pop();
    }

  }

  static createTanker(game: MyGame){
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }
    const tanker = new Tanker({ position: [0, 0, 0], size: [0.7, 0.7, 0.7] }, game);
    console.log(tanker);
    game.currentScene.addGameObject(tanker);
    game.tankers.push(tanker);
  }
}
