import { PhysicalGameObject, PhysicalObjectInitialConfig } from "drake-engine";
import { MyGame } from "../main";
import { TankerBulletOverlap } from "../overlaps/tankerBulletOverlap";
import { FuseballBulletOverlap } from "../overlaps/fuseballBulletOverlap";
import Flipper from "./flipper";


export default class Fuseball extends PhysicalGameObject {
  game: MyGame;
  targetVertex: {x: number, y: number, z: number} | null = null;

  constructor(options: PhysicalObjectInitialConfig, game: MyGame) {
    super(`obj/fuseball.obj`, options);
    this.game = game;
    if (!options.position) {
      this.setPosition(0, 0, 0);
    }
    this.velocity.z = -40;
    this.autoupdateBoxCollider = true;
  }

  override Start(): void {
    for (let i = 0; i < this.getMesh().length; i++) {
        if(i<5){
          this.setLineColor(i, "red");
        }  
        else if(i<10){
          this.setLineColor(i, "green");
        }else if(i<15){
          this.setLineColor(i, "blue");
        }else if(i<20){
          this.setLineColor(i, "yellow");
        }else{
          this.setLineColor(i, "white");
    }}
    const randomRange = this.game.level.vertecies.length / 2 - 1;
    const randomIndex = Math.floor(Math.random() * randomRange);
    const randomVertex1 = this.game.level.vertecies[randomIndex];
    const randomVertex2 = this.game.level.vertecies[randomIndex + 1];
    const middle = { x: (randomVertex1.x + randomVertex2.x) / 2, y: (randomVertex1.y + randomVertex2.y) / 2, z: 80 };
    this.move(middle.x, middle.y, 80);

    this.game.bullets.forEach((bullet) => {
        const ov = new FuseballBulletOverlap(bullet, this, this.game);
        this.game.currentScene!.addOverlap(ov);
    })
  }

  override updatePhysics(deltaTime: number): void {
    super.updatePhysics(deltaTime);

    this.boxCollider![0].z = this.position.z - 2;

    if (this.position.z <= 0) {
      if (!this.targetVertex) {
        this.targetVertex = this.findNearestVertex();
        this.moveToTarget();
      } else if (this.isAtTarget()) {
        this.targetVertex = this.findNextVertex();
        this.moveToTarget();
      }
    }
  }

  findNearestVertex() {
    return this.game.level.vertecies.reduce((prev, curr) => {
      const prevDistance = Math.hypot(prev.x - this.position.x, prev.y - this.position.y, prev.z - this.position.z);
      const currDistance = Math.hypot(curr.x - this.position.x, curr.y - this.position.y, curr.z - this.position.z);
      return prevDistance < currDistance ? prev : curr;
    });
  }
  findNextVertex() {
    if (!this.targetVertex) return null;
  
    const currentIndex = this.game.level.vertecies.findIndex(vertex => 
      vertex.x === this.targetVertex!.x && vertex.y === this.targetVertex!.y && vertex.z === this.targetVertex!.z
    );
  
    if (currentIndex === -1) return null;
  
    let nextIndex;
  
    if (currentIndex === 0) {
      nextIndex = currentIndex + 1;
    }
    else if (currentIndex === this.game.level.vertecies.length - 1) {
      nextIndex = currentIndex - 1;
    }
    else {
      nextIndex = Math.random() > 0.5 ? currentIndex + 1 : currentIndex - 1;
    }
  
    return this.game.level.vertecies[nextIndex];
  }
  
  moveToTarget() {
    if (this.targetVertex) {
      const direction = { x: this.targetVertex.x - this.position.x, y: this.targetVertex.y - this.position.y, z: 0 }; 
      const magnitude = Math.sqrt(direction.x ** 2 + direction.y ** 2);
      this.velocity.x = (direction.x / magnitude) * 2;
      this.velocity.y = (direction.y / magnitude) * 2;
      this.velocity.z = 0;
    }
  }

  isAtTarget() {
    if (this.targetVertex) {
      const distance = Math.hypot(this.targetVertex.x - this.position.x, this.targetVertex.y - this.position.y);
      return distance < 0.2; 
    }
    return false;
  }


  static createFuseball(game: MyGame){
    if (!game.currentScene) {
      throw new Error("Main scene must be set first.");
    }
    const fuseball = new Fuseball({ position: [0, 0, 0], size: [1.8,1.8,1.8 ] }, game);
    game.currentScene.addGameObject(fuseball);
    game.fuseballs.push(fuseball);
  }
}
