import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import SpikerTrace from "./spikerTrace";
import Tanker from "./tanker";

export default class Spiker extends PhysicalGameObject {
  game: MyGame;
  randomRange: number = Math.floor(Math.random() * 79) + 1;
  constructor( options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/spiker.obj`, options);
    this.game = game;
    this.setPosition(0,0,0)

    this.autoupdateBoxCollider = true
    this.velocity.z = -20
    
  }
  override Start(): void {
    this.generateBoxCollider()
    this.showBoxcollider = true
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "green");
    }
    const randomRange = this.game.level.vertecies.length / 2 - 1;
    const randomIndex = Math.floor(Math.random() * randomRange);
    const randomVertex1 = this.game.level.vertecies[randomIndex];
    const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
    const middle = { x: (randomVertex1.x + randomVertex2.x) / 2, y: (randomVertex1.y + randomVertex2.y) / 2, z: 80 };
    this.move(middle.x, middle.y, 80);
    console.table([this.position, this.boxCollider![0], this.boxCollider![1]])

    this.showBoxcollider = true

  }

  override updatePhysics(deltaTime: number): void {
    // console.log("spiker" + this.position.z)
    
    super.updatePhysics(deltaTime);
    //Spiker trace
    const spikerTrace = new SpikerTrace({ position: [this.position.x, this.position.y, this.position.z], size: [0.8, 0.8, 0.8] }, this.game);
    this.game.currentScene.addGameObject(spikerTrace);
    this.game.spikerTraces.push(spikerTrace);
    // const ov = new SpikerBulletOverlap(this, this.game);

    if (this.position.z < this.randomRange) {
      // this.game.currentScene.removeGameObject(this.id);
      // this.game.spikers.pop();
      this.velocity.z = 20;
    }
    if( this.position.z > 80){
      const tanker = new Tanker({ position: [this.position.x, this.position.y, this.position.z], size: [0.7, 0.7, 0.7] }, this.game);
      this.game.tankers.push(tanker);
      this.game.currentScene.addGameObject(tanker);
      this.game.currentScene.removeGameObject(this.id);
      this.game.spikers.pop();
    }
  }

  static createSpiker(game: MyGame){
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }
    const spiker = new Spiker({ position: [0, 0, 0], size: [0.7, 0.7, 0.7] }, game);
    game.currentScene.addGameObject(spiker);
    game.spikers.push(spiker);
  }
}
