import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { QuaternionUtils } from "drake-engine";
import { TankerBulletOverlap } from "../overlaps/tankerBulletOverlap";

export default class Tanker extends PhysicalGameObject {
  game: MyGame;
  constructor( options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/tanker.obj`, options);
    this.game = game;
    // if there is no position set, set it to 0,0,0
    if(!options.position){
      this.setPosition(0,0,0)
    }
    this.velocity.z = -30
    this.autoupdateBoxCollider = true
    }
  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
      this.setLineColor(i, "#A020F0");
    }
    this.generateBoxCollider()    
    this.showBoxcollider = true
    if(this.position.x == 0 && this.position.y == 0 && this.position.z == 0){
      const randomRange = this.game.level.vertecies.length / 2 - 1;
      const randomIndex = Math.floor(Math.random() * randomRange);
      const randomVertex1 = this.game.level.vertecies[randomIndex];
      const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
      const middle = { x: (randomVertex1.x + randomVertex2.x) / 2, y: (randomVertex1.y + randomVertex2.y) / 2, z: 80 };
      this.move(middle.x, middle.y, 80);
    }

    this.game.bullets.forEach((bullet) => {
      const ov = new TankerBulletOverlap(bullet, this, this.game)
      this.game.currentScene.addOverlap(ov);
    })
  }

  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);
    if (this.position.z < 3) {
      this.game.currentScene.removeGameObject(this.id);
      this.game.tankers.pop();
    }

  }

  static createTanker(game: MyGame){
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }
    const tanker = new Tanker({ position: [0, 0, 0], size: [0.7, 0.7, 0.7] }, game);
    game.currentScene.addGameObject(tanker);
    game.tankers.push(tanker);
  }
}
