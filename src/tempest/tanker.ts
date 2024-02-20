import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { QuaternionUtils } from "drake-engine";

export default class Tanker extends PhysicalGameObject {
  game: MyGame;
  constructor( options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/tanker.obj`, options);
    this.game = game;
      // this.velocity.z = 10

    }
  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "#A020F0");
    }
    // const rotationQuaternion = { x: 0, y: 0, z: 0, w: 0 };
    // QuaternionUtils.setFromAxisAngle(rotationQuaternion, { x: 0, y: 1, z: 0 }, Math.PI/2)
    // this.applyQuaternion(rotationQuaternion);

    
    const randomRange = this.game.level.vertecies.length / 2 - 1;
    const randomIndex = Math.floor(Math.random() * randomRange);
    const randomVertex1 = this.game.level.vertecies[randomIndex];
    const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
    const middle = { x: (randomVertex1.x + randomVertex2.x) / 2, y: (randomVertex1.y + randomVertex2.y) / 2, z: 80 };
    this.vertecies.forEach((vertex) => {
      vertex.x += middle.x;
      vertex.y += middle.y;
      vertex.z = 80;
    })
  }

  override updatePhysics(deltaTime: number): void {
    // super.updatePhysics(deltaTime);
    if (this.position.z < 0) {
      this.game.currentScene.removeGameObject(this.id);
      this.game.tankers.pop();

    }

  }

  static createTanker(game: MyGame){
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }
    const tanker = new Tanker({ position: [0, 0, 0], size: [1, 1, 1] }, game);
    game.currentScene.addGameObject(tanker);
    game.tankers.push(tanker);
  }
}
