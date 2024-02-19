import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";

export default class Level extends PhysicalGameObject {
    game: MyGame;

  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/bullet.obj`, options);
    this.game = game;
    this.velocity.z = 150
  }
  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
    if(this.position.z >= 70){
        this.game.currentScene.removeGameObject(this.id);  
        this.game.bullets.pop() 
    } 
}
  override Start(): void {
  }
}
