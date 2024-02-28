import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Particle extends PhysicalGameObject {
  game: MyGame;
  created: number = Date.now();
  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/particle.obj`, options);
    this.game = game;
    this.isShining = true;
  }
  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
    const now = Date.now();
    if (now - this.created > 100) {
      this.game.currentScene?.removeGameObject(this.id);
      this.game.particles = this.game.particles.filter((particle) => particle.id !== this.id);
    }
    this.scale(1.2, 1.2, 1.2);
  }

  override Start(): void {}

  static createParticle(game: MyGame, position: { x: number; y: number; z: number }) {
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }

    const particle = new Particle(
      { position: [position.x, position.y, position.z], size: [0.7, 0.7, 0.7] },
      game
    );
    game.currentScene.addGameObject(particle);
    game.particles.push(particle);
  }
}
