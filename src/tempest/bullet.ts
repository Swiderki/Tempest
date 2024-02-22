import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { SpikerBulletOverlap } from "../overlaps/spikerBulletOverlap";
import { SpikerTraceBulletOverlap } from "../overlaps/spikerTraceBulletOverlap";
import { TankerBulletOverlap } from "../overlaps/tankerBulletOverlap";

export default class Bullet extends PhysicalGameObject {
    game: MyGame;

  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/bullet.obj`, options);
    this.game = game;
    this.velocity.z = 60;
    this.boxCollider = [{x: this.position.x - 0.5, y: this.position.y - 0.5, z: this.position.z - 0.5}, {x: this.position.x + 0.5, y: this.position.y + 0.5, z: this.position.z + 2}];
  }
  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
    this.boxCollider = [{x: this.position.x - 0.5, y: this.position.y - 0.5, z: this.position.z - 0.5}, {x: this.position.x + 0.5, y: this.position.y + 0.5, z: this.position.z + 2}];

    if(this.position.z >= 80){
        this.game.currentScene.removeGameObject(this.id);  
        this.game.bullets.pop() 
    } 
  }

  override Start(): void {
    this.showBoxcollider = true

    // Adding overlaps
    this.game.spikers.forEach((spiker) => {
      const ov = new SpikerBulletOverlap(this, spiker, this.game);
      this.game.currentScene.addOverlap(ov);
    })

    // TODO: fix spiker trace overlap
    this.game.spikerTraces.forEach((trace) => {
      const ov = new SpikerTraceBulletOverlap(this, trace, this.game);
      this.game.currentScene.addOverlap(ov);
    })


    this.game.tankers.forEach((tanker) => {
      const ov = new TankerBulletOverlap(this, tanker, this.game);
      this.game.currentScene.addOverlap(ov);
    })
  }
  
}
