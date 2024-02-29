import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame, debugMode } from "../main";

export default class Stars extends PhysicalGameObject {
  game: MyGame;
  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/enemybullet.obj`, options);
    this.game = game;
    this.velocity.z = -60;
    this.boxCollider = [
      { x: this.position.x - 0.5, y: this.position.y - 0.5, z: this.position.z - 0.5 },
      { x: this.position.x + 0.5, y: this.position.y + 0.5, z: this.position.z - 8 },
    ];
  }
  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
  }

  override Start(): void {
    this.showBoxcollider = debugMode;

    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "white");
    }
    this.move(Math.random() * 20 - 10, Math.random() * 20 - 10, 0);
  }

  static createStars(game: MyGame, position: { x: number; y: number; z: number }) {
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }

    for (let i = 0; i < 2; i++) {
      const stars = new Stars(
        { position: [position.x, position.y, position.z], size: [0.7, 0.7, 0.7] },
        game
      );
      game.currentScene.addGameObject(stars);
      game.starsArray.push(stars);
    }
  }
}
