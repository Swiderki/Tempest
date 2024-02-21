import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { SpikerBulletOverlap } from "../overlaps/spikerBulletOverlap";
import { SpikerTraceBulletOverlap } from "../overlaps/spikerTraceBulletOverlap";

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
    if(this.position.z >= 80){
        this.game.currentScene.removeGameObject(this.id);  
        this.game.bullets.pop() 
    } 
  }

  override Start(): void {
    this.generateBoxCollider()
    this.showBoxcollider = true
    this.game.spikers.forEach((spiker) => {
      const ov = new SpikerBulletOverlap(this, spiker, this.game);
      this.game.currentScene.addOverlap(ov);
  
    })

    // TODO: fix spiker trace overlap
    this.game.spikerTraces.forEach((trace) => {
      const ov = new SpikerTraceBulletOverlap(this, trace, this.game);
      this.game.currentScene.addOverlap(ov);
    })

  }
  
}
