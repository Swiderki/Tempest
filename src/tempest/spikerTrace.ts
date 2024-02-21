import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { SpikerTraceBulletOverlap } from "../overlaps/spikerTraceBulletOverlap";
import Spiker from "./spiker";
export default class SpikerTrace extends PhysicalGameObject {
    game: MyGame;
    spiker: Spiker;
  constructor(options: PhysicalObjectInitialConfig, game: MyGame, spiker: Spiker) {
    super(`obj/spikerTrace.obj`, options);
    this.game = game;
    this.spiker = spiker

  }
  override updatePhysics(deltaTime: number): void {

    this.boxCollider = [{x: this.vertecies[0].x,y: this.vertecies[0].y,z: this.vertecies[0].z}, {x: this.vertecies[1].x,y: this.vertecies[1].y,z: this.vertecies[1].z}]
  }
  override Start(): void {
    this.boxCollider = [this.vertecies[0], this.vertecies[1]]
    this.showBoxcollider = true

    for (let i = 0; i < this.getMesh().length; i++) {
        this.setLineColor(i, "transparent");
      }
      this.setPosition(this.spiker.position.x, this.spiker.position.y, this.spiker.position.z)
      this.game.bullets.forEach((bullet) => {
            // TODO: KOLIZJA SIE PSUJE

        const ov = new SpikerTraceBulletOverlap(bullet, this, this.game);
        this.game.currentScene.addOverlap(ov);  
      })

    }
}
