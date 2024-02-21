import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { SpikerTraceBulletOverlap } from "../overlaps/spikerTraceBulletOverlap";
export default class SpikerTrace extends PhysicalGameObject {
    game: MyGame;

  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/spikerTrace.obj`, options);
    this.game = game;
    this.autoupdateBoxCollider = true

    // this.velocity.z = 150
  }
  override updatePhysics(deltaTime: number): void {
    // super.updatePhysics(deltaTime);

}
  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "red");
      }
      this.showBoxcollider = true
    //   this.game.bullets.forEach((bullet) => {
    //     const ov = new SpikerBulletOverlap(this, bullet, this.game);
    //     this.game.currentScene.addOverlap(ov);  
    //     console.log("adddd")
    //   })
      this.showBoxcollider = true

    }
}
