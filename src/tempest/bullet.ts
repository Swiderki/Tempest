import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { SpikerBulletOverlap } from "../overlaps/spikerBulletOverlap";

export default class Bullet extends PhysicalGameObject {
    game: MyGame;

  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/bullet.obj`, options);
    this.game = game;
    this.velocity.z = 29
    this.autoupdateBoxCollider = true

  }
  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
    // console.log(this.position)
    if(this.position.z >= 80){
        this.game.currentScene.removeGameObject(this.id);  
        this.game.bullets.pop() 
    } 
    // console.log("bullet" + this.position.z)
}
  override Start(): void {
    this.generateBoxCollider()
    this.showBoxcollider = true
    console.log("ASD")
    this.game.spikers.forEach((spiker) => {
      const ov = new SpikerBulletOverlap(this, spiker, this.game);
      this.game.currentScene.addOverlap(ov);
  
    })

  }
  
}
